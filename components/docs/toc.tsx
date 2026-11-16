'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * "Contents" list with scroll spy, same as the pangolin.net news article TOC
 * (landing-v5 `components/marketing/news-article-toc.tsx`).
 */

export type TocItem = { title: ReactNode; url: string; depth: number };

const DEFAULT_SCROLL_MARGIN = 120;
/** forgive small drift between the anchor scroll position and the spy line */
const ACTIVATION_TOLERANCE = 48;

function idOf(item: TocItem) {
  return decodeURIComponent(item.url.replace(/^#/, ''));
}

function getActiveId(items: TocItem[]): string {
  if (items.length === 0) return '';
  const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  const line = (Number.isFinite(padding) ? padding : DEFAULT_SCROLL_MARGIN) + ACTIVATION_TOLERANCE;

  const atBottom =
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  if (atBottom) return idOf(items[items.length - 1]);

  let active = idOf(items[0]);
  for (const item of items) {
    const el = document.getElementById(idOf(item));
    if (el && el.getBoundingClientRect().top <= line) active = idOf(item);
  }
  return active;
}

export function DocsToc({ items, className }: { items: TocItem[]; className?: string }) {
  const [activeId, setActiveId] = useState('');
  const clickTarget = useRef<string | null>(null);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minDepth = Math.min(...items.map((i) => i.depth));

  useEffect(() => {
    const sync = () => setActiveId(getActiveId(items));

    const finishClickScroll = () => {
      const clicked = clickTarget.current;
      clickTarget.current = null;
      if (fallback.current) clearTimeout(fallback.current);
      fallback.current = null;
      setActiveId(clicked ?? getActiveId(items));
    };

    const onScroll = () => {
      if (clickTarget.current) {
        if (fallback.current) clearTimeout(fallback.current);
        // scrollend is missing in some browsers or never fires without movement
        fallback.current = setTimeout(finishClickScroll, 500);
        return;
      }
      sync();
    };

    const onScrollEnd = () => (clickTarget.current ? finishClickScroll() : sync());

    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', onScrollEnd);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', onScrollEnd);
      if (fallback.current) clearTimeout(fallback.current);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className={cn('flex flex-col gap-3', className)} aria-label="On this page">
      <div className="text-sm font-medium text-foreground">On this page</div>
      <ol className="m-0 flex list-none flex-col gap-2 border-l border-border p-0">
        {items.map((item) => {
          const id = idOf(item);
          const level = Math.min(item.depth - minDepth, 2);
          return (
            <li key={item.url} className={cn('m-0 -ml-px p-0', level === 1 && 'pl-3', level === 2 && 'pl-6')}>
              <a
                href={item.url}
                onClick={() => {
                  clickTarget.current = id;
                  setActiveId(id);
                }}
                className={cn(
                  'block border-l border-transparent pl-3 text-sm leading-snug text-muted-foreground no-underline transition hover:text-foreground',
                  id === activeId && 'border-primary! font-medium text-foreground!',
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
