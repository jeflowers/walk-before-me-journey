import type { LexiconEntry } from '@app/data/types';

interface LexiconCardProps {
  entry: LexiconEntry;
}

/** Lexicon term card: navy header bar with term and language badge, parchment body with definition and significance. */
export function LexiconCard({ entry }: LexiconCardProps) {
  return (
    <div className="bg-parchment border border-navy flex flex-col">
      <div className="bg-navy px-6 py-3 flex items-center justify-between">
        <h3 className="font-chrome text-headline-sm text-parchment">{entry.term}</h3>
        <span className="font-chrome text-label-technical uppercase text-gold">{entry.language}</span>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div>
          <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-gold">Transliteration</span>
          <p className="font-narrative text-body-md font-bold text-navy mt-1">{entry.transliteration}</p>
        </div>
        <div>
          <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-gold">Definition</span>
          <p className="font-narrative text-body-md leading-[1.6] text-navy mt-1">{entry.definition}</p>
        </div>
        <div className="border-l-2 border-gold pl-4">
          <p className="font-narrative italic text-body-md leading-[1.6] text-navy">{entry.significance}</p>
        </div>
      </div>
    </div>
  );
}
