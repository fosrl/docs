import { parseId, parseVote, recordMessageVote } from '@/lib/analytics/api';
import { json, readFeedback, storageError } from '@/lib/analytics/http';

/** `{ messageId, vote: 1 | -1 | 0, visitorId }` for an assistant response */
export async function POST(req: Request) {
  const body = await readFeedback(req);
  if (body instanceof Response) return body;

  const messageId = parseId(body.messageId);
  const vote = parseVote(body.vote);
  if (!messageId || vote === null) return json(400, { error: 'Invalid feedback.' });

  try {
    const found = await recordMessageVote(messageId, parseId(body.visitorId), vote);
    if (!found) return json(404, { error: 'Unknown message.' });
  } catch (e) {
    return storageError('message vote', e);
  }
  return json(200, { ok: true });
}
