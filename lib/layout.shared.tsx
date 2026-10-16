import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, enableDarkMode, links } from './shared';

export function Logo() {
  return (
    <>
      <img
        src="/logo/light.png"
        alt={appName}
        width={665}
        height={164}
        className="pg-logo dark:hidden"
      />
      <img
        src="/logo/dark.png"
        alt={appName}
        width={933}
        height={164}
        className="pg-logo hidden dark:block"
      />
    </>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
      url: '/',
    },
    themeSwitch: { enabled: enableDarkMode },
    links: [
      // same height and radius as the header search and Ask AI button
      {
        type: 'custom',
        on: 'nav',
        children: (
          <div className="flex items-center gap-2">
            <a href={links.pricing} className="pg-btn pg-btn-secondary">
              Get pricing
            </a>
            <a href={links.bookDemo} className="pg-btn">
              Book a demo
            </a>
          </div>
        ),
      },
      {
        type: 'main',
        text: 'Get pricing',
        url: links.pricing,
        external: true,
        on: 'menu',
      },
      {
        type: 'main',
        text: 'Book a demo',
        url: links.bookDemo,
        external: true,
        on: 'menu',
      },
    ],
  };
}
