import 'server-only';
import { tool } from 'ai';
import { chatContext, docsTools } from '@/lib/docs-tools';

// Tool definitions live in lib/docs-tools.ts and are shared with the MCP server.
// The chat gets the page index in its system prompt, so it does not need list_pages.
const { search_docs, read_page, get_latest_versions } = docsTools;

export const tools = {
  search_docs: tool({
    description: search_docs.description,
    inputSchema: search_docs.inputSchema,
    execute: (input) => search_docs.execute(input, chatContext),
  }),
  read_page: tool({
    description: read_page.description,
    inputSchema: read_page.inputSchema,
    execute: (input) => read_page.execute(input, chatContext),
  }),
  get_latest_versions: tool({
    description: get_latest_versions.description,
    inputSchema: get_latest_versions.inputSchema,
    execute: () => get_latest_versions.execute(),
  }),
};
