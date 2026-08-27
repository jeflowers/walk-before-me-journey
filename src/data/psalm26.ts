import type { CommunityReflection, Study } from '@app/data/types';

/** Psalm 26 "Walk Before Me / The Path of Integrity". Text transcribed from the Stitch export (KJV 1611 spelling kept where the export used it). */
export const PSALM_26: Study = {
  id: 'psalm-26',
  title: 'Walk Before Me',
  subtitle: 'A Journey Through Psalm 26',
  reference: 'Psalm 26',
  heroImage: '/images/hero_home_wp7.jpg',
  completed: 5,
  total: 7,
  footerQuote: { text: 'Not by might, nor by power, but by my spirit, saith the LORD of hosts.', citation: 'Zechariah 4:6' },
  waypoints: [
    {
      number: 1, numeral: 'I', name: 'Covenant Ground', trackerName: 'The Appeal', verses: 'v. 1-3',
      summary: "David opens by inviting God's scrutiny, a bold declaration of transparency.",
      scripture: { text: '"I am the Almightie God: walke before me, and be thou perfect."', citation: 'Genesis 17:1' },
      question: 'Does the walk begin with our strength, or His name?', image: '/images/wp01_covenant_ground.jpg', state: 'complete',
    },
    {
      number: 2, numeral: 'II', name: 'The Prayer Beneath', trackerName: 'The Refusal', verses: 'v. 4-5',
      summary: 'A conscious, deliberate separation from the deceitful and wicked.',
      scripture: { text: '"Let integrity and uprightnesse preserve me: for I wait on thee."', citation: 'Psalm 25:21' },
      question: 'Is integrity a claim of sinlessness, or a plea for preservation?', image: '/images/wp02_prayer_beneath.jpg', state: 'complete',
    },
    {
      number: 3, numeral: 'III', name: 'The Walk and The Trust', trackerName: 'The Ritual', verses: 'v. 6-7',
      summary: 'Washing hands in innocence to approach the altar of the Lord.',
      scripture: { text: '"Judge me, O LORD, for I have walked in mine integrity: I have trusted also in the LORD: therfore I shall not slide."', citation: 'Psalm 26:1, 3' },
      question: 'Which holds the man: the walk, or the trust?', image: '/images/wp03_walk_and_trust.jpg', state: 'complete',
    },
    {
      number: 4, numeral: 'IV', name: 'The Door Opened', trackerName: 'The Affection', verses: 'v. 8',
      summary: "A profound, emotional declaration of love for God's dwelling place.",
      scripture: { text: '"Examine me, O LORD, and prove me; try my reins and my heart."', citation: 'Psalm 26:2' },
      question: 'Do we open the inner rooms to the One we trust?', note: 'Note: Tsaraph refined by fire', image: '/images/wp04_door_opened.jpg', state: 'complete',
    },
    {
      number: 5, numeral: 'V', name: 'The Petition', trackerName: 'The Petition', verses: 'v. 9-10',
      summary: 'A desperate plea to not be gathered with sinners.',
      scripture: { text: '"Gather not my soul with sinners, nor my life with bloody men: In whose hands is mischief, and their right hand is full of bribes. But as for me, I will walk in mine integrity: redeem me, and be merciful unto me."', citation: 'Psalm 26:9-11 (KJV)' },
      question: 'Where does our integrity meet His mercy?', image: '/images/hero_wp5_wp6.jpg', state: 'complete', coord: 'Coord: PS-09',
      sections: [
        { heading: 'The Cry for Mercy', body: 'Here, the tone shifts from confident self-assessment to an urgent plea. Having established his intentional walk in integrity, the Psalmist now petitions for preservation. He asks not to be swept away in the judgment destined for the wicked.' },
        { heading: 'The Pivot to Redemption', body: 'This is the critical theological pivot of the Psalm. The claim of integrity is not a claim of sinlessness. The immediate follow-up to "I will walk in mine integrity" is the cry "redeem me." True biblical integrity recognizes its inherent need for a Redeemer.' },
      ],
      lexicalNote: { term: 'Redeem Me (Pādâ)', gloss: 'The Hebrew word pādâ implies a transfer of ownership, often involving a ransom price. It connects back to the overarching theme of being wholly devoted (consecrated) to the Lord, moving beyond mere self-righteousness to total reliance on divine rescue.' },
    },
    {
      number: 6, numeral: 'VI', name: 'The Resolve', trackerName: 'The Resolve', verses: 'v. 11',
      summary: 'A renewed commitment to integrity and a cry for redemption.',
      scripture: { text: '"But as for me, I will walk in mine integrity: redeem me, and be merciful unto me."', citation: 'Psalm 26:11 (KJV)' },
      question: 'What does a resolve born of dependence look like in our week?', image: '/images/hero_wp5_wp6.jpg', state: 'current', coord: 'Coord: PS-11',
      sections: [
        { heading: 'A Renewed Commitment', body: 'This verse marks a return to the initial declaration of integrity, but now seasoned by the preceding plea for mercy. It is a resolve born of dependence. The psalmist does not rely on self-righteousness, but anchors their commitment in the grace they have just requested.' },
        { heading: 'The Dual Cry', body: "Highlight the simultaneous nature of 'I will walk' (human agency/resolve) and 'redeem me' (divine rescue). Integrity is not self-sufficiency. True biblical integrity acknowledges the constant need for divine intervention while maintaining a steadfast human commitment." },
      ],
      lexicalNote: { term: 'Redeem (Pādâ)', gloss: 'Briefly mention the ransom/rescue aspect. This term often implies a transfer of ownership or a rescue from a desperate situation at a cost.' },
    },
    {
      number: 7, numeral: 'VII', name: 'The Even Place', trackerName: 'The Stand', verses: 'v. 12',
      summary: 'The final destination: standing firmly on level ground, praising the Lord.',
      scripture: { text: '"My foot standeth in an even place: in the congregations will I bless the LORD."', citation: 'Psalm 26:12 (KJV)' },
      question: 'When does private integrity become public praise?', image: '/images/hero_home_wp7.jpg', state: 'locked', coord: 'Coord: MS-12',
      sections: [
        { heading: 'Level Ground', body: 'The journey of integrity, though fraught with trials and examination, ultimately leads to a place of profound stability. The "even place" (mîšôr) is not merely physical safety, but a spiritual certainty. When one walks in truth, the ground beneath their feet is solid; there are no hidden snares of deceit or uneven paths of compromise.' },
        { heading: 'In the Congregations', body: 'Notice the definitive shift from the deeply personal to the vibrantly public. The rigorous, private walk of integrity (vv. 1-11) finds its culmination and celebration "in the congregations." Integrity is not designed to be a solitary endeavor; it is a vital foundation that strengthens the entire community of faith, enabling authentic, public praise.' },
      ],
      lexicalNote: { term: 'Even Place (Mîšôr)', gloss: "This term implies a level plain, a place free from obstacles, pitfalls, or treacherous terrain. Metaphorically, it symbolizes a life lived according to God's truth, a path that is straight, just, and secure, contrasting sharply with the slippery slopes of the wicked." },
    },
  ],
  lexicon: [
    { term: 'Tōm', language: 'Hebrew', transliteration: 'Integrity; Completeness; Uprightness', definition: "The state of being complete, whole, or morally innocent. Often used to describe a blameless life dedicated wholly to God's precepts without divided loyalties.", significance: "Significance in 'Walk Before Me': It forms the baseline requirement for approaching the altar. It is not sinless perfection, but an undivided heart." },
    { term: 'Mēshār', language: 'Hebrew', transliteration: 'Equity; Level path; Uprightness', definition: "Refers to a smooth, straight path or equitable judgment. Metaphorically, living a life that is 'level' according to God's standard of justice.", significance: "Significance in 'Walk Before Me': Describes the resulting stability when one walks in 'Tōm'. The psalmist stands on 'level ground' amidst chaos." },
    { term: 'Pyrōson', language: 'Greek LXX', transliteration: 'Divine Refinement; Test by fire', definition: "To burn, refine with fire. The LXX translation uses this intense metallurgical term to describe God's examination of the heart and mind.", significance: "Significance in 'Walk Before Me': An active plea for God to purify the believer's motives. The walk of integrity welcomes the refining fire to burn away impurities." },
  ],
  reflectionPrompts: [
    { label: 'Note 01', prompt: "Where is the Lord calling me to a more consistent 'walk' of integrity this week?", placeholder: 'Begin journaling here...' },
    { label: 'Note 02', prompt: 'Which waypoint resonated most with my current season, and why?', placeholder: 'Begin journaling here...' },
  ],
  prayerPrompt: { label: 'Prayer', prompt: 'A Prayer for Refinement (Pyrōson)', placeholder: 'Lord, refine my heart...' },
};

