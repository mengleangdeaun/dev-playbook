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
  }),
});

export const collections = {
  docs,
  "brand-guide": brandGuide,
  blog,
  showcase,
};
