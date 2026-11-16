'use client';

import Link from 'next/link';
import { AiMagicIcon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AskAiButton } from '@/components/ai/ask-ai';
import { GitHubIcon } from '@/components/icons';
import { SearchButton, SearchField } from '@/components/search/site-search';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import type { NavLink } from '@/lib/navigation';
import { LINKS } from '@/lib/site';
import { ArrowUpRightIcon } from './icons';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';

/**
 * Docs header: logo, search and Ask AI front and centre, then the docs' outbound
 * links (`tabs` in lib/navigation.json) and one call to action. Same visual language
 * as pangolin.net (translucent bar, hairline, tactile primary button), but its own
 * content: the site menus live on pangolin.net.
 */
export function SiteHeader({ links, stars }: { links: NavLink[]; stars: string | null }) {
  // GitHub gets its own icon + stars; the Trust Center lives in the footer
  const textLinks = links.filter((link) => !/github\.com|trust\.pangolin\.net/.test(link.href));

  return (
    <header className="sticky top-0 z-40 bg-background">
      {/* `docs-shell` + the same container and columns as the page, so the search lines
          up with the content column (also while the Ask AI panel is open) */}
      <div className="docs-shell">
        <div className="mx-auto flex h-[var(--site-header-height)] w-full max-w-[1440px] items-center gap-4 px-5 sm:px-8 lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-10 xl:gap-14">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Pangolin Docs home"
          >
            <Logo className="h-7" />
            <span className="rounded-md border bg-soft px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
              Docs
            </span>
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-6">
            {/* search + Ask AI, the main tools of the docs */}
            <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex lg:justify-start">
              <SearchField className="max-w-sm" />
              <AskAiButton
                className={cn(buttonVariants({ variant: 'flat' }), 'shrink-0 px-3 font-medium')}
              >
                <HugeiconsIcon icon={AiMagicIcon} className="size-4 text-primary" strokeWidth={2} />
                Ask AI
              </AskAiButton>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1">
              <nav aria-label="Pangolin" className="docs-header-links hidden items-center gap-1 xl:flex">
                {textLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    {link.label}
                    <ArrowUpRightIcon className="size-3 text-faint" />
                  </a>
                ))}
              </nav>
              <ThemeToggle />
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={stars ? `Pangolin on GitHub, ${stars} stars` : 'Pangolin on GitHub'}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <GitHubIcon className="size-4" />
                {stars ? <span>{stars}</span> : null}
              </a>
              <SearchButton className="inline-flex cursor-pointer items-center rounded-md p-2 text-muted-foreground transition hover:text-foreground md:hidden">
                <HugeiconsIcon icon={Search01Icon} className="size-5" strokeWidth={2} />
              </SearchButton>
              <a
                href={LINKS.signup}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: 'sm' }), 'ml-2 max-sm:hidden')}
              >
                Start for free
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
