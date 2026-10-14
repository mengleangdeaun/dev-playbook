# Dev Playbook 📘

> **The Living Engineering Standards, Architecture Guidelines & Brand Handbook**

A content-driven engineering portal and technical playbook built with **Astro 7 (Content Layer)**, **React 19**, **Tailwind CSS v4**, and **Shadcn UI**.

---

## 🌟 Overview

The **Dev Playbook** serves as the single source of truth for our engineering teams. It standardizes:
- **Framework Selection Matrix**: Deciding between React (Vite SPA), Next.js, and Astro in under 30 seconds.
- **Project & Folder Architecture**: Feature-based modular structure with strict colocation and unidirectional imports.
- **Component Design Standards**: The 200-line ceiling rule, presentational separation, and design token enforcement.
- **State Management Taxonomy**: Categorizing server, URL, form, local, and global client state.
- **Brand Guidelines & Design Tokens**: Standardized OKLCH color palettes and typography scales.
- **Definition of Done**: Automated PR readiness verification checklist.

---

## 🏗️ Project Structure

```text
dev-playbook/
├── src/
│   ├── assets/                 # 🎨 Brand logos, monograms, and typography assets
│   │   ├── brand/              # Vector SVGs (logo.svg, monogram.svg)
│   │   ├── fonts/              # Custom/Khmer font definitions
│   │   └── images/             # Article & architecture diagrams
│   ├── components/
│   │   ├── branding/           # Branding showcase components (e.g. ColorPalette.astro)
│   │   ├── shared/             # Shared layout components:
│   │   │   ├── Header.astro    # Sticky header with navigation & search trigger
│   │   │   ├── Sidebar.astro   # Categorized collapsible doc navigation
│   │   │   ├── TableOfContents.astro # Dynamic scrollspy heading tracker
│   │   │   ├── SearchModal.tsx # Instant search dialog (Cmd+K / Ctrl+K)
│   │   │   ├── ThemeToggle.astro     # Zero-FOUC Dark/Light mode switcher
│   │   │   ├── Breadcrumbs.astro     # Route hierarchy breadcrumbs
│   │   │   └── Footer.astro          # Site-wide footer
│   │   └── ui/                 # Reusable Shadcn UI primitives (button, card, dialog, etc.)
│   ├── content/                # 📂 Multi-Collection Content Layer
│   │   ├── docs/               # Technical Playbook & standards (.md / .mdx)
│   │   │   ├── frontend-developer-playbook.md # Core engineering playbook
│   │   │   ├── onboarding/     # Environment setup guides
│   │   │   └── typescript/     # Strict typing standards
│   │   ├── brand-guide/        # Brand guidelines
│   │   │   ├── colors.mdx      # OKLCH color token scales & interactive palette
│   │   │   └── typography.md   # Typography scale & pairings
│   │   ├── blog/               # Engineering blog posts & retrospectives
│   │   │   ├── 2026-10-migration-to-astro.md
│   │   │   └── code-splitting-tips.md
│   │   ├── showcase/           # Project case studies & architecture highlights
│   │   │   ├── internal-crm.md
│   │   │   └── client-mobile-app.md
│   │   └── config.ts           # Zod collection schemas & loaders
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Base HTML document shell, SEO & theme scripts
│   │   ├── DocLayout.astro     # 3-column documentation layout (Sidebar + Prose + TOC)
│   │   └── BlogLayout.astro    # Editorial magazine-style layout for blog articles
│   ├── pages/                  # 🌐 File-based Routing System
│   │   ├── index.astro         # Hub Landing Portal
│   │   ├── docs/               # /docs overview and /docs/[...slug]
│   │   ├── brand/              # /brand overview and /brand/[...slug]
│   │   ├── blog/               # /blog index and /blog/[...slug]
│   │   └── showcase/           # /showcase grid and /showcase/[...slug]
│   └── styles/
│       └── global.css          # Tailwind CSS v4, theme tokens & typography plugin
├── doc/                        # Raw source documents & specification references
├── astro.config.mjs            # Astro configuration with MDX, React, and Tailwind
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>= 22.12.0`
- **Package Manager**: `npm` or `pnpm`

