import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@app/components/Icon';
import { SiteHeader } from '@app/components/SiteHeader';
import { SiteFooter } from '@app/components/SiteFooter';
import { PSALM_26 } from '@app/data/psalm26';
import { supabase } from '@app/lib/supabase';
import { ROUTES } from '@app/app/routes';

type Mode = 'sign-in' | 'sign-up';

export function AuthPage() {
  const study = PSALM_26;
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'sign-up') {
      if (password.length < 8 || password.length > 12) {
        setError('Password must be 8-12 characters long.');
        setLoading(false);
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setError('Password must include at least one uppercase letter.');
        setLoading(false);
        return;
      }
      if (!/[a-z]/.test(password)) {
        setError('Password must include at least one lowercase letter.');
        setLoading(false);
        return;
      }
      if (!/[0-9]/.test(password)) {
        setError('Password must include at least one number.');
        setLoading(false);
        return;
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        setError('Password must include at least one special character.');
        setLoading(false);
        return;
      }
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    navigate(ROUTES.profile);
  }

  return (
    <>
      <SiteHeader title="Walk Before Me" progress={study.completed / study.total} />
      <main className="max-w-container mx-auto px-margin-mobile md:px-0 pt-10 flex items-start justify-center">
        <div className="w-full max-w-[440px] border border-gold bg-surface-container-low p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <Icon name="lock" className="text-gold" />
            <h1 className="font-chrome text-[28px] font-bold uppercase tracking-[0.05em] text-primary">
              {mode === 'sign-in' ? 'Sign In' : 'Create Account'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-chrome text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gold bg-transparent px-4 py-3 font-narrative text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:border-secondary focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-chrome text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                maxLength={12}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gold bg-transparent px-4 py-3 font-narrative text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:border-secondary focus:outline-none"
                placeholder="8-12 chars, upper, lower, number, symbol"
              />
            </div>

            {error && (
              <p className="font-narrative text-[14px] text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 font-chrome text-[14px] font-bold uppercase tracking-[0.1em] px-6 py-4 bg-secondary text-on-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
              <Icon name="arrow_forward" size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            {mode === 'sign-in' ? (
              <p className="font-narrative text-[14px] text-on-surface-variant">
                No account yet?{' '}
                <button type="button" onClick={() => { setMode('sign-up'); setError(''); }} className="text-secondary underline font-bold">
                  Create one
                </button>
              </p>
            ) : (
              <p className="font-narrative text-[14px] text-on-surface-variant">
                Already have an account?{' '}
                <button type="button" onClick={() => { setMode('sign-in'); setError(''); }} className="text-secondary underline font-bold">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
      <SiteFooter quote={study.footerQuote} />
    </>
  );
}
