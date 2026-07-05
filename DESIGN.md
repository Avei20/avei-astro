# avei-astro — Design

## 1. TL;DR

The design system is two surfaces. The **home page** is a black-and-white, B/W-minimal landing page that does one thing: shows a working timeline (a Gantt chart) of the subject's life from 2019 to the present, with a quiet hero and a sticky app bar above it. Tokens are M3-named but B/W-valued, defined once at the page level. The **other apps** in the same repo (`/chat`, `/graph`) keep the original Vue 3 + Vuetify 4 stack with the M3 teal-ish token block — they are out of scope for this revision and untouched. The blog (`/blog`) is a separate, content-collection-driven, Vuetify-free surface.

## 2. What changed in this revision

- **Home page collapsed from 7 sections to 2.** The previous spec had a hero, metrics strip, proof card, work history, education, community, and side projects. All of that is gone except the hero and a single working timeline (Gantt).
- **Single source of truth for timeline data.** All entries (work, education, community, project, volunteer) live in one file (`src/data/timeline.ts`) and render as parallel tracks on the same Gantt. Side projects, community work, education, and work are no longer separate sections.
- **No kind-based visual distinction.** `work` / `education` / `community` / `project` / `volunteer` are typed but not styled. The `kind` field is currently only used in the hover `title` attribute on the track.
- **Color palette moved from teal M3 to B/W minimal.** M3 token names are preserved, values changed. Teal is at 0.
- **Webfonts added** (no new npm deps): Roboto Flex, Roboto Mono, Material Symbols Outlined — all loaded from Google Fonts CDN via three `<link>` tags in `Layout.astro`.
- **No Vuetify on the home.** The top app bar, hero, and Gantt are plain Astro + scoped CSS. The M3 Vuetify mapping from the previous doc is gone for the home (it still applies to `/chat` and `/graph`).
- **"Latest posts" preview removed** from the home. The blog is reached via the app bar's GitHub/LinkedIn links or a direct URL.
- **Metrics / proof-card / delta-strip removed.** Numeric deltas (when used) live inline as mono text in milestone copy. No animated counters, no "I shipped X services" stat row.
- **Content voice** is now spelled out as "outcomes over tool lists" — milestone text describes what was BUILT and what changed, not the stack.
- **One visual idea per page**: the Gantt is the page. Everything else (app bar, hero) defers to it.

## 3. Design principles

- **Content over decoration.** The page exists to communicate "this is what I've been doing, in what order, and for how long." Visual elements earn their place by making the data clearer, not by filling space.
- **Mobile first; works at 320 px.** Tested at 320, 390, 768, 1024, 1280, 1536. On narrow screens the Gantt becomes horizontally scrollable inside its frame; visitors accept that for a Gantt.
- **One visual idea per page.** Home = the Gantt. Hero + app bar are the wrapper. No second act.
- **Static where possible.** Astro before client islands. The only client-side JS on the home is a 6-line scroll-shadow handler for the app bar.
- **No kind-based visual distinction in the timeline.** work, community, education, project, and volunteer all look the same on the chart. The `kind` field is text, not a color or a glyph. (A track is just a vertical line with two dots.)
- **Real data structures, not curated prose.** The timeline is a typed TS array with `start`, `end`, `milestones`. Hero copy, role, and CTAs are props / constants. The shape of the data is the schema; prose is data.
- **Don't ship what's not asked for.** No search, no filter, no tags page, no newsletter, no comments, no animated counters, no scroll-triggered reveals. The home is `astro build` → static HTML.
- **Token names outlive values.** Component code references `--md-sys-color-primary` etc. The light value is B/W ink; dark mode inverts to B/W paper. Renaming the tokens would be a breaking change; recoloring them is a one-line edit.
- **One file owns each piece of truth.** Timeline data lives in `src/data/timeline.ts`. M3 tokens live in `src/pages/index.astro`. Webfont links live in `Layout.astro`. No duplication.

## 4. Pages

### 4.1 Home — the new landing page (`src/pages/index.astro`)

**Purpose.** A working timeline of the subject's life, 2019 → present. Visitors land, see who the subject is (hero), see what they're doing right now (top of the Gantt, the "now" tick), and scroll down for earlier chapters. The "open to" line and the Email CTA are present in case the visitor wants to collaborate.

