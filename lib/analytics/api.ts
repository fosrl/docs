import 'server-only';
import type { ChatUIMessage } from '@/components/ai/search';

/**
 * Analytics are stored by the Fossorial API (`/api/v1/docs-analytics`), called from the
 * docs server with `FOSSORIAL_API_KEY` so the key never reaches the browser. With
 * `FOSSORIAL_API_URL` or the key unset, events are dropped (fine for local development).
 */
const apiUrl = process.env.FOSSORIAL_API_URL?.replace(/\/+$/, '');
const apiKey = process.env.FOSSORIAL_API_KEY;

class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

let warned = false;

async function post(path: string, body: object) {
  if (!apiUrl || !apiKey) {
    if (!warned) console.warn('[analytics] FOSSORIAL_API_URL / FOSSORIAL_API_KEY not set; not storing analytics');
    warned = true;
    return;
  }

  const res = await fetch(`${apiUrl}/api/v1/docs-analytics${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
    cache: 'no-store',
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new ApiError(res.status, `Fossorial API ${path} responded ${res.status} ${detail.slice(0, 300)}`);
  }
}

/** ids come from the browser: keep them short and boring */
export function parseId(value: unknown): string | null {
  return typeof value === 'string' && /^[\w-]{8,64}$/.test(value) ? value : null;
}

export function parseVote(value: unknown): -1 | 0 | 1 | null {
  return value === 1 || value === -1 || value === 0 ? value : null;
}

/** `vote: 0` clears a previous vote */
export async function recordPageVote(page: string, visitorId: string, vote: -1 | 0 | 1) {
  await post('/page-votes', { page, visitorId, vote });
}

/** returns false when the message isn't a stored assistant response */
export async function recordMessageVote(
  messageId: string,
  visitorId: string | null,
  vote: -1 | 0 | 1,
): Promise<boolean> {
  try {
    await post('/message-votes', { messageId, visitorId, vote });
    return true;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return false;
    throw e;
  }
}

function messageText(message: ChatUIMessage) {
  return message.parts
    .flatMap((p) => (p.type === 'text' ? [p.text] : []))
    .join('')
    .trim();
}

function messagePage(message: ChatUIMessage) {
  for (const part of message.parts) {
    if (part.type !== 'data-client') continue;
    try {
      const url = new URL(part.data.location);
      return `${url.pathname}${url.search}${url.hash}`.slice(0, 2048);
    } catch {
      return null;
    }
  }
  return null;
}

/** creates the thread on its first question; re-sent messages (regenerate) are ignored */
export async function recordUserMessage(
  threadId: string,
  visitorId: string | null,
  message: ChatUIMessage,
) {
  const id = parseId(message.id);
  const content = messageText(message);
  if (!id || !content) return;

  await post('/chat-messages', {
    threadId,
    visitorId,
    page: messagePage(message),
    id,
    role: 'user',
    content,
  });
}

export async function recordAssistantMessage(threadId: string, message: ChatUIMessage) {
  const id = parseId(message.id);
  if (!id) return;

  const tools = message.parts.flatMap((p) => {
    if (!p.type.startsWith('tool-')) return [];
    const input = (p as { input?: unknown }).input;
    return [{ name: p.type.slice('tool-'.length), input }];
  });

  await post('/chat-messages', {
    threadId,
    id,
    role: 'assistant',
    content: messageText(message),
    tools,
  });
}

export interface SearchEvent {
  id: string;
  visitorId: string | null;
  query: string;
  results: number;
  clickedUrl: string | null;
  page: string | null;
}

/** one row per search; the dialog re-sends the same id as the query is refined */
export async function recordSearch(e: SearchEvent) {
  await post('/searches', e);
}
