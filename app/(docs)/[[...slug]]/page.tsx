import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';
import { appName, docsDir, getPageMarkdownUrl, gitConfig, siteUrl } from '@/lib/shared';
import { getNavigationTree, navAnchors, navTabs } from '@/lib/navigation';
import { pageJsonLd } from '@/lib/json-ld';
import { AskAIAboutPage } from '@/components/ai/ask-page';
import { CopyMarkdownButton } from '@/components/docs/copy-markdown';
import { DocsMobileBar } from '@/components/docs/sidebar';
import { DocsToc, type TocItem } from '@/components/docs/toc';
import { PageFeedback } from '@/components/page-feedback';
import { ViewOptionsPopover } from '@/components/view-options';

/** Docs page, laid out like a pangolin.net news article. */
export default async function Page(props: PageProps<'/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const tree = getNavigationTree();
  const toc = page.data.toc as TocItem[];
  const crumbs = getBreadcrumbItems(page.url, tree, { includeSeparator: true });
  const neighbours = findNeighbour(tree, page.url);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJsonLd(page) }} />
      <DocsMobileBar tree={tree} anchors={navAnchors} links={navTabs}>
        {toc.length > 0 ? <DocsToc items={toc} /> : null}
      </DocsMobileBar>

      <div className="docs-page-grid grid grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-14">
        <article className="min-w-0 max-w-[768px] pt-8 pb-16 lg:pt-10">
          <header>
            {crumbs.length > 0 && (
              <nav aria-label="Breadcrumb">
                <ol className="flex min-w-0 flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                  {crumbs.map((crumb, i) => (
                    <li key={i} className="flex items-center gap-x-2">
                      {i > 0 && (
                        <span aria-hidden className="text-faint">
                          /
                        </span>
                      )}
                      {crumb.url ? (
                        <Link href={crumb.url} className="hover:text-foreground">
                          {crumb.name}
                        </Link>
                      ) : (
                        <span>{crumb.name}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.02em] text-balance text-foreground md:text-4xl">
              {page.data.title}
            </h1>
            {page.data.description && (
              <p className="mt-3 text-lg leading-relaxed text-pretty text-muted-foreground">
                {page.data.description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <CopyMarkdownButton markdownUrl={markdownUrl} />
              <ViewOptionsPopover
                markdownUrl={markdownUrl}
                pageUrl={`${siteUrl}${page.url}`}
                githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${docsDir}/${page.path}`}
              />
              <AskAIAboutPage title={page.data.title} />
            </div>
          </header>

          <div className="prose docs-prose mt-8 max-w-none">
            <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
          </div>

          <div className="mt-16 flex flex-col gap-8">
            <PageFeedback page={page.url} />
            {(neighbours.previous || neighbours.next) && (
              <nav aria-label="Pages" className="grid gap-3 sm:grid-cols-2">
                {neighbours.previous ? (
                  <PagerLink href={neighbours.previous.url} label="Previous" title={neighbours.previous.name} />
                ) : (
                  <span className="max-sm:hidden" />
                )}
                {neighbours.next && (
                  <PagerLink href={neighbours.next.url} label="Next" title={neighbours.next.name} next />
                )}
              </nav>
            )}
          </div>
        </article>

        <aside className="docs-page-toc hidden xl:block">
          <div className="docs-scroll sticky top-[var(--site-header-height)] flex max-h-[calc(100dvh-var(--site-header-height))] flex-col gap-6 overflow-y-auto pt-10 pb-10">
            {toc.length > 0 && <DocsToc items={toc} />}
          </div>
        </aside>
      </div>
    </>
  );
}

function PagerLink({
  href,
  label,
  title,
  next,
}: {
  href: string;
  label: string;
  title: React.ReactNode;
  next?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        'flex flex-col gap-1 rounded-lg border bg-card px-4 py-3 transition hover:border-faint' +
        (next ? ' text-right sm:col-start-2' : '')
      }
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-bold text-foreground">
        {title}
      </span>
    </Link>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const isHome = page.slugs.length === 0;
  return {
    title: isHome ? { absolute: `${page.data.title} | ${appName}` } : page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url,
      types: {
        'text/markdown': getPageMarkdownUrl(page).url,
        'application/xml': '/sitemap.xml',
      },
    },
    openGraph: {
      images: '/images/home-social-graph.png',
    },
  };
}
