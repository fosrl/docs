const DAY = 86_400_000;

/**
 * The Fossorial API deletes docs analytics older than this (api repo,
 * src/controllers/docsAnalytics/retention.ts), so no range reaches further back.
 */
export const RETENTION_DAYS = 90;

export const presets = [
  { id: '24h', label: '24 hours', ms: DAY },
  { id: '7d', label: '7 days', ms: 7 * DAY },
  { id: '30d', label: '30 days', ms: 30 * DAY },
  { id: '90d', label: '90 days', ms: RETENTION_DAYS * DAY },
] as const;

/** first day that can still have data, as `YYYY-MM-DD` (for date inputs) */
export function oldestDay(now = Date.now()) {
  return formatDay(now - RETENTION_DAYS * DAY);
}

export type SearchParams = Record<string, string | string[] | undefined>;

export function param(params: SearchParams, key: string) {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
}

/** `YYYY-MM-DD` as UTC midnight */
function parseDay(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const t = Date.parse(`${value}T00:00:00Z`);
  return Number.isNaN(t) ? undefined : t;
}

export function formatDay(t: number) {
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * `?range=7d` picks a preset (default 30 days); `?from=2026-01-01&to=2026-01-31` is a
 * custom range in UTC with both days included, clamped to the retention window.
 */
export function resolveRange(params: SearchParams, now = Date.now()) {
  const from = parseDay(param(params, 'from'));
  const to = parseDay(param(params, 'to'));
  if (from !== undefined || to !== undefined) {
    const floor = now - RETENTION_DAYS * DAY;
    const end = to !== undefined ? to + DAY : now + 1;
    const start = Math.max(Math.min(from ?? floor, end), floor);
    return {
      preset: null,
      from: start,
      to: Math.max(start, end),
      label: `${formatDay(start)} to ${to !== undefined ? formatDay(to) : 'now'}`,
    };
  }

  const preset = presets.find((p) => p.id === param(params, 'range')) ?? presets[2];
  return {
    preset: preset.id,
    from: now - preset.ms,
    to: now + 1,
    label: `Last ${preset.label}`,
  };
}

/** a query string with some keys replaced; `undefined` drops a key */
export function withParams(params: SearchParams, changes: Record<string, string | undefined>) {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const v = Array.isArray(value) ? value[0] : value;
    if (v && !(key in changes)) next.set(key, v);
  }
  for (const [key, value] of Object.entries(changes)) if (value) next.set(key, value);
  const qs = next.toString();
  return qs ? `?${qs}` : '?';
}

const dateTime = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'UTC',
});

export function formatDateTime(t: number) {
  return `${dateTime.format(t)} UTC`;
}
