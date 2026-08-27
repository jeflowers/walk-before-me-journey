import { useParams, Link } from 'react-router-dom';
import { ROUTES } from '@app/app/routes';
import { Button } from '@app/components/Button';
import { Chip } from '@app/components/Chip';
import { Icon } from '@app/components/Icon';
import { ScriptureBlock } from '@app/components/ScriptureBlock';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26 } from '@app/data/psalm26';
import { useProgress } from '@app/lib/useProgress';
import { useAuth } from '@app/lib/auth';

export function WaypointPage() {
  const { number } = useParams<{ number: string }>();
  const idx = Number(number) - 1;
  const study = PSALM_26;
  const waypoint = study.waypoints[idx];

  if (!waypoint) {
    return (
      <>
        <SiteHeader title="Psalm 26" progress={study.completed / study.total} />
        <main className="max-w-container mx-auto px-margin-mobile py-16">
          <p className="font-narrative text-body-lg text-on-surface">Waypoint not found.</p>
        </main>
        <SiteFooter quote={study.footerQuote} />
      </>
    );
  }

  const { user } = useAuth();
  const { getState, markComplete } = useProgress(study.id, study.waypoints);
  const wpState = getState(waypoint.number);

  const prev = idx > 0 ? study.waypoints[idx - 1] : null;
  const next = idx < study.waypoints.length - 1 ? study.waypoints[idx + 1] : null;
  const prevLink = prev ? ROUTES.waypoint.replace(':number', String(prev.number)) : null;
  const nextLink = next ? ROUTES.waypoint.replace(':number', String(next.number)) : ROUTES.commemoration;

  return (
    <>
      <SiteHeader title="Walk Before Me" progress={study.completed / study.total} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-10">
          {/* Main article */}
          <article className="md:col-span-8 flex flex-col gap-8">
            <header className="flex flex-col gap-4">
              <Chip style="outline">Waypoint {waypoint.numeral}</Chip>
              <h1 className="font-chrome text-[48px] md:text-[56px] font-bold leading-[1.1] tracking-[-0.02em] uppercase text-parchment">
                {waypoint.trackerName}
              </h1>
              <p className="font-chrome text-headline-sm uppercase tracking-[0.1em] text-primary">
                {waypoint.scripture.citation}
              </p>
              <div className="h-[2px] bg-gold w-full" />
            </header>

            {/* Hero image */}
            <div className="relative h-[280px] md:h-[400px] border border-gold p-2 bg-surface-container-lowest">
              <img className="w-full h-full object-cover" src={waypoint.image} alt={waypoint.trackerName} />
              {waypoint.coord && (
                <div className="absolute right-6 top-6">
                  <Chip style="navy">{waypoint.coord}</Chip>
                </div>
              )}
            </div>

            <ScriptureBlock scripture={waypoint.scripture} />

            {/* Commentary sections or summary fallback */}
            {waypoint.sections && waypoint.sections.length > 0 ? (
              waypoint.sections.map((section) => (
                <div key={section.heading} className="flex flex-col gap-4">
                  <h2 className="font-chrome text-headline-sm uppercase tracking-[0.05em] text-parchment border-b border-gold/40 pb-2 inline-block">
                    {section.heading}
                  </h2>
                  <p className="font-narrative text-body-md leading-[1.6] text-on-surface">{section.body}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col gap-4">
                <p className="font-narrative text-body-lg leading-[1.6] text-on-surface">{waypoint.summary}</p>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="md:col-span-4 flex flex-col gap-6 mt-8 md:mt-0">
            {/* Lexical Note */}
            {waypoint.lexicalNote && (
              <div className="bg-parchment border-t-4 border-gold p-6 flex flex-col gap-3">
                <Chip style="navy">Lexical Note</Chip>
                <div className="flex items-center gap-3">
                  <Icon name="dictionary" className="text-navy" />
                  <h3 className="font-chrome text-headline-sm text-navy">{waypoint.lexicalNote.term}</h3>
                </div>
                <p className="font-narrative text-[16px] leading-[1.6] text-navy">{waypoint.lexicalNote.gloss}</p>
                <Link to={ROUTES.lexicon}>
                  <Button label="Explore Lexicon" style="navy" icon="menu_book" />
                </Link>
              </div>
            )}

            {/* Navigation */}
            <div className="border border-gold/60 p-6 flex flex-col gap-4">
              <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-gold">Navigation</span>
              {prevLink ? (
                <Link to={prevLink} className="flex items-center justify-between border-b border-gold/30 pb-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">
                  <span className="font-narrative text-[16px] text-on-surface-variant">Previous</span>
                  <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.1em] text-parchment">
                    Waypoint {String(prev!.number).padStart(2, '0')} &middot; {prev!.trackerName}
                  </span>
                </Link>
              ) : (
                <span className="flex items-center justify-between border-b border-gold/30 pb-3 opacity-50">
                  <span className="font-narrative text-[16px] text-on-surface-variant">Previous</span>
                  <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.1em] text-parchment">Start of Journey</span>
                </span>
              )}
              <Link to={nextLink} className="flex items-center justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">
                <span className="font-narrative text-[16px] text-on-surface-variant">Next</span>
                <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.1em] text-secondary">
                  {next ? `Waypoint ${String(next.number).padStart(2, '0')} \u00b7 ${next.trackerName}` : 'Journey Complete'}
                </span>
              </Link>
            </div>

            {/* Materials */}
            <div className="border border-gold/60 p-6 flex flex-col gap-3">
              <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-gold">Materials</span>
              {['Facilitator Guide', 'Student Handout', 'Quick Reference Card', 'Print Study'].map((mat) => (
                <button key={mat} type="button" className="flex items-center gap-3 text-left hover:text-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">
                  <Icon name="library_books" size={18} className="text-secondary" />
                  <span className="font-narrative text-[16px] text-on-surface hover:text-secondary">{mat}</span>
                </button>
              ))}
            </div>

            {/* Mark Complete */}
            {user && wpState !== 'complete' && (
              <div className="border border-gold/60 p-6 flex flex-col gap-3">
                <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-gold">Progress</span>
                <Button label="Mark Complete" icon="check_circle" onClick={() => markComplete(waypoint.number)} />
              </div>
            )}
            {user && wpState === 'complete' && (
              <div className="border border-secondary/60 p-6 flex items-center gap-3">
                <Icon name="check_circle" filled className="text-secondary" />
                <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.1em] text-secondary">Completed</span>
              </div>
            )}

            {/* Reflect */}
            <div className="border border-gold/60 p-6 flex flex-col gap-3">
              <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-gold">Reflect</span>
              <p className="font-narrative text-[16px] leading-[1.6] text-on-surface-variant">{waypoint.question}</p>
              <Link to={ROUTES.reflection}>
                <Button label="Open Reflection" style="outline" icon="edit_note" />
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
