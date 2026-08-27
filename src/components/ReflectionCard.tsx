import type { CommunityReflection } from '@app/data/types';
import { Chip } from '@app/components/Chip';
import { Icon } from '@app/components/Icon';

interface ReflectionCardProps {
  reflection: CommunityReflection;
}

/** Community feed reflection card: parchment background, avatar row, quote, scripture sidebar, engagement actions. */
export function ReflectionCard({ reflection }: ReflectionCardProps) {
  return (
    <article className="bg-parchment border border-navy p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-chrome text-label-technical uppercase text-navy">{reflection.track}</span>
        <Chip style="outline">{reflection.tag}</Chip>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-navy">
          {reflection.avatar ? (
            <img className="w-full h-full object-cover" src={reflection.avatar} alt={`${reflection.author} avatar`} />
          ) : (
            <div className="w-full h-full bg-navy flex items-center justify-center">
              <Icon name="person" className="text-gold" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-chrome text-label-technical uppercase text-navy">{reflection.author}</span>
          <span className="font-narrative text-[14px] text-navy/70">{reflection.when}</span>
        </div>
      </div>
      <p className="font-narrative text-body-lg leading-[1.6] text-navy">{reflection.quote}</p>
      <div className="border-l-2 border-gold pl-4">
        <p className="font-narrative italic text-[18px] leading-[1.5] text-navy">{reflection.verse}</p>
        <p className="font-chrome text-[12px] font-bold uppercase tracking-[0.1em] text-navy text-right mt-2">&mdash; {reflection.citation}</p>
      </div>
      <div className="flex items-center gap-6 border-t border-navy/30 pt-4">
        <span className="flex items-center gap-1 text-navy"><Icon name="favorite" size={18} /><span className="font-chrome text-[12px] font-bold">{reflection.likes}</span></span>
        <span className="flex items-center gap-1 text-navy"><Icon name="chat_bubble" size={18} /><span className="font-chrome text-[12px] font-bold">{reflection.comments}</span></span>
        <span className="flex items-center gap-1 text-navy ml-auto"><Icon name="bookmark" size={18} /><span className="font-chrome text-label-technical uppercase">Save</span></span>
      </div>
    </article>
  );
}
