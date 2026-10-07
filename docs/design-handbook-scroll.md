# Design handbook — scroll language

Site-wide motion and interaction language for thisisjyyeung.com (Dysphoria and future projects). Keep these patterns consistent unless a page explicitly opts out.

**Related:** full motion/interaction handbook → [`motion-and-interaction.md`](./motion-and-interaction.md) · taste locks → [`design-taste.md`](./design-taste.md).

Last refreshed: **2026-10-07** (HKT) — folded iPad/WebKit plate ships (`ipad-swipe-v1`, `plate-gutter-swipe-v1`).

---

## Scroll-scrubbed sticky float (major beats)

Major narrative beats (enter gate, soundtrack mid-gate, exit gate) use a **tall scroll section + sticky stage**:

- Section height is larger than the viewport (enter/exit gates ~**240vh**).
- Inner stage is `position: sticky` under the topbar and fills the remaining viewport.
- Scroll progress through the section (0→1) drives transforms, opacity, clip-path and layer crossfades.

This reads as a floating beat that the page scrubs through, not a separate “page” or a JS scroll-jack. Prefer progress math from layout geometry (`getBoundingClientRect` / section height) over wheel hijacking.

**Do:** keep pointer events off decorative gate layers; enable them only on live interactive layers (e.g. soundtrack when faded in).  
**Don’t:** rebuild cylinder / 3D tunnels for these beats; stay with 2D sticky scrub.

Under `prefers-reduced-motion: reduce`, snap gate scrub to settled states from scroll position — no continuous scale/blur.

---

## Axis-locked nested horizontal carousels (plates)

Horizontal carousels nested inside a vertically scrolling page (sheets plate stage) must not fight the page scroll.

### CSS (stage defaults)

1. Default **`touch-action: pan-y`** on `.plate-stage` so vertical page scroll still works until JS claims the gesture. **Plate-only** — no `pinch-zoom` on the stage (Jy). Page/viewport pinch elsewhere stays available (viewport meta has no `maximum-scale` / `user-scalable=no`).
2. **`overscroll-behavior-x: none`** on `html`, `body` and `.plate-stage` so iPadOS edge back-swipe cannot steal a horizontal plate drag.
3. While claimed: `.plate-stage.is-gesture`, `.is-axis-x` and `.is-loupe` set **`touch-action: none`**.

### JS claim model (live — `dysphoria.js`)

1. **Touch owns mobile** (single `touch.identifier` through start→move→end). **Pointer owns mouse/pen only** — ignore `pointerType === "touch"` on the pointer path so iPad does not dual-path race (`ipad-swipe-v1`).
2. On start: add **`.is-gesture` immediately** (Dex C). WebKit ignores mid-gesture `touch-action` changes and often ignores late `preventDefault` under nested `pan-y`.
3. Axis lock after **~6px** travel (`AXIS_LOCK_PX`). If **horizontal dominates or ties** (`adx >= ady`), lock **x**: add `.is-axis-x`, `preventDefault` on non-passive `touchmove` / `pointermove`, and (mouse/pen) `setPointerCapture`.
4. If **vertical** dominates: lock **y**, keep preventing default, and **forward** vertical delta with `window.scrollBy(0, -deltaY)` so the page still scrolls while JS owns the gesture.
5. Do **not** re-zero `dx` at lock (pre-lock travel counts toward commit). Commit threshold is low: `min(44px, plateWidth * 0.12)` so short/fast L/R swipes still advance.
6. **Gutter / peek swipe** is allowed — peeks sit in the side gutters and must start L/R (`plate-gutter-swipe-v1`). Keep Prev/Next (`.plate-nav`) and Loupe/Flip/Replace (`.icon-btn` / `.plate-controls`) exclusive so taps still hit those controls.
7. **Second finger** aborts the swipe and clears `.is-gesture` (stage is pan-y only; no plate pinch).
8. Keyboard arrows remain available for plate changes. Loupe / flip / replace are not scroll gestures — ignore them when starting a drag (`shouldIgnoreTarget`).

Desktop pointer drag shares the same axis math on the pointer-only path.

---

## Android + iPad notes

**Android Chrome** remains a primary QA target for nested scroll. **iPad Chrome/Safari** is a first-class check after the WebKit claim fixes — do not treat iPad as secondary for plate work.

Validate on real glass (or remote device) before signing off carousel work:

- Vertical scroll through intro → enter gate → sheets → exit still feels continuous.
- A mostly-horizontal swipe on the plate (including starting on a **peek / gutter**) advances/rewinds sheets without the page jumping or triggering browser back.
- A mostly-vertical drag that begins on the plate scrolls the page (via `scrollBy` once axis locks to y).
- Multi-finger on the plate aborts the swipe; page/viewport pinch outside the stage still works.
- Loupe, flip and replace still work after axis-lock changes.
- Swipe A→B→C in one session without a stuck gesture or cancelled second swipe (single touch id).

MacBook Chrome remains a secondary check for scrub math and keyboard; do not optimize nested scroll only for desktop `wheel` behavior.

---

## Primary QA devices (scroll / touch)

1. **Android Chrome** (nested scroll + touch)
2. **iPad Chrome or Safari** (WebKit claim, gutter swipe, overscroll-x, landscape About is separate — see taste doc)
3. **iPhone Safari** (emulated OK when real glass unavailable)
4. **MacBook Chrome** (gate scrub, keyboard)

Prefer `jy-site` URLs with `?v=…` after a ship. Full ladder: [`uat-checklist.md`](./uat-checklist.md).
