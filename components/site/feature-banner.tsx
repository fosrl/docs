'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  FEATURE_BANNER as BANNER,
  FEATURE_BANNER_DISMISSED_ATTR,
  FEATURE_BANNER_STORAGE_KEY as STORAGE_KEY,
} from '@/lib/site';
import { XIcon } from './icons';

/**
 * Announcement card at the top of the docs sidebar. Copy lives in `lib/site.ts`. A
 * dismissed card is hidden before first paint (see app/layout.tsx).
 */
export function FeatureBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === BANNER.id) setDismissed(true);
    } catch {
      // storage blocked; the card still dismisses for this view
    }
  }, []);

  function dismiss() {
    setDismissed(true);
    document.documentElement.setAttribute(FEATURE_BANNER_DISMISSED_ATTR, '');
    try {
      localStorage.setItem(STORAGE_KEY, BANNER.id);
    } catch {
      // ignore
    }
  }

  if (dismissed) return null;

  return (
    <div data-feature-banner className="group relative rounded-lg border bg-soft p-3 pr-8">
      <Link href={BANNER.href} className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-primary">{BANNER.badge}</span>
        <span className="text-sm font-medium text-foreground">{BANNER.title}</span>
        <span className="text-xs leading-snug text-muted-foreground">{BANNER.description}</span>
      </Link>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={dismiss}
        className="absolute top-2 right-2 inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-faint transition hover:bg-accent hover:text-foreground"
      >
        <XIcon className="size-3" />
      </button>
    </div>
  );
}
