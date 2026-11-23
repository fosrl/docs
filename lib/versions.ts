import 'server-only';

const VERSIONS_URL = 'https://api.fossorial.io/api/v1/versions';
const VERSIONS_TTL_MS = 5 * 60_000;
let versionsCache: { at: number; data: unknown } | undefined;

type VersionEntry = { latestVersion?: string; releaseNotes?: string };

export async function getLatestVersionsResult() {
  if (!versionsCache || Date.now() - versionsCache.at > VERSIONS_TTL_MS) {
    try {
      const res = await fetch(VERSIONS_URL, { signal: AbortSignal.timeout(8_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as { data?: Record<string, VersionEntry> };
      if (!body.data) throw new Error('missing data');
      const data = Object.fromEntries(
        Object.entries(body.data).map(([name, v]) => [
          name,
          {
            latestVersion: v.latestVersion,
            releaseNotes: v.releaseNotes,
            allReleases: v.releaseNotes?.replace(/\/tag\/.*$/, ''),
          },
        ]),
      );
      versionsCache = { at: Date.now(), data };
    } catch (e) {
      console.error('[versions]', e);
      if (!versionsCache)
        return {
          error:
            'Could not fetch version information. Point the user to the GitHub releases page of the relevant repo under https://github.com/fosrl.',
        };
    }
  }
  return {
    note: 'Served from a cached proxy of GitHub releases, so it can lag behind the newest release. For the definitive latest release, check the releases page of the respective GitHub repo (allReleases).',
    versions: versionsCache.data,
  };
}
