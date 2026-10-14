---
title: "Practical Code-Splitting Tips for Modern Frontend Apps"
description: "Techniques for cutting your initial bundle size in half using dynamic imports, route chunking, and lazy component loading."
pubDate: 2026-10-12
author: "Dara Chan"
tags: ["React", "Performance", "Vite", "Next.js"]
---

# Practical Code-Splitting Tips for Modern Frontend Apps

A common mistake in large React applications is allowing non-critical heavy dependencies (like charting libraries, PDF exporters, and rich text editors) to leak into the main entry bundle.

## 1. Dynamic Imports for Heavy Modals

Instead of importing dialog modals at the top level:

```tsx
// ❌ Bad: Modal code is loaded even if user never clicks the button
import { ExportPdfModal } from "@/features/reports/ExportPdfModal";
```

Lazy-load using React's `lazy` and `Suspense`:

```tsx
// ✅ Good: Only fetched when rendered
import { lazy, Suspense } from "react";
const ExportPdfModal = lazy(() => import("@/features/reports/ExportPdfModal"));
```

## 2. Route-Based Chunking in Vite

When using TanStack Router or React Router v7, utilize code-splitting route definitions so each screen only downloads its own JavaScript chunk.
