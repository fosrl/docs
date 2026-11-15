import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Pangolin Docs';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://docs.pangolin.net';
export const siteDescription =
  'Modern networking and security platform providing secure access and connectivity to apps, infrastructure, and AI workloads. Connect and protect your users.';

/** docs are served from the site root, same URLs as the old Mintlify site */
export const docsRoute = '/';
export const docsContentRoute = '/llms.mdx';

export const gitConfig = {
  user: 'fosrl',
  repo: 'docs',
  branch: 'main',
};

/** collection directory; `page.path` is relative to this */
export const docsDir = 'content/docs';

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}
