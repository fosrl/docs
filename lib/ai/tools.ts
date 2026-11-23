import 'server-only';
import { tool } from 'ai';
import { z } from 'zod';
import { getPageText, source } from '@/lib/source';
import { searchServer } from '@/lib/search';

const MAX_PAGE_CHARS = 60_000;

function findPage(pathOrUrl: string) {
  let path = pathOrUrl.trim();
  try {
    path = new URL(path, 'http://x').pathname;
  } catch {
    // not a URL, use as is
  }
  path = path.replace(/\.mdx?$/, '').replace(/^\/+|\/+$/g, '');
  const slugs = path === '' || path === 'index' ? [] : path.split('/');
  return source.getPage(slugs);
}

export const searchDocs = tool({
  description:
    'Full-text search over the Pangolin documentation. Returns matching pages and sections with their URLs. Use several short keyword queries rather than one long question.',
  inputSchema: z.object({
    query: z.string().describe('keywords, e.g. "newt docker compose" or "OIDC auto provisioning"'),
    limit: z.number().int().min(1).max(25).default(10),
  }),
  async execute({ query, limit }) {
    const results = await searchServer.search(query, { limit: limit * 3 });
    const pages = new Map<string, { url: string; title: string; matches: string[] }>();

    for (const result of results) {
      const url = result.url.split('#')[0];
      const page = pages.get(url) ?? {
        url,
        title: findPage(url)?.data.title ?? url,
        matches: [],
      };
      if (result.type !== 'page' && page.matches.length < 3) {
        const text = result.content.replace(/<\/?mark>/g, '');
        page.matches.push(result.type === 'heading' ? `${text} (${result.url})` : text);
      }
      pages.set(url, page);
      if (pages.size >= limit) break;
    }
    return [...pages.values()];
  },
});

export const readPage = tool({
  description:
    'Read the full Markdown content of one documentation page. Pass the page URL path from search results or the page index, e.g. "/manage/sites/install-site".',
  inputSchema: z.object({
    path: z.string(),
  }),
  async execute({ path }) {
    const page = findPage(path);
    if (!page) return { error: `No page found at "${path}". Use search_docs to find the right URL.` };

    const text = await getPageText(page);
    if (text.length <= MAX_PAGE_CHARS) return { url: page.url, content: text };
    return {
      url: page.url,
      truncated: true,
      note: `Page is ${text.length} characters; only the first ${MAX_PAGE_CHARS} are included. Search for specific sections if the answer is not here.`,
      content: text.slice(0, MAX_PAGE_CHARS),
    };
  },
});

const VERSIONS_URL = 'https://api.fossorial.io/api/v1/versions';
const VERSIONS_TTL_MS = 5 * 60_000;
let versionsCache: { at: number; data: unknown } | undefined;

type VersionEntry = { latestVersion?: string; releaseNotes?: string };

export const getLatestVersions = tool({
  description:
    'Get the latest released versions of Pangolin software components (Pangolin server, Newt site connector, Olm client, CLI, Windows/Linux/Mac/iOS/Android clients, remote node) with links to their release notes. Use this whenever the user asks about the latest version or an answer needs to reference current version numbers.',
  inputSchema: z.object({}),
  async execute() {
    if (!versionsCache || Date.now() - versionsCache.at > VERSIONS_TTL_MS) {
      try {
        const res = await fetch(VERSIONS_URL, { signal: AbortSignal.timeout(8_000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = (await res.json()) as { data?: Record<string, VersionEntry> };
        if (!body.data) throw new Error('missing data');
        const data = Object.fromEntries(
          Object.entries(body.data).map(([name, v]) => [
            name,
            {
              latestVersion: v.latestVersion,
              releaseNotes: v.releaseNotes,
              allReleases: v.releaseNotes?.replace(/\/tag\/.*$/, ''),
            },
          ]),
        );
        versionsCache = { at: Date.now(), data };
      } catch (e) {
        console.error('[ai/tools] versions', e);
        if (!versionsCache)
          return {
            error:
              'Could not fetch version information. Point the user to the GitHub releases page of the relevant repo under https://github.com/fosrl.',
          };
      }
    }
    return {
      note: 'Served from a cached proxy of GitHub releases, so it can lag behind the newest release. For the definitive latest release, check the releases page of the respective GitHub repo (allReleases).',
      versions: versionsCache.data,
    };
  },
});

export const tools = {
  search_docs: searchDocs,
  read_page: readPage,
  get_latest_versions: getLatestVersions,
};
