// @ts-check
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vuetifyPlugin from "vite-plugin-vuetify";
import { fileURLToPath } from "node:url";

// Vuetify 4 + Astro 7 wiring. Two non-obvious requirements:
//
//  1. vite-plugin-vuetify must load AFTER @vitejs/plugin-vue. Astro applies user
//     `vite.plugins` before the ones @astrojs/vue injects, so we register vuetify
//     from a trailing integration's `astro:config:setup` -> updateConfig.
//
//  2. Vuetify 4 components do a top-level `import "./X.css"`. Astro 7's static
//     build (rolldown) auto-externalizes BARE node_modules specifiers in the
//     prerender server bundle, so `import { createVuetify } from "vuetify"` and
//     `import VBtn from "vuetify/components/VBtn"` stay external -> Node loads
//     them at render time -> hits the `.css` import -> ERR_UNKNOWN_FILE_EXTENSION.
//     ssr.noExternal / environments.*.resolve.noExternal do NOT override this.
//     Workaround: resolve.alias the bare `vuetify` specifiers to ABSOLUTE paths.
//     Absolute paths are not "bare imports", so rolldown bundles Vuetify into the
//     prerender output, letting Vite transform (no-op) the `.css` imports for SSR.
const vuetifyLib = fileURLToPath(
  new URL("node_modules/vuetify/lib", import.meta.url),
);

const vuetify = () => ({
  name: "vuetify",
  hooks: {
    "astro:config:setup": ({ updateConfig }) => {
      updateConfig({
        vite: {
          plugins: [
            vuetifyPlugin({
              autoImport: true,
              styles: { configFile: "src/styles/settings.scss" },
            }),
          ],
          resolve: {
            alias: [
              { find: /^vuetify$/, replacement: `${vuetifyLib}/framework.js` },
              {
                find: /^vuetify\/components\/(.+)$/,
                replacement: `${vuetifyLib}/components/$1`,
              },
            ],
          },
        },
      });
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: "https://avei.ovh",
  integrations: [
    vue({ appEntrypoint: "/src/_app" }),
    mdx(),
    sitemap(),
    vuetify(),
  ],
  vite: {
    resolve: {
      // graphology's ESM build imports Node's `events` module; shim it with
      // eventemitter3 (browser-compatible) so the graph island hydrates.
      alias: {
        events: "eventemitter3",
      },
    },
    // graphology / sigma ship CommonJS; force esbuild to pre-bundle them to ESM
    // so the graph client island hydrates correctly in dev.
    optimizeDeps: {
      include: [
        "graphology",
        "graphology-layout-force",
        "graphology-layout-force/worker",
        "sigma",
      ],
    },
  },
});
