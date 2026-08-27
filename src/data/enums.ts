export const RANK_IDS = ['wayfarer', 'traveler', 'companion', 'witness', 'steward'] as const;
export type RankId = (typeof RANK_IDS)[number];

export const TRACK_IDS = ['reading', 'proving', 'walking'] as const;
export type TrackId = (typeof TRACK_IDS)[number];

export const DIVISION_IDS = ['torah', 'neviim', 'ketuvim', 'fulfillment'] as const;
export type DivisionId = (typeof DIVISION_IDS)[number];
