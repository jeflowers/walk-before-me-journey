import type { Scripture } from '@app/data/types';

/** Zechariah 4:6 running footer (house rule: on every study screen). */
export function SiteFooter({ quote }: { quote: Scripture }) {
  return (
    <footer className="w-full border-t border-outline-variant mt-16 pb-24 md:pb-0">
      <div className="max-w-container mx-auto px-margin-mobile md:px-0 py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7">
          <p className="font-narrative italic text-body-md text-on-surface-variant">{quote.text}</p>
          <p className="font-chrome text-citation uppercase tracking-[0.1em] text-gold mt-2">{quote.citation}</p>
        </div>
        <div className="md:col-span-5 flex md:justify-end gap-8 whitespace-nowrap">
          {['About the Journey', 'Historical Context', 'Privacy'].map((label) => (
            <a key={label} href="#" className="font-chrome text-label-technical uppercase text-secondary">{label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
