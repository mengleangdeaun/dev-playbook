---
title: "Developer Environment Setup"
description: "Step-by-step setup guide for new frontend and full-stack developers joining our engineering team."
category: "Onboarding"
order: 1
tags: ["Onboarding", "Node.js", "Git", "VSCode", "npm"]
author: "Engineering Operations"
lastUpdated: "2026-10-14"
---

# Developer Environment Setup

Welcome to the team! This guide walks you through setting up your local workstation for frontend and full-stack development.

## Prerequisites

Ensure you have the following installed before configuring repositories:

- **Node.js**: `>= 22.12.0` (LTS recommended)
- **Package Manager**: `npm` (run `corepack enable && corepack prepare pnpm@latest --activate`)
- **Git**: `>= 2.40.0`
- **Editor**: VS Code, Cursor, or Antigravity IDE

## Recommended VS Code Extensions

1. **Astro**: Official syntax support and language server.
2. **Tailwind CSS IntelliSense**: Autocomplete and hover previews for Tailwind classes.
3. **Prettier - Code formatter**: Automatic formatting on save.
4. **ESLint**: In-editor linting feedback.

## Git Configuration

Configure your commit signature and default branch:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"
git config --global init.defaultBranch main
```
