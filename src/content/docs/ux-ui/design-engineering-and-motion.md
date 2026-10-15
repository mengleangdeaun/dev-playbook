---
title: "Design Engineering: Motion, Micro-Interactions, and UI Polish"
description: "Practical rules for UI animations, custom easing curves, spring physics, and the invisible details that make software feel responsive and alive."
category: "UI/UX & Assets"
order: 4
pubDate: 2026-10-15
lastUpdated: "2026-10-15"
author: "Mengleang Deaun"
tags: ["UI/UX", "Animation", "CSS", "Design Engineering", "Performance"]
skillFile: "design-engineering-and-motion"
cover: "/assets/images/docs/design-engineering-cover.svg"
assets:
  - label: "Spring Physics Presets (TypeScript)"
    file: "/assets/downloads/spring-physics-presets.ts"
    size: "0.8 KB"
---

# Design Engineering: Motion, Micro-Interactions, and UI Polish

In a world where most software is "good enough," **taste and unseen details are the differentiator**. Most micro-interactions go unnoticed consciously—and that is the point. When a button scales down on press, a popover originates from its trigger, and a keyboard shortcut opens in `0ms`, the interface feels effortless.

---

## 1. The Animation Decision Framework

Before writing a single line of animation code, answer these four questions in order:

### 1. Should this animate at all?
Base your decision on **interaction frequency**:

| Frequency | Examples | Rule |
| :--- | :--- | :--- |
| **100+ times/day** | Keyboard shortcuts (`Cmd+K`), command palettes, tab switching | **No animation (`0ms`). Ever.** Animation makes high-frequency actions feel laggy. |
| **Tens of times/day** | Hover states, list navigation | Keep subtle and ultra-fast (`100ms–150ms`). |
| **Occasional** | Modals, drawers, dropdowns, toasts | Standard purposeful animation (`150ms–300ms`). |
| **Rare / First-Time** | Onboarding steps, empty-state celebrations | Can use richer motion or spring physics. |

### 2. Which Easing Curve Should It Use?
Built-in CSS easings (`ease-out`, `ease-in-out`) are too weak. Define strong custom `cubic-bezier` tokens in your root CSS:

```css
:root {
  /* Entering / Exiting elements (fast start = instant responsiveness) */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  /* Moving / Morphing elements already on screen */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

  /* iOS-style sheets and drawers */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}
```
> **Golden Rule:** **Never use `ease-in` on UI elements.** `ease-in` starts slow, delaying movement at the exact millisecond the user is watching for feedback.

### 3. How Fast Should It Be?
Keep standard UI animations **under `300ms`**:
* **Button press (`:active`):** `100ms–160ms`
* **Tooltips & small popovers:** `125ms–200ms`
* **Dropdowns & selects:** `150ms–250ms`
* **Modals & drawers:** `200ms–400ms`

---

## 2. Core Component Polish Rules

### 1. Buttons Must Feel Responsive (`scale(0.97)`)
Every pressable element needs subtle physical feedback on `:active`:

```css
.btn {
  transition: transform 150ms var(--ease-out);
}
.btn:active {
  transform: scale(0.97);
}
```

### 2. Never Animate from `scale(0)`
Nothing in the physical world appears out of zero volume. Animating from `scale(0)` feels cheap and jarring. Always start from **`scale(0.95)` + `opacity: 0`**:

```css
/* ❌ Bad */
.popover-enter { transform: scale(0); }

/* ✅ Good */
.popover-enter {
  transform: scale(0.95);
  opacity: 0;
}
```

### 3. Make Popovers & Dropdowns Origin-Aware
Dropdowns and popovers must scale out from their **trigger button**, not the center of the box. *(Exception: Modals stay `transform-origin: center` because they float in the center of the viewport).*

```css
/* Radix / Shadcn / Base UI */
.popover-content {
  transform-origin: var(--radix-popover-content-transform-origin, var(--transform-origin));
}
```

### 4. Tooltips: Delay the First, Instant on Subsequent
Show the first tooltip after a short hover delay (`~300ms`) to prevent accidental triggers. Once one tooltip is open, hovering adjacent toolbar buttons should open their tooltips in **`0ms` with no animation**.

