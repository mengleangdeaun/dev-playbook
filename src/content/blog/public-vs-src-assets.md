---
title: "public/ vs. src/assets/: Where Should Your Frontend Files Live?"
description: "Stop guessing where to drop images, fonts, and JSON files. Learn how modern bundlers like Vite and Next.js treat public/ versus src/assets/, and how it impacts caching, performance, and broken links."
pubDate: 2026-10-15
author: "Dara Chan"
tags: ["Vite", "React", "Frontend", "Architecture", "Web Performance"]
image: "/assets/images/blog/public-vs-src.svg"
---

# `public/` vs. `src/assets/`: Where Should Your Frontend Files Live?

Every modern frontend repository—whether spun up with Vite, Next.js, or Astro—gives you two places to put static files: the root **`public/`** folder and **`src/assets/`**. 

Because both folders can technically hold an image and render it on screen, developers frequently mix them up. You might see half the team placing icons in `public/images/` and referencing them with string paths, while the other half imports them from `src/assets/`.

While both approaches look identical on `localhost:5173`, they behave completely differently when your bundler compiles for production. Understanding that difference protects your app from stale browser caches, silent `404` broken images, and bloated bundles.

---

## 1. How the Bundler Treats Each Folder

The core difference comes down to **one question**: *Do you want your bundler (Vite/Rollup/Webpack) to process this file, or leave it completely untouched?*

