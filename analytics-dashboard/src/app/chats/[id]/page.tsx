import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { cn } from '@/lib/cn';
import { getThread } from '@/lib/queries';
import { formatDateTime } from '@/lib/range';
import { Card } from '@/components/ui';
import { MessageMarkdown } from '@/components/message-markdown';

const docsUrl = process.env.DOCS_SITE_URL ?? 'https://docs.pangolin.net';

function toolLabel(tool: { name: string; input?: unknown }) {
  const input = (tool.input ?? {}) as Record<string, unknown>;
  const arg = input.query ?? input.path;
  return typeof arg === 'string' ? `${tool.name}: ${arg}` : tool.name;
}

export default async function ChatPage(props: PageProps<'/chats/[id]'>) {
  await connection();
  const { id } = await props.params;
  const thread = await getThread(id);
  if (!thread) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Link href="/#chats" className="text-sm text-fd-muted-foreground hover:text-fd-foreground">
        ← All chats
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">AI chat</h1>
        <p className="text-sm text-fd-muted-foreground">
          {formatDateTime(thread.createdAt)}
          {thread.page && (
            <>
              {' · started on '}
              <a href={`${docsUrl}${thread.page}`} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                {thread.page}
              </a>
            </>
          )}
          {thread.visitorId && <> · visitor {thread.visitorId.slice(0, 8)}</>}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {thread.messages.map((m) => (
          <Card
            key={m.id}
            id={m.id}
            className={cn(
              'scroll-mt-4 target:ring-2 target:ring-fd-ring',
              m.role === 'user' && 'bg-fd-secondary',
            )}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className={cn('text-sm font-medium', m.role === 'assistant' && 'text-fd-primary')}>
                {m.role === 'user' ? 'User' : 'Pangolin AI'}
              </p>
              <div className="flex items-center gap-3 text-xs text-fd-muted-foreground">
                {m.vote === 1 && <span className="rounded-full border px-2 py-0.5 text-fd-foreground">👍 Helpful</span>}
                {m.vote === -1 && (
                  <span className="rounded-full border px-2 py-0.5 text-fd-foreground">👎 Not helpful</span>
                )}
                <span>{formatDateTime(m.createdAt)}</span>
              </div>
            </div>
            {m.tools.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {m.tools.map((t, i) => (
                  <code key={i} className="max-w-full truncate rounded border bg-fd-background px-1.5 py-0.5 text-xs">
                    {toolLabel(t)}
                  </code>
                ))}
              </div>
            )}
            {m.role === 'user' ? (
              <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
            ) : m.content ? (
              <div className="prose text-sm max-w-none">
                <MessageMarkdown text={m.content} />
              </div>
            ) : (
              <p className="text-sm text-fd-muted-foreground">(no text, the answer was stopped or failed)</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
