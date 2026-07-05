# Plan: Convert `RESUME.md` into simple mobile-friendly landing page

## Goal

- Turn resume content into website landing page, not full CV dump.
- Keep site simple, fast, static-first, mobile-friendly.
- Do not implement yet.
- Use `src/pages/index.astro` as likely target; verify current file before editing in future task.

## Source content

- Resume file: `RESUME.md`.
- Person: Muhammad Abdul Aziz Al-Ghofari.
- Positioning: backend/software engineer with cloud, observability, ML/AI, and community leadership.
- Primary proof points:
  - 400% production infra cost reduction via PHP → Go migration.
  - 96% latency reduction on Redis cache hits.
  - Associate Cloud Engineer + TensorFlow Developer Certificate.
  - GoTo DevCamp honorable mention.
  - AWS UG Jakarta co-lead + GDG Cloud Jakarta/Bogor organizer/speaker.

## Docs checked

- Astro components docs: `https://docs.astro.build/en/basics/astro-components/`.
- Astro styling docs: `https://docs.astro.build/en/guides/styling/`.
- Project rule also points to Astro routing/components/styling docs in `AGENTS.md`.

## Build approach

- Use plain Astro + scoped CSS in `src/pages/index.astro`; avoid Vue/Vuetify unless existing page requires it.
- No new dependency.
- No Markdown parser runtime needed; manually curate content from `RESUME.md` into page sections.
- Prefer semantic HTML: `main`, `section`, `article`, headings, lists, `address` only if contact block benefits.
- Keep CSS local to page unless existing layout/global style requires shared reset.
- Mobile-first CSS: default single column, then enhance at wider breakpoints.

## Content hierarchy

1. Hero
   - Name.
   - Short role line: `Backend engineer building cost-efficient cloud systems, observability, and AI products.`
   - Location: Jakarta, Indonesia.
   - Contact links: Email, LinkedIn, GitHub, Website. Phone optional; avoid prominent phone if public privacy concern.
   - Primary CTA: `Email me`.
   - Secondary CTA: `View GitHub` or `LinkedIn`.

2. Proof strip
   - `400% cost reduction`
   - `96% cache-hit latency reduction`
   - `ACE + TensorFlow certified`
   - `AWS UG Jakarta co-lead`

3. Selected work experience
   - Bangunindo Teknusa Jaya first, 4–5 strongest bullets only.
   - Bank Indonesia Institute as concise second card, 2 bullets.
   - Skip every tech stack item here; use tag chips for only most recognizable/core tools.

4. Featured projects
   - Foodie, GulTix, Avei Graph, StunThink.
   - One sentence each, plus small tech tags.
   - SPIILL can be omitted from landing page unless page feels too thin.

5. Blog preview
   - Show future blog area on landing page so homepage can surface writing later.
   - If blog posts/content collection already exists during implementation: render latest 3 posts with title, date, short description, and `Read post` link.
   - If no posts exist yet: show quiet empty-state card: `Writing coming soon` plus topics: backend systems, cloud cost, observability, AI agents, developer communities.
   - Keep section static/server-rendered; no client JS, filters, search, tags page, pagination, or newsletter until actual blog volume justifies it.
   - CTA: `Read all posts` linking to `/blog` only if route exists; otherwise skip link or use disabled-looking text, not broken href.

6. Community / speaking
   - AWS User Group Jakarta.
   - GDG Cloud Jakarta.
   - GDG Bogor.
   - Emphasize organizing, speaking, registration automation, drop-rate reduction.

7. Education / credentials
   - Bina Nusantara University.
   - GoTo DevCamp.
   - Google Cloud ACE path.
   - Bangkit / TensorFlow certificate.

8. Footer CTA
   - Repeat short availability/contact sentence.
   - Links again.

## Visual direction from frontend-design skill

### Subject, audience, single job

- Subject: backend/cloud engineer portfolio landing page.
- Audience: hiring managers, engineering leads, community/tech collaborators.
- Single job: make visitor trust expertise quickly and choose contact/link click.

### Token system

Colors:
- `ink` `#17201B` — main text, not pure black.
- `paper` `#F7F4EC` — warm off-white background, but avoid generic cream+serif template by pairing with terminal/cloud grid motif and restrained monospace accents.
- `circuit` `#0F766E` — teal accent from infra/cloud feel.
- `signal` `#F59E0B` — small highlight for metrics only.
- `muted` `#66746D` — secondary text.
- `line` `#D8D2C4` — dividers/card borders.

Type:
- Display: system sans, heavy weight, tight line-height; no webfont dependency.
- Body: system sans, readable 16–18px.
- Utility/data: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` for metrics, dates, tech tags.

Layout:
- Mobile: single-column vertical story; sticky nav skipped unless current site already has one.
- Desktop: hero split into intro + compact proof terminal card; content as stacked sections with 2-column cards where useful.
- Max width around 1080–1120px; generous but not sparse spacing.

ASCII sketch:

```text
[Name / role]
[short thesis]
[Email] [GitHub]

[proof terminal card]
400% cost down
96% latency down
ACE + TF certified

[Experience]
[Bangunindo card]
[BI Institute card]

[Projects]
[Foodie] [GulTix]
[Avei Graph] [StunThink]

[Blog]
[latest posts or coming soon card]

[Community]
[AWS UG] [GDG Cloud] [GDG Bogor]

[Education + credentials]
[Footer contact]
```

Signature element:
- `ops ledger` proof card: compact monospace block resembling deployment/observability output, showing 3–4 validated outcomes from resume.
- Keep it static; no animation required. This is distinctive to backend/ops subject without adding JS.

### Self-critique / simplification

- Avoid common portfolio defaults: no dark neon grid, no generic gradient blobs, no overbuilt timeline, no animated counters.
- Use one visual signature only: ops ledger proof card.
- Skip exhaustive resume bullets; landing page needs signal, not document parity.
- If future user asks for full resume page/download, add separate route or PDF link later.

## Implementation checklist for future task

1. Read current `src/pages/index.astro` and `src/layouts/Layout.astro`.
2. Decide whether to reuse layout metadata/title support or add minimal frontmatter values.
3. Replace/reshape index page content only; avoid touching routes not needed.
4. Add curated data arrays in Astro frontmatter if it reduces repeated markup; avoid abstraction beyond same-file arrays.
5. Add same-file scoped CSS, mobile-first.
6. Ensure links have accessible labels and visible focus styles.
7. Check mobile widths: 320px, 390px, 768px, desktop.
8. Run `bun build`.

## Non-goals

- No implementation in current task.
- No new `.md` docs.
- No new dependencies/webfonts.
- No CMS/content collection unless requested.
- No heavy animation or client JS.
- No full resume parser.

## Validation later

- Build: `bun build`.
- Optional visual check: `astro dev --background`, browser check responsive, `astro dev stop`.
- Confirm Lighthouse/accessibility basics if browser tooling available: heading order, link names, contrast, focus visible.