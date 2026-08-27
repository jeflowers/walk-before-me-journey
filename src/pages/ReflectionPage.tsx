import { Button } from '@app/components/Button';
import { Icon } from '@app/components/Icon';
import { JournalField } from '@app/components/JournalField';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26 } from '@app/data/psalm26';

export function ReflectionPage() {
  const study = PSALM_26;

  return (
    <>
      <SiteHeader title="Walk Before Me" progress={study.completed / study.total} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0 pt-10">
        {/* Title block */}
        <div className="border-l-4 border-gold pl-6 mb-10">
          <h1 className="font-chrome text-[40px] md:text-[48px] font-bold leading-[1.1] tracking-[-0.02em] uppercase text-secondary">
            Personal Reflection: The Path of Integrity
          </h1>
          <p className="font-narrative text-body-md text-on-surface-variant mt-3">
            Three prompts for the week. Entries save to your Sacred Archive.
          </p>
        </div>

        {/* Prompt cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {study.reflectionPrompts.map((p) => (
            <JournalField key={p.label} prompt={p} rows={8} />
          ))}
        </div>

        {/* Prayer field full width */}
        <div className="mt-6">
          <div className="bg-parchment border-t-4 border-gold p-6 flex flex-col gap-4">
            <span className="inline-block w-fit font-chrome text-[12px] font-bold uppercase tracking-[0.1em] text-parchment bg-navy px-2 py-1">
              {study.prayerPrompt.label}
            </span>
            <div className="flex items-center gap-3">
              <Icon name="local_fire_department" className="text-gold" />
              <label className="font-chrome text-headline-sm uppercase text-navy">
                {study.prayerPrompt.prompt}
              </label>
            </div>
            <textarea
              className="journal-lines w-full bg-transparent border border-navy p-4 font-narrative text-body-md italic text-navy placeholder:text-navy/60 focus:border-2 focus:outline-none"
              rows={4}
              placeholder={study.prayerPrompt.placeholder}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button label="Save Draft" style="outline" icon="bookmark" />
          <Button label="Save Reflection" icon="check" />
        </div>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
