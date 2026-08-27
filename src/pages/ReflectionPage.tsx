import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@app/components/Icon';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';

import { PSALM_26 } from '@app/data/psalm26';
import { supabase } from '@app/lib/supabase';
import { useAuth } from '@app/lib/auth';
import { ROUTES } from '@app/app/routes';

type EntryType = 'note' | 'prayer' | 'request';
type Visibility = 'private' | 'public';
type Status = 'praying' | 'answered';
type FilterTab = 'all' | 'notes' | 'prayers' | 'requests';

interface JournalEntry {
  id: string;
  entry_type: EntryType;
  body: string;
  visibility: Visibility;
  status: Status | null;
  prompt_source: string | null;
  created_at: string;
}

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'notes', label: 'Notes' },
  { key: 'prayers', label: 'Prayers' },
  { key: 'requests', label: 'Requests' },
];

const TYPE_META: Record<EntryType, { icon: string; label: string }> = {
  note: { icon: 'edit_note', label: 'Note' },
  prayer: { icon: 'local_fire_department', label: 'Prayer' },
  request: { icon: 'volunteer_activism', label: 'Request' },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function ReflectionPage() {
  const study = PSALM_26;
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [composerType, setComposerType] = useState<EntryType>('note');
  const [composerBody, setComposerBody] = useState('');
  const [composerVisibility, setComposerVisibility] = useState<Visibility>('private');
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const { data } = await supabase
        .from('journal_entries')
        .select('id, entry_type, body, visibility, status, prompt_source, created_at')
        .eq('study_id', study.id)
        .order('created_at', { ascending: false });
      if (data) setEntries(data as JournalEntry[]);
    }
    load();
  }, [study.id, user]);

  const handleSave = useCallback(async () => {
    if (!user) { setShowSignIn(true); return; }
    if (!composerBody.trim()) return;
    setSaving(true);
    const payload: Record<string, unknown> = {
      study_id: study.id,
      entry_type: composerType,
      body: composerBody.trim(),
      visibility: composerType === 'prayer' ? 'private' : composerVisibility,
      status: composerType === 'request' ? 'praying' : null,
    };
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(payload)
      .select('id, entry_type, body, visibility, status, prompt_source, created_at')
      .maybeSingle();
    if (!error && data) {
      setEntries((prev) => [data as JournalEntry, ...prev]);
      setComposerBody('');
    }
    setSaving(false);
  }, [user, composerBody, composerType, composerVisibility, study.id]);

  const handleDelete = useCallback(async (id: string) => {
    await supabase.from('journal_entries').delete().eq('id', id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleToggleStatus = useCallback(async (entry: JournalEntry) => {
    const newStatus: Status = entry.status === 'praying' ? 'answered' : 'praying';
    await supabase.from('journal_entries').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', entry.id);
    setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, status: newStatus } : e));
  }, []);

  const handleEditSave = useCallback(async (id: string) => {
    if (!editBody.trim()) return;
    await supabase.from('journal_entries').update({ body: editBody.trim(), updated_at: new Date().toISOString() }).eq('id', id);
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, body: editBody.trim() } : e));
    setEditingId(null);
  }, [editBody]);

  const handlePromptTap = useCallback((prompt: string) => {
    setComposerType('note');
    setComposerBody(prompt + '\n\n');
  }, []);

  const filtered = activeTab === 'all'
    ? entries
    : entries.filter((e) => {
        if (activeTab === 'notes') return e.entry_type === 'note';
        if (activeTab === 'prayers') return e.entry_type === 'prayer';
        return e.entry_type === 'request';
      });

  if (authLoading) {
    return (
      <>
        <SiteHeader title="Walk Before Me" progress={study.completed / study.total} />
        <main className="max-w-container mx-auto px-margin-mobile md:px-0 pt-10 text-center">
          <p className="font-narrative text-body-lg text-on-surface-variant">Loading...</p>
        </main>
        <SiteFooter quote={study.footerQuote} />
      </>
    );
  }

  return (
    <>
      <SiteHeader title="Walk Before Me" progress={study.completed / study.total} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0 pt-8 pb-24 md:pb-10">
        {/* Page title */}
        <div className="border-l-4 border-gold pl-6 mb-8">
          <h1 className="font-chrome text-[32px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.02em] uppercase text-secondary">
            Notes, Prayers &amp; Requests
          </h1>
          <p className="font-narrative text-body-md text-on-surface-variant mt-2">
            A unified journal for your walk through {study.reference}.
          </p>
        </div>

        {/* Sign-in banner */}
        {!user && showSignIn && (
          <div className="mb-6 bg-parchment border border-gold p-4 flex items-center gap-4">
            <Icon name="lock" className="text-gold" />
            <p className="font-narrative text-body-md text-navy flex-1">Sign in to save entries to your Sacred Archive.</p>
            <Link to={ROUTES.auth}><button className="font-chrome text-[12px] font-bold uppercase tracking-[0.1em] px-4 py-2 bg-navy text-parchment border border-gold">Sign In</button></Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
          {/* Main column */}
          <div className="flex flex-col gap-6">
            {/* Composer */}
            <section className="border border-outline-variant bg-surface-container-low p-5 md:p-6">
              {/* Type tabs */}
              <div className="flex gap-2 mb-4">
                {(['note', 'prayer', 'request'] as EntryType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setComposerType(t)}
                    className={`font-chrome text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 border ${composerType === t ? 'bg-navy text-parchment border-gold' : 'bg-transparent text-on-surface-variant border-outline-variant hover:border-secondary'}`}
                  >
                    {TYPE_META[t].label}
                  </button>
                ))}
              </div>

              <textarea
                className="w-full bg-transparent border border-outline-variant p-4 font-narrative text-body-md text-on-surface placeholder:text-outline-variant focus:border-secondary focus:outline-none resize-none"
                rows={3}
                placeholder={composerType === 'note' ? 'Today I noticed...' : composerType === 'prayer' ? 'Lord, I bring before you...' : 'I am asking for prayer about...'}
                value={composerBody}
                onChange={(e) => setComposerBody(e.target.value)}
              />

              <div className="flex items-center justify-between mt-4 gap-3">
                {/* Visibility (only for requests) */}
                {composerType === 'request' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setComposerVisibility('private')}
                      className={`font-chrome text-[10px] uppercase tracking-[0.1em] px-2 py-1 border ${composerVisibility === 'private' ? 'bg-navy text-parchment border-gold' : 'border-outline-variant text-on-surface-variant'}`}
                    >Private</button>
                    <button
                      onClick={() => setComposerVisibility('public')}
                      className={`font-chrome text-[10px] uppercase tracking-[0.1em] px-2 py-1 border ${composerVisibility === 'public' ? 'bg-navy text-parchment border-gold' : 'border-outline-variant text-on-surface-variant'}`}
                    >Group</button>
                  </div>
                )}
                {composerType === 'prayer' && (
                  <span className="font-chrome text-[10px] uppercase tracking-[0.1em] text-on-surface-variant flex items-center gap-1">
                    <Icon name="lock" size={14} /> Always private
                  </span>
                )}
                {composerType === 'note' && <span />}

                <button
                  onClick={handleSave}
                  disabled={saving || !composerBody.trim()}
                  className="font-chrome text-[12px] font-bold uppercase tracking-[0.1em] px-5 py-2 bg-navy text-parchment border border-gold hover:bg-navy/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? 'Saving...' : 'Save'}
                  <Icon name="arrow_forward" size={16} />
                </button>
              </div>
            </section>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`font-chrome text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 border ${activeTab === tab.key ? 'bg-navy text-parchment border-gold' : 'bg-transparent text-on-surface-variant border-outline-variant hover:border-secondary'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Feed */}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Icon name="draft" size={40} className="text-outline-variant mx-auto" />
                <p className="font-narrative text-body-md text-on-surface-variant mt-4">
                  {user ? 'No entries yet. Use the composer above to begin.' : 'Sign in to view and create entries.'}
                </p>
              </div>
            )}

            <ul className="flex flex-col gap-3">
              {filtered.map((entry) => (
                <li key={entry.id} className="border border-outline-variant bg-surface-container-low p-4 md:p-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 font-chrome text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 border ${entry.entry_type === 'prayer' ? 'border-gold text-gold' : entry.entry_type === 'request' ? 'border-secondary text-secondary' : 'border-outline-variant text-on-surface-variant'}`}>
                      {TYPE_META[entry.entry_type].label}
                    </span>
                    {entry.entry_type === 'request' && entry.status && (
                      <button
                        onClick={() => handleToggleStatus(entry)}
                        className={`inline-flex items-center gap-1 font-chrome text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 border ${entry.status === 'answered' ? 'bg-secondary/10 border-secondary text-secondary' : 'border-outline-variant text-on-surface-variant hover:border-secondary'}`}
                      >
                        {entry.status === 'answered' && <Icon name="check" size={12} />}
                        {entry.status}
                      </button>
                    )}
                    <span className={`font-chrome text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 border ${entry.visibility === 'public' ? 'border-gold text-gold' : 'border-outline-variant text-on-surface-variant'}`}>
                      {entry.visibility}
                    </span>
                    <span className="ml-auto font-chrome text-[10px] text-on-surface-variant">{relativeTime(entry.created_at)}</span>
                  </div>

                  {editingId === entry.id ? (
                    <div className="mt-3">
                      <textarea
                        className="w-full bg-transparent border border-secondary p-3 font-narrative text-body-md text-on-surface focus:outline-none resize-none"
                        rows={3}
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleEditSave(entry.id)} className="font-chrome text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1 bg-navy text-parchment border border-gold">Save</button>
                        <button onClick={() => setEditingId(null)} className="font-chrome text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1 border border-outline-variant text-on-surface-variant">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="font-narrative text-body-md text-on-surface mt-3 whitespace-pre-wrap">{entry.body}</p>
                  )}

                  {entry.prompt_source && (
                    <p className="font-chrome text-[10px] uppercase tracking-[0.1em] text-on-surface-variant mt-2 italic">from this week's prompt</p>
                  )}

                  {editingId !== entry.id && (
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-outline-variant">
                      <button onClick={() => { setEditingId(entry.id); setEditBody(entry.body); }} className="font-chrome text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-secondary flex items-center gap-1">
                        <Icon name="edit" size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(entry.id)} className="font-chrome text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant hover:text-red-600 flex items-center gap-1">
                        <Icon name="delete" size={14} /> Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Right rail: This week's prompts */}
          <aside className="hidden md:block">
            <div className="border border-outline-variant bg-surface-container-low p-5 sticky top-24">
              <h2 className="font-chrome text-[11px] font-bold uppercase tracking-[0.15em] text-secondary mb-4">This Week — {study.reference}</h2>
              <ul className="flex flex-col gap-3">
                {study.reflectionPrompts.map((p) => (
                  <li key={p.label}>
                    <button
                      onClick={() => handlePromptTap(p.prompt)}
                      className="w-full text-left border border-dashed border-outline-variant p-3 hover:border-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary group"
                    >
                      <span className="font-narrative text-[14px] text-on-surface-variant group-hover:text-on-surface">{p.prompt}</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => handlePromptTap(study.prayerPrompt.prompt)}
                    className="w-full text-left border border-dashed border-gold/50 p-3 hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary group"
                  >
                    <span className="flex items-center gap-2">
                      <Icon name="local_fire_department" size={14} className="text-gold" />
                      <span className="font-narrative text-[14px] text-on-surface-variant group-hover:text-on-surface">{study.prayerPrompt.prompt}</span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Mobile prompts banner */}
        <div className="md:hidden mt-6 border border-outline-variant bg-surface-container-low p-4">
          <h2 className="font-chrome text-[11px] font-bold uppercase tracking-[0.15em] text-secondary mb-3">This Week's Prompts — Tap to Start</h2>
          <div className="flex flex-col gap-2">
            {study.reflectionPrompts.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePromptTap(p.prompt)}
                className="text-left border border-dashed border-outline-variant p-3 hover:border-secondary"
              >
                <span className="font-narrative text-[13px] text-on-surface-variant">{p.prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
