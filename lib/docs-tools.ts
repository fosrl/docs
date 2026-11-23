import 'server-only';
import { z } from 'zod';
import { getPageText, source } from '@/lib/source';
import { searchServer } from '@/lib/search';
import { siteUrl } from '@/lib/shared';
import { getLatestVersionsResult } from '@/lib/versions';
import redirects from '@/lib/redirects.json';

/**
 * Docs tools shared by the Ask AI chat (`lib/ai/tools.ts`) and the public MCP server
 * (`app/mcp/route.ts`). Define a tool once here so both stay consistent.
 */

export interface DocsToolContext {
  /** prefix for page URLs in results: '' for site-relative links (chat), the site origin for MCP */
  linkBase: string;
}

export const chatContext: DocsToolContext = { linkBase: '' };
export const mcpContext: DocsToolContext = { linkBase: siteUrl };

const MAX_PAGE_CHARS = 60_000;

function normalizePath(pathOrUrl: string) {
  let path = pathOrUrl.trim();
  try {
    path = new URL(path, 'http://x').pathname;
  } catch {
    // not a URL, use as is
  }
  path = path.replace(/\.mdx?$/, '').replace(/\/content$/, '');
  path = path.replace(/^\/+|\/+$/g, '');
  if (path.startsWith('llms.mdx/')) path = path.slice('llms.mdx/'.length);
  return `/${path === 'index' ? '' : path}`;
}

function applyRedirects(path: string) {
  for (let i = 0; i < 5; i++) {
    const match = redirects.find((r) =>
      r.source.endsWith('/:slug*')
        ? path === r.source.slice(0, -7) || path.startsWith(r.source.slice(0, -6))
        : path === r.source,
    );
    if (!match) break;
    path = match.destination.split('#')[0];
  }
  return path;
}

/** resolve a page from a path, docs URL, full URL, or .md/.mdx link; follows site redirects */
export function findPage(pathOrUrl: string) {
  const path = applyRedirects(normalizePath(pathOrUrl));
  const slugs = path.split('/').filter(Boolean);
  return source.getPage(slugs);
}

let pageIndex: string | undefined;

/** compact list of every page (site-relative URL | title — description) */
export function getPageIndex() {
  pageIndex ??= source
    .getPages()
    .map((page) => `- ${page.url} | ${page.data.title}${page.data.description ? ` — ${page.data.description}` : ''}`)
    .sort()
    .join('\n');
  return pageIndex;
}

export async function searchDocs(
  { query, limit }: { query: string; limit: number },
  ctx: DocsToolContext,
) {
  // no raw-hit limit: it caps hits before grouping, so one long page can fill it; cap pages below instead
  const results = await searchServer.search(query);
  const pages = new Map<string, { url: string; title: string; matches: string[] }>();

  for (const result of results) {
    const url = result.url.split('#')[0];
    const page = pages.get(url) ?? {
      url: ctx.linkBase + url,
      title: findPage(url)?.data.title ?? url,
      matches: [],
    };
    if (result.type !== 'page' && page.matches.length < 3) {
      const text = result.content.replace(/<\/?mark>/g, '');
      page.matches.push(result.type === 'heading' ? `${text} (${ctx.linkBase}${result.url})` : text);
    }
    pages.set(url, page);
    if (pages.size >= limit) break;
  }
  return [...pages.values()];
}

export async function readPage({ path }: { path: string }, ctx: DocsToolContext) {
  const page = findPage(path);
  if (!page) return { error: `No page found at "${path}". Use search_docs to find the right URL.` };

  const url = ctx.linkBase + page.url;
  const text = await getPageText(page);
  if (text.length <= MAX_PAGE_CHARS) return { url, content: text };
  return {
    url,
    truncated: true,
    note: `Page is ${text.length} characters; only the first ${MAX_PAGE_CHARS} are included. Search for specific sections if the answer is not here.`,
    content: text.slice(0, MAX_PAGE_CHARS),
  };
}

