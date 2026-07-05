# Implementation log: Avei landing page → working timeline (Gantt)

## Final state

The landing page at `src/pages/index.astro` renders a single, full-page working timeline of the subject's life from 2019 → present, as a real Gantt chart (not a stylized one).

- **Layout**: Y-axis time (top = `now · Jul 2026`, bottom = 2019). Each life activity is one vertical track line. Tracks for overlapping activities live in parallel columns (greedy packing). Milestones are inline ticks on the track with a date+text label in a right-side column connected by a leader line.
- **Color**: Black & white only. M3 token names kept, values are `#0a0a0a` ink, 4 grays for surfaces, no teal. `prefers-color-scheme: dark` mirror inverts.
- **No kind-based visual styling**: work / community / side-project / education / volunteer tracks all look identical; type is just text in the hover tooltip.
- **Data lives in one file**: `src/data/timeline.ts`. Replace any text/date/milestone there; the chart auto-resizes.
- **Hero is minimal**: avatar + name + 1-line role + 1-line "open to" + 5 CTAs (Email, GitHub, LinkedIn, Website, "See timeline ↓").
- **No scrollspy, no animated reveal, no JS beyond app-bar scroll shadow.** Hero and timeline are the only sections.

## Iteration history (in order)

1. **M3 teal token block + 8 panel components** (Hero, Proof, Experience, Projects, BlogPreview, Community, Education, Footer) wired in `src/pages/index.astro`. Used M3 Filled/Outlined buttons, outlined cards, eyebrow-numbered sections. **Rejected**: looked like templated M3 with surface tones too close to each other.
2. **M3 polish**: added Roboto Flex + Roboto Mono + Material Symbols Outlined via 3 Google Fonts `<link>` in `Layout.astro`. Added top app bar, scroll-reveal animations, eyebrow numbers, FAB pill, hover state-layers. **Bug found**: CSS-keyframe reveal hid 30–85% of the page in screenshots; fixed by switching to a CSS animation that fires on page load (no JS observer).
3. **B/W + left-rail vertical timeline**: removed teal, switched to ink/gray. Replaced panel sections with 5 timeline entries (Work, Projects, Writing, Community, Education) on a single left rail with scrollspy active-state. **Rejected by user**: too "timeline-card panel" still, didn't merge community/work/education onto one line.
4. **Merged sections into one timeline**: deleted Experience/Projects/Community/Education/BlogPreview/Proof/Footer components. New `src/data/timeline.ts` with 13 entries (Bangunindo, GDG Cloud Jakarta, GDG Bogor, AWS UG, side projects, education, etc.). Single left-rail sequential timeline. **Rejected by user**: needed parallel/overlapping tracks, not a sequential list.
5. **Gantt with inverted y-axis (top=present)**: 3-column grid (axis | lanes | labels). Greedy column packing so overlapping activities step right. Milestones are inline ticks with right-side label column + leader lines. Column width 64px, label width 280px, axis 72px. Mobile: horizontal scroll inside the chart frame. **Initial bug**: column width 80px + label 320px + axis 72px = 992px didn't fit in 920px content area; labels overlapped rightmost tracks. Hero h1 was constrained to 360px and wrapped. **Fix applied**: reduced to 64px columns, 280px labels, made `.gantt-inner` grid `72px 1fr 280px` (was `72px auto 320px`), removed persistent track labels in favor of `title` attribute for hover tooltips, removed unconditional `min-width: 1100px` (moved to mobile-only media query), removed `max-width: 18ch` from hero h1.

## Current file structure

```
avei-astro/
├── src/
│   ├── pages/
│   │   └── index.astro              # M3 B/W token block + app bar + Hero + Timeline
│   ├── layouts/
│   │   └── Layout.astro              # 3 Google Fonts links, body reset, Vuetify safety net
│   ├── components/
│   │   └── landing/
│   │       ├── Hero.astro            # simplified: avatar + name + role + "open to" + 5 CTAs
│   │       └── Timeline.astro        # the Gantt component
│   ├── data/
│   │   └── timeline.ts               # 13 entries, PRESENT = {year: 2026, month: 7}
│   ├── content/
│   │   └── blog/                     # 2 mdx posts, untouched
│   └── assets/
│       └── avei.jpg                  # avatar
```

Deleted (do not recreate): `Experience.astro`, `Projects.astro`, `Community.astro`, `Education.astro`, `BlogPreview.astro`, `Proof.astro`, `Footer.astro`.

## Data model (src/data/timeline.ts)

