'use client';

import { useState } from 'react';
import { Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonVariants } from '@/components/ui/button';

const cache = new Map<string, Promise<string>>();

/** copies the page's Markdown source (`/llms.mdx/.../content.md`) */
export function CopyMarkdownButton({ markdownUrl }: { markdownUrl: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'copied'>('idle');

  async function copy() {
    setState('loading');
    try {
      let text = cache.get(markdownUrl);
      if (!text) {
        text = fetch(markdownUrl).then((res) => res.text());
        cache.set(markdownUrl, text);
      }
      // ClipboardItem keeps the user gesture alive in Safari while the fetch resolves
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/plain': text.then((t) => new Blob([t], { type: 'text/plain' })) }),
      ]);
      setState('copied');
      window.setTimeout(() => setState('idle'), 1500);
    } catch {
      cache.delete(markdownUrl);
      setState('idle');
    }
  }

  return (
    <button
      type="button"
      className={buttonVariants({ variant: 'flat', size: 'sm' })}
      disabled={state === 'loading'}
      onClick={copy}
    >
      <HugeiconsIcon
        icon={state === 'copied' ? Tick02Icon : Copy01Icon}
        className="size-4 text-muted-foreground"
        strokeWidth={2}
      />
      {state === 'copied' ? 'Copied' : 'Copy page'}
    </button>
  );
}