### Installation

```bash
# Clone the repository and install dependencies
npm install
```

### Development

Start the local development server with hot reload:

```bash
npm run dev
```

Visit [http://localhost:4321](http://localhost:4321) in your browser.

### Building for Production

Compile optimized static HTML and assets:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Type Checking & Linting

Verify TypeScript and Astro types:

```bash
npm run typecheck
```

Lint and format codebase:

```bash
npm run lint
npm run format
```

---

## ✍️ Adding New Documents Step-by-Step

All content is managed through Astro's **Content Layer** inside `src/content/`. Each document uses Markdown (`.md`) or MDX (`.mdx`) with frontmatter validated at build time by Zod.

### 1. Adding a Technical Playbook Doc (`src/content/docs/`)

Create a new file in `src/content/docs/` (or a subdirectory like `src/content/docs/architecture/`):

```markdown
---
title: "API Design Guidelines"
description: "RESTful endpoint conventions, error payloads, and authentication standards."
category: "Backend & API"
order: 3
tags: ["API", "REST", "Standards"]
author: "Backend Working Group"
lastUpdated: "2026-10-15"
---

# API Design Guidelines

Write your markdown content here...
```

The document will automatically be:
- Routed to `/docs/<category>/<filename>` or `/docs/<filename>`.
- Listed in the left documentation sidebar grouped under its `category`.
- Indexed into the <kbd>Cmd</kbd>+<kbd>K</kbd> quick search dialog.
- Given an automated right-hand Table of Contents.

### 2. Adding a Brand Guideline (`src/content/brand-guide/`)

Create a file in `src/content/brand-guide/` (e.g., `iconography.md`):

```markdown
---
title: "Iconography System"
description: "Rules for stroke weights, icon grids, and Lucide React integration."
category: "Brand Identity"
order: 3
---

# Iconography System
```

Accessible at `/brand/<filename>`.

### 3. Adding an Engineering Blog Post (`src/content/blog/`)

Create a file in `src/content/blog/` (e.g., `2026-11-react-compiler-adoption.md`):

```markdown
---
title: "Adopting React Compiler Across 5 Production Apps"
description: "How automated memoization simplified our codebases and eliminated re-rendering bugs."
pubDate: 2026-11-01
author: "Lead Frontend Engineer"
tags: ["React", "Performance", "Compiler"]
---

# Adopting React Compiler...
```

Accessible at `/blog/<filename>`.

### 4. Adding a Project Showcase (`src/content/showcase/`)

Create a file in `src/content/showcase/` (e.g., `partner-portal.md`):

```markdown
---
title: "B2B Partner Portal"
description: "Self-service ordering and shipment tracking portal."
techStack: ["React 19", "TanStack Query", "Tailwind CSS", "Go API"]
client: "Partner Network"
link: "https://portal.example.com"
featured: true
---

# B2B Partner Portal...
```

Accessible at `/showcase/<filename>`.

---

## 🧭 Key Playbook Rules Quick Reference

1. **The 30-Second Rule**:
   - **React (Vite SPA)**: Authenticated portals, ERPs, back-offices, and internal dashboards.
   - **Next.js (App Router)**: Public SaaS, marketplaces, and SEO-heavy e-commerce.
   - **Astro**: Documentation hubs, marketing sites, and zero-JS blogs.
2. **The 200-Line Ceiling**: Keep component files under ~200 lines by extracting custom hooks and subcomponents.
3. **The 4 States of Async UI**: Always handle **Loading** (skeleton), **Empty**, **Error** (with retry), and **Success** states.
4. **Design Tokens Only**: Use semantic tokens (`bg-background`, `text-primary`, `border-border`) rather than hardcoded hex values.

---

## 🛠️ Tech Stack Reference

- **Static Site Engine**: [Astro 7](https://astro.build/)
- **UI Runtime**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/typography`
- **Component Primitives**: [Shadcn UI](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/) + [Zod](https://zod.dev/)