**Layout.** Two sections in `<main>`:
1. A quiet hero (avatar, name, 1-line role, 1-line "open to", 5 CTAs).
2. A Gantt-style working timeline (3-column grid: y-axis | lanes | right-side labels).

Above `<main>` is a sticky top app bar (32px avatar + "Avei" wordmark on the left, 4 text links on the right).

**Files involved:**

- `src/data/timeline.ts` — typed entries. One file owns the data.
- `src/components/landing/Hero.astro` — renders the hero.
- `src/components/landing/Timeline.astro` — renders the Gantt.
- `src/pages/index.astro` — assembles them, owns the M3 B/W tokens (via `<style is:global>` on `:root`), owns the top app bar, owns the 6-line scroll-shadow inline script.

**The Gantt (`src/components/landing/Timeline.astro`).** Renders a 3-column CSS grid inside a scrollable frame:

| Column | Width | Contents |
| --- | ---: | --- |
| Y-axis | `72px` | Year + "now" tick labels (mono, right-aligned). |
| Lanes | `1fr` (≥ `64px × total-columns`) | Vertical column strips + tracks + milestone ticks. |
| Labels | `280px` | Right-side date / text / tags, connected by a 16 px leader line. |

Grid gap: `20px`. On mobile (`max-width: 719px`), the inner grid gets `min-width: 1100px` to force horizontal scroll inside the frame; the `↔ scroll` hint above the chart becomes visible at `max-width: 1119px`.

**Y-axis** — inverted time. Top of the chart = `now · Jul 2026` (the value of `PRESENT` in `src/data/timeline.ts`). Bottom of the chart = August 2019 (the earliest `start` in the data). Vertical density is `28px` per month. Year boundaries are drawn stronger than month boundaries; the "now" tick is uppercase + `font-weight: 700`.

**Tracks** — one per timeline entry, sorted ascending by `start`. Tracks are greedy-packed into columns: overlapping activities get adjacent columns. Each track is a `1px` vertical line at the column's x-center, with a hollow start dot (5 px ring) and a hollow end dot. The end dot is ink-filled (`background: var(--md-sys-color-primary)`) when `entry.end === 'present'`, with a `3px` surface-color ring around it as a halo.

**Milestones** — inline `14px × 1px` tick on the track at the milestone's date, with a `7px` hollow dot at the left edge. A right-side label is connected to the tick by a `20px` (left of label) leader line, rendered via `.gantt-label::before`.

**No kind-based styling.** `work` / `community` / `education` / `project` / `volunteer` look identical on the chart. The `kind` field is only present in the data and only surfaces in the hover `title` attribute on each `.gantt-track` (`title={`${entry.title} — ${entry.subtitle}`}`). There is no persistent track label; hover is the only way to see which track is which without reading the milestone labels.

**Mobile behavior.** The `.gantt-frame` is `overflow-x: auto`. The inner `.gantt-inner` has `min-width: 1100px`, so a narrow viewport scrolls horizontally inside the frame. The `↔ scroll` hint above the chart is hidden on desktop and shown below `1119px`.

**Data model** (`src/data/timeline.ts`):

```ts
export type EntryKind = 'work' | 'community' | 'education' | 'project' | 'volunteer';

export interface Milestone {
  date: { year: number; month?: number };
  text: string;
  tags?: string[];
}

export interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string;
  kind: EntryKind;
  start: { year: number; month?: number };
  end: { year: number; month?: number } | 'present';
  location?: string;
  summary?: string;
  milestones: Milestone[];
}

export const PRESENT = { year: 2026, month: 7 };
```

`PRESENT` is the canonical "now." It is hardcoded (system date in this environment is 2026-07). The component uses it to convert `end: 'present'` to a real `Date` and to anchor the top of the inverted y-axis. When the calendar passes it, bump it manually.

**Hero (`src/components/landing/Hero.astro`).**

- `96px` circular avatar (1px outline-variant border, `object-fit: cover`).
- Name as `<h1>`, `font-size: var(--font-headline-lg)`, `font-weight: 600`, `letter-spacing: -0.015em`. The `clamp(1.75rem, 1.3rem + 1.8vw, 2.25rem)` scale lands at 28 px on mobile, 32–36 px on desktop.
- 1-line role (`var(--font-body-lg)`, `color: on-surface-variant`, `max-width: 52ch`).
- 1-line "open to" location line (`var(--font-label-md)`, mono, muted).
- 5 CTAs in a `.cta-row` (flex-wrap, 0.75 rem gap):

