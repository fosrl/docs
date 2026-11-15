import { DocsSidebar } from '@/components/docs/sidebar';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { getNavigationTree, navAnchors, navTabs } from '@/lib/navigation';
import { getRepoStarCount } from '@/lib/repo-meta';

/**
 * Docs header and footer around the docs: navigation on the left, the page
 * (content + "On this page") on the right. See app/(docs)/[[...slug]]/page.tsx.
 */
export default async function Layout({ children }: LayoutProps<'/'>) {
  const stars = await getRepoStarCount('pangolin');

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-clip bg-background">
      <SiteHeader links={navTabs} stars={stars} />
      {/* `docs-shell` makes room for the Ask AI side panel on desktop (app/global.css) */}
      <div className="docs-shell flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-[1440px] flex-1 px-5 sm:px-8">
          <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-10 xl:gap-14">
            <DocsSidebar tree={getNavigationTree()} anchors={navAnchors} />
            <main className="min-w-0">{children}</main>
          </div>
        </div>
        <SiteFooter />
      </div>
    </div>
  );
}
