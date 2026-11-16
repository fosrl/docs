import { param, type SearchParams } from './range';

/**
 * Which site an event came from. The docs (docs.pangolin.net) and pangolin.net
 * ("landing") both send AI chats and searches to the same tables, tagged with `site`.
 * Page votes only exist on the docs.
 */
export type Site = 'docs' | 'landing';

export const sites = [
  { id: undefined, label: 'All sites' },
  { id: 'docs', label: 'Docs' },
  { id: 'landing', label: 'pangolin.net' },
] as const satisfies readonly { id: Site | undefined; label: string }[];

/** `?site=docs|landing`; anything else (or nothing) means both sites */
export function resolveSite(params: SearchParams): Site | undefined {
  const value = param(params, 'site');
  return value === 'docs' || value === 'landing' ? value : undefined;
}

export const siteLabel: Record<Site, string> = { docs: 'Docs', landing: 'pangolin.net' };

const siteUrls: Record<Site, string> = {
  docs: process.env.DOCS_SITE_URL ?? 'https://docs.pangolin.net',
  landing: process.env.LANDING_SITE_URL ?? 'https://pangolin.net',
};

/** absolute link for a path (or full URL) recorded on `site` */
export function siteHref(site: Site, path: string) {
  return /^https?:\/\//.test(path) ? path : `${siteUrls[site]}${path}`;
}