| CTA | Style | Notes |
| --- | --- | --- |
| `Email me` | Filled (ink bg, paper text, ink border) | Leading `mail` glyph, trailing `arrow_forward` glyph. |
| `GitHub` | Outlined | Text only. |
| `LinkedIn` | Outlined | Text only. |
| `Website` | Outlined | Trailing `open_in_new` glyph. |
| `See timeline ↓` | Outlined (acts as text) | `href="#timeline"`, trailing `arrow_downward` glyph. |

Buttons are `40px` tall, `1.5rem` horizontal padding, `shape-corner-full`. Filled button hover → `ink-2` bg + `elevation-1`. Outlined button hover → fills with `ink` and inverts text to `paper` + `elevation-1`. State-layer overlays are implemented with a `::before` pseudo-element at `opacity: 0.08` hover / `0.12` active.

On narrow screens, the CTA row wraps. The primary CTA stays full-width when wrapped, secondary CTAs flow.

**Top app bar.**

- `64px` tall (effectively — the inner padding is `12px 24px`).
- `position: sticky; top: 0;` so it persists as the visitor scrolls the long timeline.
- `background: var(--md-sys-color-surface)` (paper in light mode, ink in dark mode). Bottom border `1px solid var(--md-sys-color-outline-variant)`.
- `box-shadow: var(--md-sys-elevation-1)` toggled via a `is-scrolled` class when `window.scrollY > 4`. The handler is 6 lines of inline `<script is:inline>` at the end of `<main>` in `src/pages/index.astro`:
  ```js
  const bar = document.getElementById("app-bar");
  const onScroll = () => {
      if (bar) bar.classList.toggle("is-scrolled", window.scrollY > 4);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  ```
- Left: a `<a class="app-bar-brand">` containing a `32px` circular avatar + the "Avei" wordmark (`title-md`, weight 600, letter-spacing -0.01em). The brand links to `#top`.
- Right: a `<nav class="app-bar-nav">` of 4 text links (Email, GitHub, LinkedIn, Website) in `label-lg` weight 500, `on-surface-variant` color, with a hover state-layer overlay that brings the color to ink.
- Mobile (`max-width: 719px`): the nav is `display: none`. The brand stays. Mobile visitors reach contact via the hero CTAs.

### 4.2 Blog

Unchanged in this revision. Documented briefly because it ships from the same project:

- Collection: `src/content.config.ts` defines a `blog` collection via the `glob` loader over `**/*.mdx` under `src/content/blog`. Schema: `title`, `description`, `pubDate`, `updatedDate?`, `tags[]`, `heroImage?`.
- Posts currently: `hello-world.mdx`, `my-first-project.mdx`.
- Index: `src/pages/blog/index.astro` — lists posts in the collection.
- Post template: `src/pages/blog/[...slug].astro` — wraps MDX content. Reading width `720px`, body `18px`, code blocks in mono with horizontal scroll on overflow.
- Reached via direct URL only from the home. The "Latest posts" preview that the previous spec had is gone.

### 4.3 Other apps (chat, graph)

Out of scope for this revision. `src/pages/chat/index.astro` and `src/pages/graph/index.astro` still use Vue 3 + Vuetify 4.1 with the M3 Vuetify mapping from the previous design (`v-theme-primary`, `bg-primary`, etc.). The M3 Vuetify component mapping that used to be in this doc still applies to them — it is intentionally not duplicated here, since the doc is now landing-page focused.

## 5. Tokens

### 5.1 Color (B/W, M3-named)

The B/W palette lives at the page level in `src/pages/index.astro` `<style is:global>` on `:root`. M3 token names are kept so component code can reference `--md-sys-color-primary` etc. without knowing the value. Dark mode inverts the values inside `@media (prefers-color-scheme: dark)`.

