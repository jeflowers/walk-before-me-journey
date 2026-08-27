import type { Scripture } from '@app/data/types';

/** Signature component: 2px gold left border, 32px scripture indent, italic EB Garamond 22px, right-aligned citation. */
export function ScriptureBlock({ scripture, sheet = 'navy' }: { scripture: Scripture; sheet?: 'navy' | 'parchment' }) {
  const onParchment = sheet === 'parchment';
  return (
    <blockquote className={`${onParchment ? 'bg-parchment' : 'bg-navy'} border-l-2 border-gold pl-scripture-indent pr-6 py-6`}>
      <p className={`font-narrative italic text-scripture ${onParchment ? 'text-navy' : 'text-parchment'}`}>{scripture.text}</p>
      <p className={`font-chrome text-citation uppercase tracking-[0.1em] text-right mt-4 ${onParchment ? 'text-navy' : 'text-gold'}`}>{scripture.citation}</p>
    </blockquote>
  );
}
