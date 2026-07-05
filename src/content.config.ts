import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Content Layer API (Astro 7): collections are defined via a loader + zod schema.
// Content lives at src/content/blog/*.mdx; the glob id is the filename stem
// (e.g. "hello-world"), which maps to /blog/<id>.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog };
