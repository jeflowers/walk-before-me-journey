import type { ReactNode } from 'react';

export type ChipStyle = 'outline' | 'filled' | 'navy';

const STYLES: Record<ChipStyle, string> = {
  outline: 'text-gold border border-gold',
  filled: 'text-navy bg-secondary',
  navy: 'text-parchment bg-navy',
};

/** Technical metadata tag (DESIGN.md "Chips & Tags"): 12px Space Grotesk, uppercase, 0.1em tracking, sharp corners. */
export function Chip({ children, style = 'outline', className = '' }: { children: ReactNode; style?: ChipStyle; className?: string }) {
  return <span className={`inline-block w-fit font-chrome text-label-technical uppercase px-2 py-1 ${STYLES[style]} ${className}`}>{children}</span>;
}
