import Link from 'next/link';
import { connection } from 'next/server';
import { cn } from '@/lib/cn';
import {
  getDownvotedResponses,
  getQuestionActivity,
  getSummary,
  getThreads,
  getTopPages,
  getTopSearches,
  type Range,
} from '@/lib/queries';
import {
  formatDateTime,
  formatDay,
  oldestDay,
  param,
  presets,
  resolveRange,
  withParams,
  type SearchParams,
} from '@/lib/range';
import { ActivityChart } from '@/components/activity-chart';
import { Card, CardTitle, Empty, percent, Stat, Votes } from '@/components/ui';

const PAGE_SIZE = 25;

const inputClass =
  'rounded-md border bg-fd-background px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring';
const buttonClass =
  'rounded-md border bg-fd-secondary px-3 py-1.5 text-sm font-medium hover:bg-fd-accent';

/** answer snippets: drop the Markdown syntax that would show up as literal characters */
function plain(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' [code] ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*`#>]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const docsUrl = process.env.DOCS_SITE_URL ?? 'https://docs.pangolin.net';

export default async function AnalyticsPage(props: PageProps<'/'>) {
  await connection();
  const params: SearchParams = await props.searchParams;
  const range = resolveRange(params);
  const q = param(params, 'q');
  const feedbackParam = param(params, 'feedback');
  const feedback = feedbackParam === 'up' || feedbackParam === 'down' ? feedbackParam : undefined;
  const offset = Math.max(0, Number(param(params, 'offset')) || 0);

  let data;
  try {
    data = await Promise.all([
      getSummary(range),
      getQuestionActivity(range),
      getTopPages(range, 'up'),
      getTopPages(range, 'down'),
      getDownvotedResponses(range),
      getThreads({ ...range, q, feedback, offset, limit: PAGE_SIZE }),
      getTopSearches(range),
      getTopSearches(range, { empty: true }),
    ]);
  } catch (e) {
    console.error('[analytics] dashboard', e);
    return (
      <Card>
        <CardTitle>Analytics database unavailable</CardTitle>
        <p className="text-sm text-fd-muted-foreground">
          Check <code>DATABASE_URL</code> and the server logs. Error:{' '}
          <code>{e instanceof Error ? e.message : String(e)}</code>
        </p>
      </Card>
    );
  }
  const [summary, activity, topUp, topDown, downvoted, threads, topSearches, emptySearches] = data;

  const pageVotes = summary.pages.up + summary.pages.down;
  const responseVotes = summary.responses.up + summary.responses.down;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-semibold">Docs analytics</h1>
          <p className="text-sm text-fd-muted-foreground">{range.label}</p>
        </div>
        <RangeFilter params={params} range={range} activePreset={range.preset} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat
          label="Pages rated helpful"
          value={percent(summary.pages.up, pageVotes)}
          detail={<Votes up={summary.pages.up} down={summary.pages.down} />}
        />
        <Stat label="AI chats" value={summary.threads.toLocaleString()} detail="conversations started" />
        <Stat
          label="Questions asked"
          value={summary.questions.toLocaleString()}
          detail={summary.threads > 0 ? `${(summary.questions / summary.threads).toFixed(1)} per chat` : undefined}
        />
        <Stat
          label="Searches"
          value={summary.searches.total.toLocaleString()}
          detail={
            summary.searches.total > 0
              ? `${percent(summary.searches.empty, summary.searches.total)} found nothing`
              : undefined
          }
        />
        <Stat
          label="AI answers rated good"
          value={percent(summary.responses.up, responseVotes)}
          detail={<Votes up={summary.responses.up} down={summary.responses.down} />}
        />
      </div>

      <Card>
        <CardTitle hint="per day, UTC">
          AI questions asked
        </CardTitle>
        <ActivityChart points={activity} />
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <PageTable title="Most upvoted pages" rows={topUp} empty="No upvotes in this range." />
        <PageTable title="Most downvoted pages" rows={topDown} empty="No downvotes in this range." />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <SearchTable
          title="Top searches"
          hint="opened = picked a result"
          rows={topSearches}
          empty="No searches in this range."
        />
        <SearchTable
          title="Searches with no results"
          hint="gaps in the docs"
          rows={emptySearches}
          empty="Every search found something."
          noResults
        />
      </div>

      <Card>
        <CardTitle hint="most recent first">Downvoted AI answers</CardTitle>
        {downvoted.length === 0 ? (
          <Empty>No downvoted answers in this range.</Empty>
        ) : (
          <ul className="divide-y">
            {downvoted.map((r) => (
              <li key={r.messageId} className="py-3 first:pt-0 last:pb-0">
                <Link
                  href={`/chats/${r.threadId}#${r.messageId}`}
                  className="group block min-w-0"
                >
                  <p className="text-sm font-medium group-hover:underline line-clamp-2">{r.question}</p>
                  <p className="mt-1 text-sm text-fd-muted-foreground line-clamp-2">{plain(r.answer)}</p>
                  <p className="mt-1 text-xs text-fd-muted-foreground">{formatDateTime(r.votedAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card id="chats">
        <CardTitle hint="newest first">AI chats</CardTitle>
        <form className="mb-3 flex flex-wrap items-center gap-2" action="/#chats">
          {/* keep the time range when searching */}
          {(['range', 'from', 'to'] as const).map((key) => {
            const value = param(params, key);
            return value ? <input key={key} type="hidden" name={key} value={value} /> : null;
          })}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search questions…"
            aria-label="Search questions"
            className={cn(inputClass, 'min-w-0 flex-1 basis-48')}
          />
          <select name="feedback" defaultValue={feedback ?? ''} aria-label="Feedback" className={inputClass}>
            <option value="">Any feedback</option>
            <option value="down">Has 👎</option>
            <option value="up">Has 👍</option>
          </select>
          <button type="submit" className={buttonClass}>
            Filter
          </button>
          {(q || feedback) && (
            <Link
              href={`/${withParams(params, { q: undefined, feedback: undefined, offset: undefined })}#chats`}
              className="text-sm text-fd-muted-foreground hover:text-fd-foreground"
            >
              Reset
            </Link>
          )}
        </form>

        {threads.threads.length === 0 ? (
          <Empty>No chats match.</Empty>
        ) : (
          <div className="-mx-4 overflow-x-auto px-4">
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="text-xs text-fd-muted-foreground">
                  <th className="pb-2 text-start font-normal">First question</th>
                  <th className="pb-2 text-start font-normal">Started on</th>
                  <th className="pb-2 text-end font-normal">Questions</th>
                  <th className="pb-2 text-end font-normal">Feedback</th>
                  <th className="pb-2 text-end font-normal">When</th>
                </tr>
              </thead>
              <tbody>
                {threads.threads.map((t) => (
                  <tr key={t.id} className="border-t align-top">
                    <td className="py-2 pe-4">
                      <Link href={`/chats/${t.id}`} className="line-clamp-2 hover:underline">
                        {t.firstQuestion}
                      </Link>
                    </td>
                    <td className="max-w-[14rem] py-2 pe-4 text-fd-muted-foreground">
                      <span className="block truncate" title={t.page ?? undefined}>
                        {t.page ?? '—'}
                      </span>
                    </td>
                    <td className="py-2 text-end tabular-nums">{t.questions}</td>
                    <td className="py-2 ps-4 text-end">
                      {t.up + t.down > 0 ? <Votes up={t.up} down={t.down} /> : <span className="text-fd-muted-foreground">—</span>}
                    </td>
                    <td className="py-2 ps-4 text-end whitespace-nowrap text-fd-muted-foreground">
                      {formatDateTime(t.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(offset > 0 || threads.hasMore) && (
          <nav className="mt-3 flex items-center justify-between text-sm">
            {offset > 0 ? (
              <Link
                href={`/${withParams(params, { offset: offset - PAGE_SIZE > 0 ? String(offset - PAGE_SIZE) : undefined })}#chats`}
                className={buttonClass}
              >
                ← Newer
              </Link>
            ) : (
              <span />
            )}
            <span className="text-xs text-fd-muted-foreground">
              {offset + 1}–{offset + threads.threads.length}
            </span>
            {threads.hasMore ? (
              <Link
                href={`/${withParams(params, { offset: String(offset + PAGE_SIZE) })}#chats`}
                className={buttonClass}
              >
                Older →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </Card>
    </div>
  );
}

function RangeFilter({
  params,
  range,
  activePreset,
}: {
  params: SearchParams;
  range: Range;
  activePreset: string | null;
}) {
  const reset = { from: undefined, to: undefined, offset: undefined };
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="flex flex-wrap gap-1 rounded-lg border bg-fd-secondary p-1" role="group" aria-label="Time range">
        {presets.map((p) => (
          <Link
            key={p.id}
            href={`/${withParams(params, { ...reset, range: p.id === '30d' ? undefined : p.id })}`}
            aria-current={activePreset === p.id ? 'true' : undefined}
            className={cn(
              'rounded-md px-2.5 py-1 text-sm text-fd-muted-foreground hover:text-fd-foreground',
              activePreset === p.id && 'bg-fd-background text-fd-foreground shadow-sm',
            )}
          >
            {p.label}
          </Link>
        ))}
      </div>
      <form className="flex flex-wrap items-center gap-2" action="/">
        {(['q', 'feedback'] as const).map((key) => {
          const value = param(params, key);
          return value ? <input key={key} type="hidden" name={key} value={value} /> : null;
        })}
        <input
          type="date"
          name="from"
          aria-label="From"
          min={oldestDay()}
          max={formatDay(Date.now())}
          defaultValue={activePreset ? undefined : formatDay(range.from)}
          className={inputClass}
        />
        <span className="text-sm text-fd-muted-foreground">to</span>
        <input
          type="date"
          name="to"
          aria-label="To"
          min={oldestDay()}
          max={formatDay(Date.now())}
          defaultValue={activePreset ? undefined : formatDay(range.to - 1)}
          className={inputClass}
        />
        <button type="submit" className={buttonClass}>
          Apply
        </button>
      </form>
    </div>
  );
}

function PageTable({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: { page: string; up: number; down: number }[];
  empty: string;
}) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      {rows.length === 0 ? (
        <Empty>{empty}</Empty>
      ) : (
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="text-xs text-fd-muted-foreground">
              <th className="pb-2 text-start font-normal">Page</th>
              <th className="w-28 pb-2 text-end font-normal">Votes</th>
              <th className="w-16 pb-2 text-end font-normal">Helpful</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.page} className="border-t">
                <td className="py-2 pe-3">
                  <a
                    href={`${docsUrl}${r.page}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate hover:underline"
                    title={r.page}
                  >
                    {r.page}
                  </a>
                </td>
                <td className="py-2 text-end">
                  <Votes up={r.up} down={r.down} />
                </td>
                <td className="py-2 text-end tabular-nums">{percent(r.up, r.up + r.down)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

function SearchTable({
  title,
  hint,
  rows,
  empty,
  noResults = false,
}: {
  title: string;
  hint: string;
  rows: { query: string; count: number; clicks: number; results: number; lastSearched: number }[];
  empty: string;
  noResults?: boolean;
}) {
  return (
    <Card>
      <CardTitle hint={hint}>{title}</CardTitle>
      {rows.length === 0 ? (
        <Empty>{empty}</Empty>
      ) : (
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="text-xs text-fd-muted-foreground">
              <th className="pb-2 text-start font-normal">Query</th>
              <th className="w-20 pb-2 text-end font-normal">Searches</th>
              <th className="w-24 pb-2 text-end font-normal">{noResults ? 'Last' : 'Opened'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.query} className="border-t">
                <td className="py-2 pe-3">
                  <span className="block truncate" title={r.query}>
                    {r.query}
                  </span>
                  {!noResults && r.results === 0 && (
                    <span className="block text-xs text-fd-muted-foreground">no results</span>
                  )}
                </td>
                <td className="py-2 text-end tabular-nums">{r.count}</td>
                <td className="py-2 text-end tabular-nums text-fd-muted-foreground">
                  {noResults ? formatDay(r.lastSearched) : percent(r.clicks, r.count)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
