# Walk Before Me Journey in bolt.new

Date: 2026-08-27 | Kit: `WBMJ_Bolt_Kit.zip` | Figma: https://www.figma.com/design/lODjVmlS7McOZC8FMzppeD

## 1. What the kit is

A Vite + React + TypeScript + Tailwind project that already contains the design system, the content, the routes, the shared components, and one finished page (Study Home). Bolt's job is to build the remaining ten pages from the reference HTML, one page per prompt.

| Path | Purpose |
|---|---|
| `.bolt/prompt` | Project rules Bolt must follow (tokens only, reference HTML is the spec, named exports, scope discipline) |
| `tailwind.config.js` | Every color, type role, spacing and radius token from `DESIGN.md` |
| `src/data/psalm26.ts`, `src/data/types.ts` | All copy, scripture, waypoints, lexicon, prompts, community cards, profile |
| `src/app/routes.ts`, `src/app/router.tsx` | Route table; unbuilt routes render `PlaceholderPage` |
| `src/components/` | `SiteHeader`, `SiteFooter`, `BottomNav`, `Button`, `Chip`, `Icon`, `ScriptureBlock` |
| `src/pages/StudyHomePage.tsx` | The pattern page: data in, tokens only, desktop + mobile |
| `reference/desktop/*.html` | 11 desktop layouts (1440px) |
| `reference/mobile/*.html` | 11 mobile layouts (390px, Stitch export) |
| `public/images/` | Paintings and avatars used by the pages |

Verified locally: `npm install`, `tsc -b`, `vite build`, and the Study Home page render at 1440 and 390.

## 2. Get the kit into Bolt

Bolt opens any public GitHub repository by prefixing the URL, so the fastest path is a repository.

1. Unzip `WBMJ_Bolt_Kit.zip` into a folder. Do not include `node_modules` or `dist`.
2. Create a public GitHub repository (for example `walk-before-me-journey`) and push the folder.
3. Open `https://bolt.new/~/github.com/<your-user>/walk-before-me-journey`. Bolt installs dependencies and starts the dev server.
4. If the repository must stay private, create a blank Bolt project instead and paste the files in through the chat one prompt at a time, starting with `tailwind.config.js`, `src/data/types.ts`, `src/data/psalm26.ts`, then the components. Paste each file inside a fenced code block with its path on the first line.

## 3. Set the project rules

1. Open the project settings in Bolt and find the project-level knowledge / prompt field (Bolt supports persistent instructions at account, project and team level).
2. Paste the full contents of `.bolt/prompt` there. The file also stays in the repository so the rules travel with the code.
3. Lock the files Bolt should not touch while building pages: `tailwind.config.js`, `src/data/*`, `src/components/*` (use "Lock file" in the file tree). Unlock a component only when a prompt asks for a change to it.

## 4. Build order and prompts

Run these in order. One prompt, one page. Review the preview at 1440 and 390 before the next prompt. Use "Target file" on the page file named in each prompt.

### Prompt 0: confirm the baseline

```
Run the project and open /study/psalm-26. Confirm the page matches reference/desktop/study_home_psalm_26.html at 1440px and reference/mobile/study_home_walk_before_me_psalm_26.html at 390px. Do not change any file. Report what differs, if anything.
```

### Prompt 1: shared building blocks

```
Create these components in src/components with named exports, typed props, tokens only (no hex), following the patterns in ScriptureBlock.tsx and Button.tsx:
- WaypointCard: used on the landing page; props { waypoint: Waypoint; flip: boolean }. Layout from reference/desktop/landing_psalm_26.html (image 5 columns, text 7 columns, alternating) and reference/mobile/walk_before_me_a_journey_through_psalm_26.html (stacked card with 1px parchment border and Chip header).
- TimelineNode: used on the tracker; props { waypoint: Waypoint; active: boolean }. States complete / current / locked from reference/desktop/waypoints_psalm_26.html.
- LexiconCard: props { entry: LexiconEntry }. Navy header bar with term and language, parchment body, from reference/desktop/lexicon_psalm_26.html.
- ReflectionCard: props { reflection: CommunityReflection }. Parchment card from reference/desktop/community_feed_psalm_26.html.
- JournalField: props { prompt: ReflectionPrompt; rows?: number }. Parchment card, Chip label, textarea with the .journal-lines rule lines, from reference/desktop/personal_reflection_psalm_26.html.
- IndexedCard: props { label: string; children: ReactNode; sheet?: 'navy' | 'parchment' }. 1px border, Chip label, from the reference cards.
Do not modify existing components or pages.
```

### Prompt 2: landing page

```
Replace the Landing placeholder in src/app/router.tsx with a new src/pages/LandingPage.tsx. Desktop layout: reference/desktop/landing_psalm_26.html (hero with title, subtitle, two buttons, painting on the right; then seven WaypointCard rows alternating image and text). Mobile layout: reference/mobile/walk_before_me_a_journey_through_psalm_26.html (stacked cards). Data: PSALM_26.waypoints. Buttons: "Begin the Journey" links to /study/psalm-26, "Facilitator Materials" is an outline button. SiteHeader title "Psalm 26", progress 0. Change only LandingPage.tsx and the one line in router.tsx.
```

### Prompt 3: waypoints tracker

```
Create src/pages/WaypointsPage.tsx and wire it to ROUTES.waypoints. Desktop: reference/desktop/waypoints_psalm_26.html (left 5 columns: vertical timeline of TimelineNode cards using waypoint.trackerName and waypoint.verses; right 7 columns: sticky panel for the current waypoint with Chip "Current Waypoint", image, ScriptureBlock, summary, "Enter Study" button linking to /study/psalm-26/waypoints/6 and an outline "Reflection Prompts" button). Mobile: reference/mobile/waypoints_the_path_of_integrity.html (timeline only, current card highlighted with the button inside). Change only WaypointsPage.tsx and router.tsx.
```

