import { cn } from '@/lib/cn';

/** Pangolin wordmark; the text turns light in dark mode */
export function Logo({ className }: { className?: string }) {
  return (
    <>
      <img
        src="/site/logo-light.svg"
        alt="Pangolin"
        width={120}
        height={30}
        className={cn('w-auto dark:hidden', className)}
      />
      <img
        src="/site/logo-dark.svg"
        alt="Pangolin"
        width={120}
        height={30}
        className={cn('hidden w-auto dark:block', className)}
      />
    </>
  );
}