### 5. Use `filter: blur(2px)` to Mask Imperfect State Crossfades
When morphing a button's label/icon (e.g., *"Copy"* $\rightarrow$ *"Copied!"*), a plain opacity crossfade briefly shows two overlapping icons. Adding a `2px` blur during the transition tricks the eye into seeing a single smooth morph:

```css
.button-content {
  transition: filter 180ms ease, opacity 180ms ease;
}
.button-content[data-transitioning="true"] {
  filter: blur(2px);
  opacity: 0.7;
}
```

### 6. Asymmetric Timing (Slow to Commit, Fast to Cancel)
For destructive "Hold to Delete" buttons using `clip-path: inset(0 100% 0 0)` overlays:
* **Pressing down:** `transition: clip-path 2s linear` (deliberate).
* **Releasing early:** `transition: clip-path 200ms var(--ease-out)` (snappy reset).

---

## 3. Springs, Gestures & Interruptibility

### Transitions Over `@keyframes`
Use **CSS transitions** or **Springs** instead of `@keyframes` for dynamic UI (like toasts or toggles). If a user toggles a state mid-animation, `@keyframes` snap back to `0%`, whereas transitions and springs smoothly reverse from their current position.

### Spring Physics Configuration (Framer Motion / Motion)
Use springs for drag gestures, sheets, and elements that need momentum:
```tsx
// Clean Apple-style spring config
const springConfig = { type: "spring", duration: 0.45, bounce: 0.15 };
```

### Gesture Rules for Mobile & Drawers
* **Velocity Dismissal:** Never force users to drag a sheet 50% down the screen if they flick it quickly. Dismiss if `Math.abs(swipeDistance) / elapsedTime > 0.11`.
* **Boundary Damping:** When dragging a drawer past its top limit, apply progressive rubber-band friction rather than a hard stop.

---

## 4. Performance & Accessibility Checklist

1. **Only Animate `transform` and `opacity`:** Never animate `height`, `width`, `padding`, or `margin` (which trigger expensive CPU layout recalculations every frame).
2. **Avoid Updating CSS Variables on Parent Containers During Drag:** Changing `--drag-y` on a parent recalculates styles for all child nodes. Mutate `element.style.transform = translateY(...)` directly on the target node.
3. **Hardware-Accelerate Framer Motion Under Load:** Use `animate={{ transform: "translateX(100px)" }}` instead of `animate={{ x: 100 }}` when the main thread is busy fetching or rendering page data.
4. **Gate Hover Effects for Touch Screens:** Prevent sticky "hover" states on iOS/Android taps:
   ```css
   @media (hover: hover) and (pointer: fine) {
     .card:hover { transform: translateY(-2px); }
   }
   ```
5. **Respect `prefers-reduced-motion`:** Replace spatial movement (`translate`, `scale`) with gentle `opacity` fades for motion-sensitive users.

---

## 5. Quick UI Code Review Reference

| Before (Anti-Pattern) | After (Design Engineering Standard) | Why |
| :--- | :--- | :--- |
| `transition: all 300ms` | `transition: transform 200ms var(--ease-out), opacity 200ms var(--ease-out)` | Never animate `all`; keep UI transitions under `300ms`. |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Real objects don't appear from zero mass. |
| `ease-in` on dropdowns/modals | `cubic-bezier(0.23, 1, 0.32, 1)` (`--ease-out`) | `ease-in` delays initial movement and feels sluggish. |
| No `:active` state on buttons | `active:scale-[0.97]` | Pressable elements must physically acknowledge taps. |
| `transform-origin: center` on popover | `transform-origin: var(--transform-origin)` | Popovers should grow out of the button that opened them. |
| Animating `Cmd+K` modal open | Instant open (`0ms`) | Never animate keyboard-triggered actions used 100x/day. |
| Bare `:hover` transform | Wrap in `@media (hover: hover) and (pointer: fine)` | Prevents sticky hover bugs on mobile touchscreens. |