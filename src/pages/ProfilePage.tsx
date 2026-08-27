import { Button } from '@app/components/Button';
import { Chip } from '@app/components/Chip';
import { Icon } from '@app/components/Icon';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26, PROFILE } from '@app/data/psalm26';

export function ProfilePage() {
  const study = PSALM_26;

  return (
    <>
      <SiteHeader title="Sacred Archive" progress={study.completed / study.total} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Identity card */}
          <aside className="md:col-span-4">
            <div className="border-t-4 border-secondary bg-surface-container-low p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-32 h-32 border border-gold p-1">
                <div className="w-full h-full overflow-hidden">
                  <img className="w-full h-full object-cover" src={PROFILE.avatar} alt="" />
                </div>
              </div>
              <h1 className="font-chrome text-[32px] font-semibold uppercase tracking-[0.05em] text-primary">{PROFILE.name}</h1>
              <Chip style="outline">{PROFILE.rank}</Chip>
              <p className="font-narrative text-[16px] text-on-surface-variant">Two journeys complete. Twelve reflections archived.</p>
              <div className="flex gap-3 mt-2">
                <Button label="Settings" style="outline" icon="settings" />
              </div>
            </div>
          </aside>

          {/* Right column */}
          <section className="md:col-span-8 flex flex-col gap-6">
            {/* Journey Progress */}
            <div className="border border-secondary bg-surface-container-low p-6">
              <div className="flex items-center justify-between border-b border-secondary pb-3">
                <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-secondary">Journey Progress</span>
                <Icon name="timeline" className="text-secondary" />
              </div>
              {PROFILE.progress.map((p) => (
                <div key={p.study} className="mt-5">
                  <div className="flex justify-between">
                    <span className="font-chrome text-[14px] font-bold uppercase tracking-[0.05em] text-on-surface">{p.study}</span>
                    <span className="font-chrome text-[12px] font-bold text-secondary">{p.percent}%</span>
                  </div>
                  <div className="h-[2px] bg-outline-variant mt-2">
                    <div className="h-[2px] bg-secondary" style={{ width: `${p.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Two-col grid: commemorations + reflections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earned Commemorations */}
              <div className="border border-secondary bg-surface-container-low p-6">
                <div className="flex items-center justify-between border-b border-secondary pb-3">
                  <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-secondary">Earned Commemorations</span>
                  <Icon name="military_tech" className="text-secondary" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-5">
                  {PROFILE.commemorations.map((c) => (
                    <div key={c.title} className="border border-secondary p-5 flex flex-col items-center gap-2 text-center">
                      <Icon name={c.icon} filled size={36} className="text-secondary" />
                      <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.05em] text-on-surface">{c.title}</span>
                      <span className="font-chrome text-[10px] font-bold uppercase tracking-[0.15em] text-secondary">{c.study}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Reflections */}
              <div className="border border-secondary bg-surface-container-low p-6">
                <div className="flex items-center justify-between border-b border-secondary pb-3">
                  <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-secondary">Personal Reflections</span>
                  <Icon name="book_4" className="text-secondary" />
                </div>
                {PROFILE.reflections.map((r) => (
                  <div key={r.title} className="border-l-2 border-secondary pl-4 mt-5">
                    <span className="font-chrome text-[10px] font-bold uppercase tracking-[0.15em] text-secondary">{r.date}</span>
                    <h3 className="font-chrome text-[14px] font-bold uppercase text-primary mt-1">{r.title}</h3>
                    <p className="font-narrative italic text-[14px] leading-[1.5] text-on-surface-variant mt-1">{r.excerpt}</p>
                  </div>
                ))}
                <div className="mt-5">
                  <Button label="New Entry" style="outline" icon="add" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
