---
title: "TypeScript Best Practices"
description: "Strict typing conventions, generic constraints, and avoiding common type antipatterns."
category: "TypeScript"
order: 2
tags: ["TypeScript", "Types", "Standards"]
author: "Frontend Core Team"
lastUpdated: "2026-10-14"
---

# TypeScript Best Practices

We enforce `strict: true` across all projects. Code that suppresses compiler diagnostics or uses sloppy typing will not pass PR review.

## Golden Rules

### 1. `any` is strictly banned
Use `unknown` when a type cannot be known ahead of time, then narrow using Zod or type guards:

```ts
// ❌ Disallowed
function parseResponse(data: any) {
  return data.user.id;
}

// ✅ Allowed
import { z } from "zod";

const UserSchema = z.object({ id: z.string() });

function parseResponse(data: unknown) {
  const result = UserSchema.safeParse(data);
  if (!result.success) throw new Error("Invalid payload");
  return result.data.id;
}
```

### 2. Prefer Interfaces for Extensible Domain Objects
Use `interface` for entity declarations and `type` for unions, intersections, or utility types.
