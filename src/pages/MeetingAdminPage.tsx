import { useState, useEffect } from 'react';
import { Icon } from '@app/components/Icon';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26 } from '@app/data/psalm26';
import { useAuth } from '@app/lib/auth';
import { useRole } from '@app/lib/useRole';
import { supabase } from '@app/lib/supabase';

interface MeetingForm {
  slug: string;
  join_url: string;
  meeting_id: string;
  passcode: string;
  dial_in: string;
  ics_url: string;
  note: string;
}

const EMPTY_FORM: MeetingForm = { slug: '', join_url: '', meeting_id: '', passcode: '', dial_in: '', ics_url: '', note: '' };
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function MeetingAdminPage() {
  const study = PSALM_26;
  const { user, loading: authLoading } = useAuth();
  const { role, approved, loading: roleLoading } = useRole();

  const [form, setForm] = useState<MeetingForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [pwdNotice, setPwdNotice] = useState(false);

  const isAdmin = role === 'admin' && approved;
  const loading = authLoading || roleLoading;

  useEffect(() => {
    if (!user || !isAdmin) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('meetings')
        .select('slug, join_url, meeting_id, passcode, dial_in, ics_url, note')
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setForm({
          slug: data.slug ?? '',
          join_url: data.join_url ?? '',
          meeting_id: data.meeting_id ?? '',
          passcode: data.passcode ?? '',
          dial_in: data.dial_in ?? '',
          ics_url: data.ics_url ?? '',
          note: data.note ?? '',
        });
      }
    })();
    return () => { cancelled = true; };
  }, [user, isAdmin]);

  function handleChange(field: keyof MeetingForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setFeedback('');
    if (field === 'join_url' && value && !value.includes('pwd=')) {
      setPwdNotice(true);
    } else if (field === 'join_url') {
      setPwdNotice(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFeedback('');

    if (!form.slug || !SLUG_RE.test(form.slug)) {
      setFeedback('Slug must be lowercase letters, numbers and hyphens only.');
      return;
    }
    if (form.join_url && !form.join_url.endsWith('zoom.us') && !new URL(form.join_url).hostname.endsWith('zoom.us')) {
      setFeedback('Join URL must be a zoom.us link.');
      return;
    }

    setSaving(true);
    const payload = {
      slug: form.slug,
      join_url: form.join_url || null,
      meeting_id: form.meeting_id || null,
      passcode: form.passcode || null,
      dial_in: form.dial_in || null,
      ics_url: form.ics_url || null,
      note: form.note || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('meetings')
      .upsert(payload, { onConflict: 'slug' });

    setSaving(false);
    if (error) {
      setFeedback('Something went wrong while saving. Please try again.');
    } else {
      setFeedback('Meeting saved successfully.');
    }
  }

  if (loading) {
    return (
      <>
        <SiteHeader title="Admin" progress={0} />
        <main className="max-w-container mx-auto px-margin-mobile md:px-0 py-16 text-center">
          <p className="font-narrative text-body-md text-on-surface-variant">Loading...</p>
        </main>
        <SiteFooter quote={study.footerQuote} />
      </>
    );
  }

  // UX guard — not security; RLS enforces the real constraint
  if (!user || !isAdmin) {
    return (
      <>
        <SiteHeader title="Admin" progress={0} />
        <main className="max-w-container mx-auto px-margin-mobile md:px-0 py-16 text-center">
          <Icon name="lock" className="text-gold mb-4" />
          <p className="font-narrative text-body-md text-on-surface-variant">
            You do not have permission to view this page.
          </p>
        </main>
        <SiteFooter quote={study.footerQuote} />
      </>
    );
  }

  return (
    <>
      <SiteHeader title="Admin — Meetings" progress={0} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0 py-10">
        <div className="max-w-[640px]">
          <div className="flex items-center gap-3 mb-8">
            <Icon name="settings" className="text-gold" />
            <h1 className="font-chrome text-headline-md uppercase text-primary">Manage Meeting</h1>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <Field label="Slug" value={form.slug} onChange={(v) => handleChange('slug', v)} placeholder="family-prayer" />
            <Field label="Join URL" value={form.join_url} onChange={(v) => handleChange('join_url', v)} placeholder="https://us02web.zoom.us/j/..." />
            {pwdNotice && (
              <p className="font-narrative text-[13px] text-gold -mt-3">
                The join URL does not appear to contain a pwd= parameter. Members may need to enter the passcode manually.
              </p>
            )}
            <Field label="Meeting ID" value={form.meeting_id} onChange={(v) => handleChange('meeting_id', v)} placeholder="123 456 7890" />
            <Field label="Passcode" value={form.passcode} onChange={(v) => handleChange('passcode', v)} placeholder="abc123" />
            <div className="flex flex-col gap-2">
              <label className="font-chrome text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                Dial-In Numbers (one per line)
              </label>
              <textarea
                value={form.dial_in}
                onChange={(e) => handleChange('dial_in', e.target.value)}
                rows={3}
                className="w-full border border-gold bg-transparent px-4 py-3 font-narrative text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:border-secondary focus:outline-none resize-y"
                placeholder="+1 (669) 900-6833&#10;+1 (346) 248-7799"
              />
            </div>
            <Field label="Calendar (.ics) URL" value={form.ics_url} onChange={(v) => handleChange('ics_url', v)} placeholder="https://..." />
            <Field label="Note" value={form.note} onChange={(v) => handleChange('note', v)} placeholder="Optional note shown to members" />

            {feedback && (
              <p role="alert" className={`font-narrative text-[14px] ${feedback.includes('success') ? 'text-secondary' : 'text-red-400'}`}>{feedback}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 font-chrome text-[14px] font-bold uppercase tracking-[0.1em] px-6 py-4 bg-secondary text-on-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary disabled:opacity-50 w-fit"
            >
              {saving ? 'Saving...' : 'Save Meeting'}
              <Icon name="save" size={18} />
            </button>
          </form>
        </div>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-chrome text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gold bg-transparent px-4 py-3 font-narrative text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:border-secondary focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}
