'use client';

import { useChat, type UseChatHelpers } from '@ai-sdk/react';
import {
  AiMagicIcon,
  ArrowUp02Icon,
  Cancel01Icon,
  File01Icon,
  Loading03Icon,
  RefreshIcon,
  Search01Icon,
  StopIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { DefaultChatTransport } from 'ai';
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  type SyntheticEvent,
  use,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Markdown } from '@/components/markdown';
import type { ChatUIMessage } from '@/lib/ai/types';
import { getVisitorId, randomId, sendFeedback, type Vote } from '@/lib/analytics/client';
import { cn } from '@/lib/cn';

/**
 * "Ask Pangolin AI": the same floating bar and chat panel as pangolin.net
 * (landing-v5 `components/ask-ai/ask-ai.tsx`). Answers come from `/api/chat`, which
 * searches and reads these docs. Conversations and answer votes go to analytics.
 */

type AskAiContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: UseChatHelpers<ChatUIMessage>;
  /** empties the chat and starts a new analytics thread */
  clear: () => void;
  votes: Record<string, Vote>;
  vote: (messageId: string, vote: Vote) => void;
};

const AskAiContext = createContext<AskAiContextValue | null>(null);

function useAskAiContext() {
  const ctx = use(AskAiContext);
  if (!ctx) throw new Error('Ask AI components must be inside <AskAiProvider>');
  return ctx;
}

const suggestions = [
  'How do I expose a web app running on my home server?',
  'What is the difference between a site and a client?',
  'How do I self-host Pangolin with Docker Compose?',
  'How do I connect Claude Code to the AI Gateway?',
];

function sendText(send: UseChatHelpers<ChatUIMessage>['sendMessage'], text: string) {
  void send({
    role: 'user',
    parts: [
      { type: 'data-client', data: { location: location.href } },
      { type: 'text', text },
    ],
  });
}

export function AskAiProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  // one analytics thread per conversation; "Clear chat" starts a new one
  const threadId = useRef<string>(null);
  const [transport] = useState(
    () =>
      new DefaultChatTransport<ChatUIMessage>({
        api: '/api/chat',
        body: () => ({ threadId: (threadId.current ??= randomId()), visitorId: getVisitorId() }),
      }),
  );
  const chat = useChat<ChatUIMessage>({ id: 'ask-ai', transport });

  const { setMessages } = chat;
  const clear = useCallback(() => {
    setMessages([]);
    setVotes({});
    threadId.current = null;
  }, [setMessages]);
  const vote = useCallback((messageId: string, value: Vote) => {
    setVotes((prev) => ({ ...prev, [messageId]: value }));
    sendFeedback('message', { messageId, vote: value });
  }, []);

  return (
    <AskAiContext
      value={useMemo(
        () => ({ open, setOpen, chat, clear, votes, vote }),
        [open, chat, clear, votes, vote],
      )}
    >
      {children}
      <AskAiPanel />
      <AskAiFloatingBar />
    </AskAiContext>
  );
}

/** open the panel, and optionally ask `text` right away */
export function useAskAi() {
  const { setOpen, chat } = useAskAiContext();
  return (text?: string) => {
    setOpen(true);
    if (!text || chat.status === 'streaming' || chat.status === 'submitted') return;
    sendText(chat.sendMessage, text);
  };
}

/** any button that opens the panel */
export function AskAiButton({ onClick, ...props }: ComponentProps<'button'>) {
  const ask = useAskAi();
  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ask();
      }}
    />
  );
}

const noopSubscribe = () => () => {};

/**
 * Floating "Ask Pangolin AI…" bar: Enter opens the panel and asks right away; empty
 * just opens it. Hidden while the panel is open.
 */
