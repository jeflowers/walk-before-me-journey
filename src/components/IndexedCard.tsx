import type { ReactNode } from 'react';
import { Chip } from '@app/components/Chip';

interface IndexedCardProps {
  label: string;
  children: ReactNode;
  sheet?: 'navy' | 'parchment';
}

/** Generic bordered card with a Chip label header. Sheet controls surface color. */
export function IndexedCard({ label, children, sheet = 'navy' }: IndexedCardProps) {
  const onParchment = sheet === 'parchment';
  return (
    <div className={`border ${onParchment ? 'bg-parchment border-navy' : 'bg-navy border-gold'} p-6 flex flex-col gap-4`}>
      <Chip style={onParchment ? 'navy' : 'outline'}>{label}</Chip>
      {children}
    </div>
  );
}
