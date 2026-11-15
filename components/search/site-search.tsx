'use client';

import {
  AiMagicIcon,
  ArrowUpRight01Icon,
  BookOpen01Icon,
  File01Icon,
  Loading03Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import {
  type ComponentProps,
  createContext,
  Fragment,
  type ReactNode,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { useAskAi } from '@/components/ai/ask-ai';
import { randomId, sendEvent } from '@/lib/analytics/client';
import { cn } from '@/lib/cn';
import { SITE } from '@/lib/site';

/**
 * Docs search (Cmd/Ctrl+K or "/"), the same dialog as pangolin.net's site search.
 * Results come from the docs' own index (`/api/search`); a 3+ word query also offers
 * to ask Pangolin AI. Each search is logged once for analytics (see `useSearchLog`).
 */

type SearchContextValue = { open: boolean; setOpen: (open: boolean) => void };

const SearchContext = createContext<SearchContextValue | null>(null);

function useSearchContext() {
  const ctx = use(SearchContext);
  if (!ctx) throw new Error('Search components must be inside <SiteSearchProvider>');
  return ctx;
}

export function SiteSearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (open) return;
    const target = e.target as HTMLElement | null;
    const typing =
      target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '');
    if (
      (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
      (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey)
    ) {
      e.preventDefault();
      setOpen(true);
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <SearchContext value={useMemo(() => ({ open, setOpen }), [open])}>
      {children}
      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </SearchContext>
  );
}

/** opens the search dialog; style it at the call site */
export function SearchButton({ onClick, ...props }: ComponentProps<'button'>) {
  const { setOpen } = useSearchContext();
  return (
    <button
      type="button"
      aria-label="Search"
      aria-haspopup="dialog"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        setOpen(true);
      }}
    />
  );
}

const noopSubscribe = () => () => {};

/** "⌘K" on Apple devices, "Ctrl K" elsewhere ("⌘K" during SSR) */
export function SearchShortcut({ className }: { className?: string }) {
  const label = useSyncExternalStore(
    noopSubscribe,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl K'),
    () => '⌘K',
  );
  return <kbd className={className}>{label}</kbd>;
}

/** Search field look-alike that opens the dialog (pangolin.net news search) */
export function SearchField({ className }: { className?: string }) {
  return (
    <SearchButton
      className={cn(
        'flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-transparent px-3 text-left transition-[color,box-shadow,border-color] hover:border-faint focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        className,
      )}
    >
      <HugeiconsIcon icon={Search01Icon} className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} />
      <span className="min-w-0 flex-1 truncate text-base text-muted-foreground md:text-sm">
        Search docs
      </span>
      <SearchShortcut className="hidden shrink-0 rounded border bg-soft px-1.5 py-px font-sans text-[11px] text-muted-foreground [@media(hover:hover)]:inline" />
    </SearchButton>
  );
}

type Item =
  | { kind: 'ask'; key: string; query: string }
  | {
      kind: 'docs' | 'site';
      key: string;
      url: string;
      title: string;
      crumb?: string;
      context?: string;
      snippet?: string;
    };

const QUICK_LINKS: Item[] = [
  { kind: 'docs', key: 'q-install', url: '/self-host/quick-install', title: 'Quick install' },
  { kind: 'docs', key: 'q-how', url: '/about/how-pangolin-works', title: 'How Pangolin works' },
  { kind: 'docs', key: 'q-sites', url: '/manage/sites/understanding-sites', title: 'Sites' },
  {
    kind: 'docs',
    key: 'q-resources',
    url: '/manage/resources/understanding-resources',
    title: 'Resources',
  },
  { kind: 'docs', key: 'q-clients', url: '/manage/clients/understanding-clients', title: 'Clients' },
  { kind: 'docs', key: 'q-ai', url: '/manage/ai/overview', title: 'AI Gateway' },
  { kind: 'site', key: 'q-pricing', url: `${SITE}/pricing`, title: 'Pricing' },
];

/** one entry of the Fumadocs search API response */
type RawResult = {
  id: string;
  url: string;
  type: 'page' | 'heading' | 'text';
  content: string;
  breadcrumbs?: string[];
};

type PageResult = {
  url: string;
  title: string;
  crumb?: string;
  context?: string;
  snippet?: string;
};

