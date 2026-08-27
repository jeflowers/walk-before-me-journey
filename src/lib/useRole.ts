import { useEffect, useState } from 'react';
import { supabase } from '@app/lib/supabase';
import { useAuth } from '@app/lib/auth';

export interface RoleState {
  role: 'member' | 'admin' | null;
  approved: boolean;
  loading: boolean;
}

export function useRole(): RoleState {
  const { user } = useAuth();
  const [role, setRole] = useState<'member' | 'admin' | null>(null);
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setApproved(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('user_roles')
        .select('role, approved')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;
      if (data) {
        setRole(data.role as 'member' | 'admin');
        setApproved(data.approved);
      } else {
        setRole(null);
        setApproved(false);
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [user]);

  return { role, approved, loading };
}
