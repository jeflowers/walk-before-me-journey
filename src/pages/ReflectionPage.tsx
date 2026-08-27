import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@app/components/Icon';
import { JournalField } from '@app/components/JournalField';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26 } from '@app/data/psalm26';
import { supabase } from '@app/lib/supabase';

interface ReflectionRow {
  id: string;
  prompt_key: string;
  body: string;
}

export function ReflectionPage() {
  const study = PSALM_26;
  const allPrompts = [...study.reflectionPrompts, study.prayerPrompt];

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savedRows, setSavedRows] = useState<Record<string, ReflectionRow>>({});
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('reflections')
        .select('id, prompt_key, body')
        .eq('study_id', study.id);
      if (data) {
        const map: Record<string, ReflectionRow> = {};
        const draftMap: Record<string, string> = {};
        for (const row of data) {
          map[row.prompt_key] = row;
          draftMap[row.prompt_key] = row.body;
        }
        setSavedRows(map);
        setDrafts(draftMap);
      }
    }
    load();
  }, [study.id]);

  const handleChange = useCallback((key: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async (key: string) => {
    setSavingKeys((prev) => new Set(prev).add(key));
    const body = drafts[key] || '';
    const existing = savedRows[key];

    if (existing) {
      const { data } = await supabase
        .from('reflections')
        .update({ body, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select('id, prompt_key, body')
        .maybeSingle();
      if (data) {
        setSavedRows((prev) => ({ ...prev, [key]: data }));
      }
    } else {
      const { data } = await supabase
        .from('reflections')
        .insert({ study_id: study.id, prompt_key: key, body })
        .select('id, prompt_key, body')
        .maybeSingle();
      if (data) {
        setSavedRows((prev) => ({ ...prev, [key]: data }));
      }
    }
    setSavingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, [drafts, savedRows, study.id]);

  const handleDelete = useCallback(async (key: string) => {
    const existing = savedRows[key];
    if (!existing) return;
    await supabase.from('reflections').delete().eq('id', existing.id);
    setSavedRows((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, [savedRows]);

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

        {/* Note cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {study.reflectionPrompts.map((p) => (
            <JournalField
              key={p.label}
              prompt={p}
              rows={8}
              value={drafts[p.label] || ''}
              onChange={(v) => handleChange(p.label, v)}
              onSave={() => handleSave(p.label)}
              onDelete={() => handleDelete(p.label)}
              saving={savingKeys.has(p.label)}
              saved={!!savedRows[p.label]}
            />
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
              value={drafts[study.prayerPrompt.label] || ''}
              onChange={(e) => handleChange(study.prayerPrompt.label, e.target.value)}
            />
            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={() => handleSave(study.prayerPrompt.label)}
                disabled={savingKeys.has(study.prayerPrompt.label)}
                className="inline-flex items-center gap-2 font-chrome text-[12px] font-bold uppercase tracking-[0.1em] px-4 py-2 bg-navy text-parchment border border-gold hover:bg-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary disabled:opacity-50"
              >
                <Icon name="check" size={16} />
                {savingKeys.has(study.prayerPrompt.label) ? 'Saving...' : savedRows[study.prayerPrompt.label] ? 'Update' : 'Save'}
              </button>
              {savedRows[study.prayerPrompt.label] && (
                <button
                  type="button"
                  onClick={() => handleDelete(study.prayerPrompt.label)}
                  className="inline-flex items-center gap-2 font-chrome text-[12px] font-bold uppercase tracking-[0.1em] px-4 py-2 border border-navy/40 text-navy hover:border-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
                >
                  <Icon name="delete" size={16} />
                  Delete
                </button>
              )}
              {savedRows[study.prayerPrompt.label] && (
                <span className="ml-auto font-chrome text-[11px] uppercase tracking-[0.1em] text-navy/60 flex items-center gap-1">
                  <Icon name="cloud_done" size={14} />
                  Saved
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
