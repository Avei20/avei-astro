# Conventions

- Project rule: if starting dev server, use background mode: `astro dev --background`; manage with `astro dev stop/status/logs`.
- Consult Astro docs before related tasks: routing, components, framework components, content collections, styling, i18n.
- `astro.config.mjs` contains non-obvious Vuetify 4 + Astro 7 workaround: keep `vite-plugin-vuetify` loaded from trailing integration hook after Vue plugin; keep absolute `vuetify` aliases so Astro/Rolldown bundles Vuetify CSS imports during prerender.
- `astro.config.mjs` aliases Node `events` to `eventemitter3` for graph island hydration; graphology/sigma are pre-bundled in `optimizeDeps`.
- Prefer minimal Astro/CSS pages for static content; only use Vue/Vuetify islands when interactivity or existing Vuetify patterns justify it.