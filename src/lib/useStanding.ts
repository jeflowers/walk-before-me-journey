import { useState, useEffect } from 'react';
import { supabase } from '@app/lib/supabase';
import { useAuth } from '@app/lib/auth';
import { evaluateStanding } from '@app/lib/standing';
import type { MemberProgress } from '@app/data/standing.types';
import type { StandingResult } from '@app/data/standing.types';

const EMPTY_PROGRESS: MemberProgress = {
  studiesComplete: 0,
  questionSetsComplete: 0,
  reflectionsWritten: 0,
  serviceHoursApproved: 0,
  divisionsStudied: [],
  groupCyclesParticipated: 0,
  mentorSessionsAttended: 0,
  communityReflectionsShared: 0,
};

export function useStanding(): { standing: StandingResult; progress: MemberProgress; loading: boolean } {
  const { user } = useAuth();
  const [progress, setProgress] = useState<MemberProgress>(EMPTY_PROGRESS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress(EMPTY_PROGRESS);
      setLoading(false);
      return;
    }

    async function load() {
      const [waypointsRes, reflectionsRes] = await Promise.all([
        supabase
          .from('waypoint_progress')
          .select('study_id, waypoint_number')
          .eq('user_id', user!.id),
        supabase
          .from('reflections')
          .select('id')
          .eq('user_id', user!.id),
      ]);

      const wpRows = waypointsRes.data ?? [];
      const reflRows = reflectionsRes.data ?? [];

      const studiesWithAllSeven = new Set<string>();
      const studyMap = new Map<string, Set<number>>();
      for (const row of wpRows) {
        if (!studyMap.has(row.study_id)) studyMap.set(row.study_id, new Set());
        studyMap.get(row.study_id)!.add(row.waypoint_number);
      }
      for (const [sid, nums] of studyMap) {
        if (nums.size >= 7) studiesWithAllSeven.add(sid);
      }

      setProgress({
        studiesComplete: studiesWithAllSeven.size,
        questionSetsComplete: wpRows.length,
        reflectionsWritten: reflRows.length,
        serviceHoursApproved: 0,
        divisionsStudied: [],
        groupCyclesParticipated: 0,
        mentorSessionsAttended: 0,
        communityReflectionsShared: 0,
      });
      setLoading(false);
    }

    load();
  }, [user]);

  return { standing: evaluateStanding(progress), progress, loading };
}
