import 'server-only';
import { clientKey, createRateLimiter } from '@/lib/ai/rate-limit';

const checkFeedbackLimit = createRateLimiter(Number(process.env.FEEDBACK_RATE_LIMIT_PER_MINUTE ?? 60));

export function json(status: number, body: object) {
  return Response.json(body, { status });
}

/** shared guard for the feedback endpoints: rate limit + JSON body */
export async function readFeedback(req: Request): Promise<Record<string, unknown> | Response> {
  if (!checkFeedbackLimit(clientKey(req)).ok) return json(429, { error: 'Too many requests.' });
  const body = (await req.json().catch(() => null)) as unknown;
  if (!body || typeof body !== 'object') return json(400, { error: 'Invalid body.' });
  return body as Record<string, unknown>;
}

export function storageError(scope: string, error: unknown) {
  console.error(`[analytics] ${scope}`, error);
  return json(503, { error: 'Feedback storage is unavailable.' });
}
