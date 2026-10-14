---
title: "Frontend Engineering Playbook"
description: "Standardize how we choose frameworks, structure repositories, manage state, and ship high-performance interfaces across all frontend projects."
category: "Engineering Standards"
order: 1
tags: ["Architecture", "React", "Astro", "Next.js", "Standards"]
author: "Frontend Core Team"
lastUpdated: "2026-10-14"
---

# Frontend Engineering Playbook

> **Objective:** Standardize how we choose frameworks, structure repositories, manage state, and ship high-performance interfaces across all frontend projects.
> **Core Rule:** Automate formatting and linting via tooling; reserve code reviews for architecture, logic, and user experience.

---

## Table of Contents

1. [Framework Selection Matrix](#1-framework-selection-matrix)
2. [Universal Shared Tooling](#2-universal-shared-tooling)
3. [Project & Folder Architecture](#3-project--folder-architecture)
4. [Component Design Standards](#4-component-design-standards)
5. [State Management & Data Fetching](#5-state-management--data-fetching)
6. [Styling & UI Consistency](#6-styling--ui-consistency)
7. [Performance & Optimization Checklist](#7-performance--optimization-checklist)
8. [Definition of Done (PR Checklist)](#8-definition-of-done-pr-checklist)

---

## 1. Framework Selection Matrix

To prevent "Resume-Driven Development" and maintain high team velocity, every new frontend project must select its framework using the decision matrix below.

### The 30-Second Decision Rule

Before initializing a repository, answer these three questions:

1. **SEO & Previews:** Does the application need public pages indexed by Google or rich OpenGraph link previews on social platforms?
2. **Content vs. App:** Is the primary user activity _reading static/semi-static content_ or _interacting with complex stateful UI_?
3. **Backend Coupling:** Does a standalone backend API already exist (e.g., Laravel, NestJS, Go), or should the frontend framework handle server-side logic and routing?

| Framework                | Core Rendering Model              | Primary Use Cases                                                                                                           |
| :----------------------- | :-------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **React (Vite SPA)**     | Client-Side Rendering (CSR)       | Authenticated dashboards, internal admin panels, ERP/HRMS portals, POS systems, Telegram Mini Apps.                         |
| **Next.js (App Router)** | Hybrid SSR / RSC / PPR            | Public SaaS products, e-commerce storefronts, marketplaces, dynamic web apps requiring SEO + rich interactivity.            |
| **Astro**                | Zero-JS Static + Islands          | Marketing websites, landing pages, documentation hubs, blogs, corporate portfolios.                                         |
| **SolidJS / SolidStart** | Fine-Grained Reactivity (No VDOM) | High-frequency real-time UIs, web-based canvas/video editors, trading terminals, lightweight embeddable `<script>` widgets. |
| **React Native (Expo)**  | Native Mobile Runtime             | Cross-platform iOS & Android apps requiring native hardware access (push notifications, biometrics, camera, offline sync).  |

---

### Deep-Dive: When to Choose Which

#### A. React + Vite (Single Page Application)

- **Role:** _The Default for Authenticated Web Apps & Internal Tools_
- **When to use:**
  - The application sits entirely behind a login screen where SEO offers zero value.
  - You are connecting to an existing standalone backend API.
  - You want ultra-fast local builds and simple static hosting (Cloudflare Pages, S3, Nginx).
- **When NOT to use:** Public-facing pages that require dynamic SEO or social media link scraping.
- **Standard Stack:** Vite + React 19 (React Compiler enabled) + TanStack Router (or React Router v7) + TanStack Query + Tailwind CSS + Shadcn UI.

#### B. Next.js (App Router)

- **Role:** _The Default for Public, Dynamic Full-Stack Web Applications_
- **When to use:**
  - Customer-facing SaaS apps, marketplaces, or e-commerce stores needing dynamic metadata (`generateMetadata`) and fast initial page paints.
  - Projects benefiting from React Server Components (RSC), Partial Prerendering (PPR), and Edge Middleware.
  - Projects needing a Backend-for-Frontend (BFF) layer via Server Actions or Route Handlers.
- **When NOT to use:**
  - Simple marketing sites or blogs (Next.js ships unnecessary React hydration runtime—use Astro instead).
  - Strictly private back-office portals where managing a Node.js SSR server adds unnecessary infrastructure cost.

#### C. Astro

- **Role:** _The Default for Content-First, High-Speed Websites_
- **When to use:**
  - Marketing pages, documentation portals, blogs, and campaign micro-sites.
  - Projects where near-instant loading on mobile networks and 100/100 Core Web Vitals are mandatory.
  - You want to ship **Zero JavaScript by default** and hydrate interactive React/Solid components strictly as isolated Islands (`client:load`, `client:visible`).
- **When NOT to use:** Highly stateful web applications with complex client-side routing and persistent shared state across screens.

#### D. SolidJS / SolidStart

- **Role:** _The Specialist Choice for Extreme Runtime Performance_
- **When to use:**
  - Interfaces with high-frequency updates (60fps+ animations, live order books, multiplayer canvases, complex data grids).
  - Third-party embeddable widgets where bundle size must stay tiny (<15 KB).
- **When NOT to use:** Standard CRUD business applications where the team relies heavily on React ecosystem libraries (Shadcn/Radix, React Hook Form, specialized SDKs).

#### E. React Native + Expo

- **Role:** _The Default for Native iOS & Android Applications_
- **When to use:** Dedicated mobile applications requiring App Store / Play Store distribution, native gestures, background tasks, or hardware APIs, while sharing TypeScript types and validation schemas with the web stack.

---

## 2. Universal Shared Tooling

Even when switching between Astro, Vite, and Next.js, the developer experience must remain identical across repositories.

- **Language:** TypeScript (`strict: true` is mandatory; `any` is forbidden without an explicit `// eslint-disable-next-line` justification).
- **Package Manager:** `pnpm` (or `bun`)—never mix lockfiles (`package-lock.json` / `yarn.lock`) in a repository.
- **Schema & Validation:** **Zod** for all form validation, URL search param parsing, and environment variable validation.
- **Styling & Primitives:** **Tailwind CSS** + **Shadcn UI** (using shared CSS custom property tokens across all web frameworks).
- **Formatting & Linting:** **Biome** (or **ESLint + Prettier**) enforced automatically via `husky` + `lint-staged` pre-commit hooks.
- **Icons:** `lucide-react` (or framework equivalent).

---

## 3. Project & Folder Architecture

We use a **Feature-Based Folder Structure**. Grouping files strictly by technical type (e.g., putting 150 components in a single `/components` directory) does not scale.

```text
src/
├── app/ (or routes/)        # Routing layer only (thin page wrappers & layouts)
├── components/              # Truly global, domain-agnostic UI
│   ├── ui/                  # Read-only base primitives (Shadcn button, dialog, input)
│   └── shared/              # App-wide composites (PageHeader, DataTable, ConfirmModal)
├── features/                # Domain-specific modules (where 80% of code lives)
│   └── [feature-name]/      # e.g., auth, billing, inventory, approvals
│       ├── api/             # API fetchers & TanStack Query hooks for this domain
│       ├── components/      # Components used ONLY inside this feature
│       ├── hooks/           # Custom hooks scoped to this feature
│       ├── schemas/         # Zod validation schemas for this feature
│       └── types.ts         # TypeScript interfaces for this feature
├── hooks/                   # Global reusable hooks (useDebounce, useMediaQuery)
├── lib/                     # Configured instances & utilities (apiClient, cn, formatters)
├── stores/                  # Minimal global client state (Zustand)
└── types/                   # Global shared TypeScript definitions
```

### Architecture Rules

1. **The Rule of Colocation:** Keep components, hooks, and types inside `src/features/[feature-name]` by default. Only promote a component to `src/components/shared/` when **at least two different features** import it.
2. **Thin Routes:** Files inside `app/` or `routes/` should only handle route parameters, SEO metadata, layout wrapping, and rendering a top-level Feature view. Keep business logic out of route files.
3. **Unidirectional Imports:**
   - `components/ui` & `lib` $\rightarrow$ Can be imported anywhere.
   - `features/*` $\rightarrow$ Can import from `components/`, `hooks/`, `lib/`. **One feature must not import internal files directly from another feature** unless explicitly exported via that feature's public `index.ts`.

---

## 4. Component Design Standards

### 1. The 200-Line Ceiling

If a component file exceeds **~200 lines of code**, it is doing too much. Refactor by:

- Extracting complex stateful logic and effects into a custom hook (`useOrderForm.ts`).
- Breaking visual sections into smaller sub-components within the feature folder.

### 2. Protect Base UI Primitives

Treat `src/components/ui/` (Shadcn primitives) as read-only vendor code. Do not add business logic or feature-specific styling inside `ui/button.tsx` or `ui/dialog.tsx`. Instead, compose a new wrapper component inside `components/shared/` or your feature folder.

### 3. Separate Data Fetching from Presentation

Presentational components should accept data and callbacks via props. Container/Feature components coordinate queries and mutations.

```tsx
// ❌ BAD: Mixing raw API calls, missing states, and hardcoded styles
export function EmployeeProfile({ id }: { id: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/employees/${id}`)
      .then((res) => res.json())
      .then(setData);
  }, [id]);

  if (!data) return <div>Loading...</div>;
  return <div className="p-4 bg-[#ffffff]  border">{data.fullName}</div>;
}

// ✅ GOOD: Clean query hook, typed props, skeleton state, and design tokens
export function EmployeeProfile({ id }: { id: string }) {
  const { data: employee, isPending, isError, refetch } = useEmployeeQuery(id);

  if (isPending) return <EmployeeProfileSkeleton />;
  if (isError) return <ErrorState onRetry={refetch} message="Failed to load profile" />;

  return (
    <Card className="p-4 bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>{employee.fullName}</CardTitle>
      </CardHeader>
    </Card>
  );
}
```

### 4. Props & Naming Conventions

- **Component Files:** `PascalCase.tsx` (e.g., `InvoiceSummaryCard.tsx`).
- **Hook Files:** `camelCase.ts` prefixed with `use` (e.g., `useInvoiceTotals.ts`).
- **Event Handler Props:** Prefix prop names with `on` (`onApprove`, `onFilterChange`) and internal implementation functions with `handle` (`handleApprove`, `handleFilterChange`).
- **Avoid Boolean Prop Explosion:** Instead of `<Button isPrimary isLarge isOutline />`, use explicit variants via `class-variance-authority` (`cva`): `<Button variant="outline" size="lg" />`.

---

## 5. State Management & Data Fetching

Mismanaging state is the #1 cause of frontend bugs and sluggish UIs. Always choose the right state bucket:

| State Category          | Examples                                                          | Mandatory Tool                                                                                                                  |
| :---------------------- | :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **Server State**        | API responses, lists, user profiles, server records               | **TanStack Query (React Query)** or Next.js RSC. **Never** copy server data into Zustand/Redux or fetch inside raw `useEffect`. |
| **URL State**           | Pagination (`?page=2`), search queries, active tabs, sort filters | **URL Search Params** (`nuqs` or router search params) so views are shareable and bookmarkable.                                 |
| **Form State**          | Inputs, validation errors, dirty/submitting flags                 | **React Hook Form** + **Zod** resolver (`@hookform/resolvers/zod`).                                                             |
| **Local UI State**      | Dropdown open/close, active accordion, hover state                | Standard `useState` or `useReducer` inside the component.                                                                       |
| **Global Client State** | Theme mode, sidebar collapsed state, ephemeral multi-step wizard  | **Zustand** (keep stores small and focused).                                                                                    |

### Data Fetching Rules

- **Centralized Query Keys:** Never hardcode magic string arrays across files. Use a Query Key Factory per feature:
  ```ts
  export const invoiceKeys = {
    all: ['invoices'] as const,
    lists: () => [...invoiceKeys.all, 'list'] as const,
    list: (filters: InvoiceFilters) => [...invoiceKeys.lists(), filters] as const,
    detail: (id: string) => [...invoiceKeys.all, 'detail', id] as const,
  };
  ```
- **Typed API Client:** All HTTP requests must go through a single configured client (`src/lib/api-client.ts`) that handles auth headers, token refresh, and standardized error parsing automatically.

---

## 6. Styling & UI Consistency

### 1. Semantic Design Tokens Only

Never hardcode arbitrary hex colors (`bg-[#1e293b]`) or random pixel spacing (`mt-[13px]`). Always use semantic theme tokens mapped in Tailwind (`bg-background`, `bg-primary`, `text-muted-foreground`, `border-border`) so dark mode and brand updates work automatically.

### 2. Always Merge Classes Safely

Whenever creating a reusable component that accepts a `className` prop, merge classes using the `cn()` utility (`clsx` + `tailwind-merge`):

```tsx
import { cn } from "@/lib/utils";

export function SectionContainer({ className, children }: React.ComponentProps<"section">) {
  return <section className={cn("mx-auto max-w-7xl px-4 py-6", className)}>{children}</section>;
}
```

### 3. The "4 States of Async UI" Rule

No UI screen or widget that fetches data is considered complete until it gracefully handles all four states:

1. **Loading State:** Skeleton loaders matching the layout geometry (avoid layout jump; never show a blank screen).
2. **Empty State:** A clear illustration/icon, helpful explanation, and a primary Call-to-Action button (e.g., _"No invoices found. Create your first invoice"_).
3. **Error State:** A user-friendly message with a **Retry** button or clear troubleshooting action.
4. **Success State:** Properly truncated long text (`truncate` or `line-clamp-2`) so long user-generated names never break the layout.

---

## 7. Performance & Optimization Checklist

Speed is a feature. Follow these standards on every task:

- **Prevent Double Submissions:** Every form submit button and mutation trigger must immediately disable itself (`disabled={isPending}`) and display a loading indicator while the request is in flight.
- **Route & Heavy Component Lazy Loading:** Lazy-load heavy third-party libraries (charts, PDF viewers, rich-text editors, maps) so they do not bloat the initial bundle.
- **Virtualize Large Lists:** Never render more than **50 complex rows** in the DOM simultaneously. Use server-side pagination or `@tanstack/react-virtual` for long lists.
- **Image & Font Hygiene:**
  - Use `WebP` or `AVIF` formats for bitmap images.
  - Always specify explicit `width` and `height` (or `aspect-ratio`) to prevent Cumulative Layout Shift (CLS).
  - Set `loading="lazy"` on all below-the-fold images.
- **Debounce Expensive Triggers:** Search inputs that trigger API calls or heavy filtering must be debounced (300ms standard) or synced nicely with URL params.

---

## 8. Definition of Done (PR Checklist)

Before marking a Pull Request as **Ready for Review**, the author must verify:

- [ ] **Zero Type/Lint Errors:** `pnpm typecheck` and `pnpm lint` pass with zero warnings.
- [ ] **All 4 UI States Handled:** Loading (skeleton), Empty, Error, and Success states are implemented and tested.
- [ ] **Responsive Check:** Layout works cleanly at mobile (`375px`), tablet (`768px`), and desktop (`1280px+`) viewports.
- [ ] **No Console Artifacts:** Removed all debugging `console.log`, commented-out code blocks, and unused imports.
- [ ] **Self-Reviewed Diff:** Author has reviewed their own Git diff line-by-line on GitHub/GitLab before requesting teammates.