| M3 token | Light value | Dark value | Use |
| --- | --- | --- | --- |
| `--md-sys-color-primary` | `#0a0a0a` | `#f5f5f5` | Filled buttons, active track-end dot, "now" tick. |
| `--md-sys-color-on-primary` | `#ffffff` | `#0a0a0a` | Text on primary fills. |
| `--md-sys-color-primary-container` | `#e5e5e5` | `#1a1a1a` | Tonal surfaces (FAB-style chips). |
| `--md-sys-color-on-primary-container` | `#0a0a0a` | `#f5f5f5` | Text on primary-container. |
| `--md-sys-color-secondary` | `#525252` | `#a3a3a3` | Mid-gray text, secondary buttons. |
| `--md-sys-color-on-secondary` | `#ffffff` | `#0a0a0a` | Text on secondary. |
| `--md-sys-color-secondary-container` | `#f5f5f5` | `#1a1a1a` | Tag chip bg, milestone tag strip. |
| `--md-sys-color-on-secondary-container` | `#0a0a0a` | `#f5f5f5` | Text on secondary-container. |
| `--md-sys-color-tertiary` | `#404040` | `#d4d4d4` | Reserved (was used for proof deltas; available for a future accent). |
| `--md-sys-color-on-tertiary` | `#ffffff` | `#0a0a0a` | Reserved. |
| `--md-sys-color-tertiary-container` | `#f5f5f5` | `#1a1a1a` | Reserved. |
| `--md-sys-color-on-tertiary-container` | `#0a0a0a` | `#f5f5f5` | Reserved. |
| `--md-sys-color-error` | `#b91c1c` | `#f87171` | Reserved. Single warm tone, used only for accessibility state (form errors, etc.). |
| `--md-sys-color-on-error` | `#ffffff` | `#0a0a0a` | Reserved. |
| `--md-sys-color-surface` | `#ffffff` | `#0a0a0a` | Page background, app bar background. |
| `--md-sys-color-on-surface` | `#0a0a0a` | `#f5f5f5` | Primary text. |
| `--md-sys-color-surface-variant` | `#f5f5f5` | `#1a1a1a` | Tonal bands. |
| `--md-sys-color-on-surface-variant` | `#525252` | `#a3a3a3` | Secondary text, axis labels, hint text. |
| `--md-sys-color-surface-container-lowest` | `#ffffff` | `#000000` | High-elevation surface (modal-style). |
| `--md-sys-color-surface-container-low` | `#fafafa` | `#141414` | Cards. |
| `--md-sys-color-surface-container` | `#f5f5f5` | `#1a1a1a` | Tonal bands, app bar tonal alt. |
| `--md-sys-color-surface-container-high` | `#ededed` | `#2a2a2a` | Chip hover. |
| `--md-sys-color-surface-container-highest` | `#e5e5e5` | `#404040` | Strong tonal. |
| `--md-sys-color-outline` | `#525252` | `#a3a3a3` | Track lines, milestone ticks, button outlines. |
| `--md-sys-color-outline-variant` | `#e5e5e5` | `#2a2a2a` | Column separators, axis divider, leader lines, app-bar border. |

**Shorthand aliases** (also on `:root`, used in component CSS for terseness):

```css
--ink: #0a0a0a;   /* ≈ primary in light, on-surface in dark */
--ink-2: #1a1a1a; /* one step lighter than ink, used on filled :hover */
--ink-3: #2a2a2a; /* two steps lighter, used on filled :active */
--mid:  #525252;  /* ≈ secondary */
--muted:#a3a3a3;  /* ≈ on-surface-variant in light */
--line: #e5e5e5;  /* ≈ outline-variant in light */
--line-2:#d4d4d4;
--paper:#ffffff;  /* ≈ surface in light */
--paper-2:#fafafa;
--paper-3:#f5f5f5;
```

These are read alongside the M3 tokens, not instead of them. The Gantt and Hero reference both (`background: var(--ink)` for fills, `background: var(--md-sys-color-primary)` for active dots, so dark-mode inversion works automatically through the M3 token).

**State layers.** Hover / active / focus overlays are `currentColor` (or the resolved `--ink`) at 8 % / 12 % / 16 % opacity, implemented with a `::before` pseudo-element and a 200 ms transition. The pattern is reused across the app-bar nav links, outlined buttons, and the Gantt's track/milestone hover. No background-color animations on the element itself.

### 5.2 Typography (M3 type scale, fluid via `clamp`)

Display and body use **Roboto Flex** (loaded via Google Fonts in `Layout.astro`). Mono uses **Roboto Mono**. Icons use **Material Symbols Outlined** for `mail`, `arrow_forward`, `arrow_downward`, `open_in_new`, `handshake`, etc.

