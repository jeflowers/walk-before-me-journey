import type { TrackStatus } from '@app/data/standing.types';
import { Icon } from '@app/components/Icon';

interface TrackMeterProps {
  track: TrackStatus;
}

export function TrackMeter({ track }: TrackMeterProps) {
  return (
    <div className="border border-outline-variant p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-chrome text-[13px] font-bold uppercase tracking-[0.08em] text-parchment">{track.label}</h3>
        {track.met && <Icon name="check_circle" size={18} className="text-secondary" filled />}
      </div>
      <ul className="flex flex-col gap-2">
        {track.requirements.map((req) => {
          const pct = Math.min(100, Math.round((req.current / req.threshold) * 100));
          return (
            <li key={req.key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-chrome text-[11px] text-parchment/70">{req.label}</span>
                <span className="font-chrome text-[11px] text-parchment/50">{req.current}/{req.threshold}</span>
              </div>
              <div className="h-1 w-full bg-navy/50 overflow-hidden">
                <div
                  className={`h-full transition-all ${req.met ? 'bg-secondary' : 'bg-gold/60'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
