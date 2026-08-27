import { useState } from 'react';
import { Button } from '@app/components/Button';
import { Icon } from '@app/components/Icon';
import { ReflectionCard } from '@app/components/ReflectionCard';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26, COMMUNITY_REFLECTIONS } from '@app/data/psalm26';

const FILTERS = ['All Tracks', 'Zechariah 4', 'Psalm 26', 'Romans 8'] as const;
type Filter = (typeof FILTERS)[number];

export function CommunityPage() {
  const [active, setActive] = useState<Filter>('All Tracks');

  const filtered = active === 'All Tracks'
    ? COMMUNITY_REFLECTIONS
    : COMMUNITY_REFLECTIONS.filter((r) => r.track.includes(active));

  return (
    <>
      <SiteHeader title="Walk Before Me" progress={PSALM_26.completed / PSALM_26.total} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0 pt-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-gold/40 pb-6 gap-4">
          <div>
            <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.2em] text-gold">Modern Artifact</span>
            <h1 className="font-chrome text-[48px] md:text-[56px] font-bold leading-[1.1] tracking-[-0.02em] uppercase text-parchment mt-2">Community</h1>
            <p className="font-narrative text-body-md text-on-surface-variant mt-2">Shared reflections from the current theological study tracks.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 border border-gold px-3 py-2">
              <Icon name="search" size={18} className="text-gold" />
              <span className="font-narrative text-[16px] text-on-surface-variant">Search reflections</span>
            </div>
            <Button label="Share Reflection" icon="edit_note" />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-3 mt-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={`font-chrome text-[12px] font-bold uppercase tracking-[0.1em] px-2 py-1 ${
                f === active
                  ? 'bg-secondary text-navy'
                  : 'border border-gold text-gold'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {filtered.map((r, i) => (
            <ReflectionCard key={i} reflection={r} />
          ))}

          {/* Empty-slot invitation */}
          <div className="border border-gold/40 p-8 flex flex-col items-center justify-center gap-4 text-center">
            <Icon name="group" size={40} className="text-gold" />
            <p className="font-narrative text-body-md text-on-surface-variant">
              Filter by track to see reflections from your study group. New entries appear here after review.
            </p>
            <Button label="Share Your Reflection" style="outline" icon="edit_note" />
          </div>
        </div>
      </main>
      <SiteFooter quote={PSALM_26.footerQuote} />
    </>
  );
}
