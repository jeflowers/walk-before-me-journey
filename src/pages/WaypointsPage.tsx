import { Link } from 'react-router-dom';
import { ROUTES } from '@app/app/routes';
import { Button } from '@app/components/Button';
import { Chip } from '@app/components/Chip';
import { Icon } from '@app/components/Icon';
import { ScriptureBlock } from '@app/components/ScriptureBlock';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26 } from '@app/data/psalm26';
import type { Waypoint } from '@app/data/types';

function NodeCard({ waypoint }: { waypoint: Waypoint }) {
  const isCurrent = waypoint.state === 'current';
  const isLocked = waypoint.state === 'locked';

  const dotClass = isCurrent
    ? 'bg-secondary'
    : isLocked
      ? 'bg-surface border-2 border-outline-variant'
      : 'bg-surface border-2 border-secondary';

  const cardClass = isCurrent
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
        {isCurrent && (
          <div className="mt-3 md:hidden">
            <Link to={ROUTES.waypoint.replace(':number', String(waypoint.number))}>
              <Button label="Enter Study" className="w-full justify-center" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function WaypointsPage() {
  const study = PSALM_26;
  const current = study.waypoints.find((w) => w.state === 'current') ?? study.waypoints[0];

  return (
    <>
      <SiteHeader title="Walk Before Me" progress={study.completed / study.total} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0">
        <section className="pt-10 pb-6 border-b border-outline-variant">
          <h1 className="font-chrome text-headline-md text-secondary">Psalm 26</h1>
          <p className="font-narrative text-body-md text-on-surface-variant mt-2">
            <span className="uppercase tracking-[0.05em]">{study.completed} / {study.total} Waypoints complete</span> &middot; A pilgrimage of integrity.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
          {/* Timeline column */}
          <div className="md:col-span-5 relative pl-10">
            <div className="absolute left-3 top-2 bottom-2 w-[2px] bg-secondary" />
            {study.waypoints.map((wp) => (
              <NodeCard key={wp.number} waypoint={wp} />
            ))}
          </div>

          {/* Sticky detail panel (desktop only) */}
          <div className="hidden md:block md:col-span-7">
            <div className="sticky top-8 bg-navy border border-secondary p-8 flex flex-col gap-6">
              <Chip style="filled">Current Waypoint</Chip>
              <h2 className="font-chrome text-headline-md uppercase text-parchment">
                {current.trackerName} <span className="text-secondary">({current.verses})</span>
              </h2>
              <div className="h-[260px] border border-gold p-2">
                <img className="w-full h-full object-cover" src={current.image} alt={current.trackerName} />
              </div>
              <ScriptureBlock scripture={current.scripture} />
              <p className="font-narrative text-body-md leading-[1.6] text-on-surface">
                {current.summary}
              </p>
              <div className="flex gap-4">
                <Link to={ROUTES.waypoint.replace(':number', String(current.number))}>
                  <Button label="Enter Study" />
                </Link>
                <Link to={ROUTES.reflection}>
                  <Button label="Reflection Prompts" style="outline" icon="edit_note" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
