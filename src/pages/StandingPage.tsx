import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { WaymarkBadge } from '@app/components/WaymarkBadge';
import { TrackMeter } from '@app/components/TrackMeter';
import { Icon } from '@app/components/Icon';
import { RANK_IDS } from '@app/data/enums';
import { RANK_LABELS, NEHUSHTAN_CLAUSE } from '@app/data/standing';
import { PSALM_26 } from '@app/data/psalm26';
import { useStanding } from '@app/lib/useStanding';

const DIVISION_LABELS: Record<string, string> = {
  torah: 'Torah',
  neviim: "Nevi'im",
  ketuvim: 'Ketuvim',
  fulfillment: 'Fulfillment',
};

export function StandingPage() {
  const { standing, progress } = useStanding();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SiteHeader title="Waymark Standing" />
      <main className="flex-1 w-full max-w-container mx-auto px-margin-mobile py-8 md:py-12">
        {/* Current Rank */}
        <section className="text-center mb-10">
          <p className="font-chrome text-[11px] uppercase tracking-[0.12em] text-parchment/60 mb-2">Current Standing</p>
          <h1 className="font-chrome text-[36px] font-semibold uppercase tracking-[0.05em] text-gold mb-3">
            {standing.currentRankLabel}
          </h1>
          {standing.nextRankLabel && (
            <p className="font-chrome text-[13px] text-parchment/70">
              {standing.requirementsMet} of {standing.requirementsTotal} met toward{' '}
              <span className="text-secondary">{standing.nextRankLabel}</span>
            </p>
          )}
        </section>

        {/* Rank Ladder */}
        <section className="mb-10">
          <h2 className="font-chrome text-[13px] font-bold uppercase tracking-[0.08em] text-parchment/60 mb-4">The Five Waymarks</h2>
          <div className="flex flex-col gap-2">
            {RANK_IDS.map((id, i) => {
              const isCurrent = id === standing.currentRank;
              const isEarned = i <= RANK_IDS.indexOf(standing.currentRank);
              return (
                <div
                  key={id}
                  className={`flex items-center gap-3 p-3 border ${isCurrent ? 'border-gold bg-navy/40' : isEarned ? 'border-outline-variant' : 'border-outline-variant/30'}`}
                >
                  <Icon
                    name={isEarned ? 'check_circle' : 'radio_button_unchecked'}
                    size={18}
                    className={isEarned ? 'text-secondary' : 'text-parchment/30'}
                    filled={isEarned}
                  />
                  <span className={`font-chrome text-[13px] uppercase tracking-[0.08em] ${isCurrent ? 'text-gold font-bold' : isEarned ? 'text-parchment' : 'text-parchment/40'}`}>
                    {RANK_LABELS[id]}
                  </span>
                  {isCurrent && <span className="ml-auto font-chrome text-[10px] uppercase tracking-[0.1em] text-secondary">Current</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Track Progress */}
        {standing.tracks.length > 0 && (
          <section className="mb-10">
            <h2 className="font-chrome text-[13px] font-bold uppercase tracking-[0.08em] text-parchment/60 mb-4">
              Progress Toward {standing.nextRankLabel}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {standing.tracks.map((track) => (
                <TrackMeter key={track.track} track={track} />
              ))}
            </div>
          </section>
        )}

        {/* Canon Breadth */}
        <section className="mb-10">
          <h2 className="font-chrome text-[13px] font-bold uppercase tracking-[0.08em] text-parchment/60 mb-4">Canon Breadth</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['torah', 'neviim', 'ketuvim', 'fulfillment'] as const).map((div) => {
              const studied = progress.divisionsStudied.includes(div);
              return (
                <div
                  key={div}
                  className={`p-3 border text-center ${studied ? 'border-secondary bg-navy/30' : 'border-outline-variant/30'}`}
                >
                  <Icon
                    name={studied ? 'menu_book' : 'lock'}
                    size={20}
                    className={studied ? 'text-secondary' : 'text-parchment/30'}
                    filled={studied}
                  />
                  <p className={`font-chrome text-[11px] uppercase tracking-[0.08em] mt-1 ${studied ? 'text-parchment' : 'text-parchment/40'}`}>
                    {DIVISION_LABELS[div]}
                  </p>
                </div>
              );
            })}
          </div>
          {standing.canonBreadth.required > 0 && (
            <p className="font-chrome text-[11px] text-parchment/50 mt-2">
              {standing.canonBreadth.current} of {standing.canonBreadth.required} divisions required for next rank
            </p>
          )}
        </section>

        {/* Nehushtan Clause */}
        <section className="border border-outline-variant/50 p-4 bg-navy/20">
          <div className="flex items-start gap-3">
            <Icon name="visibility_off" size={20} className="text-parchment/40 shrink-0 mt-0.5" />
            <p className="font-narrative text-[14px] leading-relaxed text-parchment/60 italic">
              {NEHUSHTAN_CLAUSE}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter quote={PSALM_26.footerQuote} />
    </div>
  );
}
