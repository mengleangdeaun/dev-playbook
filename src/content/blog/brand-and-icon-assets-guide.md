---
title: "Practical Guide to Brand Assets, App Icons, and Safe-Zone Sizing"
description: "How to format, size, and pad logos, favicons, mobile app icons, and backgrounds so your brand looks crisp across web tabs and mobile home screens."
pubDate: 2026-10-10
author: "Dara Chan"
tags: ["UI/UX", "Frontend", "React Native", "Assets", "Design Systems"]
image: "/assets/images/blog/brand-icons.svg"
---

# Practical Guide to Brand Assets, App Icons, and Safe-Zone Sizing

Nothing makes a polished application look amateur faster than a blurry navbar logo, a clipped Android home screen icon, or a massive 4 MB background image blocking the initial page paint. 

While designers hand over raw assets in Figma, it is usually up to the developer to export, size, pad, and wire them up properly. Getting your **formats**, **dimensions**, and **safe-zone padding** right ensures your app looks crisp on every Retina display, browser tab, and mobile launcher.

---

## 1. Logo Assets: Formats, Variants, and Sizing

Your primary brand logo appears in navbars, auth screens, footers, and emails. Using a single PNG file everywhere is a trap.

### Which Format to Use?
* **`.svg` (Scalable Vector Graphics) — Primary Choice:** Infinitely scalable, sharp on 4K and Retina screens, and tiny in file size (usually 2 KB–10 KB). Can also be styled dynamically with CSS (`fill="currentColor"`).
* **`.png` / `.webp` — Fallback Only:** Only use raster formats if your logo contains complex 3D shading or photographic textures, or when embedding inside HTML emails (since email clients like Outlook block SVGs).

### The 3 Logo Variants Every Repo Needs
Always store three distinct variants in `src/assets/brand/` (or `assets/images/` on mobile):
1. **`logo-full.svg`:** Icon mark + wordmark (for wide desktop navbars and login headers).
2. **`logo-mark.svg`:** The symbol alone (for collapsed sidebars and mobile headers).
3. **`logo-light.svg` / `logo-dark.svg`:** High-contrast versions tailored for dark mode and light mode surfaces.

> **Padding Tip for Navbar Logos:** Export SVGs with **tight bounding boxes** (zero internal empty space around the vector paths). Handle spacing in code using CSS `padding` or Flexbox `gap` so the logo aligns mathematically with your buttons and navigation links.

---

## 2. Web Favicons & Social Preview Images

Gone are the days of generating 25 different favicon sizes. Modern browsers only need a minimal, clean set of 5 files placed inside your `public/` folder:

| File Name | Dimensions | Format | Purpose |
| :--- | :--- | :--- | :--- |
| **`favicon.ico`** | `32×32` | `.ico` | Legacy browser fallback. |
| **`icon.svg`** | Vector (`1:1`) | `.svg` | Modern browsers; supports `@media (prefers-color-scheme: dark)` inside the SVG! |
| **`apple-touch-icon.png`** | `180×180` | `.png` | iOS Safari "Add to Home Screen" icon. |
| **`icon-192.png` & `icon-512.png`** | `192×192`, `512×512` | `.png` | Web App Manifest (`manifest.webmanifest`) for Android PWA installs. |
| **`og-image.png`** | `1200×630` | `.png` / `.jpg` | OpenGraph preview card for Telegram, Facebook, LinkedIn, and X links. |

```html
<!-- index.html -->
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.webmanifest" />
```

### Favicon Padding Guideline
* **`icon.svg` / `favicon.ico`:** Keep padding minimal (**~5%–8% margin**). At `16×16` or `32×32` pixels on a browser tab, excess padding makes your logo microscopic.
* **`apple-touch-icon.png` (`180×180`):** Use an **opaque background** (no transparency—iOS fills transparent pixels with pure black) and leave **~15%–18% padding** around the logo mark so iOS's rounded squircle corners don't crowd the edges.

---

## 3. Mobile App Icons (iOS & Android): The Safe-Zone Rule

The #1 mistake developers make with mobile app icons is making the logo **too big inside the canvas**. When installed on a phone, the operating system masks the edges—cutting off text or making the icon look claustrophobic next to native apps.

```text
+---------------------------------------+  <-- Full Canvas: 1024x1024 px (100%)
|             Outer Bleed               |      (Cropped by OS masks: circle/squircle)
|    +-----------------------------+    |
|    |      Safe Zone (66%)        |    |  <-- Inner Safe Zone: ~675x675 px
|    |                             |    |      Keep 100% of your logo mark inside
|    |         [ LOGO ]            |    |      this centered box!
|    |                             |    |
|    +-----------------------------+    |
|                                       |
+---------------------------------------+
```