| Token | Size (`clamp` / fixed) | Weight | Use |
| --- | --- | ---: | --- |
| `--font-display` | `clamp(2.25rem, 1.6rem + 3vw, 3rem)` | 700 | H1 hero (display) — reserved, current hero uses headline-lg. |
| `--font-headline-lg` | `clamp(1.75rem, 1.3rem + 1.8vw, 2.25rem)` | 600 | `<h1>` on hero, `<h2>` on Gantt. |
| `--font-headline-md` | `clamp(1.5rem, 1.2rem + 1.2vw, 1.75rem)` | 600 | Section h2. |
| `--font-title-lg` | `1.375rem` | 600 | Card titles. |
| `--font-title-md` | `1rem` | 600 | App-bar brand wordmark, sub-headings. |
| `--font-body-lg` | `1.0625rem` | 400 | Hero role line. |
| `--font-body-md` | `0.9375rem` | 400 | Gantt label text, page body. |
| `--font-label-lg` | `0.875rem` | 500 | Button labels, app-bar nav links. |
| `--font-label-md` | `0.8125rem` | 500 | Eyebrow text, dates, "open to" line. |
| `--font-label-sm` | `0.75rem` | 500 | Tiny labels, axis ticks, tag chips, hint text. |

**Font stacks** (on `:root`):

```css
--md-ref-typeface-brand: "Roboto Flex", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--md-ref-typeface-plain: "Roboto Flex", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--md-ref-typeface-mono:  "Roboto Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
```

`brand` and `plain` are intentionally identical for now (single sans family). `mono` is the only mono.

