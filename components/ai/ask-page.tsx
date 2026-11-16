'use client';
import { AiMagicIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonVariants } from '@/components/ui/button';
import { useAskAi } from './ask-ai';

export function AskAIAboutPage({ title }: { title: string }) {
  const ask = useAskAi();
  return (
    <button
      type="button"
      className={buttonVariants({ variant: 'flat', size: 'sm' })}
      onClick={() => ask(`Summarize the "${title}" page I'm on and what I should do next.`)}
    >
      <HugeiconsIcon icon={AiMagicIcon} className="size-4 text-primary" strokeWidth={2} />
      Ask AI
    </button>
  );
}
