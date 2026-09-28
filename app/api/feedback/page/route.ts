import { source } from '@/lib/source';
import { parseId, parseVote, recordPageVote } from '@/lib/analytics/api';
import { json, readFeedback, storageError } from '@/lib/analytics/http';

/** `{ page: '/some/path', vote: 1 | -1 | 0, visitorId }`; `0` removes the vote */
export async function POST(req: Request) {
  const body = await readFeedback(req);
  if (body instanceof Response) return body;

  const visitorId = parseId(body.visitorId);
  const vote = parseVote(body.vote);
  const page = typeof body.page === 'string' ? body.page : '';
  const slugs = page.split('/').filter(Boolean);
  if (!visitorId || vote === null || !page.startsWith('/') || !source.getPage(slugs)) {
    return json(400, { error: 'Invalid feedback.' });
  }

  try {
    await recordPageVote(source.getPage(slugs)!.url, visitorId, vote);
  } catch (e) {
    return storageError('page vote', e);
  }
  return json(200, { ok: true });
}
