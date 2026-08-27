import { useEffect, useState } from 'react';
import { supabase } from '@app/lib/supabase';
import { useAuth } from '@app/lib/auth';

export interface MeetingAccess {
  joinUrl: string | null;
  meetingId: string | null;
  passcode: string | null;
  dialIn: string | null;
  icsUrl: string | null;
  note: string | null;
  loading: boolean;
  error: boolean;
}

export function useMeetingAccess(slug: string): MeetingAccess {
  const { user } = useAuth();
  const [state, setState] = useState<MeetingAccess>({
    joinUrl: null,
    meetingId: null,
    passcode: null,
    dialIn: null,
    icsUrl: null,
    note: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    if (!user) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('join_url, meeting_id, passcode, dial_in, ics_url, note')
        .eq('slug', slug)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setState((s) => ({ ...s, loading: false, error: true }));
        return;
      }

      if (data) {
        setState({
          joinUrl: data.join_url,
          meetingId: data.meeting_id,
          passcode: data.passcode,
          dialIn: data.dial_in,
          icsUrl: data.ics_url,
          note: data.note,
          loading: false,
          error: false,
        });
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    })();

    return () => { cancelled = true; };
  }, [user, slug]);

  return state;
}
