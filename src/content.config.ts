// Content collections: one Markdown file per project in src/content/projects.
// The front matter is checked against this schema at build time; a project with
// `caseStudy: true` also gets its own page at /projects/<file name>.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const CATEGORIES = ["Desktop", "Backend", "AI/ML", "Mobile", "Games"] as const;

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    tag: z.string(),
    summary: z.string(),
    categories: z.array(z.enum(CATEGORIES)).min(1),
    stack: z.array(z.string()).min(1),
    source: z.string().url(),
    live: z.string().url().optional(),
    liveLabel: z.string().optional(),
    liveLink: z.string().default("Live"),
    order: z.number().int(),
    caseStudy: z.boolean().default(false),
    facts: z.array(z.object({ label: z.string(), value: z.string() }).strict()).default([]),   // strict: a stray key (an unquoted comma in YAML) is an error
  }),
});

export const collections = { projects };
