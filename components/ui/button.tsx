import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Same buttons as pangolin.net (landing-v5 `components/ui/button.tsx`), which ports
 * them from the Pangolin dashboard.
 */
export const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border border-[oklch(0.58_0.19_41.93)] bg-[linear-gradient(180deg,oklch(0.72_0.18_45)_0%,var(--primary)_100%)] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1px_2px_rgba(120,45,10,0.25),0_2px_6px_-2px_rgba(243,107,33,0.45)] hover:brightness-[1.06] active:translate-y-px active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] transition-[filter,transform,box-shadow]',
        /* bordered, no shadow; for secondary controls */
        flat: 'border border-border bg-background text-foreground hover:border-faint/60 hover:bg-soft transition-[border-color,background-color]',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-9 rounded-lg px-4',
        sm: 'h-8 rounded-lg px-3',
        lg: 'h-11 rounded-lg px-6',
        icon: 'size-9 rounded-md',
        'icon-sm': 'size-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps = VariantProps<typeof buttonVariants>;
