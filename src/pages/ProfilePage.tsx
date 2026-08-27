import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@app/components/Button';
import { WaymarkBadge } from '@app/components/WaymarkBadge';
import { Icon } from '@app/components/Icon';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26 } from '@app/data/psalm26';
import { supabase } from '@app/lib/supabase';
import { useAuth } from '@app/lib/auth';
import { ROUTES } from '@app/app/routes';
import { useStanding } from '@app/lib/useStanding';
import { useTimeFormat } from '@app/lib/useTimeFormat';

interface Profile {
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface ReflectionEntry {
  prompt_key: string;
  body: string;
  updated_at: string;
}

interface ProgressEntry {
  waypoint_number: number;
  completed_at: string;
}

export function ProfilePage() {
  const study = PSALM_26;
  const { user, loading: authLoading, signOut, refreshProfile } = useAuth();
  const { standing } = useStanding();
  const { format: timeFormat, toggle: toggleTimeFormat } = useTimeFormat();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const [profileRes, reflectionsRes, progressRes] = await Promise.all([
        supabase.from('profiles').select('first_name, last_name, username, avatar_url').eq('id', user!.id).maybeSingle(),
        supabase.from('reflections').select('prompt_key, body, updated_at').eq('study_id', study.id).order('updated_at', { ascending: false }),
        supabase.from('waypoint_progress').select('waypoint_number, completed_at').eq('study_id', study.id).eq('user_id', user!.id),
      ]);
      if (profileRes.data) {
        setProfile(profileRes.data);
        setFirstName(profileRes.data.first_name || '');
        setLastName(profileRes.data.last_name || '');
        setUsername(profileRes.data.username || '');
      }
      if (reflectionsRes.data) setReflections(reflectionsRes.data);
      if (progressRes.data) setProgress(progressRes.data);
    }
    load();
  }, [user, study.id]);

  async function handleSaveProfile() {
    if (!user) return;
    setSaving(true);
    const { data } = await supabase
      .from('profiles')
      .update({ first_name: firstName.trim() || null, last_name: lastName.trim() || null, username: username.trim() || null, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select('first_name, last_name, username, avatar_url')
      .maybeSingle();
    if (data) setProfile(data);
    await refreshProfile();
    setSaving(false);
    setEditing(false);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!user || !e.target.files?.length) return;
    const file = e.target.files[0];
    setUploadError('');
    const extByType: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    const ext = extByType[file.type];
    if (!ext) {
      setUploadError('Please choose a JPEG, PNG or WebP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be under 2MB.');
      return;
    }
    setUploading(true);
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setUploadError('We could not upload that image. Please try again.');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { data } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select('first_name, last_name, username, avatar_url')
      .maybeSingle();
    if (data) setProfile(data);
    setUploading(false);
  }

  const displayName = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}`
    : user?.email?.split('@')[0] || 'Student';

  const completedWaypoints = progress.length;
  const totalWaypoints = study.total;
  const journeyPercent = totalWaypoints > 0 ? Math.round((completedWaypoints / totalWaypoints) * 100) : 0;

  if (authLoading) {
    return (
      <>
        <SiteHeader title="Sacred Archive" progress={0} />
        <main className="max-w-container mx-auto px-margin-mobile md:px-0 pt-10 text-center">
          <p className="font-narrative text-body-lg text-on-surface-variant">Loading...</p>
        </main>
        <SiteFooter quote={study.footerQuote} />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <SiteHeader title="Sacred Archive" progress={0} />
        <main className="max-w-container mx-auto px-margin-mobile md:px-0 pt-10 flex flex-col items-center gap-6">
          <Icon name="account_circle" size={64} className="text-gold" />
          <h1 className="font-chrome text-[32px] font-bold uppercase tracking-[0.05em] text-primary">Your Sacred Archive</h1>
          <p className="font-narrative text-body-md text-on-surface-variant text-center max-w-[360px]">
            Sign in to save your reflections, track your journey progress, and access your personal archive.
          </p>
          <Link to={ROUTES.auth}>
            <Button label="Sign In" icon="login" />
          </Link>
        </main>
        <SiteFooter quote={study.footerQuote} />
      </>
    );
  }

  return (
    <>
      <SiteHeader title="Sacred Archive" progress={completedWaypoints / totalWaypoints} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Identity card */}
          <aside className="md:col-span-4">
            <div className="border-t-4 border-secondary bg-surface-container-low p-8 flex flex-col items-center gap-4 text-center">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 border border-gold p-1">
                  <div className="w-full h-full overflow-hidden bg-navy/10 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img className="w-full h-full object-cover" src={profile.avatar_url} alt={`${displayName} profile`} />
                    ) : (
                      <Icon name="account_circle" size={80} className="text-navy/30" />
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 flex items-center justify-center bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Upload profile picture"
                >
                  <Icon name={uploading ? 'hourglass_empty' : 'photo_camera'} size={32} className="text-parchment" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {uploadError && (
                <p role="alert" className="font-narrative text-[14px] text-red-400">{uploadError}</p>
              )}

              {/* Name + Edit */}
              {editing ? (
                <div className="flex flex-col gap-3 w-full">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gold p-2 font-chrome text-[14px] text-parchment bg-navy/30 placeholder:text-parchment/50 focus:border-2 focus:border-secondary focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-gold p-2 font-chrome text-[14px] text-parchment bg-navy/30 placeholder:text-parchment/50 focus:border-2 focus:border-secondary focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-gold p-2 font-chrome text-[14px] text-parchment bg-navy/30 placeholder:text-parchment/50 focus:border-2 focus:border-secondary focus:outline-none"
                  />
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="inline-flex items-center gap-2 font-chrome text-[12px] font-bold uppercase tracking-[0.1em] px-4 py-2 bg-navy text-parchment border border-gold hover:bg-navy/90 disabled:opacity-50"
                    >
                      <Icon name="check" size={14} />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditing(false); setFirstName(profile?.first_name || ''); setLastName(profile?.last_name || ''); setUsername(profile?.username || ''); }}
                      className="inline-flex items-center gap-2 font-chrome text-[12px] font-bold uppercase tracking-[0.1em] px-4 py-2 bg-navy text-parchment border border-gold hover:bg-navy/90"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="font-chrome text-[32px] font-semibold uppercase tracking-[0.05em] text-primary">{displayName}</h1>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-1 font-chrome text-[11px] font-bold uppercase tracking-[0.1em] text-secondary hover:text-gold"
                  >
                    <Icon name="edit" size={14} />
                    Edit Name
                  </button>
                </>
              )}

              <p className="font-narrative text-[14px] text-on-surface-variant">{user.email}</p>
              <div className="flex items-center gap-3">
                <WaymarkBadge rank={standing.currentRank} />
                <Link to={ROUTES.standing} className="font-chrome text-[11px] uppercase tracking-[0.1em] text-secondary hover:text-gold">
                  View Standing
                </Link>
              </div>

              {/* Time format preference */}
              <div className="flex items-center gap-3 mt-4 border-t border-outline-variant pt-4 w-full">
                <Icon name="schedule" size={18} className="text-on-surface-variant" />
                <span className="font-chrome text-[11px] uppercase tracking-[0.1em] text-on-surface-variant">Clock</span>
                <button
                  type="button"
                  onClick={toggleTimeFormat}
                  className="ml-auto font-chrome text-[12px] font-bold uppercase tracking-[0.1em] px-3 py-1 border border-secondary text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
                >
                  {timeFormat === '12h' ? '12-hour' : '24-hour'}
                </button>
              </div>

              <div className="flex gap-3 mt-4">
                <Button label="Sign Out" style="outline" icon="logout" onClick={signOut} />
              </div>
            </div>
          </aside>

          {/* Right column */}
          <section className="md:col-span-8 flex flex-col gap-6">
            {/* Journey Progress */}
            <div className="border border-secondary bg-surface-container-low p-6">
              <div className="flex items-center justify-between border-b border-secondary pb-3">
                <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-secondary">Journey Progress</span>
                <Icon name="timeline" className="text-secondary" />
              </div>
              <div className="mt-5">
                <div className="flex justify-between">
                  <span className="font-chrome text-[14px] font-bold uppercase tracking-[0.05em] text-on-surface">Psalm 26: The Path of Integrity</span>
                  <span className="font-chrome text-[12px] font-bold text-secondary">{journeyPercent}%</span>
                </div>
                <div className="h-[2px] bg-outline-variant mt-2">
                  <div className="h-[2px] bg-secondary" style={{ width: `${journeyPercent}%` }} />
                </div>
              </div>
              {journeyPercent === 0 && (
                <p className="font-narrative text-[13px] italic text-on-surface-variant mt-4">
                  Begin your journey through the waypoints to track progress here.
                </p>
              )}
            </div>

            {/* Two-col grid: commemorations + reflections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earned Commemorations */}
              <div className="border border-secondary bg-surface-container-low p-6">
                <div className="flex items-center justify-between border-b border-secondary pb-3">
                  <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-secondary">Earned Commemorations</span>
                  <Icon name="military_tech" className="text-secondary" />
                </div>
                {journeyPercent === 100 ? (
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="border border-secondary p-5 flex flex-col items-center gap-2 text-center">
                      <Icon name="shield" filled size={36} className="text-secondary" />
                      <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.05em] text-on-surface">Path of Integrity</span>
                      <span className="font-chrome text-[10px] font-bold uppercase tracking-[0.15em] text-secondary">PSA 26</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 mt-5 py-6">
                    <Icon name="military_tech" size={40} className="text-navy/20" />
                    <p className="font-narrative text-[13px] italic text-on-surface-variant text-center">
                      Complete a full journey to earn commemorations.
                    </p>
                  </div>
                )}
              </div>

              {/* Personal Reflections */}
              <div className="border border-secondary bg-surface-container-low p-6">
                <div className="flex items-center justify-between border-b border-secondary pb-3">
                  <span className="font-chrome text-[12px] font-bold uppercase tracking-[0.15em] text-secondary">Personal Reflections</span>
                  <Icon name="book_4" className="text-secondary" />
                </div>
                {reflections.length > 0 ? (
                  <>
                    {reflections.slice(0, 3).map((r) => (
                      <Link key={r.prompt_key} to={ROUTES.reflection} className="block border-l-2 border-secondary pl-4 mt-5 hover:border-gold transition-colors">
                        <span className="font-chrome text-[10px] font-bold uppercase tracking-[0.15em] text-secondary">
                          {new Date(r.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <h3 className="font-chrome text-[14px] font-bold uppercase text-primary mt-1">{r.prompt_key}</h3>
                        <p className="font-narrative italic text-[14px] leading-[1.5] text-on-surface-variant mt-1">
                          {r.body.length > 120 ? r.body.slice(0, 120) + '...' : r.body}
                        </p>
                      </Link>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 mt-5 py-6">
                    <Icon name="book_4" size={40} className="text-navy/20" />
                    <p className="font-narrative text-[13px] italic text-on-surface-variant text-center">
                      No reflections yet. Start journaling to see your entries here.
                    </p>
                  </div>
                )}
                <div className="mt-5">
                  <Link to={ROUTES.reflection}>
                    <Button label="New Entry" style="outline" icon="add" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
