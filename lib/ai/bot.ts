import 'server-only';
import { createHash, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { createRateLimiter } from '@/lib/ai/rate-limit';

/**
 * Shared bits of the Pango-Bot endpoints (`/api/bot/*`). The bot is a trusted server, so it
 * authenticates with `DOCS_BOT_API_KEY` instead of being limited per IP; limits are per
 * Discord user instead.
 */

export function json(status: number, body: object, headers?: HeadersInit) {
  return Response.json(body, { status, headers });
}

/** returns an error response, or null when the request carries the bot key */
export function checkBotAuth(req: Request): Response | null {
  const key = process.env.DOCS_BOT_API_KEY;
  if (!key) return json(503, { error: 'The docs bot endpoint is not configured (DOCS_BOT_API_KEY).' });

  const given = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const a = Buffer.from(given);
  const b = Buffer.from(key);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return json(401, { error: 'Unauthorized.' });
  return null;
}

/** Discord ids are snowflakes: numeric strings */
export const snowflake = z.string().regex(/^\d{15,25}$/);

/**
 * Analytics ids for Discord, accepted by the analytics API as-is (`[\w-]{8,64}`), so the
 * API needs no changes to tell Discord apart from the docs site:
 * - threads: `discord-<thread id>`, and the thread's page is `/discord/<guild>/<thread>`
 * - messages: `discord-<message id>`
 * - visitors: `discord-<hash of the user id>` (raw Discord user ids are not stored)
 */
export const discordAnalytics = {
  threadId: (channelId: string) => `discord-${channelId}`,
  messageId: (messageId: string) => `discord-${messageId}`,
  page: (guildId: string, channelId: string) => `/discord/${guildId}/${channelId}`,
  visitorId: (userId: string) =>
    `discord-${createHash('sha256').update(`pango-bot:${userId}`).digest('hex').slice(0, 32)}`,
};

/** questions per Discord user per minute, plus a cap for the whole bot */
const checkUserLimit = createRateLimiter(Number(process.env.AI_BOT_RATE_LIMIT_PER_MINUTE ?? 3));
const checkGlobalLimit = createRateLimiter(Number(process.env.AI_BOT_GLOBAL_RATE_LIMIT_PER_MINUTE ?? 30));

export function checkBotRateLimit(userId: string) {
  // per user first, so one noisy user doesn't use up the bot-wide budget
  const user = checkUserLimit(userId);
  if (!user.ok) return user;
  return checkGlobalLimit('global');
}
