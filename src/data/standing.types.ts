import type { RankId, TrackId, DivisionId } from '@app/data/enums';

export interface TrackRequirement {
  key: string;
  label: string;
  threshold: number;
}

export interface RankThresholds {
  rank: RankId;
  label: string;
  tracks: Record<TrackId, TrackRequirement[]>;
  canonBreadth: number;
}

export interface MemberProgress {
  studiesComplete: number;
  questionSetsComplete: number;
  reflectionsWritten: number;
  serviceHoursApproved: number;
  divisionsStudied: DivisionId[];
  groupCyclesParticipated: number;
  mentorSessionsAttended: number;
  communityReflectionsShared: number;
}

export interface TrackStatus {
  track: TrackId;
  label: string;
  requirements: RequirementStatus[];
  met: boolean;
}

export interface RequirementStatus {
  key: string;
  label: string;
  current: number;
  threshold: number;
  met: boolean;
}

export interface StandingResult {
  currentRank: RankId;
  currentRankLabel: string;
  nextRank: RankId | null;
  nextRankLabel: string | null;
  tracks: TrackStatus[];
  canonBreadth: { current: number; required: number; met: boolean };
  requirementsMet: number;
  requirementsTotal: number;
}