/** strip the index's <mark> tags and inline markdown; the dialog highlights itself */
function plain(text: string) {
  return text
    .replace(/<\/?mark>/g, '')
    .replace(/\*\*|__|`/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .trim();
}

/** results are flat (page, then its matching headings / paragraphs); fold them per page */
function groupResults(raw: RawResult[]): PageResult[] {
  const pages: PageResult[] = [];
  let current: PageResult | undefined;
  for (const r of raw) {
    if (r.type === 'page') {
      const crumbs = (r.breadcrumbs ?? []).filter((b) => b !== 'Docs');
      current = { url: r.url, title: plain(r.content), crumb: crumbs.join(' / ') || undefined };
      pages.push(current);
      continue;
    }
    if (!current) continue;
    if (r.type === 'heading' && !current.context) {
      current.context = plain(r.content);
      if (current.url === r.url.split('#')[0]) current.url = r.url;
    } else if (r.type === 'text' && !current.snippet) {
      current.snippet = plain(r.content);
    }
  }
  return pages;
}

const DEBOUNCE_MS = 120;

function useSearchResults(query: string) {
  const [state, setState] = useState<{
    query: string;
    data?: PageResult[];
    loading: boolean;
    error?: boolean;
  }>({ query: '', loading: false });
  const cache = useRef(new Map<string, PageResult[]>());

  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const cached = cache.current.get(q);
    if (cached) {
      setState({ query: q, data: cached, loading: false });
      return;
    }
    setState((prev) => ({ ...prev, loading: true }));
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = groupResults((await res.json()) as RawResult[]).slice(0, 10);
        cache.current.set(q, data);
        setState({ query: q, data, loading: false });
      } catch (e) {
        if (controller.signal.aborted) return;
        console.error('[search]', e);
        setState((prev) => ({ ...prev, loading: false, error: true }));
      }
    }, DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return query.trim() ? state : { query: '', loading: false as const, data: undefined, error: false };
}

/** a query has to sit still this long before it counts as a search */
const SETTLE_MS = 1500;

/**
 * Stores each search once with how many pages matched (0 = no results) and which
 * result, if any, was opened. Typing further ("dock" → "docker compose") updates the
 * same row instead of logging every prefix.
 */
function useSearchLog(query: string, results: number | undefined) {
  const settled = useRef<{ query: string; results: number } | null>(null);
  const logged = useRef<{ id: string; query: string; results: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  function commit(clickedUrl?: string) {
    window.clearTimeout(timer.current);
    const current = settled.current;
    if (!current) return;

    const prev = logged.current;
    if (!clickedUrl && prev?.query === current.query && prev.results === current.results) return;
    const refines = prev && current.query.toLowerCase().startsWith(prev.query.toLowerCase());
    logged.current = { id: refines ? prev.id : randomId(), ...current };

    sendEvent('/api/analytics/search', {
      id: logged.current.id,
      query: current.query,
      results: current.results,
      clickedUrl,
      page: location.pathname,
    });
  }

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!query || results === undefined) {
      if (!query) settled.current = null;
      return;
    }
    settled.current = { query, results };
    timer.current = window.setTimeout(() => commit(), SETTLE_MS);
    return () => window.clearTimeout(timer.current);
  }, [query, results]);

  return commit;
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const askAi = useAskAi();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const results = useSearchResults(query);
  const { data, loading, error } = results;
  const q = query.trim();
  const fresh = results.query === q && !loading ? data : undefined;
  const logSearch = useSearchLog(q, fresh?.length);

  const wordCount = q ? q.split(/\s+/).filter(Boolean).length : 0;
  const showAsk = wordCount >= 3;

  const groups = useMemo(() => {
    if (!q) return [{ label: 'Popular', items: QUICK_LINKS }];
    const result: { label?: string; items: Item[] }[] = [];
    if (showAsk) result.push({ items: [{ kind: 'ask', key: 'ask', query: q }] });
    if (data?.length)
      result.push({
        label: 'Documentation',
        items: data.map((r) => ({ kind: 'docs', key: `d-${r.url}`, ...r })),
      });
    return result;
  }, [q, data, showAsk]);

  const items = groups.flatMap((g) => g.items);
  const activeIndex = Math.min(active, Math.max(items.length - 1, 0));
  const terms = useMemo(
    () =>
      q
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length > 1),
    [q],
  );

  // lock page scroll while open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  function close() {
    logSearch();
    onClose();
  }

  function select(item: Item | undefined, newTab = false) {
    if (!item) return;
    if (item.kind === 'ask') {
      close();
      askAi(item.query);
      return;
    }
    logSearch(item.url);
    onClose();
    if (newTab) window.open(item.url, '_blank', 'noopener,noreferrer');
    else if (item.kind === 'site') window.location.href = item.url;
    else router.push(item.url);
  }

  return (
    <div className="fixed inset-0 z-[1020]">
      <div
        aria-hidden
        className="absolute inset-0 animate-[ask-ai-fade-in_150ms] bg-black/25 backdrop-blur-[2px]"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the docs"
        className="absolute top-3 left-1/2 flex max-h-[calc(100dvh-1.5rem)] w-[min(640px,calc(100vw-1.5rem))] -translate-x-1/2 animate-[ask-ai-in_180ms_var(--ease-brand)] flex-col overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-[0_4px_4px_rgba(0,0,0,0.05),0_24px_64px_-16px_rgba(0,0,0,0.25)] md:top-[12vh] md:max-h-[min(560px,76vh)]"
      >
        <div className="flex items-center gap-3 border-b px-4">
          <HugeiconsIcon
            icon={loading ? Loading03Icon : Search01Icon}
            className={cn('size-[18px] shrink-0 text-muted-foreground', loading && 'animate-spin')}
            strokeWidth={2}
          />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const step = e.key === 'ArrowDown' ? 1 : -1;
                setActive((activeIndex + step + items.length) % Math.max(items.length, 1));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                select(items[activeIndex], e.metaKey || e.ctrlKey);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                close();
              }
            }}
            placeholder="Search the docs…"
            aria-label="Search"
            aria-controls="site-search-results"
            aria-activedescendant={items[activeIndex] ? `site-search-${activeIndex}` : undefined}
            role="combobox"
            aria-expanded="true"
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-faint"
          />
          <button
            type="button"
            onClick={close}
            className="shrink-0 cursor-pointer rounded-md border bg-soft px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
          >
            Esc
          </button>
        </div>

        <div
          ref={listRef}
          id="site-search-results"
          role="listbox"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
        >
          {groups.map((group, gi) => (
            <Fragment key={group.label ?? gi}>
              {group.label && (
                <p className="px-2 pt-3 pb-1.5 text-xs text-faint first:pt-1">{group.label}</p>
              )}
              {group.items.map((item) => {
                const index = items.indexOf(item);
                return (
                  <ResultRow
                    key={item.key}
                    id={`site-search-${index}`}
                    index={index}
                    item={item}
                    terms={terms}
                    active={index === activeIndex}
                    onHover={() => setActive(index)}
                    onSelect={(newTab) => select(item, newTab)}
                  />
                );
              })}
            </Fragment>
          ))}
          {q && !loading && data && !data.length && (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No pages match <q>{q}</q>
              {showAsk ? '. Try asking Pangolin AI instead.' : '.'}
            </p>
          )}
          {q && error && !data && (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              Search is unavailable right now.
            </p>
          )}
        </div>

        <div className="hidden items-center gap-4 border-t bg-soft px-4 py-2 text-[11px] text-muted-foreground md:flex">
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> to navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↵</Kbd> to open
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>Esc</Kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-5 items-center justify-center rounded border bg-card px-1 py-px font-sans text-[10px] text-muted-foreground">
      {children}
    </kbd>
  );
}

function ResultRow({
  id,
  index,
  item,
  terms,
  active,
  onHover,
  onSelect,
}: {
  id: string;
  index: number;
  item: Item;
  terms: string[];
  active: boolean;
  onHover: () => void;
  onSelect: (newTab: boolean) => void;
}) {
  const icon = item.kind === 'ask' ? AiMagicIcon : item.kind === 'docs' ? BookOpen01Icon : File01Icon;

  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      data-index={index}
      onMouseMove={onHover}
      onClick={(e) => onSelect(e.metaKey || e.ctrlKey)}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 transition-colors',
        active && 'bg-accent',
      )}
    >
      <span
        className={cn(
          'mt-px inline-flex size-7 shrink-0 items-center justify-center rounded-md border bg-card text-muted-foreground',
          item.kind === 'ask' && 'border-primary/25 bg-hero-tint text-primary',
        )}
      >
        <HugeiconsIcon icon={icon} className="size-4" strokeWidth={1.75} />
      </span>
      {item.kind === 'ask' ? (
        <div className="min-w-0 flex-1 py-1 text-sm">
          <span className="font-medium text-foreground">Ask Pangolin AI:</span>{' '}
          <span className="text-muted-foreground">&ldquo;{item.query}&rdquo;</span>
        </div>
      ) : (
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <span className="truncate">{item.title}</span>
            {item.crumb && (
              <span className="shrink-0 truncate text-xs font-normal text-faint">{item.crumb}</span>
            )}
            {item.kind === 'site' && (
              <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-3 shrink-0 text-faint" strokeWidth={2} />
            )}
          </p>
          {(item.context || item.snippet) && (
            <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {item.context && (
                <span className="font-medium text-foreground/75">
                  {item.context}
                  {item.snippet ? ' · ' : ''}
                </span>
              )}
              {item.snippet && <Highlight text={item.snippet} terms={terms} />}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>;
  const pattern = new RegExp(
    `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi',
  );
  return (
    <>
      {text.split(pattern).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-hero-tint px-px text-foreground">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
