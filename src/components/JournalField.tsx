import { useState } from 'react';
import type { ReflectionPrompt } from '@app/data/types';
import { Chip } from '@app/components/Chip';
import { Icon } from '@app/components/Icon';

interface JournalFieldProps {
  prompt: ReflectionPrompt;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  saving?: boolean;
  saved?: boolean;
}

export function JournalField({ prompt, rows = 8, value, onChange, onSave, onDelete, saving, saved }: JournalFieldProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showUpdated, setShowUpdated] = useState(false);

  function handleSave() {
    onSave();
    if (saved) {
      setShowUpdated(true);
      setTimeout(() => setShowUpdated(false), 2000);
    }
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setConfirmDelete(false);
    onDelete();
  }

  function cancelDelete() {
    setConfirmDelete(false);
  }

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
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {confirmDelete ? (
        <div className="flex items-center gap-3 mt-1 border border-red-400/50 bg-red-50 p-3">
          <Icon name="warning" size={18} className="text-red-600" />
          <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.05em] text-red-700">Delete this entry?</span>
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto inline-flex items-center gap-2 font-chrome text-[12px] font-bold uppercase tracking-[0.1em] px-4 py-2 bg-red-600 text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
          >
            <Icon name="delete" size={16} />
            Confirm
          </button>
          <button
            type="button"
            onClick={cancelDelete}
            className="inline-flex items-center gap-2 font-chrome text-[12px] font-bold uppercase tracking-[0.1em] px-4 py-2 border border-navy/40 text-navy hover:border-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !value.trim()}
            className="inline-flex items-center gap-2 font-chrome text-[12px] font-bold uppercase tracking-[0.1em] px-4 py-2 bg-navy text-parchment border border-gold hover:bg-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary disabled:opacity-50"
          >
            <Icon name="check" size={16} />
            {saving ? 'Saving...' : saved ? 'Update' : 'Save'}
          </button>
          {saved && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 font-chrome text-[12px] font-bold uppercase tracking-[0.1em] px-4 py-2 border border-navy/40 text-navy hover:border-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
            >
              <Icon name="delete" size={16} />
              Delete
            </button>
          )}
          {showUpdated && (
            <span className="ml-auto font-chrome text-[11px] uppercase tracking-[0.1em] text-green-700 flex items-center gap-1">
              <Icon name="check_circle" size={14} />
              Updated
            </span>
          )}
          {!showUpdated && saved && (
            <span className="ml-auto font-chrome text-[11px] uppercase tracking-[0.1em] text-navy/60 flex items-center gap-1">
              <Icon name="cloud_done" size={14} />
              Saved
            </span>
          )}
        </div>
      )}
    </div>
  );
}
