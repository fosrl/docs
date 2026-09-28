import 'server-only';
import { and, asc, count, desc, eq, exists, gte, ilike, lt, max, min, sql, type AnyColumn } from 'drizzle-orm';
import {
  docsChatMessageTable as message,
  docsChatThreadTable as thread,
  docsMessageVoteTable as messageVote,
  docsPageVoteTable as pageVote,
  docsSearchQueryTable as search,
  getDb,
} from '@/db';

/** epoch ms; `to` is exclusive */
export interface Range {
  from: number;
  to: number;
}

const DAY = 86_400_000;

function inRange(column: AnyColumn, { from, to }: Range) {
  return and(gte(column, new Date(from)), lt(column, new Date(to)));
}

const upvotes = (vote: AnyColumn) => sql<number>`coalesce(sum(case when ${vote} = 1 then 1 else 0 end), 0)::int`;
const downvotes = (vote: AnyColumn) => sql<number>`coalesce(sum(case when ${vote} = -1 then 1 else 0 end), 0)::int`;

export async function getSummary(range: Range) {
  const db = getDb();
  const [[pages], [responses], [threads], [questions], [searches]] = await Promise.all([
    db
      .select({ up: upvotes(pageVote.vote), down: downvotes(pageVote.vote) })
      .from(pageVote)
      .where(inRange(pageVote.updatedAt, range)),
    db
      .select({ up: upvotes(messageVote.vote), down: downvotes(messageVote.vote) })
      .from(messageVote)
      .where(inRange(messageVote.updatedAt, range)),
    db.select({ n: count() }).from(thread).where(inRange(thread.createdAt, range)),
    db
      .select({ n: count() })
      .from(message)
      .where(and(eq(message.role, 'user'), inRange(message.createdAt, range))),
    db
      .select({
        n: count(),
        empty: sql<number>`coalesce(sum(case when ${search.results} = 0 then 1 else 0 end), 0)::int`,
      })
      .from(search)
      .where(inRange(search.createdAt, range)),
  ]);

  return {
    pages,
    responses,
    threads: threads.n,
    questions: questions.n,
    searches: { total: searches.n, empty: searches.empty },
  };
}

/** start of the UTC day */
function dayStart(t: number) {
  return t - (((t % DAY) + DAY) % DAY);
}

/** questions asked per UTC day, with empty days filled in */
export async function getQuestionActivity(range: Range) {
  const db = getDb();
  const userInRange = and(eq(message.role, 'user'), inRange(message.createdAt, range));
  const [bounds] = await db.select({ first: min(message.createdAt) }).from(message).where(userInRange);
  if (!bounds?.first) return [];

  // epoch ms of the day; `at time zone 'UTC'` makes day boundaries UTC midnight
  const dayOf = sql<number>`(extract(epoch from date_trunc('day', ${message.createdAt} at time zone 'UTC')) * 1000)::float8`;
  const rows = await db.select({ day: dayOf, n: count() }).from(message).where(userInRange).groupBy(dayOf);
  const counts = new Map(rows.map((r) => [Number(r.day), r.n]));

  const points: { start: number; count: number }[] = [];
  for (let d = dayStart(range.from); d <= dayStart(Math.min(range.to, Date.now())); d += DAY) {
    points.push({ start: d, count: counts.get(d) ?? 0 });
  }
  return points;
}

export async function getTopPages(range: Range, by: 'up' | 'down', limit = 15) {
  const up = upvotes(pageVote.vote);
  const down = downvotes(pageVote.vote);
  return getDb()
    .select({ page: pageVote.page, up, down })
    .from(pageVote)
    .where(inRange(pageVote.updatedAt, range))
    .groupBy(pageVote.page)
    .having(sql`${by === 'up' ? up : down} > 0`)
    .orderBy(desc(by === 'up' ? up : down), asc(by === 'up' ? down : up), asc(pageVote.page))
    .limit(limit);
}

