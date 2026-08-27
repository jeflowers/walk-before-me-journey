import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@app/lib/supabase';
import { useAuth } from '@app/lib/auth';

export type TimeFormat = '12h' | '24h';

const BROWSER_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function useTimeFormat() {
  const { user } = useAuth();
  const [format, setFormatState] = useState<TimeFormat>('12h');
  const [timeZone, setTimeZoneState] = useState<string>(BROWSER_TZ);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('time_format, time_zone')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.time_format === '24h') setFormatState('24h');
        if (data?.time_zone) setTimeZoneState(data.time_zone);
      });
  }, [user]);

  const setFormat = useCallback(async (f: TimeFormat) => {
    setFormatState(f);
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ time_format: f, updated_at: new Date().toISOString() })
      .eq('id', user.id);
  }, [user]);

  const toggle = useCallback(() => {
    const next = format === '12h' ? '24h' : '12h';
    setFormat(next);
  }, [format, setFormat]);

  const setTimeZone = useCallback(async (tz: string) => {
    setTimeZoneState(tz);
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ time_zone: tz, updated_at: new Date().toISOString() })
      .eq('id', user.id);
  }, [user]);

  return { format, setFormat, toggle, timeZone, setTimeZone };
}
