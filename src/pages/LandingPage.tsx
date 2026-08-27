import { Link } from 'react-router-dom';
import { ROUTES } from '@app/app/routes';
import { Button } from '@app/components/Button';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { WaypointCard } from '@app/components/WaypointCard';
import { PSALM_26 } from '@app/data/psalm26';

export function LandingPage() {
  const study = PSALM_26;
  return (
    <>
      <SiteHeader title="Psalm 26" progress={0} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0">
        {/* Hero */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-16 border-b border-gold/40">
          <div className="md:col-span-6 flex flex-col gap-6">
            <span className="inline-block w-fit font-chrome text-label-technical uppercase text-gold border border-gold px-2 py-1">
              Emmaus Road &bull; Psalm 26
            </span>
            <h1 className="font-chrome text-[48px] md:text-[72px] font-bold leading-[1.05] tracking-[-0.02em] uppercase text-secondary">
              Walk<br />Before Me
            </h1>
            <p className="font-chrome text-headline-sm uppercase text-primary">
              A journey through Psalm 26 in seven waypoints
            </p>
            <p className="font-narrative text-body-md text-on-surface-variant">
              Seven waypoints trace the path of integrity from the covenant ground of Genesis 17 to the even place of Psalm 26:12. Each waypoint sets the text first, then asks one question we carry into the week.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link to={ROUTES.studyHome}>
                <Button label="Begin the Journey" />
              </Link>
              <Button label="Facilitator Materials" style="outline" icon="menu_book" />
            </div>
          </div>
          <div className="md:col-span-6 h-[300px] md:h-[420px] border border-gold p-2 bg-surface-container-lowest">
            <img className="w-full h-full object-cover" src={study.heroImage} alt={study.title} />
          </div>
        </section>

        {/* Waypoint cards */}
        {study.waypoints.map((wp, i) => (
          <WaypointCard key={wp.number} waypoint={wp} flip={i % 2 !== 0} />
        ))}
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
