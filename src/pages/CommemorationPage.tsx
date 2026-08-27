import { Link } from 'react-router-dom';
import { ROUTES } from '@app/app/routes';
import { Button } from '@app/components/Button';
import { Chip } from '@app/components/Chip';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26 } from '@app/data/psalm26';

export function CommemorationPage() {
  const study = PSALM_26;

  return (
    <>
      <SiteHeader title="Psalm 26" progress={1} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0 pt-10">
        <div className="md:grid md:grid-cols-12 md:gap-6">
          <div className="hidden md:block md:col-span-2" />
          <div className="md:col-span-8 flex flex-col gap-8">
            {/* Journey Complete block */}
            <div className="bg-navy border-2 border-secondary p-8 md:p-10 text-center flex flex-col gap-3">
              <h1 className="font-chrome text-[48px] md:text-[64px] font-bold leading-[1.05] tracking-[-0.02em] uppercase text-secondary">
                Journey Complete
              </h1>
              <p className="font-chrome text-headline-sm uppercase tracking-[0.05em] text-parchment">
                The Path of Integrity
              </p>
              <p className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mt-2">
                Psalm 26 &middot; Theological Study Concluded
              </p>
            </div>

            {/* Hero image */}
            <div className="h-[240px] md:h-[320px] border border-gold p-2 bg-surface-container-lowest">
              <img className="w-full h-full object-cover" src={study.heroImage} alt="" />
            </div>

            {/* Core mandate scripture card */}
            <div className="bg-surface-container-low border-l-2 border-gold p-6 md:p-8 relative">
              <div className="absolute right-6 top-6">
                <Chip style="outline">Core Mandate</Chip>
              </div>
              <p className="font-scripture italic text-[20px] md:text-[22px] leading-[1.5] text-parchment pr-0 md:pr-40">
                &ldquo;{study.footerQuote.text}&rdquo;
              </p>
              <p className="font-chrome text-citation text-secondary text-right mt-4">
                {study.footerQuote.citation} (KJV)
              </p>
            </div>

            {/* Two-column: waypoint names + summary */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5 border border-outline-variant p-6">
                <h3 className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-secondary border-b border-outline-variant pb-3">
                  The 7 Waypoints
                </h3>
                <ol className="mt-4 flex flex-col gap-2">
                  {study.waypoints.map((wp) => (
                    <li key={wp.number} className="font-chrome text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface">
                      {String(wp.number).padStart(2, '0')}. {wp.trackerName}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="md:col-span-7 bg-navy border-l-4 border-secondary p-6 md:p-8">
                <p className="font-narrative text-[18px] md:text-[20px] leading-[1.6] text-parchment">
                  The walk of integrity begins on covenant ground and ends on level ground. Seven waypoints traced the appeal, the refusal, the ritual, the affection, the petition, the resolve, and the stand. The claim of integrity was never a claim of sinlessness: the cry &ldquo;redeem me&rdquo; stands at its center, and the journey closes in the congregations, where private integrity becomes public praise.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.landing}>
                <Button label="Begin New Journey" icon="arrow_forward" />
              </Link>
              <Link to={ROUTES.community}>
                <Button label="Share Reflection" style="outline" icon="share" />
              </Link>
            </div>
          </div>
          <div className="hidden md:block md:col-span-2" />
        </div>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
