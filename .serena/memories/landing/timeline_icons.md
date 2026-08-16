# Working Timeline Logos & Icons

## Overview
Added authentic vector SVG brand marks and unified layout to the Gantt timeline in `avei-astro`:
- Component: `src/components/landing/OrgIcon.astro`
- Timeline configuration: `src/data/timeline.ts`
- Gantt implementation: `src/components/landing/Timeline.astro`
- Hero header: `src/components/landing/Hero.astro`

## Timeline Integration & Active Roles
- **Hero Bio**: Clean minimalist header without artificial status pills; summary cleanly focused on services and collaboration.
- **Low-Profile Trajectory Toolbar**: Integrated toolbar containing category toggle chips (`Professional Experience`, `Side Projects`, `Community`, `Education`).
- **Active Role Highlights**:
  - `tridorian`: Stylized with lowercase `t` and title set to `Software Engineer`.
  - Active tracks (`end: 'present'`) such as `tridorian`, `AWS User Group Jakarta`, and `GDG Bogor` have their branch lane lines, milestone dots, and connectors styled in distinct emerald green (`#10b981`).
  - Top lane column heads have an emerald live dot indicator for active roles.
  - Individual milestone cards remain clean without badge spam.

## Sourced Official Logos
- **GDG (Google Developer Groups)**: Latest official Google Developer Groups / Google for Developers modern solid dual-chevron mark (`< >`)
- **Amazon Web Services / AWS**: Official standard bold AWS wordmark and curved smile vector (`devicons`)
- **Bangunindo Teknusa Jaya**: Official twin-chevron "B" geometric brand mark sourced directly from `bangunindo.com` assets
- **Bangkit Academy**: Official 4-arc quarter-circle radiating logo mark matching the official Google/Bangkit visual identity
- **Bank Indonesia**: Official Indonesian financial emblem vector (`idn-finlogos`)
- **tridorian**: Official geometric triad logomark (`tridorian.com`)
- **Bliv.id**: Official 3D isometric stair pyramid vector (`bangunindo.com/products/bliv`)
- **GoTo / Gojek**: Official infinite circle target mark
- **Google Cloud Platform**: Official GCP cloud mark
- **DroidJam / Android**: Official Android Bugdroid robot vector
- **Binus University**: Official academic crest mark

## Rules
- Personal open-source projects (`stunthink-thesis`, `avei-graph`, `gultix`, `foodie`) have NO logos attached, keeping them clean.
- All icons adhere to monochrome M3 CSS variables (`currentColor`, `--accent`, `--md-sys-color-on-surface-variant`) and interactively highlight on hover/track focus.
