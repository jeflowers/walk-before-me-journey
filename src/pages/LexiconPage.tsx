import { Button } from '@app/components/Button';
import { LexiconCard } from '@app/components/LexiconCard';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26 } from '@app/data/psalm26';

export function LexiconPage() {
  const study = PSALM_26;

  return (
    <>
      <SiteHeader title="Walk Before Me" progress={study.completed / study.total} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0 pt-10">
        {/* Title block */}
        <div className="border-l-4 border-gold pl-6 mb-10">
          <h1 className="font-chrome text-[40px] md:text-[48px] font-bold leading-[1.1] tracking-[-0.02em] uppercase text-secondary">
            Lexicon: Psalm 26
          </h1>
          <p className="font-narrative text-body-md text-on-surface-variant mt-3">
            Key terms and their theological significance for the study of uprightness and divine refinement.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {study.lexicon.map((entry) => (
            <LexiconCard key={entry.term} entry={entry} />
          ))}
        </div>

        {/* Provisional sources note */}
        <div className="mt-10 border border-gold/40 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="font-narrative text-body-md text-on-surface-variant">
            Strong's numbers and 1611 block quotes are provisional until proofread against the physical 1611.
          </p>
          <Button label="Print Glossary" style="outline" icon="library_books" />
        </div>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