**Webfont loading** (`src/layouts/Layout.astro`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,400;8..144,500;8..144,700&family=Roboto+Mono:wght@400;500&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" />
```

All `<link>`s use `display=swap`. No webfont npm packages; everything comes from the Google Fonts CDN.

### 5.3 Shape (M3 shape scale)

| Token | Value | Use |
| --- | ---: | --- |
| `--md-sys-shape-corner-none` | `0` | — |
| `--md-sys-shape-corner-xs` | `4px` | Small chips, focus ring. |
| `--md-sys-shape-corner-sm` | `8px` | Tag chips. |
| `--md-sys-shape-corner-md` | `12px` | Cards, leader-line start radius. |
| `--md-sys-shape-corner-lg` | `16px` | (Reserved) |
| `--md-sys-shape-corner-xl` | `28px` | (Reserved) |
| `--md-sys-shape-corner-full` | `9999px` | Buttons, dots, kind chips, app-bar nav, app-bar avatar. |

### 5.4 Elevation

Subtle. Used sparingly. Dark mode increases shadow opacity to remain visible against ink.

| Token | Light value | Use |
| --- | --- | --- |
| `--md-sys-elevation-1` | `0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 1px rgb(0 0 0 / 0.07)` | App bar when scrolled; card hover. |
| `--md-sys-elevation-2` | `0 1px 2px 0 rgb(0 0 0 / 0.06), 0 2px 6px 2px rgb(0 0 0 / 0.10)` | (Reserved for FAB-style floating elements.) |

Dark mode equivalent: `0 1px 2px 0 rgb(0 0 0 / 0.5), 0 1px 3px 1px rgb(0 0 0 / 0.4)` for elevation-1.

## 6. Gantt-specific tokens

These are page-level constants, not CSS custom properties — they're used in the Astro frontmatter for layout math.

| Constant | Value | Why |
| --- | ---: | --- |
| `PX_PER_MONTH` | `28` | Vertical density. One row per month, readable at 1280 px width. |
| `COLUMN_WIDTH` | `64` | Horizontal density. Fits 7+ parallel tracks in a 528 px lanes area. |
| `LABEL_WIDTH` | `280` | Right-side label column (date + text + tags). |
| `AXIS_WIDTH` | `72` | Y-axis (year/month labels). |
| `TRACK_DOT_SIZE` | `9px` (CSS) | Track start/end dot diameter (hollow ring). |
| `MILESTONE_DOT_SIZE` | `7px` (CSS) | Milestone tick dot diameter. |
| `LEADER_LINE_LENGTH` | `20px` (CSS `left: -20px`) | Distance from milestone tick to label box edge. |
| `MOBILE_MIN_WIDTH` | `1100px` (CSS) | Min width of `.gantt-inner` on mobile to force horizontal scroll. |

These are not currently in CSS custom properties because they're used in JS math (column packing, y-positions, axis tick generation). If/when the Gantt becomes interactive (zoom, pan), promote them to CSS variables.

## 7. Spacing

8 px grid: `xs=4, sm=8, md=16, lg=24, xl=32, 2xl=48, 3xl=64, 4xl=96`.

| Container | Mobile | Desktop |
| --- | --- | --- |
| `<main>` padding | `1.5rem 1.5rem 4rem` (`max-width: 719px`) | `2rem 2rem 5rem` (`min-width: 720px`) |
| `<main>` content max-width | `920px` | `920px` |
| App-bar inner padding | `12px 24px` | `12px 24px` |
| Gantt section bottom padding | `64px` | `64px` |
| Hero band | `1.5rem 0 2.5rem` | inherited from main |

## 8. Components (what's on the home page)

**Top app bar**

- `64px` effective height, sticky, `surface` background, `outline-variant` bottom border, `elevation-1` shadow when scrolled.
- Left: `32px` circular avatar + "Avei" wordmark.
- Right: 4 text links (Email, GitHub, LinkedIn, Website), `label-lg` weight 500.
- Mobile: nav hidden; brand only.

**Hero**

- `96px` avatar, name (`headline-lg` clamp, weight 600, letter-spacing -0.015em), role line (`body-lg`, `on-surface-variant`, `max-width: 52ch`), "open to" line (`label-md`, mono, muted), 5 CTAs in a row.
- Filled CTA = ink bg, paper text, `shape-corner-full`. Outlined CTA = transparent bg, ink border, ink text, `shape-corner-full`; hover fills with ink and inverts text. Text-style CTA = transparent bg, ink text, optional arrow glyph.
- Min tap target 44 px (button is 40 px tall + 2 px outline offset ≈ 44 px hit area; verified at mobile tap). Visible focus ring (`3px` outline + `2px` offset, ink color).

**Gantt chart**

- 3-column grid (`72px 1fr 280px`, gap `20px`) inside a `min-width: 1100px` scrollable frame on mobile.
- Track line: `1px` wide, `outline` color.
- Track dots: `9px` diameter hollow circles, `1.5px` outline border. End dot is ink-filled when `entry.end === 'present'`, with a `3px` surface-color halo.
- Milestone tick: `14px` wide × `1px` tall, with a `7px` hollow dot at the left edge.
- Right-side label: date (`label-sm`, mono, uppercase, `on-surface-variant`) + text (`body-md`, on-surface) + tag strip (`label-sm`, mono, `on-surface-variant`, `·`-separated).
- Leader line: `20px`, `outline-variant` color, drawn with `.gantt-label::before`.

**Tag chip** (milestone tags, when present)

- `secondary-container` bg, `on-secondary-container` text, `label-sm`, `shape-corner-sm`, `2px 8px` padding.
- The current Gantt renders tags inline as a `·`-separated `label-sm` mono strip, not as discrete chips. Promote to chips only if a milestone has more than 3 tags.

**Material Symbols Outlined icons**

- `mail` (Email CTA lead), `arrow_forward` (Email CTA trail), `open_in_new` (Website CTA trail), `arrow_downward` (See timeline trail). All `aria-hidden="true"`; the parent `<a>` carries the accessible name.

## 9. Accessibility

- **Contrast.** WCAG AA minimum. All B/W + gray pairings on the home pass; the only non-gray is `--md-sys-color-error`, reserved for state. `on-surface` (#0a0a0a) on `surface` (#ffffff) = 19.3:1. `on-surface-variant` (#525252) on `surface` (#ffffff) = 7.5:1.
- **Focus.** All interactive elements have a `:focus-visible` ring: `3px` solid `var(--ink)` outline + `2px` offset, `border-radius: var(--md-sys-shape-corner-xs)`. Implemented in `index.astro` as a global `:global(a:focus-visible), :global(button:focus-visible)` rule.
- **Tap targets.** Min 44 × 44 px hit area. Buttons are 40 px tall; the focus outline + padding push the effective hit area past 44 px on touch.
- **Semantic structure.** `<header>` for the app bar, `<main>` for the page, `<header class="hero">` for the hero (it carries the `<h1>`), `<section id="timeline">` for the Gantt (it carries the `<h2>`). Tracks are `<div>`s, not headings; their information is in the hover `title` and the milestone labels.
- **Accessible names.** All `<a>` and `<button>` elements have an accessible name. The Email CTA's "Email me" is its name; the trailing `arrow_forward` icon is `aria-hidden`. The "See timeline" link has `aria-label="See timeline"` to make the arrow glyph redundant.
- **Images.** `<img>` elements have `alt` text. The app-bar avatar has `alt=""` (decorative, name is the wordmark next to it).
- **Color scheme.** Page has `prefers-color-scheme: dark` token block that mirrors the light values.
- **Motion.** `prefers-reduced-motion: reduce` kills all transitions and animations across the home. Implemented globally in `index.astro`:
  ```css
  @media (prefers-reduced-motion: reduce) {
      :global(*),
      :global(*::before),
      :global(*::after) {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
      }
  }
  ```
  Plus local reduced-motion overrides in Hero.astro (transforms off on hover) and Timeline.astro (`-webkit-overflow-scrolling: auto`).

## 10. Responsive rules

Breakpoints: `720px` (mobile → tablet), `900px` (tablet → desktop). The Gantt adds `1120px` as the threshold for showing the `↔ scroll` hint.

Mobile (default, `<720px`):

- Single column. Hero stacks. Gantt chart enters `overflow-x: auto` mode with `min-width: 1100px` on `.gantt-inner` to force horizontal scroll. The `↔ scroll` hint appears at the top of the Gantt. App-bar nav hidden.
- `<main>` padding: `1.5rem 1.5rem 4rem`.

Tablet (`≥720px`, `<900px`):

- Hero is full-width single-column. CTAs may wrap to 2 rows. App-bar nav becomes visible. Gantt is still likely to scroll horizontally depending on column count.
- `<main>` padding: `2rem 2rem 5rem`.

Desktop (`≥900px`):

- Gantt's 3-column grid is active and the content area is `max-width: 920px` with auto margins. The Gantt's lanes are `1fr` to fill the frame. All app-bar nav visible.

Test widths: 320, 390, 768, 1024, 1280, 1536.

## 11. Content voice

- **Direct and specific.** No "passionate about X." A milestone says what was BUILT and what CHANGED.
- **Outcomes over tool lists.** Milestone text leads with the result ("infra cost ↓ ~400%", "cache-hit latency ↓ ~96%"). The tool list goes in the `tags` array, not the prose. Example: "Architected Redis caching for historical + real-time data; cache-hit latency ↓ ~96%." with `tags: ['Redis']`.
- **Active voice.** "Shipped," "Migrated," "Joined." No "was responsible for."
- **Short.** A milestone is one line of `body-md` text. A role line is one sentence. The hero "open to" line is one sentence.
- **No marketing fluff.** No "passionate about," "love building," "driven by." No emoji.
- **Honest numbers.** When a number is given, it has a unit and a comparison ("↓ ~400%" relative to the prior PHP service, "↓ 96%" cache-hit latency). Soft numbers use `~`. Hard numbers are exact.
- **The "open to" line is plain English.** Says what is wanted AND what is offered.

## 12. Implementation guidance

- **One file owns the timeline data.** `src/data/timeline.ts`. Do not duplicate the data into `Timeline.astro` or any other component. Pass it in via `entries` prop if you ever need a fixture.
- **M3 B/W tokens are defined once** in `src/pages/index.astro` `<style is:global>` on `:root` (with the `prefers-color-scheme: dark` block immediately after). Do not redefine in components. Reference them by M3 name (`--md-sys-color-primary`, etc.).
- **Webfonts come from Google Fonts CDN** via 3 `<link>` tags in `Layout.astro`. Do not add webfont npm packages. Do not self-host. The `<link>`s are preconnect + the two `css2?family=...` stylesheets, all with `display=swap`.
- **The Gantt component is a single `.astro` file** (`src/components/landing/Timeline.astro`). No external helpers. All math (column packing, y-position calculation, axis tick generation, milestone placement) lives in the frontmatter. No JS at runtime.
- **No JS in components.** The only client-side script on the home is the 6-line app-bar scroll-shadow handler in `src/pages/index.astro`. Use `is:inline` so Astro doesn't try to bundle it.
- **Do not introduce Vue on the home page.** The home is pure Astro + scoped CSS. Other apps still use Vue + Vuetify; that's fine, just not here.
- **Do not add new npm dependencies.** The M3 B/W palette is a `<style is:global>` block, not a design-system package. Roboto Flex / Roboto Mono / Material Symbols are CDN `<link>`s, not `@fontsource/*` packages.
- **No `.md` docs.** This DESIGN.md is the only design doc. Do not create additional spec files. If a section grows, fold it into this file.
- **Bump `PRESENT` in `src/data/timeline.ts`** when the calendar passes `2026-07`. The component renders against the constant, not `new Date()`.

## 13. Validation

- **Build.** `bun run build` must complete in <10 s with 6 pages (`/`, `/blog`, `/blog/[...slug]` × 2 posts, `/chat`, `/graph`) and no warnings.
- **Layout probe.** `browser_evaluate` to verify:
  - `.gantt-inner` has `grid-template-columns: 72px <computed> 280px`.
  - `.gantt-lanes` has `min-width: calc(64px * <N>)` where `N` matches the greedy-packed column count.
  - The hero `<h1>` has `font-size` matching the `clamp(1.75rem, 1.3rem + 1.8vw, 2.25rem)` interpolation at the current viewport width.
- **Pixel check.** `bun run build` + Playwright screenshot at 1280 px and 390 px, then a Python pixel-count check:
  - teal pixels = 0 (palette is B/W)
  - ink pixels (luminance < 0.1) > 1000 on the desktop screenshot
  - track lines (mid-gray vertical strokes of ~1 px width spanning > 100 px of height) ≥ 3
  - empty bins (< 50 colored pixels in a 5%-of-height slice of the Gantt area) ≤ 2
- **Accessibility probe.** `browser_snapshot` at 1280 px to verify heading order (h1 hero → h2 timeline → h3 none) and that every link has an accessible name.

## 14. Out of scope

- Search, filter, tags pages, pagination, newsletter signup, comments — not on the home, not needed until content volume justifies them.
- Animated counters, scroll-triggered reveals, page-load choreography — the Gantt is static; the user scrolls and reads.
- Dark-mode-specific design beyond an inverted token block. Don't author dark-mode-specific components.
- Resume PDF / downloadable CV route — add only when asked.
- Side projects or community work as separate sections — they're entries on the timeline. Promoting them to a section would split the data and break the single visual idea.
- Refining the timeline data — the entries in `src/data/timeline.ts` are editable placeholders. The user will replace them with their own.
- A 404 / 500 design — use the default Astro page until asked.
- i18n — the timeline is English-only. The data file is plain TS; internationalizing it is a future refactor.
- A "now" line that auto-updates — `PRESENT` is a constant. Don't wire it to `new Date()`; that would cause the Gantt to drift across builds.

## 15. Open questions for the user

- **Should the timeline data move from `src/data/timeline.ts` to a content collection** (so the user can write entries as MDX files with frontmatter, the same way blog posts work)? Currently `.ts` is simpler and type-checks at build time, but a content collection would be more user-friendly for non-dev updates. Trade-off: a content collection needs a zod schema, a loader, and a rebuild step to add an entry; a `.ts` array needs `git` and a text editor.
- **Should the home page add a short "what I want next" panel at the very top, above the Gantt**, to make collaboration intent more explicit? Currently the hero's "open to" line + Email CTA covers this. A panel would be more prominent but adds a third region to the page, which violates "one visual idea per page."
- **Should the `kind` field ever be used for visual distinction** (e.g. side-project tracks have a hollow-only dot, work tracks have an ink end-dot, education tracks have a thinner line)? Currently no — the user explicitly asked for no kind-based styling. If a future revision wants to differentiate, the change is local to `Timeline.astro` and the `EntryKind` type stays the same.
- **Should `PRESENT` be wired to a build-time date** so the Gantt always shows the current month? Currently it's a hardcoded constant. Wiring it to `new Date()` would cause the Gantt to drift across builds; on the other hand, the constant requires a manual bump every period.
- **Should the Gantt grow a zoom control** (years-only view, quarters-only view) once the data set is bigger? Currently `PX_PER_MONTH` is a constant; making it user-controllable means adding JS to the Gantt, which is currently zero-JS.
