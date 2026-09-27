import { parseId, recordSearch } from '@/lib/analytics/api';
import { json, readFeedback, storageError } from '@/lib/analytics/http';

function path(value: unknown, max: number) {
  return typeof value === 'string' && value.startsWith('/') ? value.slice(0, max) : null;
}

/** `{ id, query, results, clickedUrl?, page?, visitorId }` from the search dialog */
export async function POST(req: Request) {
  const body = await readFeedback(req);
  if (body instanceof Response) return body;

  const id = parseId(body.id);
  const query = typeof body.query === 'string' ? body.query.replace(/\s+/g, ' ').trim().slice(0, 256) : '';
  const results = Number(body.results);
  if (!id || !query || !Number.isInteger(results) || results < 0) {
    return json(400, { error: 'Invalid search event.' });
  }

  try {
    await recordSearch({
      id,
      visitorId: parseId(body.visitorId),
      query,
      results: Math.min(results, 1000),
      clickedUrl: path(body.clickedUrl, 512),
      page: path(body.page, 2048),
    });
  } catch (e) {
    return storageError('search', e);
  }
  return json(200, { ok: true });
}
