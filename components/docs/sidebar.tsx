'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { Menu01Icon, TextAlignLeftIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/cn';
import type { NavLink as Anchor } from '@/lib/navigation';
import { Icon } from '@/components/icons';
import { ArrowUpRightIcon, ChevronDownIcon, ChevronRightIcon, XIcon } from '@/components/site/icons';
import { FeatureBanner } from '@/components/site/feature-banner';

/**
 * Docs navigation, styled like pangolin.net: group labels like the news "Contents"
 * heading, top-level rows like the install page nav, nested pages like the article
 * TOC (hairline rail, orange marker on the current page).
 */

function normalize(url: string) {
  return url.length > 1 ? url.replace(/\/$/, '') : url;
}

function containsUrl(node: PageTree.Node, url: string): boolean {
  if (node.type === 'page') return normalize(node.url) === url;
  if (node.type === 'folder') {
    if (node.index && normalize(node.index.url) === url) return true;
    return node.children.some((child) => containsUrl(child, url));
  }
  return false;
}

function useActiveUrl() {
  return normalize(usePathname() || '/');
}

function TopPage({ node }: { node: PageTree.Item }) {
  const active = useActiveUrl() === normalize(node.url);
  return (
    <Link
      href={node.url}
      data-active={active || undefined}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition [&_svg]:size-4 [&_svg]:shrink-0',
        active
          ? 'bg-soft font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border)]'
          : 'text-muted-foreground hover:bg-soft hover:text-foreground',
      )}
    >
      {node.icon}
      <span className="min-w-0 flex-1">{node.name}</span>
    </Link>
  );
}

function NestedPage({ node }: { node: PageTree.Item }) {
  const active = useActiveUrl() === normalize(node.url);
  return (
    <Link
      href={node.url}
      data-active={active || undefined}
      className={cn(
        '-ml-px block border-l py-1.5 pl-3.5 text-sm leading-snug transition',
        active
          ? 'border-primary font-medium text-foreground'
          : 'border-transparent text-muted-foreground hover:border-faint hover:text-foreground',
      )}
    >
      {node.name}
    </Link>
  );
}

function Folder({ node, nested }: { node: PageTree.Folder; nested: boolean }) {
  const url = useActiveUrl();
  const hasActive = containsUrl(node, url);
  const [open, setOpen] = useState(hasActive);
  const [lastUrl, setLastUrl] = useState(url);
  if (url !== lastUrl) {
    // open the folder when navigation lands inside it
    setLastUrl(url);
    if (hasActive && !open) setOpen(true);
  }

  const indexActive = node.index ? normalize(node.index.url) === url : false;
  const chevron = (
    <ChevronRightIcon
      className={cn('size-3.5 shrink-0 text-faint transition-transform duration-200', open && 'rotate-90')}
    />
  );

  const rowClass = nested
    ? cn(
        '-ml-px flex w-full items-center gap-2 border-l py-1.5 pl-3.5 text-left text-sm leading-snug transition',
        indexActive
          ? 'border-primary font-medium text-foreground'
          : 'border-transparent text-muted-foreground hover:border-faint hover:text-foreground',
      )
    : cn(
        'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition [&_svg]:size-4 [&_svg]:shrink-0',
        indexActive
          ? 'bg-soft font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border)]'
          : hasActive
            ? 'font-medium text-foreground hover:bg-soft'
            : 'text-muted-foreground hover:bg-soft hover:text-foreground',
      );

  return (
    <li>
      {node.index ? (
        <div className={cn(rowClass, 'pr-0')} data-active={indexActive || undefined}>
          {!nested && node.icon}
          <Link href={node.index.url} className="min-w-0 flex-1" onClick={() => setOpen(true)}>
            {node.name}
          </Link>
          <button
            type="button"
            aria-label={open ? `Collapse ${node.name}` : `Expand ${node.name}`}
            aria-expanded={open}
            className="-my-1 mr-1 inline-flex size-6 cursor-pointer items-center justify-center rounded hover:bg-accent"
            onClick={() => setOpen(!open)}
          >
            {chevron}
          </button>
        </div>
      ) : (
        <button type="button" aria-expanded={open} className={cn(rowClass, 'cursor-pointer pr-2')} onClick={() => setOpen(!open)}>
          {!nested && node.icon}
          <span className="min-w-0 flex-1">{node.name}</span>
          {chevron}
        </button>
      )}
      {open && (
        <ul className={cn('flex flex-col border-l', nested ? 'my-0.5 ml-3.5' : 'mt-1 mb-1.5 ml-[1.1875rem]')}>
          {node.children.map((child) => (
            <TreeNode key={child.$id ?? String(child.name)} node={child} nested />
          ))}
        </ul>
      )}
    </li>
  );
}

