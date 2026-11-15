import Link from 'next/link';
import { GitHubIcon, LinkedInIcon, YouTubeIcon } from './icons';
import { Logo } from './site/logo';
import {
  FOOTER_ADDRESS,
  FOOTER_COLUMNS,
  FOOTER_LEGAL_ENTITY,
  LINKS,
  SITE,
  type FooterLink as FooterLinkData,
} from '@/lib/site';

const socials = [
  { label: 'GitHub', href: LINKS.github, icon: GitHubIcon },
  { label: 'LinkedIn', href: `${SITE}/linkedin`, icon: LinkedInIcon },
  { label: 'YouTube', href: `${SITE}/youtube`, icon: YouTubeIcon },
];

function FooterLink({ link }: { link: FooterLinkData }) {
  const cls = 'text-sm leading-[1.5] text-muted-foreground transition hover:text-foreground';
  if (link.href.startsWith('/')) {
    return (
      <Link href={link.href} className={cls}>
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {link.label}
    </a>
  );
}

/**
 * Laid out like the pangolin.net footer (logo column, link columns, slim legal row),
 * with docs links. Columns live in `lib/site.ts`.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background pt-16 pb-10">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-6 md:col-span-3 lg:col-span-1">
            <Link
              href="/"
              aria-label="Pangolin Docs home"
              title="Fossorial (adj.): adapted for digging. Like a pangolin."
              className="flex w-fit items-center gap-2.5"
            >
              <Logo className="h-7" />
              <span className="rounded-md border bg-soft px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
                Docs
              </span>
            </Link>
            <address className="text-xs leading-relaxed text-muted-foreground/60 not-italic">
              {FOOTER_ADDRESS.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col">
              <h2 className="mb-1 text-sm font-bold text-foreground">{column.title}</h2>
              <ul className="flex flex-col">
                {column.links.map((link) => (
                  <li key={link.label} className="mt-2">
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 lg:mt-20 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href={LINKS.trust} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
              <img src="/site/iso27001.png" alt="ISO 27001 certified" width={32} height={32} className="size-8 object-contain" />
              <img src="/site/soc2.png" alt="SOC 2 certified" width={32} height={32} className="size-8 object-contain" />
            </a>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>
                © {year} {FOOTER_LEGAL_ENTITY}
              </span>
              <a href={`${SITE}/privacy`} className="hover:text-foreground">
                Privacy
              </a>
              <a href={`${SITE}/tos`} className="hover:text-foreground">
                Terms
              </a>
              <a
                href={LINKS.status}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                All systems operational
              </a>
            </div>
          </div>

          <div className="order-first flex items-center gap-5 text-muted-foreground lg:order-last">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition hover:text-foreground"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
