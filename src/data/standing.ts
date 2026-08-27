import type { RankThresholds } from '@app/data/standing.types';

export const RANK_LABELS: Record<string, string> = {
  wayfarer: 'Wayfarer',
  traveler: 'Traveler',
  companion: 'Companion',
  witness: 'Witness',
  steward: 'Steward',
};

export const TRACK_LABELS: Record<string, string> = {
  reading: 'The Reading',
  proving: 'The Proving',
  walking: 'The Walking',
};

export const RANK_POLICY: RankThresholds[] = [
  {
    rank: 'wayfarer',
    label: 'Wayfarer',
    tracks: {
      reading: [],
      proving: [],
      walking: [],
    },
    canonBreadth: 0,
  },
  {
    rank: 'traveler',
    label: 'Traveler',
    tracks: {
      reading: [
        { key: 'studies', label: 'Studies complete', threshold: 1 },
        { key: 'questions', label: 'Question sets answered', threshold: 7 },
      ],
      proving: [
        { key: 'reflections', label: 'Reflections written', threshold: 7 },
      ],
      walking: [
        { key: 'service', label: 'Approved service hours', threshold: 5 },
      ],
    },
    canonBreadth: 1,
  },
  {
    rank: 'companion',
    label: 'Companion',
    tracks: {
      reading: [
        { key: 'studies', label: 'Studies complete', threshold: 3 },
        { key: 'questions', label: 'Question sets answered', threshold: 21 },
      ],
      proving: [
        { key: 'reflections', label: 'Reflections written', threshold: 21 },
        { key: 'shared', label: 'Community reflections shared', threshold: 5 },
      ],
      walking: [
        { key: 'service', label: 'Approved service hours', threshold: 15 },
        { key: 'groups', label: 'Group cycles participated', threshold: 1 },
      ],
    },
    canonBreadth: 2,
  },
  {
    rank: 'witness',
    label: 'Witness',
    tracks: {
      reading: [
        { key: 'studies', label: 'Studies complete', threshold: 7 },
        { key: 'questions', label: 'Question sets answered', threshold: 49 },
      ],
      proving: [
        { key: 'reflections', label: 'Reflections written', threshold: 49 },
        { key: 'shared', label: 'Community reflections shared', threshold: 14 },
      ],
      walking: [
        { key: 'service', label: 'Approved service hours', threshold: 40 },
        { key: 'groups', label: 'Group cycles participated', threshold: 3 },
        { key: 'mentoring', label: 'Mentor sessions attended', threshold: 5 },
      ],
    },
    canonBreadth: 3,
  },
  {
    rank: 'steward',
    label: 'Steward',
    tracks: {
      reading: [
        { key: 'studies', label: 'Studies complete', threshold: 12 },
        { key: 'questions', label: 'Question sets answered', threshold: 84 },
      ],
      proving: [
        { key: 'reflections', label: 'Reflections written', threshold: 84 },
        { key: 'shared', label: 'Community reflections shared', threshold: 28 },
      ],
      walking: [
        { key: 'service', label: 'Approved service hours', threshold: 80 },
        { key: 'groups', label: 'Group cycles participated', threshold: 7 },
        { key: 'mentoring', label: 'Mentor sessions attended', threshold: 12 },
      ],
    },
    canonBreadth: 4,
  },
];

export const NEHUSHTAN_CLAUSE =
  'Standing is for the walker, not the watched. It is never shown publicly, never compared between members, and never used as a basis for authority or access.';
