import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@app/lib/supabase';
import { useAuth } from '@app/lib/auth';

export type TimeFormat = '12h' | '24h';

export function useTimeFormat() {
  const { user } = useAuth();
  const [format, setFormatState] = useState<TimeFormat>('12h');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('time_format')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.time_format === '24h') setFormatState('24h');
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

  return { format, setFormat, toggle };
}
