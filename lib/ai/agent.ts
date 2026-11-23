import 'server-only';
import { stepCountIs, streamText, type ModelMessage, type SystemModelMessage } from 'ai';
import type { ModelConfig } from '@/lib/ai/model';
import { getSystemPrompt, type Surface } from '@/lib/ai/prompt';
import { createTools } from '@/lib/ai/tools';
import { chatContext, discordContext } from '@/lib/docs-tools';

/**
 * The docs assistant: one agent (prompt, tools, step limit) shared by the docs site chat
 * (`/api/chat`) and Pango-Bot in Discord (`/api/bot/answer`). Surfaces differ only in the
 * prompt's surface rules and whether tool results use absolute links.
 */
export function streamDocsAgent({
  config,
  surface,
  messages,
}: {
  config: ModelConfig;
  surface: Surface;
  messages: ModelMessage[];
}) {
  const instructions: SystemModelMessage = {
    role: 'system',
    content: getSystemPrompt(surface),
    // the system prompt is large and identical across requests
    providerOptions: { anthropic: { cacheControl: { type: 'ephemeral' } } },
  };

  return streamText({
    model: config.model,
    stopWhen: stepCountIs(8),
    tools: createTools(surface === 'web' ? chatContext : discordContext),
    toolChoice: 'auto',
    instructions,
    messages,
    onError({ error }) {
      console.error(`[ai/agent] ${surface}`, error);
    },
  });
}