| Feature | `src/assets/` (Bundler-Managed) | `public/` (Static Root Copy) |
| :--- | :--- | :--- |
| **Build Behavior** | Processed, optimized, and moved into `dist/assets/`. | Copied 1:1 directly to the root of `dist/` as-is. |
| **Filename Hashing** | **Yes** (`logo.svg` $\rightarrow$ `logo-8f3a1b.svg`). | **No** (`logo.svg` stays `logo.svg`). |
| **Cache Strategy** | Safe for aggressive long-term caching (`max-age=31536000, immutable`). | Requires careful cache invalidation or browsers may show stale files. |
| **Missing File Check** | **Fails at build/compile time** if a file is renamed or deleted. | **Fails silently at runtime** (`404 Not Found` in the user's browser). |
| **Base64 Inlining** | Tiny files (`< 4 KB` in Vite) are automatically inlined as Data URLs to save HTTP requests. | Never inlined; always triggers a separate network request. |

---

## 2. Inside `src/assets/`: The Default Choice for UI

Any image, icon, or illustration that is imported directly by a React component or CSS file belongs in **`src/assets/`**.

```text
my-app/
└── src/
    ├── assets/
    │   ├── icons/
    │   │   └── check-badge.svg
    │   └── images/
    │       └── empty-state.webp
    └── components/
        └── EmptyState.tsx
```

### How You Use It
Instead of hardcoding a URL string, you `import` the asset just like a JavaScript module:

```tsx
// ✅ Good: Bundler verifies the file exists and returns the hashed production URL
import emptyIllustration from "@/assets/images/empty-state.webp";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center p-8">
      <img
        src={emptyIllustration}
        alt="No records found"
        width={240}
        height={180}
      />
      <p>No transactions found for this period.</p>
    </div>
  );
}
```

### Why `src/assets/` Wins for Component UI
1. **Zero Stale Cache Bugs:** Suppose you update `empty-state.webp` with a new illustration. On build, Vite renames it from `empty-state-a1b2.webp` to `empty-state-x9y8.webp`. Your CDN can cache assets for a full year, yet users instantly see the new image the moment you deploy.
2. **Automatic Base64 Inlining:** In Vite, assets smaller than `4 KB` (configurable via `build.assetsInlineLimit`) are automatically converted into inline `data:image/...` strings inside your bundle, eliminating extra network round-trips for small UI icons.
3. **Compile-Time Safety:** If a teammate deletes `empty-state.webp`, TypeScript and `vite build` immediately throw an error before broken code can reach production.

---

## 3. Inside `public/`: When You Need a Predictable URL

Files inside `public/` bypass the bundler entirely. Whatever you put in `public/` is copied verbatim to the root of your production build (`dist/`), preserving its exact folder path and filename.

```text
my-app/
└── public/
    ├── favicon.ico               --> [https://yourapp.com/favicon.ico](https://yourapp.com/favicon.ico)
    ├── robots.txt                --> [https://yourapp.com/robots.txt](https://yourapp.com/robots.txt)
    ├── manifest.webmanifest      --> [https://yourapp.com/manifest.webmanifest](https://yourapp.com/manifest.webmanifest)
    ├── og-image.png              --> [https://yourapp.com/og-image.png](https://yourapp.com/og-image.png)
    └── fonts/
        └── Inter-Variable.woff2  --> [https://yourapp.com/fonts/Inter-Variable.woff2](https://yourapp.com/fonts/Inter-Variable.woff2)
```

### What Belongs in `public/`?
1. **Crawler & Browser Root Files:** `robots.txt`, `sitemap.xml`, `favicon.ico`, `apple-touch-icon.png`, `manifest.webmanifest`, and `.well-known/` verification files (like Apple Universal Links or Android `assetlinks.json`). External crawlers and mobile OS launchers look for these at exact, hardcoded root URLs—they cannot guess a Vite content hash.
2. **Social OpenGraph Images (`og-image.png`):** Meta tags in `index.html` (`<meta property="og:image" content="..." />`) require a stable URL so Telegram, Facebook, and X link scrapers can fetch them.
3. **Preloaded Web Fonts:** Fonts referenced in `<link rel="preload" href="/fonts/Inter.woff2" as="font" />` inside `index.html` work best with predictable paths in `public/fonts/`.
4. **Web Workers, WASM binaries, or External Scripts:** Third-party scripts (`pdf.worker.min.js`) loaded dynamically by URL at runtime.

### The Common `public/` Pitfall
Never write `src="/public/logo.svg"` in your code. Because `public/` is served at the root `/` of your web server, always reference it starting from `/` (or `import.meta.env.BASE_URL` if deploying to a subfolder):

```tsx
// ❌ Wrong: Will work in some poorly configured dev setups, then 404 in production
<img src="/public/og-image.png" alt="Preview" />

// ✅ Correct: Served from the root domain
<img src="/og-image.png" alt="Preview" />
```

---

## 4. Handling Dynamic Image Names (`src/assets/` vs. `public/`)

A common reason developers dump UI images into `public/` is when rendering dynamic paths—for example, displaying a payment provider icon based on an API response (`provider: "aba" | "acleda" | "wing"`).

Because static `import` statements cannot take variables, developers often resort to:
```tsx
// ⚠️ Risky: Putting UI icons in public/ just to use template strings
<img src={`/icons/banks/${bank.code}.svg`} alt={bank.name} />
```

Instead of moving UI assets to `public/` (and losing filename hashing and build checks), keep them in `src/assets/` and use **`new URL(..., import.meta.url)`** or **`import.meta.glob`** in Vite:

```tsx
// ✅ Best Practice: Dynamic asset resolution inside src/assets/ with Vite
function getBankLogoUrl(code: string): string {
  return new URL(`../assets/banks/${code}.svg`, import.meta.url).href;
}

export function BankBadge({ code, name }: { code: string; name: string }) {
  return <img src={getBankLogoUrl(code)} alt={name} className="h-6 w-6" />;
}
```
Vite analyzes the `new URL` pattern at build time, hashes all matching files in `src/assets/banks/`, and rewrites the lookup automatically.

---

## 5. The 10-Second Decision Rule

Before dropping a file into your project, ask yourself these three questions:

1. **Does an external bot, browser tab, or OS need to fetch this file by an exact, unchanging URL?** (`robots.txt`, `favicon.ico`, `og-image.png`, `.well-known/assetlinks.json`)
   $\rightarrow$ Put it in **`public/`**.
2. **Is it referenced directly inside `index.html` `<head>` preload tags?** (`Inter-Variable.woff2`)
   $\rightarrow$ Put it in **`public/`**.
3. **Is it rendered by a React component or CSS stylesheet?** (UI illustrations, navbar logos, backgrounds, SVG icons)
   $\rightarrow$ Put it in **`src/assets/`** and `import` it.