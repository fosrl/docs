import { cn } from '@/lib/cn';
import { formatDay } from '@/lib/range';
import { Empty } from './ui';

/**
 * Single-series bar chart with a hover/focus tooltip per bar (pure CSS, no client JS)
 * and a table view for screen readers and exact numbers.
 */
export function ActivityChart({ points }: { points: { start: number; count: number }[] }) {
  if (points.length === 0) return <Empty>No questions in this range.</Empty>;

  const max = Math.max(1, ...points.map((p) => p.count));
  // first, middle and last bucket; with only 1–2 buckets these overlap
  const ticks = [...new Set([points[0], points[Math.floor((points.length - 1) / 2)], points.at(-1)!])];

  return (
    <div>
      <div className="relative">
        {/* recessive gridlines: max and half */}
        <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-fd-border" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-fd-border" />
        <span className="absolute -top-2 end-0 bg-fd-card ps-1 text-[11px] text-fd-muted-foreground tabular-nums">
          {max}
        </span>

        <div className="flex h-40 items-end justify-center gap-[2px] border-b border-fd-border pe-6" aria-hidden>
          {points.map((p, i) => (
            <div
              key={p.start}
              tabIndex={0}
              className="group relative flex h-full min-w-0 max-w-12 flex-1 items-end outline-none"
            >
              <div
                className="w-full rounded-t-[4px] bg-fd-primary/80 transition-colors group-hover:bg-fd-primary group-focus-visible:bg-fd-primary"
                style={{ height: p.count === 0 ? 0 : `max(2px, ${(p.count / max) * 100}%)` }}
              />
              {/* tooltips at the edges anchor inward so they never overflow the page */}
              <div
                className={cn(
                  'pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap rounded-md border bg-fd-popover px-2 py-1 text-xs text-fd-popover-foreground shadow-md group-hover:block group-focus-visible:block',
                  i < points.length / 4
                    ? 'left-0'
                    : i >= (points.length * 3) / 4
                      ? 'right-0'
                      : 'left-1/2 -translate-x-1/2',
                )}
              >
                <span className="text-fd-muted-foreground">{formatDay(p.start)}</span>{' '}
                <strong className="tabular-nums">{p.count}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-1 flex justify-between pe-6 text-[11px] text-fd-muted-foreground tabular-nums">
        {ticks.map((p) => (
          <span key={p.start}>{formatDay(p.start)}</span>
        ))}
      </div>

      <details className="mt-3 text-xs">
        <summary className="cursor-pointer text-fd-muted-foreground">Show as table</summary>
        <table className="mt-2 w-full max-w-xs tabular-nums">
          <thead>
            <tr className="text-start text-fd-muted-foreground">
              <th className="py-1 text-start font-normal">Day</th>
              <th className="py-1 text-end font-normal">Questions</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.start} className="border-t">
                <td className="py-1">{formatDay(p.start)}</td>
                <td className="py-1 text-end">{p.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
