import { createMcpHandler, McpServer } from '@modelcontextprotocol/server';
import { appName } from '@/lib/shared';
import { docsTools, getDocsGuidance, mcpContext, type DocsToolName } from '@/lib/docs-tools';

// Same tools and guidance as the Ask AI chat (lib/docs-tools.ts), so agents using this
// server behave like the docs assistant. Links in results are absolute.
const instructions = `Search and read the official Pangolin documentation and look up current release versions. Pangolin is an open-source networking and security platform (identity-aware access to apps, infrastructure, and AI workloads).

How to use these tools:
${getDocsGuidance(mcpContext)}`;

const handler = createMcpHandler(() => {
  const mcp = new McpServer({ name: appName, version: '1.0.0' }, { instructions });

  for (const name of Object.keys(docsTools) as DocsToolName[]) {
    const t = docsTools[name];
    mcp.registerTool(
      name,
      { title: t.title, description: t.description, inputSchema: t.inputSchema },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (input: any) => {
        const result = await t.execute(input, mcpContext);
        const isError = typeof result === 'object' && result !== null && 'error' in result;
        return {
          content: [{ type: 'text' as const, text: typeof result === 'string' ? result : JSON.stringify(result) }],
          isError,
        };
      },
    );
  }

  return mcp;
});

export function GET(request: Request) {
  return handler.fetch(request);
}

export function POST(request: Request) {
  return handler.fetch(request);
}

export function DELETE(request: Request) {
  return handler.fetch(request);
}