### iOS App Icon (`1024×1024` PNG)
* **Format:** Flat `.png` with **no alpha channel (no transparency)**. If you upload a transparent PNG to App Store Connect, Apple will reject the build or fill the transparency with black.
* **Corners:** Export as a **sharp 90-degree square**. Never pre-round the corners—iOS automatically applies its continuous super-ellipse ("squircle") mask. Pre-rounding leaves ugly black or white artifacts in the corners.
* **Optical Padding Guideline:** Leave roughly **18% to 22% padding** on all four sides (`~185px–220px` margin on a `1024×1024` canvas).

### Android Adaptive Icons (`1024×1024` PNG)
Android uses a two-layer **Adaptive Icon** system so the OS launcher can crop icons into circles, squircles, or teardrops, and animate them when dragged:
1. **`adaptive-icon-background.png` (`1024×1024`):** Solid color, gradient, or subtle pattern.
2. **`adaptive-icon-foreground.png` (`1024×1024`):** Transparent PNG containing your centered logo mark.

**The 66% Safe-Zone Rule (Critical for Android):**
* The outer **17% on every side** is reserved for OS masking and parallax motion.
* Your foreground logo **must sit strictly inside the center 66% (`675×675` px)** of the `1024×1024` canvas—and visually looks best when kept around **50%–55% (`512×512` px)** so it breathes nicely inside circular masks.

### Optical Centering vs. Mathematical Centering
If your logo is an asymmetrical shape (like a "Play" triangle pointing right, or a stylized letter with a heavy tail), centering its bounding box mathematically (`X: 512, Y: 512`) will make it look off-center on the home screen. Shift asymmetrical icons slightly toward their visual center of weight so they feel balanced inside a circle.

---

## 4. Splash Screens & Background Assets

### Mobile Splash Screens (`splash-icon.png`)
Modern iOS and Android (Android 12+ SplashScreen API) no longer use full-screen stretched splash images—which always distorted across iPads, foldables, and notched phones. Instead, use:
* **A solid background color** (configured in `app.json` or native theme XML).
* **A centered `splash-icon.png` (`1024×1024` transparent PNG)** with the logo confined to the center **`560×560` px** safe circle.

```json
// app.json (Expo Configuration)
{
  "expo": {
    "icon": "./assets/images/icon.png",
    "ios": {
      "icon": "./assets/images/ios-icon.png"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-foreground.png",
        "backgroundImage": "./assets/images/adaptive-background.png"
      }
    },
    "plugins": [
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#0F172A",
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200
        }
      ]
    ]
  }
}
```

### App Background Images (Web & Mobile)
Full-bleed backgrounds are the heaviest assets in any application. Follow these rules to keep your UI fast:

1. **Prefer CSS/SVG over Raster Images:** Subtle mesh gradients, dot grids, and geometric backgrounds should be built with CSS `radial-gradient()` or lightweight `<svg>` patterns (`< 5 KB`) instead of exporting a `1920×1080` PNG.
2. **Use `.webp` or `.avif` for Photo Backgrounds:** If you need a photographic hero or login background, convert it to `.webp` or `.avif` at `80%` quality. Aim for **under `150 KB`** for desktop (`1920px` wide) and **under `75 KB`** for mobile (`1080px` wide).
3. **Provide `@2x` and `@3x` Scales on Mobile:** In React Native, if you use raster UI illustrations or backgrounds, provide `bg.png`, `bg@2x.png`, and `bg@3x.png` inside `assets/images/`. Metro bundler automatically picks the right resolution for the user's screen density.

---

## 5. Quick Asset Reference Sheet

| Asset Type | Format | Canvas Size | Safe-Zone / Padding Rule |
| :--- | :--- | :--- | :--- |
| **Navbar / UI Logo** | `.svg` | Tight crop | `0px` internal padding; space via CSS. |
| **Web Favicon** | `.svg` + `.ico` | `32×32` | **5%–8%** margin so it stays legible in small tabs. |
| **Apple Touch Icon** | `.png` (Opaque) | `180×180` | **15%–18%** margin; square corners. |
| **iOS App Icon** | `.png` (Opaque) | `1024×1024` | **~20% margin** (`~620×620` inner box); no transparency. |
| **Android Adaptive Icon** | `.png` (Transparent) | `1024×1024` | Keep logo inside center **55%–66%** (`560×560` to `675×675`). |
| **Social OG Card** | `.png` / `.jpg` | `1200×630` | Keep text/logos **80px** away from edges. |
| **Hero / App Background** | `.webp` / `.svg` | `1920×1080` | Compress under **150 KB**; use `object-fit: cover`. |