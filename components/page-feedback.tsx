'use client';
import { useEffect, useState } from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { sendFeedback, type Vote } from '@/lib/analytics/client';

const storageKey = (page: string) => `pg-page-vote:${page}`;

/** "Was this page helpful?" thumbs; clicking the chosen thumb again takes the vote back */
export function PageFeedback({ page }: { page: string }) {
  const [vote, setVote] = useState<Vote>(0);

  useEffect(() => {
    try {
      const stored = Number(localStorage.getItem(storageKey(page)));
      setVote(stored === 1 || stored === -1 ? stored : 0);
    } catch {
      setVote(0);
    }
  }, [page]);

  function choose(value: Vote) {
    const next = vote === value ? 0 : value;
    setVote(next);
    try {
      if (next === 0) localStorage.removeItem(storageKey(page));
      else localStorage.setItem(storageKey(page), String(next));
    } catch {
      // storage unavailable
    }
    sendFeedback('page', { page, vote: next });
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-fd-muted-foreground">
      <p>{vote === 0 ? 'Was this page helpful?' : 'Thanks for the feedback!'}</p>
      <div className="flex gap-2">
        {([1, -1] as const).map((value) => {
          const Icon = value === 1 ? ThumbsUp : ThumbsDown;
          const active = vote === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'rounded-full gap-1.5 px-3 [&_svg]:size-3.5',
                active && 'bg-fd-accent text-fd-accent-foreground',
              )}
              onClick={() => choose(value)}
            >
              <Icon className={cn(active && 'fill-current')} />
              {value === 1 ? 'Yes' : 'No'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