export const COMMUNITY_REFLECTIONS: CommunityReflection[] = [
  { track: 'Psalm 26: The Path of Integrity', tag: 'Divine Standard', author: 'Sarah M.', when: '1 hour ago', quote: "\"Walking in integrity isn't about perfection, but about the orientation of the heart. It's the 'straight path' that requires constant recalibration against the Divine standard.\"", verse: '"Vindicate me, O LORD, for I have walked in my integrity, and I have trusted in the LORD without wavering."', citation: 'Psalm 26:1', likes: 18, comments: 5, avatar: '/images/avatar_feed.jpg' },
  { track: 'Zechariah 4: The Vision of the Lampstand', tag: 'Divine Sustenance', author: 'Benjamin S.', when: '2 hours ago', quote: '"The flow of oil through the pipes reminds me that divine sustenance is constant, provided we remain connected to the Source. My own striving often blocks the flow."', verse: '"Not by might, nor by power, but by my Spirit, saith the LORD of hosts."', citation: 'Zechariah 4:6', likes: 12, comments: 3 },
  { track: 'Romans 8: Life in the Spirit', tag: 'No Condemnation', author: 'Sarah M.', when: '5 hours ago', quote: "\"The tension between the 'flesh' and the 'Spirit' here isn't just moral; it feels ontological. It's about what sphere of reality we choose to inhabit.\"", verse: '"For those who live according to the flesh set their minds on the things of the flesh, but those who live according to the Spirit set their minds on the things of the Spirit."', citation: 'Romans 8:5', likes: 24, comments: 8, avatar: '/images/avatar_feed.jpg' },
];

export const PROFILE = {
  name: 'Theophilus',
  rank: 'Scholar Rank',
  avatar: '/images/avatar_profile_theophilus.jpg',
  progress: [
    { study: 'Zechariah 4: The Lampstand', percent: 100 },
    { study: 'Psalm 26: The Path of Integrity', percent: 100 },
    { study: 'Romans 8: Life in the Spirit', percent: 43 },
  ],
  commemorations: [
    { icon: 'emoji_objects', title: 'The Golden Bowl', study: 'ZEC 4' },
    { icon: 'shield', title: 'Path of Integrity', study: 'PSA 26' },
  ],
  reflections: [
    { date: 'Oct 24, 2024', title: 'On the Infinite Source of Oil', excerpt: 'The perpetual flow observed in the vision suggests a reliance beyond human effort, deeply challenging my current perspective on spiritual stamina...' },
    { date: 'Sep 15, 2024', title: 'Walking in Truth', excerpt: 'Vindication is not self-declared but established through a consistent, observable walk. The altar serves as the center point of this orientation...' },
  ],
} as const;
