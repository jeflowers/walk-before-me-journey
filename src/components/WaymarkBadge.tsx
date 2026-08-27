import type { RankId } from '@app/data/enums';
import { RANK_LABELS } from '@app/data/standing';

interface WaymarkBadgeProps {
  rank: RankId;
  size?: 'sm' | 'md';
}

export function WaymarkBadge({ rank, size = 'md' }: WaymarkBadgeProps) {
  const label = RANK_LABELS[rank];
  const base = 'inline-flex items-center border font-chrome uppercase tracking-[0.1em]';
  const sizing = size === 'sm'
    ? 'px-2 py-0.5 text-[10px]'
    : 'px-3 py-1 text-[11px]';

  return (
    <span className={`${base} ${sizing} border-gold text-gold`}>
      {label}
    </span>
  );
}
