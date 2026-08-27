import { RANK_IDS } from '@app/data/enums';
import type { RankId } from '@app/data/enums';
import { RANK_POLICY, TRACK_LABELS } from '@app/data/standing';
import type { MemberProgress, StandingResult, TrackStatus, RequirementStatus } from '@app/data/standing.types';

function resolveValue(progress: MemberProgress, key: string): number {
  switch (key) {
    case 'studies': return progress.studiesComplete;
    case 'questions': return progress.questionSetsComplete;
    case 'reflections': return progress.reflectionsWritten;
    case 'service': return progress.serviceHoursApproved;
    case 'groups': return progress.groupCyclesParticipated;
    case 'mentoring': return progress.mentorSessionsAttended;
    case 'shared': return progress.communityReflectionsShared;
    default: return 0;
  }
}

export function evaluateStanding(progress: MemberProgress): StandingResult {
  let currentRankIndex = 0;

  for (let i = 1; i < RANK_POLICY.length; i++) {
    const policy = RANK_POLICY[i];
    const allTracksMet = (['reading', 'proving', 'walking'] as const).every((track) =>
      policy.tracks[track].every((req) => resolveValue(progress, req.key) >= req.threshold)
    );
    const canonMet = progress.divisionsStudied.length >= policy.canonBreadth;
    if (allTracksMet && canonMet) {
      currentRankIndex = i;
    }
  }

  const nextIndex = currentRankIndex < RANK_POLICY.length - 1 ? currentRankIndex + 1 : null;
  const nextPolicy = nextIndex !== null ? RANK_POLICY[nextIndex] : null;

  const tracks: TrackStatus[] = nextPolicy
    ? (['reading', 'proving', 'walking'] as const).map((trackId) => {
        const requirements: RequirementStatus[] = nextPolicy.tracks[trackId].map((req) => {
          const current = resolveValue(progress, req.key);
          return { key: req.key, label: req.label, current, threshold: req.threshold, met: current >= req.threshold };
        });
        return { track: trackId, label: TRACK_LABELS[trackId], requirements, met: requirements.every((r) => r.met) };
      })
    : [];

  const canonBreadth = nextPolicy
    ? { current: progress.divisionsStudied.length, required: nextPolicy.canonBreadth, met: progress.divisionsStudied.length >= nextPolicy.canonBreadth }
    : { current: progress.divisionsStudied.length, required: 4, met: true };

  let requirementsMet = 0;
  let requirementsTotal = 0;
  for (const t of tracks) {
    for (const r of t.requirements) {
      requirementsTotal++;
      if (r.met) requirementsMet++;
    }
  }
  requirementsTotal++;
  if (canonBreadth.met) requirementsMet++;

  return {
    currentRank: RANK_IDS[currentRankIndex],
    currentRankLabel: RANK_POLICY[currentRankIndex].label,
    nextRank: nextIndex !== null ? (RANK_IDS[nextIndex] as RankId) : null,
    nextRankLabel: nextPolicy?.label ?? null,
    tracks,
    canonBreadth,
    requirementsMet,
    requirementsTotal,
  };
}