```ts
export type EntryKind = 'work' | 'community' | 'education' | 'project' | 'volunteer';

export interface Milestone {
  date: { year: number; month?: number };  // month is 1-12, optional
  text: string;
  tags?: string[];                          // max 4-5
}

export interface TimelineEntry {
  id: string;                               // url-safe
  title: string;                            // e.g. "Bangunindo Teknusa Jaya"
  subtitle: string;                         // e.g. "Software Engineer — Backend"
  kind: EntryKind;                          // used for hover tooltip text only, not styling
  start: { year: number; month?: number };
  end: { year: number; month?: number } | 'present';
  location?: string;
  summary?: string;
  milestones: Milestone[];
}

export const PRESENT = { year: 2026, month: 7 };
```

## Gantt component algorithm (Timeline.astro)

1. Sort entries by `start.year` then `start.month` ascending.
2. Greedy column pack: for each entry in order, find first column where the previous column's end date ≤ this entry's start date; if none, open a new column to the right.
3. Time span: from `earliest` (min start) to `now` (PRESENT). `PX_PER_MONTH = 28`, `CHART_HEIGHT = totalMonths * 28`.
4. Y-position: `yTop(d) = (totalMonths - monthsFromEarliest(d)) * PX_PER_MONTH` (so top = present, bottom = 2019).
5. Render: 3-column grid `72px 1fr 280px` = axis | lanes | labels. Each track is `position: absolute; left: column * 64 + 32; top: yStart; height: yEnd - yStart;` with start dot (`::before`) and end dot (`::after`, ink-filled if `end === 'present'`). Each milestone is a 12px×1px tick at `left: column * 64 + 32; top: yTop(date)`. Each label is `position: absolute; top: yTop(date);` in the right column with a `::before` leader line going 16px left.

## Hard-won lessons

- **Don't trust sub-agents' visual reports.** Two different agents viewing the same screenshot of the original M3 page reported "raw unstyled HTML" when the page was actually fully styled — they hallucinated plausible-sounding visual reports without actually parsing the pixels. Always verify with `browser_evaluate` getComputedStyle/getBoundingClientRect or pixel sampling.
- **B/W minimalist is harder than colorful** because the only signal left is weight, size, and spacing. Get those wrong and the page looks "raw" even when it's correct.
- **Gantt-on-mobile is horizontal scroll inside a `min-width: NNNNpx` container**, not a stacked layout. Visitors accept horizontal scroll for Gantt; a stacked fallback breaks the "this is a Gantt" reading.
- **CSS grid `1fr` works for the middle column when the side columns have fixed widths** — but only if you also set `min-width: 0` (or just don't set min-width at all on the middle column, which is the default). The old `auto` middle column greedily took space and broke the fixed-width label column.
- **Hero h1 wrapping from a child constraint** is a common Astro bug. Always check the actual `getBoundingClientRect().width` of the h1 vs its text — if text wraps but the parent is wide, there's a child max-width or sibling column constraining it.
- **The Playwright MCP writes screenshots to a sibling project dir** (`/home/avei/GithubRepo/playground/avei-nuxt/.playwright-mcp/...`) regardless of the active project. Always `cp` them back into the project root.
- **The `read_file` tool can't see PNG files at the project root** (path resolution rejects them); copy screenshots into `src/.shots/` or a similar subdirectory, or use pixel sampling via `python3 -c "from PIL import Image; ..."` in a terminal.

## Validation pattern

After every redesign, run `bun run build` (clean, 6 pages, ~6s) and a Python pixel check on the fullpage screenshot:

```python
from PIL import Image
img = Image.open('landing-X.png')
# teal == 0
# ink > 1000
# vertical track lines: count mid-gray columns with > 200 pixels
# empty bins (< 50 colored pixels in 5%-of-height bin) <= 2
```

Also use `browser_evaluate` to check live layout:
```js
const h1 = document.querySelector('h1').getBoundingClientRect();
const frame = document.querySelector('.gantt-frame').getBoundingClientRect();
const lanes = document.querySelector('.gantt-lanes').getBoundingClientRect();
const labels = document.querySelector('.gantt-labels').getBoundingClientRect();
// h1.w >= 600, h1.h < 50 (one line)
// frame.w == inner.w (no horizontal scroll on desktop)
// labels.x >= lanes.right + gap (no overlap)
```

## What was deliberately not included

- No M3 NavigationBar, FAB, or top app bar beyond a 64px sticky bar with avatar + 4 contact links.
- No scrollspy active-state (the Gantt is one continuous chart, not discrete sections).
- No kind-based color or shape distinction (B/W only).
- No per-track deep-link anchors (only `#timeline`).
- No webfont/typography work beyond the 3 Google Fonts links.
- No dark-mode-specific design (just an inverted token block; design is light-mode first).

## If the user asks to refine the data later

Point them at `src/data/timeline.ts`. Single file, typed entries, sorted ascending. Add a new entry → it auto-appears. Edit a milestone text → the right-side label updates. Change `end: 'present'` to a specific date → that track's "present" filled dot becomes a hollow dot.