function TreeNode({ node, nested = false }: { node: PageTree.Node; nested?: boolean }) {
  if (node.type === 'separator') {
    return (
      <li className="mt-6 mb-1.5 px-2.5 text-sm font-semibold text-foreground first:mt-0">
        {node.name}
      </li>
    );
  }
  if (node.type === 'folder') return <Folder node={node} nested={nested} />;
  return <li>{nested ? <NestedPage node={node} /> : <TopPage node={node} />}</li>;
}

function SidebarContent({ tree, anchors }: { tree: PageTree.Root; anchors: Anchor[] }) {
  return (
    <nav aria-label="Docs" className="flex flex-col gap-6 text-sm">
      <FeatureBanner />
      <ul className="flex flex-col gap-0.5">
        {anchors.map((anchor) => (
          <li key={anchor.href}>
            <a
              href={anchor.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-2.5 rounded-md px-2.5 py-1 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <span className="inline-flex size-6 items-center justify-center rounded-md border bg-card text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition group-hover:border-faint group-hover:text-foreground [&_svg]:size-3.5">
                <Icon name={anchor.icon ?? undefined} />
              </span>
              {anchor.label}
            </a>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-0.5">
        {tree.children.map((node) => (
          <TreeNode key={node.$id ?? String(node.name)} node={node} />
        ))}
      </ul>
    </nav>
  );
}

/** desktop: sticky column under the header */
export function DocsSidebar({ tree, anchors }: { tree: PageTree.Root; anchors: Anchor[] }) {
  const ref = useRef<HTMLDivElement>(null);

  // bring the current page into view on first load
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('[data-active]');
    if (!el || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const item = el.getBoundingClientRect();
    if (item.bottom > box.bottom || item.top < box.top) {
      ref.current.scrollTop += item.top - box.top - box.height / 3;
    }
  }, []);

  return (
    <aside className="hidden lg:block">
      <div
        ref={ref}
        className="docs-scroll sticky top-[var(--site-header-height)] -mx-2.5 max-h-[calc(100dvh-var(--site-header-height))] overflow-y-auto overscroll-contain px-2.5 pt-8 pb-16"
      >
        <SidebarContent tree={tree} anchors={anchors} />
      </div>
    </aside>
  );
}

/**
 * Phones and tablets: a bar under the header with the docs menu (opens a drawer) and
 * this page's contents.
 */
export function DocsMobileBar({
  tree,
  anchors,
  links = [],
  children,
}: {
  tree: PageTree.Root;
  anchors: Anchor[];
  /** outbound links (Downloads, Website, ...) shown in the header on desktop */
  links?: Anchor[];
  /** this page's table of contents; the "On this page" toggle hides without it */
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setTocOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = () => desktop.matches && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onDesktop);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [menuOpen]);

  return (
    <>
      <div className="sticky top-[var(--site-header-height)] z-30 -mx-5 border-y bg-background sm:-mx-8 lg:hidden">
        <div className="flex h-12 items-center justify-between gap-3 px-5 sm:px-8">
          <button
            type="button"
            className="-ml-2 inline-flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition hover:bg-soft"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <HugeiconsIcon icon={Menu01Icon} className="size-4" strokeWidth={2} />
            Menu
          </button>
          {children && (
            <button
              type="button"
              className="-mr-2 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition hover:bg-soft hover:text-foreground"
              aria-expanded={tocOpen}
              onClick={() => setTocOpen(!tocOpen)}
            >
              <HugeiconsIcon icon={TextAlignLeftIcon} className="size-4" strokeWidth={2} />
              On this page
              <ChevronDownIcon className={cn('size-3.5 transition-transform', tocOpen && 'rotate-180')} />
            </button>
          )}
        </div>
        {tocOpen && (
          <div className="docs-scroll max-h-[60dvh] overflow-y-auto border-t bg-background px-5 py-4 sm:px-8">
            <div onClick={(e) => (e.target as HTMLElement).closest('a') && setTocOpen(false)}>
              {children}
            </div>
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[1000] lg:hidden">
          <div
            aria-hidden
            className="absolute inset-0 animate-[ask-ai-fade-in_200ms] bg-black/20 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
          />
          <div
            role="dialog"
            aria-label="Docs navigation"
            className="docs-drawer docs-scroll absolute inset-y-0 left-0 flex w-[min(320px,88vw)] flex-col overflow-y-auto overscroll-contain border-r bg-background shadow-[0_24px_64px_-16px_rgba(32,24,16,0.28)]"
          >
            <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
              <span className="text-sm font-bold text-foreground">Documentation</span>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                <XIcon className="size-4" />
              </button>
            </div>
            <div className="px-3 pt-4 pb-6">
              <SidebarContent tree={tree} anchors={anchors} />
            </div>
            {links.length > 0 && (
              <ul className="mt-auto flex flex-col gap-0.5 border-t px-3 pt-4 pb-8">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition hover:bg-soft hover:text-foreground"
                    >
                      {link.label}
                      <ArrowUpRightIcon className="size-3 text-faint" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