export const docsTools = {
  search_docs: {
    title: 'Search Docs',
    description:
      'Full-text search over the Pangolin documentation. Returns matching pages and sections with their URLs. Use several short keyword queries rather than one long question.',
    inputSchema: z.object({
      query: z.string().describe('keywords, e.g. "newt docker compose" or "OIDC auto provisioning"'),
      limit: z.number().int().min(1).max(25).default(10),
    }),
    execute: searchDocs,
  },
  read_page: {
    title: 'Read Page',
    description:
      'Read the full Markdown content of one documentation page. Pass the page URL path from search results or the page index, e.g. "/manage/sites/install-site". Full docs URLs also work.',
    inputSchema: z.object({
      path: z.string(),
    }),
    execute: readPage,
  },
  list_pages: {
    title: 'List Pages',
    description:
      'List every Pangolin documentation page as "URL | title — description". Use it to find the right page to read when search is not enough.',
    inputSchema: z.object({}),
    execute: async (_input: Record<string, never>, ctx: DocsToolContext) =>
      ctx.linkBase ? getPageIndex().replace(/^- \//gm, `- ${ctx.linkBase}/`) : getPageIndex(),
  },
  get_latest_versions: {
    title: 'Get Latest Versions',
    description:
      'Get the latest released versions of Pangolin software components (Pangolin server, Newt site connector, Olm client, CLI, Windows/Linux/Mac/iOS/Android clients, remote node) with links to their release notes. Use this whenever the user asks about the latest version or an answer needs to reference current version numbers.',
    inputSchema: z.object({}),
    execute: async () => getLatestVersionsResult(),
  },
};

export type DocsToolName = keyof typeof docsTools;

/**
 * How to use the docs well. Shared by the chat system prompt and the MCP server
 * instructions so agents behave like the Ask AI assistant.
 */
export function getDocsGuidance(ctx: DocsToolContext) {
  const link = (path: string) => ctx.linkBase + path;
  return `- Ground every answer in the documentation. Before answering anything specific (config keys, commands, versions, UI steps, feature availability), use search_docs and read_page to look it up. Read the full page when the answer depends on details.
- Always check the FAQ pages before answering, e.g. [Enterprise Edition FAQ](${link('/self-host/enterprise-edition/faq')}), and any FAQ sections within docs pages (search_docs for "FAQ" plus the topic). They hold official answers to common questions; when one applies, use it and keep your answer consistent with it.
- Cite the pages you used as Markdown links${ctx.linkBase ? ` (page URLs are relative to ${ctx.linkBase})` : ' with site-relative URLs'}, e.g. [Install a Site](${link('/manage/sites/install-site')}). Link to sections with #anchors when you have them.
- If the docs don't cover something, say so plainly and point to the closest relevant page or to the community (Discord: https://pangolin.net/discord, GitHub discussions: https://github.com/fosrl/pangolin/discussions). Do not invent configuration options, flags, or behavior.
- Page sources contain MDX components such as <Note>, <Steps>, <Card> or <ResponseField>. Never output those tags; rewrite their content as plain Markdown (blockquotes, lists, headings, tables).
- Use the same terminology as the docs (sites, resources, clients, remote nodes).
- Newt, Olm, and Gerbil are internal engineering names. Newt is the Pangolin site connector, Olm is the Pangolin client, and Gerbil is the relay server that runs on the Pangolin server. Use the product terms instead ("site", "client", "the Pangolin server" or "relay") and avoid the engineering names unless the user uses them first or asks about them. Docs pages and commands may still use these names (e.g. a newt install command); keep them inside commands, config, and links, but describe them to the user in product terms.
- Pangolin has a hosted Cloud edition and a self-hosted edition (Community and Enterprise). When the answer differs between them, say which one you are describing.
- When referring to Enterprise Edition, always remind people it is free for personal use and link to [Personal Use](${link('/self-host/enterprise-edition/personal-use')}).
- For questions about the latest version of any Pangolin component, or when an answer needs current version numbers (e.g. pinning an image tag or checking whether someone is out of date), call get_latest_versions instead of guessing or relying on versions written in docs pages. Its data comes from a cached proxy of GitHub releases and may lag slightly; when you report versions, link the release notes and mention that the newest releases are always on the component's GitHub releases page.`;
}
