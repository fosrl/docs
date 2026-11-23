import { after } from 'next/server';
import { generateId, type ModelMessage } from 'ai';
import { z } from 'zod';
import type { ChatUIMessage } from '@/lib/ai/types';
import { streamDocsAgent } from '@/lib/ai/agent';
import { AIConfigError, getModel } from '@/lib/ai/model';
import { checkBotAuth, checkBotRateLimit, discordAnalytics, json, snowflake } from '@/lib/ai/bot';
import { recordAssistantMessage, recordUserMessage } from '@/lib/analytics/api';
import { findPage } from '@/lib/docs-tools';
import { siteUrl } from '@/lib/shared';

export const maxDuration = 120;

const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 12_000;
const MAX_SOURCES = 5;

/**
 * Pango-Bot (Discord) asks the docs assistant. Request: the Discord thread so far. Response:
 * newline-delimited JSON events, so the bot can show progress:
 *
 *   {"type":"status","tool":"search_docs","label":"Searching the docs for \"newt docker\""}
 *   {"type":"answer","id":"...","text":"...","sources":[{"title":"...","url":"https://..."}]}
 *   {"type":"error","message":"..."}
 *
 * `answer.id` is the analytics message id, for 👍/👎 via `/api/bot/vote`.
 */
const bodySchema = z.object({
  guildId: snowflake,
  /** the thread (or channel) the question was asked in */
  channelId: snowflake,
  /** who asked */
  userId: snowflake,
  /** the message being answered: the @mention, or the thread's first post */
  messageId: snowflake,
  /** the thread so far, oldest first, ending with the message being answered */
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        author: z.string().max(100).optional(),
        text: z.string(),
      }),
    )
    .min(1),
});

type Event =
  | { type: 'status'; tool: string; label: string }
  | { type: 'answer'; id: string; text: string; sources: { title: string; url: string }[] }
  | { type: 'error'; message: string };

function statusLabel(tool: string, input: unknown) {
  const i = (input ?? {}) as { query?: unknown; path?: unknown };
  if (tool === 'search_docs' && typeof i.query === 'string') return `Searching the docs for "${i.query.slice(0, 80)}"`;
  if (tool === 'read_page' && typeof i.path === 'string') {
    const page = findPage(i.path);
    return `Reading "${page?.data.title ?? i.path}"`;
  }
  if (tool === 'get_latest_versions') return 'Checking the latest release versions';
  return 'Looking through the docs';
}

/** merge consecutive turns from the same side and make sure the thread starts and ends with a user turn */
function toModelMessages(messages: z.infer<typeof bodySchema>['messages']): ModelMessage[] {
  const out: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const m of messages.slice(-MAX_MESSAGES)) {
    let text = m.text.trim();
    if (!text) continue;
    if (text.length > MAX_MESSAGE_CHARS) text = `${text.slice(0, MAX_MESSAGE_CHARS)}\n[truncated]`;
    if (m.role === 'user') text = `[${m.author?.trim() || 'user'}]: ${text}`;

    const last = out.at(-1);
    if (last?.role === m.role) last.content += `\n\n${text}`;
    else out.push({ role: m.role, content: text });
  }
  while (out[0]?.role === 'assistant') out.shift();
  return out;
}

/** pages cited in the answer first, then pages the agent read; absolute URLs */
function collectSources(text: string, readPaths: string[]) {
  const sources = new Map<string, { title: string; url: string }>();
  const add = (link: string) => {
    if (sources.size >= MAX_SOURCES) return;
    const page = findPage(link);
    if (!page || sources.has(page.url)) return;
    const hash = link.includes('#') ? link.slice(link.indexOf('#')) : '';
    sources.set(page.url, { title: page.data.title, url: `${siteUrl}${page.url}${hash}` });
  };

  const escaped = siteUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const match of text.matchAll(new RegExp(`${escaped}(/[^\\s)>\\]]*)?`, 'g'))) add(match[1] ?? '/');
  for (const path of readPaths) add(path);
  return [...sources.values()];
}

export async function POST(req: Request) {
  const unauthorized = checkBotAuth(req);
  if (unauthorized) return unauthorized;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(400, { error: 'Invalid request.' });
  const body = parsed.data;

  const limit = checkBotRateLimit(body.userId);
  if (!limit.ok) {
    return json(
      429,
      { error: 'Too many questions.', retryAfter: limit.retryAfter },
      { 'Retry-After': String(limit.retryAfter) },
    );
  }

  let config;
  try {
    config = getModel();
  } catch (e) {
    if (e instanceof AIConfigError) return json(503, { error: e.message });
    throw e;
  }

  const messages = toModelMessages(body.messages);
  if (messages.at(-1)?.role !== 'user') return json(400, { error: 'The thread has no question to answer.' });

  // analytics: Discord threads are tagged by their ids and page (see discordAnalytics)
  const threadId = discordAnalytics.threadId(body.channelId);
  const question = body.messages.at(-1)!;
  const logError = (e: unknown) => console.error('[analytics] bot', e);
  const saved = recordUserMessage(
    threadId,
    discordAnalytics.visitorId(body.userId),
    {
      id: discordAnalytics.messageId(body.messageId),
      role: 'user',
      parts: [{ type: 'text', text: question.text }],
    },
    discordAnalytics.page(body.guildId, body.channelId),
  ).catch(logError);

  const result = streamDocsAgent({ config, surface: 'discord', messages });
  const answerId = generateId();
  const encoder = new TextEncoder();
  // resolves once the answer is stored (or failed), so `after` keeps the function alive for it
  let finished!: (p: Promise<unknown>) => void;
  const stored = new Promise<unknown>((resolve) => (finished = resolve));

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // the bot may disconnect mid-answer; keep going so the answer is still stored
      const send = (event: Event) => {
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          // stream closed
        }
      };
      const tools: { name: string; input: unknown }[] = [];

      try {
        for await (const part of result.stream) {
          if (part.type !== 'tool-call') continue;
          tools.push({ name: part.toolName, input: part.input });
          send({ type: 'status', tool: part.toolName, label: statusLabel(part.toolName, part.input) });
        }

        // the final step's text: the answer without "let me search..." from earlier steps
        const text = (await result.text).trim();
        if (!text) throw new Error('empty answer');

        const readPaths = tools.flatMap((t) =>
          t.name === 'read_page' && typeof (t.input as { path?: unknown })?.path === 'string'
            ? [(t.input as { path: string }).path]
            : [],
        );
        send({ type: 'answer', id: answerId, text, sources: collectSources(text, readPaths) });

        const answer = {
          id: answerId,
          role: 'assistant',
          parts: [
            ...tools.map((t) => ({ type: `tool-${t.name}`, input: t.input })),
            { type: 'text', text },
          ],
        } as unknown as ChatUIMessage;
        finished(saved.then(() => recordAssistantMessage(threadId, answer)).catch(logError));
      } catch (e) {
        console.error('[api/bot/answer]', e);
        send({ type: 'error', message: 'The assistant hit an error.' });
      } finally {
        finished(saved);
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
  });

  after(async () => {
    await saved;
    await stored;
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
