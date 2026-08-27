import { Link } from 'react-router-dom';
import { ROUTES } from '@app/app/routes';
import { Button } from '@app/components/Button';
import { Icon } from '@app/components/Icon';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26 } from '@app/data/psalm26';
import { useProgress } from '@app/lib/useProgress';
import type { Waypoint, WaypointState } from '@app/data/types';

function getQuickActions(currentWpNumber: number) {
  const materialsLink = ROUTES.waypoint.replace(':number', String(currentWpNumber)) + '#materials';
  return [
    { icon: 'menu_book', label: 'Lexicon', detail: 'Hebrew and Greek terms behind the walk', to: ROUTES.lexicon },
    { icon: 'lightbulb', label: 'Reflections', detail: 'Journal prompts and saved entries', to: ROUTES.reflection },
    { icon: 'library_books', label: 'Materials', detail: 'Facilitator guide, handouts, cards', to: materialsLink },
    { icon: 'group', label: 'Community', detail: 'Shared reflections on this track', to: ROUTES.community },
  ];
}

const NODE_STYLE: Record<WaypointState, string> = {
  complete: 'bg-secondary',
  current: 'bg-surface border-2 border-secondary',
  locked: 'bg-surface border-2 border-outline-variant',
};

function ProgressNode({ waypoint, state, last }: { waypoint: Waypoint; state: WaypointState; last: boolean }) {
  const locked = state === 'locked';
  const link = ROUTES.waypoint.replace(':number', String(waypoint.number));
  return (
    <li className="flex flex-col gap-3 md:gap-4">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${NODE_STYLE[state]}`}>
          {state === 'complete' ? <Icon name="check" size={18} className="text-navy" /> : null}
          {state === 'current' ? <div className="w-2 h-2 rounded-full bg-secondary" /> : null}
        </div>
        {!last ? <div className={`flex-1 h-[2px] ml-2 ${locked ? 'bg-outline-variant' : 'bg-secondary'}`} /> : null}
      </div>
      <span className={`font-chrome text-[10px] uppercase tracking-[0.15em] ${locked ? 'text-outline' : 'text-secondary'}`}>Waypoint {waypoint.numeral}</span>
      {locked ? (
        <span className="font-chrome text-[16px] text-outline">{waypoint.name}</span>
      ) : (
        <Link to={link} className="font-chrome text-[16px] hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary text-on-surface">
          {waypoint.name}
        </Link>
      )}
    </li>
  );
}

export function StudyHomePage() {
  const study = PSALM_26;
  const { getState, completedCount } = useProgress(study.id, study.waypoints);

  const currentWp = study.waypoints.find((w) => getState(w.number) === 'current') ?? study.waypoints[0];
  const continueLink = ROUTES.waypoint.replace(':number', String(currentWp.number));
  const quickActions = getQuickActions(currentWp.number);

  return (
    <>
      <SiteHeader title="Walk Before Me" progress={completedCount / study.total} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0">
        <section className="relative mt-8 border border-outline-variant overflow-hidden h-[320px] md:h-[420px]">
          <img src={study.heroImage} alt={study.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />
          <div className="absolute left-6 md:left-10 bottom-6 md:bottom-10 flex flex-col gap-3">
            <span className="font-chrome text-label-technical uppercase tracking-[0.2em] text-secondary">Emmaus Road</span>
            <h1 className="font-chrome text-display-lg md:text-[64px] uppercase text-secondary">{study.title}</h1>
            <p className="font-chrome text-headline-sm uppercase text-primary">{study.subtitle}</p>
          </div>
          <div className="hidden md:block absolute right-10 bottom-10">
            <Link to={continueLink}>
              <Button label={`Continue Study: Waypoint ${currentWp.numeral}`} />
            </Link>
          </div>
        </section>
        <div className="md:hidden mt-4">
          <Link to={continueLink}>
            <Button label={`Continue Study: Waypoint ${currentWp.numeral}`} className="w-full justify-center" />
          </Link>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.to} className="border border-outline-variant bg-surface-container-low p-5 md:p-6 flex flex-col gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">
              <Icon name={action.icon} className="text-secondary" />
              <span className="font-chrome text-label-technical uppercase text-on-surface">{action.label}</span>
              <span className="text-[16px] leading-[1.5] text-on-surface-variant hidden md:block">{action.detail}</span>
            </Link>
          ))}
        </section>

        <section className="mt-12 border border-outline-variant bg-surface-container-low p-6 md:p-8">
          <div className="flex justify-between items-center border-b border-outline-variant pb-4">
            <h2 className="font-chrome text-label-technical uppercase tracking-[0.15em] text-on-surface">Journey Progress</h2>
            <span className="font-chrome text-label-technical uppercase text-secondary">{completedCount} / {study.total} Complete</span>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-7 gap-6 md:gap-4 mt-8">
            {study.waypoints.map((w, i) => (
              <ProgressNode key={w.number} waypoint={w} state={getState(w.number)} last={i === study.waypoints.length - 1} />
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
