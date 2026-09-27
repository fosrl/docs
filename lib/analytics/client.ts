/**
 * Browser helpers for docs feedback. The visitor id is an anonymous random id kept in
 * localStorage so a person can change their vote; nothing else identifies them.
 */
const VisitorKey = 'pg-visitor-id';

export function randomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

let fallbackVisitorId: string | undefined;

export function getVisitorId() {
  try {
    let id = localStorage.getItem(VisitorKey);
    if (!id) {
      id = randomId();
      localStorage.setItem(VisitorKey, id);
    }
    return id;
  } catch {
    // storage unavailable (private mode): one id per page load
    return (fallbackVisitorId ??= randomId());
  }
}

export type Vote = -1 | 0 | 1;

/** fire-and-forget; analytics must never break the page */
export function sendEvent(url: string, body: Record<string, unknown>) {
  void fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, visitorId: getVisitorId() }),
    keepalive: true,
  }).catch(() => undefined);
}

export function sendFeedback(kind: 'page' | 'message', body: Record<string, unknown>) {
  sendEvent(`/api/feedback/${kind}`, body);
}
