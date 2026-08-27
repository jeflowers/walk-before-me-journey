import type { ReflectionPrompt } from '@app/data/types';
import { Chip } from '@app/components/Chip';

interface JournalFieldProps {
  prompt: ReflectionPrompt;
  rows?: number;
}

/** Parchment journal card with Chip label, prompt text, and lined textarea. */
export function JournalField({ prompt, rows = 8 }: JournalFieldProps) {
  return (
    <div className="bg-parchment border-t-4 border-gold p-6 flex flex-col gap-4">
      <Chip style="navy">{prompt.label}</Chip>
      <label className="font-chrome text-headline-sm uppercase text-navy leading-[1.4]">
        {prompt.prompt}
      </label>
      <textarea
        className="journal-lines w-full bg-transparent border border-navy p-4 font-narrative text-body-md italic text-navy placeholder:text-navy/60 focus:border-2 focus:outline-none"
        rows={rows}
        placeholder={prompt.placeholder}
      />
    </div>
  );
}
