---
title: "SVG Icons in React & React Native: Libraries, Sprites, and Bundle Hygiene"
description: "When to use lucide-react, when to import raw SVGs, how to strip dead Figma metadata with SVGO, and how to render crisp vector icons in React Native."
category: "UI/UX & Assets"
order: 1
pubDate: 2026-10-15
lastUpdated: "2026-10-15"
author: "Mengleang Deaun"
tags: ["SVG", "UI/UX", "React", "React Native", "Performance"]
cover: "/assets/images/docs/svg-icons-cover.svg"
---

# SVG Icons in React & React Native: Libraries, Sprites, and Bundle Hygiene

Icons are everywhere in modern interfaces, but treating SVGs carelessly is one of the easiest ways to bloat your JavaScript bundle or break theme colors. An unoptimized SVG exported straight from Figma or Illustrator often carries kilobytes of hidden XML junk, hardcoded hex colors that ignore dark mode, and fixed dimensions that refuse to scale.

Following a strict icon workflow keeps your UI sharp, your dark mode automatic, and your bundle lean.

---

## 1. The 3 Ways to Render SVGs in React

Not every vector graphic should be loaded the same way. Choose your strategy based on what the SVG represents:

| Approach | Best Used For | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Icon Library (`lucide-react`)** | Standard UI icons (arrows, trash, search, settings) | Consistent 2px stroke, tree-shakeable, easy sizing & coloring via props. | Limited to the library's catalog. |
| **Inline JSX Component (`SVGR`)** | Custom brand icons, interactive multi-color icons | Supports `currentColor`, CSS hover transitions, and dynamic props. | Adds to the JS bundle size if overused for large illustrations. |
| **`<img src={svgUrl} />`** | Complex empty-state illustrations, multi-stop gradients | Cached separately by the browser as an image; zero JS bundle cost. | Cannot style internal paths with CSS or `text-*` classes. |

### Rule #1: Never Import Full Icon Packs Without Tree-Shaking
Stick to **`lucide-react`** (Web) and **`lucide-react-native`** (Mobile) as our standard icon library. Always import individual icons directly so Vite/Rollup only bundles the exact icons rendered on screen:

```tsx
// ✅ Good: Only bundles the ~500 bytes for Check and Copy
import { Check, Copy } from "lucide-react";

export function CopyButton({ copied }: { copied: boolean }) {
  return (
    <button className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary">
      {copied ? <Check className="size-4 text-emerald-500"/> : <Copy className="size-4"/>}
      <span>{copied ? "Copied" : "Copy ID"}</span>
    </button>
  );
}
```

---

## 2. Cleaning Custom SVGs from Figma (`currentColor` & `viewBox`)

When a designer creates a custom icon in Figma (like a custom KhQR badge or specialized module icon), never drop the raw exported file straight into `src/assets/icons/`.

### Step 1: Strip Figma Bloat with SVGO / SVGOMG
Run exported SVGs through [SVGOMG](https://jakearchibald.github.io/svgomg/) or an `svgo` CLI script to strip XML comments, editor metadata, unnecessary `<defs>`, and redundant `<g>` wrapper groups.

### Step 2: Replace Hardcoded Hex Colors with `currentColor`
When you export an icon from Figma, it usually hardcodes `stroke="#0F172A"` or `fill="#1E293B"`. If you leave that in, the icon will stay pitch black in Dark Mode!

Replace hardcoded monochrome fills/strokes with **`currentColor`** so the SVG automatically inherits whatever Tailwind `text-*` class is applied to its parent:

```xml
<!-- ❌ Bad: Hardcoded width/height and hardcoded hex color -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#0F172A" stroke-width="2" />
</svg>

<!-- ✅ Good: Uses viewBox + currentColor so Tailwind's size-* and text-* control it -->
<svg viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

---

## 3. Using Custom SVGs in Vite (`vite-plugin-svgr`)

For custom monochrome icons stored in `src/assets/icons/`, configure `vite-plugin-svgr` so you can import `.svg?react` files directly as typed React components:

```tsx
import KhqrIcon from "@/assets/icons/khqr-mark.svg?react";

export function PaymentOption() {
  return (
    <div className="flex items-center gap-3 text-muted-foreground hover:text-primary">
      {/* Inherits text-muted-foreground and switches to text-primary on hover */}
      <KhqrIcon className="size-6 shrink-0"/>
      <span>Pay with KHQR</span>
    </div>
  );
}
```

> **Always add `shrink-0` to icons inside Flex containers:** If adjacent text wraps or grows long on mobile screens, Flexbox will squash your `size-5` icon into a skinny oval unless `shrink-0` is applied.

---

## 4. SVGs in React Native & Expo

Unlike web browsers, iOS and Android do not have a built-in HTML `<svg>` DOM parser. To render vector icons on mobile:

1. **Install `react-native-svg`:**
   ```bash
   npx expo install react-native-svg
   ```
2. **Use `lucide-react-native` for UI icons:**
   ```tsx
   import { QrCode } from "lucide-react-native";
   import { View, Text } from "react-native";

   export function ScanButton() {
     return (
       <View className="flex-row items-center gap-2 bg-primary px-4 py-3 rounded-xl">
         <QrCode color="#FFFFFF" size="{20}" strokeWidth="{2}"/>
         <Text className="text-white font-semibold">Scan Attendance QR</Text>
       </View>
     );
   }
   ```
3. **Use `react-native-svg-transformer` (or `expo-image`) for Custom SVG Files:**
   For complex static SVG illustrations on mobile, pass the `.svg` file directly to **`expo-image`**, which caches and renders it natively at 60fps without converting thousands of vector paths into React bridge nodes.

---

## 5. Optical Sizing & Touch Target Guidelines

* **Standard UI Icon Grid:** Design and export all system icons on a strict **`24×24` px** grid with a **2px stroke width** and **2px internal live-area padding** (so the vector artwork sits inside the center `20×20` box).
* **Button Pairing:**
  * Small buttons (`h-8` / `text-xs`): Use `size-3.5` (`14px`) or `size-4` (`16px`) icons.
  * Default buttons (`h-9` or `h-10` / `text-sm`): Use `size-4` (`16px`) or `size-5` (`20px`) icons.
* **Minimum Touch Targets:** An icon-only button (like a close `X` or notification bell) may visually use a `20×20` px icon, but its clickable `<button>` or `<Pressable>` wrapper must be at least **`40×40` px (Web)** or **`44×44` pt (Mobile)** so users don't mis-tap.