---
title: "Practical Code-Splitting Tips for Modern Frontend Apps"
description: "Battle-tested techniques for cutting your initial bundle size in half using dynamic imports, route chunking, and smart prefetching."
pubDate: 2026-10-12
author: "Dara Chan"
tags: ["React", "Performance", "Vite", "Next.js"]
image: "/assets/images/blog/code-splitting.svg"
---

# Practical Code-Splitting Tips for Modern Frontend Apps

One of the fastest ways a growing React application degrades in performance is allowing heavy, non-critical dependencies—like charting libraries (`recharts`), PDF generators (`jspdf`), or rich text editors (`tiptap`)—to leak into the main entry bundle. Every kilobyte in your initial JavaScript payload has to be downloaded, parsed, and executed before the user can interact with your page.

By strategically splitting your bundle, you ensure users only pay the network and CPU cost for the code they actually touch.

---

## 1. Lazy-Load Heavy Modals and Conditional UI

Modals, drawers, and complex popovers are hidden by default, yet developers frequently import them statically at the top of a page component. If that modal imports a 300 KB PDF utility, every visitor downloads that library—even if only 2% of users ever click "Export."

### Static Import (Anti-Pattern)

```tsx
// ❌ Bad: The modal and all its heavy sub-dependencies are bundled into the main chunk
import { ExportPdfModal } from "@/features/reports/ExportPdfModal";
```

### Dynamic Import with `React.lazy` & Prefetch on Hover

Instead of static imports, defer loading until the component is needed. To eliminate the brief loading spinner when the user clicks the button, trigger the import early on `onMouseEnter` or `onFocus`:

```tsx
// ✅ Good: Fetched on demand, and preloaded right before the user clicks
import { useState, lazy, Suspense } from "react";

const loadExportModal = () => import("@/features/reports/ExportPdfModal");
const ExportPdfModal = lazy(loadExportModal);

export function ReportsToolbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onMouseEnter={loadExportModal} // Warms the cache before click
        onFocus={loadExportModal}
        onClick={() => setIsOpen(true)}
      >
        Export PDF
      </button>

      {isOpen && (
        <Suspense fallback={<div className="modal-skeleton">Loading exporter...</div>}>
          <ExportPdfModal onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
```

> **Note on Named Exports:** `React.lazy` expects a `default` export. If your codebase enforces named exports, either re-export as default or chain `.then(m => ({ default: m.ExportPdfModal }))` inside your loader.

---

## 2. Route-Based Chunking in Vite

Route boundaries are the most natural seam for code splitting. A user visiting your `/login` or `/dashboard` page has zero need for the JavaScript powering your `/admin/billing` settings.

Modern routers handle this with minimal boilerplate:

* **TanStack Router:** Enable automatic file-based code splitting in the Vite plugin (`autoCodeSplitting: true`), or split heavy UI from critical data loaders using `.lazy.tsx` route files so data fetching and component downloading happen in parallel, avoiding network waterfalls.
* **React Router v7:** Use the route `lazy()` property to split both the route component and its loader/action logic into separate chunks:

```tsx
// routes.tsx
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/analytics",
    lazy: async () => {
      const { AnalyticsPage, analyticsLoader } = await import("./pages/Analytics");
      return { Component: AnalyticsPage, loader: analyticsLoader };
    },
  },
]);
```

---

## 3. On-Demand Function Imports (Event-Driven Splitting)

Not every heavy library is tied to a React component. Libraries like `xlsx`, `papaparse`, or `canvas-confetti` are often executed purely inside an `onClick` handler. Use native dynamic `import()` directly inside the async event handler:

```tsx
async function handleDownloadCsv(rows: ReportRow[]) {
  // Only downloads papaparse when the user explicitly exports data
  const { unparse } = await import("papaparse");
  const csv = unparse(rows);
  triggerBrowserDownload(csv, "report.csv");
}
```

---

## 4. Fine-Tuning Vendor Chunks in Vite

Sometimes third-party libraries are shared across routes, causing Rollup (Vite's bundler) to either duplicate them or lump them into a single massive vendor file. You can isolate stable, heavy libraries into dedicated cacheable chunks using `manualChunks` in `vite.config.ts`:

```ts
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-charts": ["recharts"],
        },
      },
    },
  },
});
```

### Verify Before You Optimize

Never guess what is bloating your bundle. Install `rollup-plugin-visualizer` (for Vite) or `@next/bundle-analyzer` (for Next.js) to generate an interactive treemap of your production build, and target the largest blocks first.