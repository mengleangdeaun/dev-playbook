---
title: "Enterprise Sales & CRM Platform"
description: "A high-throughput enterprise customer relationship and order management system built with React 19, TanStack Query, and Laravel API."
techStack: ["React 19", "Vite", "TanStack Query", "Tailwind CSS", "Shadcn UI", "Laravel"]
client: "Internal Operations"
link: "https://crm.internal.example.com"
featured: true
image: "/assets/images/showcase/crm-platform.svg"
tags: ["React 19", "Vite", "TanStack Query", "Tailwind CSS", "Architecture"]
---

# Enterprise Sales & CRM Platform

The Enterprise Sales & CRM Platform automates lead qualification, quotation generation, inventory allocation, and order fulfillment across multiple corporate branches.

## Architecture Highlights

- **Frontend**: Vite SPA with React 19, utilizing the React Compiler for automatic memoization without manual `useMemo` / `useCallback`.
- **State**: Server state fully coordinated via TanStack Query with optimistic UI mutations and automated background refetching.
- **Styling**: Shared Tailwind v4 tokens with dark mode toggle and accessible Shadcn component primitives.
- **Performance**: Virtualized client-side tables handling upwards of 10,000 transaction rows without lag.
