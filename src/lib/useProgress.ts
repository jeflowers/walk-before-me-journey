import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@app/lib/supabase';
import { useAuth } from '@app/lib/auth';
import type { Waypoint, WaypointState } from '@app/data/types';

interface UseProgressResult {
  getState: (waypointNumber: number) => WaypointState;
  completedCount: number;
  markComplete: (waypointNumber: number) => Promise<void>;
  loading: boolean;
}

export function useProgress(studyId: string, waypoints: Waypoint[]): UseProgressResult {
  const { user } = useAuth();
  const [completedNumbers, setCompletedNumbers] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    async function load() {
      const { data } = await supabase
        .from('waypoint_progress')
        .select('waypoint_number')
        .eq('study_id', studyId);
      if (data) {
        setCompletedNumbers(new Set(data.map((r) => r.waypoint_number)));
      }
      setLoading(false);
    }
    load();
  }, [studyId, user]);

  const getState = useCallback((waypointNumber: number): WaypointState => {
    if (!user) {
      return waypoints.find((w) => w.number === waypointNumber)?.state ?? 'locked';
    }
    if (completedNumbers.has(waypointNumber)) return 'complete';
    const allBefore = waypoints
      .filter((w) => w.number < waypointNumber)
      .every((w) => completedNumbers.has(w.number));
    if (waypointNumber === 1 || allBefore) return 'current';
    return 'locked';
  }, [user, completedNumbers, waypoints]);

  const markComplete = useCallback(async (waypointNumber: number) => {
    if (!user) return;
    await supabase
      .from('waypoint_progress')
      .upsert({ study_id: studyId, waypoint_number: waypointNumber }, { onConflict: 'user_id,study_id,waypoint_number' });
    setCompletedNumbers((prev) => new Set(prev).add(waypointNumber));
  }, [user, studyId]);

  return { getState, completedCount: completedNumbers.size, markComplete, loading };
}
