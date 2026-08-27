/** Route table for the Psalm 26 flagship flow. Keys match reference/desktop/*.html and reference/mobile/*.html. */
export const ROUTES = {
  landing: '/',
  studyHome: '/study/psalm-26',
  waypoints: '/study/psalm-26/waypoints',
  waypoint: '/study/psalm-26/waypoints/:number',
  reflection: '/study/psalm-26/reflection',
  community: '/community',
  lexicon: '/study/psalm-26/lexicon',
  profile: '/profile',
  commemoration: '/study/psalm-26/complete',
} as const;

export type RouteKey = keyof typeof ROUTES;
