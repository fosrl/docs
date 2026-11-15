'use client';

import Link from 'fumadocs-core/link';
import { usePathname } from 'next/navigation';

export type NotFoundLink = {
  title: string;
  url: string;
};

const fallbackUrls = ['/', '/about/how-pangolin-works', '/self-host/quick-install'];

function segments(path: string) {
  return path.split('/').filter(Boolean);
}

/** Pages that share the most of the requested path, same idea as Mintlify's suggestions. */
function suggest(pages: NotFoundLink[], pathname: string) {
  const wanted = segments(pathname);
  const ranked = pages
    .map((page, index) => {
      const parts = segments(page.url);
      let prefix = 0;
      while (prefix < parts.length && prefix < wanted.length && parts[prefix] === wanted[prefix]) {
        prefix += 1;
      }
      return {
        page,
        index,
        score: prefix === 0 ? 0 : prefix * 100 - Math.abs(parts.length - wanted.length),
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const picks = ranked.slice(0, 3).map((item) => item.page);
  if (picks.length > 0) return picks;

  return fallbackUrls.flatMap((url) => {
    const page = pages.find((item) => item.url === url);
    return page ? [page] : [];
  });
}

export function NotFoundPage({ pages }: { pages: NotFoundLink[] }) {
  const suggestions = suggest(pages, usePathname() || '/');

  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-5xl font-extrabold tracking-[-0.02em] text-primary">404</p>
      <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.02em] text-foreground">Page Not Found</h1>
      <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
        We couldn&apos;t find the page. Maybe you were looking for one of these pages below?
      </p>
      {suggestions.length > 0 && (
        <ul className="mt-8 flex flex-col items-center gap-3">
          {suggestions.map((page) => (
            <li key={page.url}>
              <Link
                href={page.url}
                className="text-sm font-medium text-primary hover:underline hover:underline-offset-4"
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
