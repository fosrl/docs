import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';

/** UI icons from Hugeicons (stroke rounded), same set as pangolin.net */
function hugeIcon(icon: IconSvgElement) {
  return function Icon({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
    return <HugeiconsIcon icon={icon} className={className} strokeWidth={strokeWidth} />;
  };
}

export const ArrowUpRightIcon = hugeIcon(ArrowUpRight01Icon);
export const ChevronDownIcon = hugeIcon(ArrowDown01Icon);
export const ChevronRightIcon = hugeIcon(ArrowRight01Icon);
export const XIcon = hugeIcon(Cancel01Icon);