/** `ilike` pattern matching `q` literally (escapes `%`, `_` and `\`) */
function containsPattern(q: string) {
  return `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

export interface ThreadFilter extends Range {
  q?: string;
  feedback?: 'up' | 'down';
  offset?: number;
  limit?: number;
}

/** the outer thread's id, table-qualified for use inside correlated subqueries */
const threadId = sql`${sql.identifier('docsChatThread')}.${sql.identifier('id')}`;

export async function getThreads({ q, feedback, offset = 0, limit = 25, ...range }: ThreadFilter) {
  const db = getDb();
  const filters = [inRange(thread.createdAt, range)];
  if (q) {
    filters.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(message)
          .where(
            and(eq(message.threadId, thread.id), eq(message.role, 'user'), ilike(message.content, containsPattern(q))),
          ),
      ),
    );
  }
  if (feedback) {
    filters.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(messageVote)
          .where(and(eq(messageVote.threadId, thread.id), eq(messageVote.vote, feedback === 'up' ? 1 : -1))),
      ),
    );
  }

  // fetch one extra row to know whether there is a next page
  const rows = await db
    .select({
      id: thread.id,
      firstQuestion: thread.firstQuestion,
      page: thread.page,
      createdAt: thread.createdAt,
      // Drizzle leaves columns unqualified in a single-table select, so these correlated
      // subqueries alias the inner table and name the outer one explicitly
      questions: sql<number>`(select count(*)::int from ${message} m where m.thread_id = ${threadId} and m.role = 'user')`,
      up: sql<number>`(select count(*)::int from ${messageVote} v where v.thread_id = ${threadId} and v.vote = 1)`,
      down: sql<number>`(select count(*)::int from ${messageVote} v where v.thread_id = ${threadId} and v.vote = -1)`,
    })
    .from(thread)
    .where(and(...filters))
    .orderBy(desc(thread.createdAt), asc(thread.id))
    .limit(limit + 1)
    .offset(offset);

  return {
    hasMore: rows.length > limit,
    threads: rows.slice(0, limit).map((r) => ({ ...r, createdAt: r.createdAt.getTime() })),
  };
}

/** most recent thumbs-down answers with the question they answered */
export async function getDownvotedResponses(range: Range, limit = 10) {
  const rows = await getDb()
    .select({
      threadId: messageVote.threadId,
      messageId: messageVote.messageId,
      votedAt: messageVote.updatedAt,
      answer: message.content,
      // the latest question asked before this answer (`u` is the inner copy of the table)
      question: sql<string | null>`(select u.content from ${message} u where u.thread_id = ${message.threadId} and u.role = 'user' and u.created_at <= ${message.createdAt} order by u.created_at desc limit 1)`,
    })
    .from(messageVote)
    .innerJoin(message, eq(message.id, messageVote.messageId))
    .where(and(eq(messageVote.vote, -1), inRange(messageVote.updatedAt, range)))
    .orderBy(desc(messageVote.updatedAt))
    .limit(limit);

  return rows.map((r) => ({ ...r, question: r.question ?? '', votedAt: r.votedAt.getTime() }));
}

export async function getThread(id: string) {
  const db = getDb();
  const [row] = await db.select().from(thread).where(eq(thread.id, id));
  if (!row) return null;

  const messages = await db
    .select({
      id: message.id,
      role: message.role,
      content: message.content,
      tools: message.tools,
      createdAt: message.createdAt,
      vote: messageVote.vote,
    })
    .from(message)
    .leftJoin(messageVote, eq(messageVote.messageId, message.id))
    .where(eq(message.threadId, id))
    // same-instant ties: user before assistant
    .orderBy(asc(message.createdAt), desc(message.role));

  return {
    id: row.id,
    page: row.page,
    visitorId: row.visitorId,
    createdAt: row.createdAt.getTime(),
    messages: messages.map((m) => ({
      ...m,
      tools: m.tools ?? [],
      createdAt: m.createdAt.getTime(),
      vote: m.vote ?? 0,
    })),
  };
}

/** searches grouped case-insensitively; `empty` limits them to ones that found nothing */
export async function getTopSearches(range: Range, { empty = false, limit = 15 } = {}) {
  const filters = [inRange(search.createdAt, range)];
  if (empty) filters.push(eq(search.results, 0));

  const rows = await getDb()
    .select({
      query: max(search.query),
      count: count(),
      clicks: sql<number>`coalesce(sum(case when ${search.clickedUrl} is not null then 1 else 0 end), 0)::int`,
      results: max(search.results),
      lastSearched: max(search.createdAt),
    })
    .from(search)
    .where(and(...filters))
    .groupBy(sql`lower(${search.query})`)
    .orderBy(desc(count()), desc(max(search.createdAt)))
    .limit(limit);

  return rows.map((r) => ({
    query: r.query ?? '',
    count: r.count,
    clicks: r.clicks,
    results: r.results ?? 0,
    lastSearched: r.lastSearched?.getTime() ?? 0,
  }));
}
