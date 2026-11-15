'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ComputerIcon, Moon02Icon, Sun03Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/cn';

const options: { value: 'light' | 'dark' | 'system'; label: string; icon: IconSvgElement }[] = [
  { value: 'light', label: 'Light', icon: Sun03Icon },
  { value: 'dark', label: 'Dark', icon: Moon02Icon },
  { value: 'system', label: 'System', icon: ComputerIcon },
];

const noopSubscribe = () => () => {};

/**
 * Theme menu: Light, Dark or System (follows the OS). The button shows the look in
 * effect; both icons render and CSS picks one (`dark:`), so nothing flashes before
 * the theme is known.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // the stored choice is only known in the browser
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Theme"
        title="Theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'inline-flex cursor-pointer items-center rounded-md p-2 text-muted-foreground transition hover:text-foreground',
          open && 'text-foreground',
        )}
        onClick={() => setOpen(!open)}
      >
        <HugeiconsIcon icon={Moon02Icon} className="size-[18px] dark:hidden" strokeWidth={2} />
        <HugeiconsIcon icon={Sun03Icon} className="hidden size-[18px] dark:block" strokeWidth={2} />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Theme"
          className="absolute top-full right-0 z-50 mt-2 flex w-36 animate-[ask-ai-in_150ms_var(--ease-brand)] flex-col rounded-lg border bg-popover p-1 text-popover-foreground shadow-[0_4px_4px_rgba(0,0,0,0.05),0_12px_32px_-12px_rgba(0,0,0,0.18)]"
        >
          {options.map((option) => {
            const selected = mounted && (theme ?? 'system') === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-accent',
                  selected ? 'font-medium text-foreground' : 'text-muted-foreground',
                )}
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
              >
                <HugeiconsIcon icon={option.icon} className="size-4" strokeWidth={2} />
                <span className="flex-1">{option.label}</span>
                {selected && (
                  <HugeiconsIcon icon={Tick02Icon} className="size-3.5 text-primary" strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
