import 'server-only';

/** Same source and formatting as pangolin.net (landing-v5 `lib/marketing/repo-meta.ts`). */
const STARS_URL = 'https://api.fossorial.io/api/v1/stars';
const REVALIDATE_SECONDS = 3600;

type StarsApiResponse = {
  data?: { repositories?: Record<string, { stars?: number }> };
};

/** 25540 -> "25.5k", always rounded down so it never overstates the count */
function formatStarCount(count: number): string {
  if (count < 1000) return String(count);
  return `${Math.floor((count / 1000) * 10) / 10}k`.replace('.0k', 'k');
}

export async function getRepoStarCount(repo: string): Promise<string | null> {
  try {
    const res = await fetch(STARS_URL, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const data = (await res.json()) as StarsApiResponse;
    const count = data.data?.repositories?.[repo]?.stars;
    return typeof count === 'number' ? formatStarCount(count) : null;
  } catch {
    return null;
  }
}
