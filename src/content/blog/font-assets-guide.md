---
title: "The Practical Guide to Font Assets in Web and Mobile Apps"
description: "Everything you need to know about choosing the right font extensions (.woff2, .ttf, .otf), where to store them, and how to load them cleanly in Vite, Next.js, and React Native."
pubDate: 2026-10-15
author: "Mengleang Deaun"
tags: ["Typography", "Frontend", "React Native", "Web Performance", "CSS"]
image: "/assets/images/blog/font-assets.svg"
---

# The Practical Guide to Font Assets in Web and Mobile Apps

Typography can make or break a user interface, yet managing font files across web and mobile repositories often turns into a guessing game. Should you commit `.ttf` files to your web app? Do fonts go inside `public/` or `src/assets/`? Why does a custom font work on iOS but fail silently on Android?

Understanding **what** font formats exist, **where** they belong in your project structure, and **how** to load them properly eliminates layout shifts on the web and broken text on mobile.

---

## 1. What: Choosing the Right Font Extension

Not all font files are built for the same platform. Dropping a raw desktop font into a web application wastes bandwidth, while feeding a web-compressed font to a native mobile app will cause a build error.

| Extension | Full Name | Best Used For | Key Characteristics |
| :--- | :--- | :--- | :--- |
| **`.woff2`** | Web Open Font Format 2 | **Web Apps (Primary)** | Uses Brotli compression (~30% smaller than `.woff`). Supported by all modern browsers. |
| **`.woff`** | Web Open Font Format | **Web Apps (Legacy)** | Older zlib-compressed web format. Rarely needed unless supporting ancient browsers. |
| **`.ttf`** | TrueType Font | **Mobile Apps (iOS / Android)** | Uncompressed, universal standard for native OS rendering engines. |
| **`.otf`** | OpenType Font | **Mobile Apps & Desktop** | Built on TrueType with support for advanced typographic features (ligatures, alternates). |

### Variable vs. Static Fonts
Before downloading 6 separate files for `Light`, `Regular`, `Medium`, `SemiBold`, and `Bold`, check if the typeface offers a **Variable Font** (e.g., `Inter-Variable.woff2` or `Inter-VariableFont_slnt,wght.ttf`). A single variable font file contains every weight and style axis, cutting network requests on the web and reducing app binary size on mobile.

---

## 2. Web Apps: Where to Store & How to Load Fonts

### Where to Store Fonts in a Web Project
In modern bundlers like **Vite** or **Next.js**, you have two directory options:

1. **`public/fonts/` (Recommended for `@font-face` & Preloading):**
   Files in `public/` are served at the root URL (`/fonts/Inter.woff2`) without having their filenames hashed during build. This predictable path makes it easy to add `<link rel="preload">` tags in your HTML head so the browser downloads the font before parsing your CSS bundle.
2. **`src/assets/fonts/` (Bundled):**
   Files placed here are processed by Vite/Webpack, given a cache-busting hash (e.g., `Inter-a8f3b2.woff2`), and bundled when imported in CSS. Use this if you don't need manual HTML preloading.

```text
my-web-app/
├── public/
│   └── fonts/
│       └── PlusJakartaSans-Variable.woff2  <-- Predictable URL: /fonts/...
└── src/
    ├── styles/
    │   └── globals.css
    └── main.tsx
```

### How to Load Fonts in Vite / Standard React
Always self-host `.woff2` files rather than relying on third-party CDNs like Google Fonts—since modern browsers partition HTTP caches by domain, users no longer share cached Google Fonts across websites.

**Step 1: Preload critical fonts in `index.html`**
```html
<head>
  <link
    rel="preload"
    href="/fonts/PlusJakartaSans-Variable.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
</head>
```
> **Crucial:** Always include `crossorigin="anonymous"` on font preloads, even when hosted on your own domain. Fonts are fetched using anonymous mode CORS; omitting this attribute forces the browser to download the font twice!

**Step 2: Declare `@font-face` in `src/styles/globals.css`**
```css
@font-face {
  font-family: "Plus Jakarta Sans";
  src: url("/fonts/PlusJakartaSans-Variable.woff2") format("woff2");
  font-weight: 200 800; /* Range for variable font */
  font-style: normal;
  font-display: swap; /* Shows fallback text immediately, swaps when loaded */
}
```

**Step 3: Wire up Tailwind CSS**
```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
    },
  },
};
```

### How to Load Fonts in Next.js (`next/font`)
If you are using Next.js, store your `.woff2` files inside `src/app/fonts/` and use `next/font/local`. Next.js automatically optimizes the font and generates zero-layout-shift CSS size-adjust fallbacks:

```tsx
// src/app/layout.tsx
import localFont from "next/font/local";

const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-jakarta",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

---

## 3. Mobile Apps (React Native & Expo): Where & How

Mobile operating systems do not understand `.woff2` and do not support CSS `font-weight: 600` fallback matching the way browsers do on older Android versions unless properly linked. Always use **`.ttf`** or **`.otf`** files.

### Where to Store Fonts in Mobile Projects
Store your font files inside `assets/fonts/` at the root of your repository:

```text
my-mobile-app/
├── assets/
│   └── fonts/
│       ├── PlusJakartaSans-Regular.ttf
│       ├── PlusJakartaSans-Medium.ttf
│       └── PlusJakartaSans-Bold.ttf
├── app/
│   └── _layout.tsx
└── app.json
```

### How to Load Fonts in Expo (Best Practice)
Instead of loading fonts asynchronously at runtime across components, use the **`expo-font` config plugin** in `app.json` to embed the fonts directly into the native iOS `Info.plist` and Android `assets/fonts` directory at build time.

**Step 1: Register fonts in `app.json` (Build-time native linking)**
```json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/PlusJakartaSans-Regular.ttf",
            "./assets/fonts/PlusJakartaSans-Medium.ttf",
            "./assets/fonts/PlusJakartaSans-Bold.ttf"
          ]
        }
      ]
    ]
  }
}
```

**Step 2: Runtime loading with `useFonts` & SplashScreen (For Expo Go / OTA updates)**
If you aren't running a custom prebuild yet, hold the splash screen until `useFonts` finishes loading in your root layout:

```tsx
// app/_layout.tsx
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return <Stack false headerShown: screenOptions="{{" }}/>;
}
```

### Common Mobile Gotcha: PostScript Names vs. Filenames
On **Android**, React Native matches the `fontFamily` string to the **filename** (e.g., `PlusJakartaSans-Bold.ttf` -> `PlusJakartaSans-Bold`).
On **iOS**, native rendering looks for the internal **PostScript name** embedded inside the font metadata. Always keep your `.ttf` filenames identical to the font's internal PostScript name (or define explicit alias keys in `useFonts`) so a single `fontFamily: "Jakarta-Bold"` style works identically on both platforms.

---

## 4. Quick Checklist Before Shipping

* **Web:** Convert all `.ttf` and `.otf` files to **`.woff2`** (use tools like `fonttools` or CloudConvert).
* **Web:** Subset fonts if you only need specific character sets (e.g., Latin + Khmer) to strip out unused glyphs.
* **Web:** Set `font-display: swap` or `optional` to prevent invisible text during slow 3G/4G loads.
* **Mobile:** Stick strictly to **`.ttf`** or **`.otf`** inside `assets/fonts/`.
* **Mobile:** Map each font weight explicitly (`Jakarta-Regular`, `Jakarta-Bold`) rather than relying on `fontWeight: "700"` with a custom `fontFamily` to avoid synthetic bolding bugs on Android.