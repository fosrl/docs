import { z } from 'zod';
import { checkBotAuth, discordAnalytics, json, snowflake } from '@/lib/ai/bot';
import { parseId, recordMessageVote } from '@/lib/analytics/api';

/** Pango-Bot 👍/👎 on an answer: `{ messageId: answer.id, userId, vote: 1 | -1 | 0 }` */
const bodySchema = z.object({
  messageId: z.string(),
  userId: snowflake,
  vote: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
});

export async function POST(req: Request) {
  const unauthorized = checkBotAuth(req);
  if (unauthorized) return unauthorized;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  const messageId = parsed.success ? parseId(parsed.data.messageId) : null;
  if (!parsed.success || !messageId) return json(400, { error: 'Invalid vote.' });

  try {
    const found = await recordMessageVote(messageId, discordAnalytics.visitorId(parsed.data.userId), parsed.data.vote);
    if (!found) return json(404, { error: 'Unknown message.' });
  } catch (e) {
    console.error('[analytics] bot vote', e);
    return json(503, { error: 'Feedback storage is unavailable.' });
  }
  return json(200, { ok: true });
}
