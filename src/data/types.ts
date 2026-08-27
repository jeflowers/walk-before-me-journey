/** Content model for a study track. Everything rendered on screen comes from these types; no copy lives in components. */
export type WaypointState = 'complete' | 'current' | 'locked';

export interface Scripture {
  text: string;
  citation: string;
}

export interface CommentarySection {
  heading: string;
  body: string;
}

export interface LexicalNote {
  term: string;
  gloss: string;
}

export interface Waypoint {
  number: number;
  numeral: string;
  /** Emmaus Road name (landing page and study home) */
  name: string;
  /** Verse-by-verse name (tracker and detail pages). Two schemes exist in the Stitch export; both are kept until one is chosen. */
  trackerName: string;
  verses: string;
  summary: string;
  scripture: Scripture;
  question: string;
  note?: string;
  image: string;
  state: WaypointState;
  coord?: string;
  sections?: CommentarySection[];
  lexicalNote?: LexicalNote;
}

export interface LexiconEntry {
  term: string;
  language: 'Hebrew' | 'Greek LXX';
  transliteration: string;
  definition: string;
  significance: string;
}

export interface ReflectionPrompt {
  label: string;
  prompt: string;
  placeholder: string;
}

export interface CommunityReflection {
  track: string;
  tag: string;
  author: string;
  when: string;
  quote: string;
  verse: string;
  citation: string;
  likes: number;
  comments: number;
  avatar?: string;
}

export interface Study {
  id: string;
  title: string;
  subtitle: string;
  reference: string;
  heroImage: string;
  completed: number;
  total: number;
  waypoints: Waypoint[];
  lexicon: LexiconEntry[];
  reflectionPrompts: ReflectionPrompt[];
  prayerPrompt: ReflectionPrompt;
  footerQuote: Scripture;
}
