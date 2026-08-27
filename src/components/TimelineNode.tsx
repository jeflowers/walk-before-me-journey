import type { Waypoint } from '@app/data/types';
import { Chip } from '@app/components/Chip';

interface TimelineNodeProps {
  waypoint: Waypoint;
  active: boolean;
}

/** Waypoints tracker timeline node. Three visual states: complete, current, locked. */
export function TimelineNode({ waypoint, active }: TimelineNodeProps) {
  const isCurrent = waypoint.state === 'current';
  const isLocked = waypoint.state === 'locked';

  const dotClass = isCurrent
    ? 'bg-secondary'
    : isLocked
      ? 'bg-surface border-2 border-outline-variant'
      : 'bg-surface border-2 border-secondary';

  const cardClass = active
    ? 'bg-navy border border-secondary'
    : 'bg-surface-container-low border border-outline-variant';

  return (
    <div className="relative mb-4">
      <div className={`absolute left-[-34px] top-5 w-4 h-4 rounded-full ${dotClass}`} />
      <div className={`${cardClass} p-5 flex flex-col gap-2`}>
        <Chip style={isCurrent ? 'filled' : 'outline'}>
          {isCurrent ? 'Current Waypoint' : `Waypoint ${waypoint.number}`}
        </Chip>
        <h3 className={`font-chrome text-[18px] font-medium uppercase tracking-[0.05em] ${isLocked ? 'text-outline' : 'text-on-surface'}`}>
          {waypoint.trackerName} <span className="text-secondary">({waypoint.verses})</span>
        </h3>
        <p className={`font-narrative text-[16px] leading-[1.5] ${isLocked ? 'text-outline' : 'text-on-surface-variant'}`}>
          {waypoint.summary}
        </p>
      </div>
    </div>
  );
}
