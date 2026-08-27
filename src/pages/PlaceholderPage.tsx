import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26 } from '@app/data/psalm26';

/** Stand-in for pages not yet built. Bolt: replace this with the real page using the referenced HTML as the layout spec. */
export function PlaceholderPage({ name, reference }: { name: string; reference: string }) {
  return (
    <>
      <SiteHeader title={name} progress={PSALM_26.completed / PSALM_26.total} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0 py-16">
        <p className="font-chrome text-label-technical uppercase text-gold">Not built yet</p>
        <h1 className="font-chrome text-headline-md text-parchment mt-2">{name}</h1>
        <p className="text-body-md text-on-surface-variant mt-4">Build this page from <code className="font-chrome text-[14px] text-secondary">{reference}</code> (desktop) and the matching file in <code className="font-chrome text-[14px] text-secondary">reference/mobile/</code>.</p>
      </main>
      <SiteFooter quote={PSALM_26.footerQuote} />
    </>
  );
}
