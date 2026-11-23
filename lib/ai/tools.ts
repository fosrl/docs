import 'server-only';
import { tool } from 'ai';
import { chatContext, docsTools, type DocsToolContext } from '@/lib/docs-tools';

// Tool definitions live in lib/docs-tools.ts and are shared with the MCP server.
// The chat gets the page index in its system prompt, so it does not need list_pages.
const { search_docs, read_page, get_latest_versions } = docsTools;

/** chat tools; `ctx` decides whether result links are site-relative (web) or absolute (Discord) */
export function createTools(ctx: DocsToolContext) {
  return {
    search_docs: tool({
      description: search_docs.description,
      inputSchema: search_docs.inputSchema,
      execute: (input) => search_docs.execute(input, ctx),
    }),
    read_page: tool({
      description: read_page.description,
      inputSchema: read_page.inputSchema,
      execute: (input) => read_page.execute(input, ctx),
    }),
    get_latest_versions: tool({
      description: get_latest_versions.description,
      inputSchema: get_latest_versions.inputSchema,
      execute: () => get_latest_versions.execute(),
    }),
  };
}

export const tools = createTools(chatContext);
export type ChatTools = typeof tools;
