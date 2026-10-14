---
title: "Why We Migrated Our Internal Docs and Playbook to Astro"
description: "How switching from heavy single-page apps to Astro's content layer cut our build times by 70% and delivered instant sub-second navigation."
pubDate: 2026-10-10
author: "Mengleang Deaun"
tags: ["Astro", "Performance", "Architecture", "WebDev"]
---

# Why We Migrated Our Internal Docs and Playbook to Astro

Internal documentation is only useful if developers actually read and search it. When our documentation was wrapped in a bloated client-side SPA, cold starts were slow, search indexing was awkward, and publishing updates felt sluggish.

## The Pain Points with Traditional SPAs for Docs

1. **Hydration Overhead**: Shipping megabytes of JavaScript just to render mostly static markdown text.
2. **Search Inefficiencies**: Client-side full-text search indexes having to load across the network before queries could execute.
3. **Build Bottlenecks**: Heavy webpack or Next.js production builds taking several minutes for standard doc updates.

## Why Astro Won

- **Zero JS by Default**: Astro renders pure HTML and CSS for all markdown content.
- **Island Architecture**: When we need an interactive color picker or search modal, we hydrate *only* that component using `client:load`.
- **Content Collections & Schema Safety**: Zod schemas validate frontmatter at build time, eliminating broken links and invalid tags before deployment.
