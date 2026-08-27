import type { Waypoint } from '@app/data/types';
import { Chip } from '@app/components/Chip';
import { ScriptureBlock } from '@app/components/ScriptureBlock';

interface WaypointCardProps {
  waypoint: Waypoint;
  flip: boolean;
}

/** Landing-page waypoint card. Desktop: 12-col grid (image 5, text 7, alternating). Mobile: stacked parchment card. */
export function WaypointCard({ waypoint, flip }: WaypointCardProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-12 border-b border-gold/20">
      <div className={`md:col-span-5 ${flip ? 'md:order-2' : ''} h-48 md:h-[300px] border border-parchment p-2 bg-surface-container-lowest`}>
        <img className="w-full h-full object-cover" src={waypoint.image} alt="" />
      </div>
      <div className={`md:col-span-7 ${flip ? 'md:order-1 md:pr-8' : 'md:pl-8'} flex flex-col gap-5`}>
        <Chip style="filled">Waypoint {waypoint.numeral}</Chip>
        <h2 className="font-chrome text-headline-md text-parchment">{waypoint.name}</h2>
        <ScriptureBlock scripture={waypoint.scripture} />
        <p className="font-narrative text-body-md text-on-surface">{waypoint.question}</p>
        {waypoint.note ? <Chip style="outline">{waypoint.note}</Chip> : null}
      </div>
    </section>
  );
}
