import { Link } from 'react-router-dom';
import { ROUTES } from '@app/app/routes';
import { Button } from '@app/components/Button';
import { Icon } from '@app/components/Icon';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26 } from '@app/data/psalm26';
import type { Waypoint, WaypointState } from '@app/data/types';

const QUICK_ACTIONS = [
  { icon: 'menu_book', label: 'Lexicon', detail: 'Hebrew and Greek terms behind the walk', to: ROUTES.lexicon },
  { icon: 'lightbulb', label: 'Reflections', detail: 'Journal prompts and saved entries', to: ROUTES.reflection },
  { icon: 'library_books', label: 'Materials', detail: 'Facilitator guide, handouts, cards', to: ROUTES.waypoints },
  { icon: 'group', label: 'Community', detail: 'Shared reflections on this track', to: ROUTES.community },
];

const NODE_STYLE: Record<WaypointState, string> = {
  complete: 'bg-secondary',
  current: 'bg-surface border-2 border-secondary',
  locked: 'bg-surface border-2 border-outline-variant',
};

function ProgressNode({ waypoint, last }: { waypoint: Waypoint; last: boolean }) {
  const locked = waypoint.state === 'locked';
  return (
    <li className="flex flex-col gap-3 md:gap-4">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${NODE_STYLE[waypoint.state]}`}>
          {waypoint.state === 'complete' ? <Icon name="check" size={18} className="text-navy" /> : null}
          {waypoint.state === 'current' ? <div className="w-2 h-2 rounded-full bg-secondary" /> : null}
        </div>
        {!last ? <div className={`flex-1 h-[2px] ml-2 ${locked ? 'bg-outline-variant' : 'bg-secondary'}`} /> : null}
      </div>
      <span className={`font-chrome text-[10px] uppercase tracking-[0.15em] ${locked ? 'text-outline' : 'text-secondary'}`}>Waypoint {waypoint.numeral}</span>
      <Link to={ROUTES.waypoint.replace(':number', String(waypoint.number))} className={`font-chrome text-[16px] ${waypoint.state === 'current' ? 'font-bold text-on-surface' : locked ? 'text-outline' : 'text-on-surface'}`}>
        {waypoint.name}
      </Link>
    </li>
  );
}

/** Study Home (dashboard). Layout: reference/desktop/study_home_psalm_26.html and reference/mobile/study_home_walk_before_me_psalm_26.html. */
export function StudyHomePage() {
  const study = PSALM_26;
  const current = study.waypoints.find((w) => w.state === 'current') ?? study.waypoints[0];
  return (
    <>
      <SiteHeader title="Walk Before Me" progress={study.completed / study.total} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0">
        <section className="relative mt-8 border border-outline-variant overflow-hidden h-[320px] md:h-[420px]">
          <img src={study.heroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />
          <div className="absolute left-6 md:left-10 bottom-6 md:bottom-10 flex flex-col gap-3">
            <span className="font-chrome text-label-technical uppercase tracking-[0.2em] text-secondary">Emmaus Road</span>
            <h1 className="font-chrome text-display-lg md:text-[64px] uppercase text-secondary">{study.title}</h1>
            <p className="font-chrome text-headline-sm uppercase text-primary">{study.subtitle}</p>
          </div>
          <div className="hidden md:block absolute right-10 bottom-10">
            <Button label={`Continue Study: Waypoint ${current.numeral}`} />
          </div>
        </section>
        <div className="md:hidden mt-4"><Button label={`Continue Study: Waypoint ${current.numeral}`} className="w-full justify-center" /></div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.label} to={action.to} className="border border-outline-variant bg-surface-container-low p-5 md:p-6 flex flex-col gap-3">
              <Icon name={action.icon} className="text-secondary" />
              <span className="font-chrome text-label-technical uppercase text-on-surface">{action.label}</span>
              <span className="text-[16px] leading-[1.5] text-on-surface-variant hidden md:block">{action.detail}</span>
            </Link>
          ))}
        </section>

        <section className="mt-12 border border-outline-variant bg-surface-container-low p-6 md:p-8">
          <div className="flex justify-between items-center border-b border-outline-variant pb-4">
            <h2 className="font-chrome text-label-technical uppercase tracking-[0.15em] text-on-surface">Journey Progress</h2>
            <span className="font-chrome text-label-technical uppercase text-secondary">{study.completed} / {study.total} Complete</span>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-7 gap-6 md:gap-4 mt-8">
            {study.waypoints.map((w, i) => <ProgressNode key={w.number} waypoint={w} last={i === study.waypoints.length - 1} />)}
          </ol>
        </section>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
