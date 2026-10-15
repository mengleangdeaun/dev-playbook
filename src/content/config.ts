import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string().default("General"),
    order: z.number().default(99),
    tags: z.array(z.string()).default([]),
    author: z.string().optional(),
    lastUpdated: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    /** Slug of the linked skill file in src/content/skill/ */
    skillFile: z.string().optional(),
    /** Relative path to a cover/hero image (co-located in the doc folder) */
    cover: z.string().optional(),
    /** Downloadable file attachments */
    assets: z
      .array(
        z.object({
          label: z.string(),
          file: z.string(),
          size: z.string().optional(),
        })
      )
      .default([]),
  }),
});

const brandGuide = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/brand-guide" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string().default("Brand Identity"),
    order: z.number().default(99),
    tags: z.array(z.string()).default([]),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    author: z.string().default("Engineering Team"),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const showcase = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/showcase" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    techStack: z.array(z.string()).default([]),
    client: z.string().optional(),
    link: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const skill = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/skill" }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = {
  docs,
  "brand-guide": brandGuide,
  blog,
  showcase,
  skill,
};
