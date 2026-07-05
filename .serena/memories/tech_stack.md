# Tech Stack

- Astro 7 site, strict TypeScript config via `astro/tsconfigs/strict`.
- Bun lockfile present; project commands documented as `bun ...`.
- Node engine: `>=22.12.0`.
- Integrations: `@astrojs/vue`, `@astrojs/mdx`, `@astrojs/sitemap`.
- Vue 3 and Vuetify 4 available; Vuetify wired through `src/_app.ts` and custom Vite integration in `astro.config.mjs`.
- Other installed client/data deps: `graphology`, `graphology-layout-force`, `sigma`, `socket.io-client`, `marked`, `uuid`, `@mdi/font`.
- Styling supports Sass; Vuetify settings at `src/styles/settings.scss`.