function AskAiFloatingBar() {
  const { open } = useAskAiContext();
  const ask = useAskAi();
  const [value, setValue] = useState('');
  const shortcut = useSyncExternalStore(
    noopSubscribe,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘I' : 'Ctrl I'),
    () => '⌘I',
  );

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const text = value.trim();
    ask(text || undefined);
    setValue('');
  };

  return (
    <>
      {/* phones: just an icon */}
      <button
        type="button"
        aria-label="Ask Pangolin AI"
        aria-expanded={open}
        tabIndex={open ? -1 : undefined}
        onClick={() => ask()}
        className={cn(
          'fixed right-4 bottom-4 z-40 inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-[oklch(0.58_0.19_41.93)] bg-[linear-gradient(180deg,oklch(0.72_0.18_45)_0%,var(--primary)_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_2px_8px_-2px_rgba(243,107,33,0.35)] transition-[translate,opacity] duration-200 md:hidden',
          open && 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <HugeiconsIcon icon={AiMagicIcon} className="size-5" strokeWidth={2} />
      </button>
      <form
        onSubmit={onSubmit}
        aria-hidden={open}
        className={cn(
          'fixed right-4 bottom-4 z-40 hidden w-[min(22rem,calc(100vw-2rem))] items-center gap-2 rounded-full border bg-background py-1.5 pr-1.5 pl-2 shadow-[0_4px_12px_rgba(32,32,32,0.06)] transition-[translate,opacity,border-color,box-shadow] duration-200 focus-within:border-faint focus-within:shadow-[0_4px_14px_rgba(32,32,32,0.1)] md:flex',
          open && 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <button
          type="button"
          aria-label="Open Ask Pangolin AI"
          tabIndex={open ? -1 : undefined}
          className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-primary transition-colors hover:bg-accent"
          onClick={() => ask()}
        >
          <HugeiconsIcon icon={AiMagicIcon} className="size-4" strokeWidth={2} />
        </button>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask Pangolin AI…"
          aria-label="Ask Pangolin AI a question"
          tabIndex={open ? -1 : undefined}
          className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-faint md:text-sm"
        />
        <kbd className="hidden shrink-0 rounded-md border bg-soft px-1.5 py-0.5 font-sans text-[11px] text-muted-foreground [@media(hover:hover)]:inline">
          {shortcut}
        </kbd>
        <button
          type="submit"
          aria-label="Send"
          tabIndex={open ? -1 : undefined}
          className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-colors hover:brightness-[1.06]"
        >
          <HugeiconsIcon icon={ArrowUp02Icon} className="size-4" strokeWidth={2.5} />
        </button>
      </form>
    </>
  );
}

function AskAiPanel() {
  const { open, setOpen } = useAskAiContext();
  const [mounted, setMounted] = useState(open);
  useHotKey();

  if (open && !mounted) setMounted(true);

  // desktop: the page makes room for the side panel (see `html[data-ai-open]` in
  // app/global.css). Follows `open` directly so the page moves back as the panel closes.
  useEffect(() => {
    document.documentElement.toggleAttribute('data-ai-open', open);
    return () => document.documentElement.removeAttribute('data-ai-open');
  }, [open]);

  // unmount after the close transition
  useEffect(() => {
    if (open || !mounted) return;
    const timer = window.setTimeout(() => setMounted(false), 200);
    return () => window.clearTimeout(timer);
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <>
      <div
        aria-hidden
        className={cn(
          'fixed inset-0 z-[1010] bg-black/20 backdrop-blur-[2px] lg:hidden',
          open ? 'animate-[ask-ai-fade-in_200ms]' : 'opacity-0 transition-opacity duration-200',
        )}
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-label="Ask Pangolin AI"
        className={cn(
          'fixed z-[1010] flex flex-col overflow-hidden bg-card text-card-foreground',
          // phones / tablets: an overlay card
          'inset-x-2 top-4 bottom-2 rounded-2xl border shadow-[0_24px_64px_-16px_rgba(32,24,16,0.28),0_2px_6px_rgba(0,0,0,0.04)]',
          // desktop: a full-height side panel next to the header (which shifts left)
          'lg:inset-x-auto lg:top-0 lg:right-0 lg:bottom-0 lg:z-50 lg:w-[var(--ai-panel-width)] lg:rounded-none lg:border-0 lg:border-l lg:shadow-none',
          open
            ? 'animate-[ask-ai-in_200ms_var(--ease-brand)] lg:animate-[ask-ai-panel-in_200ms_var(--ease-brand)]'
            : 'translate-y-2 opacity-0 transition-[translate,opacity] duration-200 lg:translate-x-full lg:translate-y-0 lg:opacity-100',
        )}
      >
        <PanelHeader />
        <MessageList className="min-h-0 flex-1" />
        <div className="p-3 pt-0">
          <div className="rounded-xl border bg-background shadow-[0_1px_2px_rgba(32,32,32,0.04)] transition-[border-color,box-shadow] focus-within:border-faint focus-within:shadow-[0_4px_16px_rgba(32,32,32,0.08)]">
            <ChatInput />
            <InputActions />
          </div>
        </div>
      </div>
    </>
  );
}

function PanelHeader() {
  const { setOpen } = useAskAiContext();

  return (
    <div className="flex items-start gap-2 border-b bg-soft px-4 py-3">
      <div className="flex-1">
        <p className="flex items-center gap-1.5 text-sm font-bold">
          <HugeiconsIcon icon={AiMagicIcon} className="size-4 text-primary" strokeWidth={2} />
          Ask Pangolin AI
        </p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          Answers are generated from the docs and can be wrong. Check the linked pages.
          Don&apos;t send any sensitive information.
        </p>
      </div>
      <button
        type="button"
        aria-label="Close"
        className="-mr-1.5 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        onClick={() => setOpen(false)}
      >
        <HugeiconsIcon icon={Cancel01Icon} className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}

function InputActions() {
  const { chat, clear } = useAskAiContext();
  const { messages, status, regenerate } = chat;
  const busy = status === 'streaming' || status === 'submitted';

  if (messages.length === 0) return null;

  const pill =
    'inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border bg-muted px-3 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-accent disabled:cursor-default disabled:opacity-50';

  return (
    <div className="flex items-center gap-1.5 px-2 pb-2">
      {!busy && messages.at(-1)?.role === 'assistant' && (
        <button type="button" className={pill} onClick={() => regenerate()}>
          <HugeiconsIcon icon={RefreshIcon} className="size-3.5" strokeWidth={2} />
          Retry
        </button>
      )}
      <button type="button" className={pill} disabled={busy} onClick={clear}>
        Clear chat
      </button>
    </div>
  );
}

const StorageKeyInput = '__ask_ai_input';

function ChatInput() {
  const { chat } = useAskAiContext();
  const { status, sendMessage, stop } = chat;
  const [input, setInput] = useState(() => {
    try {
      return localStorage.getItem(StorageKeyInput) ?? '';
    } catch {
      return '';
    }
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const busy = status === 'streaming' || status === 'submitted';

  const saveInput = (value: string) => {
    setInput(value);
    try {
      if (value) localStorage.setItem(StorageKeyInput, value);
      else localStorage.removeItem(StorageKeyInput);
    } catch {
      // storage unavailable
    }
  };

  const onSubmit = (e?: SyntheticEvent) => {
    e?.preventDefault();
    const message = input.trim();
    if (message.length === 0 || busy) return;
    sendText(sendMessage, message);
    saveInput('');
  };

  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy]);

  const field = 'col-start-1 row-start-1 max-h-40 px-2 py-1.5 text-base md:text-sm';

  return (
    <form className="flex items-end gap-2 p-2" onSubmit={onSubmit}>
      {/* auto-growing textarea: an invisible copy of the text sizes the grid cell */}
      <div className="grid min-w-0 flex-1">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          placeholder={busy ? 'Pangolin AI is answering…' : 'Ask a question…'}
          aria-label="Ask a question"
          autoFocus
          disabled={busy}
          className={cn(
            field,
            'resize-none overflow-y-auto bg-transparent placeholder:text-faint focus-visible:outline-none',
          )}
          onChange={(e) => saveInput(e.target.value)}
          onKeyDown={(event) => {
            // keyCode 229: Safari fires `compositionend` before this keydown
            if (event.nativeEvent.isComposing || event.keyCode === 229) return;
            if (!event.shiftKey && event.key === 'Enter') onSubmit(event);
          }}
        />
        <div aria-hidden className={cn(field, 'invisible overflow-hidden break-words whitespace-pre-wrap')}>
          {`${input}\n`}
        </div>
      </div>
      {busy ? (
        <button
          type="button"
          aria-label="Stop answering"
          className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground text-background"
          onClick={stop}
        >
          <HugeiconsIcon icon={StopIcon} className="size-3.5" strokeWidth={2.5} />
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Send"
          disabled={input.trim().length === 0}
          className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-colors disabled:cursor-default disabled:bg-muted disabled:text-faint"
        >
          <HugeiconsIcon icon={ArrowUp02Icon} className="size-4" strokeWidth={2.5} />
        </button>
      )}
    </form>
  );
}

function MessageList({ className }: { className?: string }) {
  const { chat } = useAskAiContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const messages = chat.messages.filter((msg) => msg.role !== 'system');
  const empty = messages.length === 0;

  // stick to the bottom while the answer streams in
  useEffect(() => {
    const container = containerRef.current;
    const content = container?.firstElementChild;
    if (!container || !content) return;
    const scroll = () => container.scrollTo({ top: container.scrollHeight, behavior: 'instant' });
    const observer = new ResizeObserver(scroll);
    observer.observe(content);
    scroll();
    return () => observer.disconnect();
  }, [empty]);

  return (
    <div
      ref={containerRef}
      className={cn('flex min-w-0 flex-col overflow-y-auto overscroll-contain py-4', className)}
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)',
      }}
    >
      {empty ? (
        <div className="flex flex-1 flex-col justify-end gap-2 px-3">
          <p className="mb-1 px-1 text-sm text-muted-foreground">
            Ask anything about Pangolin. The assistant searches and reads these docs to answer.
          </p>
          {suggestions.map((q) => (
            <button
              key={q}
              type="button"
              className="cursor-pointer rounded-xl border bg-card px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-soft"
              onClick={() => sendText(chat.sendMessage, q)}
            >
              {q}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-4">
          {messages.map((message, i) => (
            <Message
              key={message.id}
              message={message}
              complete={i < messages.length - 1 || chat.status === 'ready' || chat.status === 'error'}
            />
          ))}
          {chat.status === 'submitted' && messages.at(-1)?.role === 'user' && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
              Thinking…
            </p>
          )}
          {chat.error && (
            <div className="rounded-lg border bg-soft p-3">
              <p className="mb-1 text-xs text-muted-foreground">Request failed</p>
              <p className="text-sm">{errorText(chat.error)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ToolPart {
  type: string;
  toolCallId: string;
  state: string;
  input?: { query?: string; path?: string };
  output?: unknown;
  errorText?: string;
}

function ToolActivity({ part }: { part: ToolPart }) {
  const name = part.type.slice('tool-'.length);
  const failed = part.state === 'output-error' || part.state === 'output-denied';
  const done = part.state === 'output-available';
  const search = name === 'search_docs';

  let label: ReactNode = name;
  if (search) {
    const count = Array.isArray(part.output) ? part.output.length : 0;
    label = done ? (
      <>
        Searched the docs for <q>{part.input?.query}</q>, {count} {count === 1 ? 'page' : 'pages'}
      </>
    ) : (
      <>
        Searching the docs for <q>{part.input?.query ?? '…'}</q>
      </>
    );
  } else if (name === 'read_page') {
    label = (
      <>
        {done ? 'Read' : 'Reading'} <code className="font-mono">{part.input?.path ?? '…'}</code>
      </>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-soft px-2 py-1.5 text-xs text-muted-foreground">
      <HugeiconsIcon
        icon={done || failed ? (search ? Search01Icon : File01Icon) : Loading03Icon}
        className={cn('size-3.5 shrink-0', !done && !failed && 'animate-spin')}
        strokeWidth={2}
      />
      <p className={cn('truncate', failed && 'text-destructive')}>
        {failed ? (part.errorText ?? 'Tool call failed') : label}
      </p>
    </div>
  );
}

function MessageFeedback({ messageId }: { messageId: string }) {
  const { votes, vote } = useAskAiContext();
  const current = votes[messageId] ?? 0;

  return (
    <div className="mt-1.5 -ml-1.5 flex items-center gap-0.5 text-muted-foreground">
      {([1, -1] as const).map((value) => {
        const active = current === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={value === 1 ? 'Good response' : 'Bad response'}
            aria-pressed={active}
            className={cn(
              'inline-flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-foreground',
              active && 'text-primary',
            )}
            onClick={() => vote(messageId, active ? 0 : value)}
          >
            <HugeiconsIcon
              icon={value === 1 ? ThumbsUpIcon : ThumbsDownIcon}
              className="size-3.5"
              strokeWidth={2}
            />
          </button>
        );
      })}
      {current !== 0 && <span className="ml-1 text-xs">Thanks for the feedback</span>}
    </div>
  );
}

function Message({ message, complete }: { message: ChatUIMessage; complete: boolean }) {
  let markdown = '';
  const toolCalls: ToolPart[] = [];

  for (const part of message.parts ?? []) {
    if (part.type === 'text') markdown += part.text;
    else if (part.type.startsWith('tool-')) {
      const p = part as unknown as ToolPart;
      if (p.toolCallId) toolCalls.push(p);
    }
  }

  if (message.role === 'user') {
    return (
      <div className="ml-8 self-end rounded-2xl rounded-br-md bg-soft px-3 py-2 text-sm whitespace-pre-wrap">
        {markdown}
      </div>
    );
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-bold text-primary">Pangolin AI</p>
      {toolCalls.length > 0 && (
        <div className="mb-2 flex flex-col gap-1">
          {toolCalls.map((call) => (
            <ToolActivity key={call.toolCallId} part={call} />
          ))}
        </div>
      )}
      {markdown && (
        <div className="ask-ai-prose prose max-w-none text-foreground">
          <Markdown text={markdown} />
        </div>
      )}
      {complete && markdown.length > 0 && <MessageFeedback messageId={message.id} />}
    </div>
  );
}

/** `/api/chat` returns `{ error }` JSON for config / rate-limit errors */
function errorText(error: Error) {
  try {
    const parsed = JSON.parse(error.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    // not JSON
  }
  return error.message;
}

/** Esc closes, Cmd/Ctrl+I opens */
function useHotKey() {
  const { open, setOpen } = useAskAiContext();

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      e.preventDefault();
    }
    if (e.key === 'i' && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true);
      e.preventDefault();
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
