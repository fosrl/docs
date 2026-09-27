import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...props }: ComponentProps<'section'>) {
  return <section className={cn('rounded-xl border bg-fd-card p-4 min-w-0', className)} {...props} />;
}

export function CardTitle({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <h2 className="text-sm font-medium">{children}</h2>
      {hint && <p className="text-xs text-fd-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Stat({ label, value, detail }: { label: string; value: ReactNode; detail?: ReactNode }) {
  return (
    <Card>
      <p className="text-xs text-fd-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {detail && <p className="mt-1 text-xs text-fd-muted-foreground tabular-nums">{detail}</p>}
    </Card>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-fd-muted-foreground">{children}</p>;
}

/** 👍 / 👎 counts as text + icon, never color alone */
export function Votes({ up, down }: { up: number; down: number }) {
  return (
    <span className="inline-flex gap-3 tabular-nums whitespace-nowrap">
      <span title="Thumbs up">👍 {up}</span>
      <span title="Thumbs down">👎 {down}</span>
    </span>
  );
}

export function percent(part: number, total: number) {
  return total === 0 ? '—' : `${Math.round((part / total) * 100)}%`;
}