### Prompt 4: waypoint detail

```
Create src/pages/WaypointPage.tsx for ROUTES.waypoint (param :number). Find the waypoint in PSALM_26.waypoints; if it has no sections, render the summary and scripture only. Desktop: reference/desktop/waypoint_05_the_petition.html (main 8 columns: Chip label, display title, reference line, gold rule, hero image with the coord Chip, ScriptureBlock on parchment, commentary sections; sidebar 4 columns: lexical note on parchment with "Explore Lexicon" navy button, previous/next navigation, materials list, reflect box). Mobile: reference/mobile/waypoint_7_the_stand_psalm_26.html (single column, sidebar content stacked after the commentary). Previous/next link to number-1 and number+1; the last waypoint links "Next" to /study/psalm-26/complete. Change only WaypointPage.tsx and router.tsx.
```

### Prompt 5: personal reflection

```
Create src/pages/ReflectionPage.tsx for ROUTES.reflection. Desktop: reference/desktop/personal_reflection_psalm_26.html (title block with 4px gold left border, two JournalField cards side by side from PSALM_26.reflectionPrompts, prayer JournalField full width from PSALM_26.prayerPrompt with a local_fire_department icon, "Save Draft" outline and "Save Reflection" primary buttons right-aligned). Mobile: reference/mobile/student_reflection_the_path_of_integrity.html (stacked). Keep entries in React state only; no backend. Change only ReflectionPage.tsx and router.tsx.
```

### Prompt 6: community feed

```
Create src/pages/CommunityPage.tsx for ROUTES.community. Desktop: reference/desktop/community_feed_psalm_26.html (kicker "Modern Artifact", display title "Community", subtitle, search field and "Share Reflection" button on the right, filter Chips "All Tracks / Zechariah 4 / Psalm 26 / Romans 8", two-column grid of ReflectionCard from COMMUNITY_REFLECTIONS, last cell is the empty-slot invitation). Mobile: reference/mobile/community_feed_psalm_26_filtered.html. Filter chips filter the cards by track in React state. Change only CommunityPage.tsx and router.tsx.
```

### Prompt 7: lexicon

```
Create src/pages/LexiconPage.tsx for ROUTES.lexicon. Desktop: reference/desktop/lexicon_psalm_26.html (title block, three LexiconCard in a row from PSALM_26.lexicon, provisional-sources note with a "Print Glossary" outline button). Mobile: reference/mobile/hebrew_greek_lexicon_the_path_of_integrity.html (stacked cards). Change only LexiconPage.tsx and router.tsx.
```

### Prompt 8: profile

```
Create src/pages/ProfilePage.tsx for ROUTES.profile using PROFILE from src/data/psalm26.ts. Desktop: reference/desktop/profile_sacred_archive.html (identity card left 4 columns with avatar, name, "Scholar Rank" Chip; right 8 columns: journey progress bars, commemorations grid with filled icons, personal reflections list with a "New Entry" outline button). Mobile: reference/mobile/user_profile_sacred_archive.html. SiteHeader title "Sacred Archive". Change only ProfilePage.tsx and router.tsx.
```

### Prompt 9: commemoration

```
Create src/pages/CommemorationPage.tsx for ROUTES.commemoration. Desktop: reference/desktop/commemoration_psalm_26.html (centered 8 columns: navy "Journey Complete" block with 2px gold border, hero image, core-mandate scripture card with Chip, two-column block with the seven waypoint names (waypoint.trackerName) and the summary paragraph, "Begin New Journey" and "Share Reflection" buttons). Mobile: reference/mobile/commemoration_the_vision_of_the_lampstand_zechariah_4.html for structure only; text comes from PSALM_26. Change only CommemorationPage.tsx and router.tsx.
```

### Prompt 10: quality pass

```
Without changing layout: add alt text to every image from the waypoint name, make sure every interactive element has a visible focus state using the secondary token, run tsc and fix any type errors, and remove PlaceholderPage if no route uses it. List every file you changed.
```

## 5. Rules of thumb while iterating

- Ask for one page or one component per prompt. Bolt's own guidance: architecture first, then features one by one, and be explicit about what should and should not change.
- Use "Enhance prompt" only for new pages you describe from scratch; the prompts above are already specific.
- When Bolt restyles something it should not have, reply: "Revert the changes to <file>; only <file> should change."
- Keep chat history short: after two or three pages, ask Bolt to summarize the state, then duplicate the project and continue in the copy.
- Deploy from Bolt when the ten pages pass the checklist (Netlify is the built-in target); keep the GitHub repository as the source of truth.

## 6. Alternative: import Figma frames

Bolt can import a single Figma frame at a time ("Import from Figma" on the home page, or the plus icon in the chatbox → "Import Figma frame"; paste the frame link from right-click → Copy link to selection). It renders the frame through Anima and generates a page from the picture. This works once the SVG screens are imported into the Figma file, but it produces one-off markup with hardcoded values and no shared components, so use it only for a visual reference, not as the code base. The kit above is the code base.

## 7. Acceptance checklist per page

1. Desktop at 1440 matches the reference: same sections, same order, 1200px container, 12-column placement.
2. Mobile at 390 matches the mobile reference: 64px header, fixed 4-tab bottom nav, single column.
3. No hex values in the page file; all text comes from `src/data`.
4. `npm run build` passes with zero type errors.
5. Keyboard: every link and button reachable, focus visible.
