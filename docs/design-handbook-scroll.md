# Design handbook — scroll language

Site-wide motion and interaction language for thisisjyyeung.com (Dysphoria and future projects). Keep these patterns consistent unless a page explicitly opts out.

## Scroll-scrubbed sticky float (major beats)

Major narrative beats (enter gate, exit gate) use a **tall scroll section + sticky stage**:

- Section height is larger than the viewport (e.g. ~150vh enter / ~240vh exit).
- Inner stage is `position: sticky` under the topbar and fills the remaining viewport.
- Scroll progress through the section (0→1) drives transforms, opacity, and clip-path.

This reads as a floating beat that the page scrubs through, not a separate “page” or a JS scroll-jack. Prefer progress math from layout geometry (`getBoundingClientRect` / section height) over wheel hijacking.

**Soundtrack** is a **persistent document-flow section** between enter-gate and sheets (heading, copy, Listen on, Apple Music iframe). It must never fade or get covered by a scrub wipe — keep pointer events on so the iframe works without sticky-overlay quirks.

**Do:** keep pointer events off decorative gate layers.  
**Don’t:** rebuild cylinder / 3D tunnels for these beats; stay with 2D sticky scrub for gates only.

## Axis-locked nested horizontal carousels

Horizontal carousels nested inside a vertically scrolling page (sheets plate stage) must not fight the page scroll:

1. Default `touch-action: pan-y` on the carousel stage so vertical page scroll still works when the gesture is clearly vertical.
2. On pointer/touch move, wait until movement clears a small threshold (~10px).
3. If **horizontal** dominates, lock to **x**: add an `is-axis-x` class (`touch-action: none`), `setPointerCapture`, and `preventDefault` on non-passive `touchmove` so Android Chrome cannot steal the gesture mid-swipe with a slight vertical drift.
4. If **vertical** dominates, abandon the carousel gesture and let the page scroll.
5. Preserve in-carousel tools (loupe / flip / replace) — they are not scroll gestures; ignore them when starting a drag.

Desktop pointer drag can share the same lock path. Keyboard arrows remain available for plate changes.


## Android note (pan-y vs pan-x)

`touch-action: pan-x` alone makes vertical page scroll feel broken when the finger starts on the plate stage — users expect two-direction nested scroll. Prefer:

- Default **`touch-action: pan-y`** so vertical page scroll works until the gesture locks.
- On axis lock to **x** (`adx >= ady` after a small threshold): set `is-axis-x` (`touch-action: none`), capture pointer, and **`preventDefault` immediately** on non-passive `touchmove` / `pointermove`. Mid-gesture `touch-action` changes are ignored by Chromium; preventDefault is what keeps Android Chrome from stealing a horizontal swipe.
- Do **not** re-zero `dx` at lock (pre-lock travel counts toward commit). Use a lower commit threshold so short/fast L/R swipes still advance.
- Keep a dedicated touch listener path in addition to pointer events for Android Chrome reliability.

## Primary QA device

**Android Chrome** is the primary QA target for nested scroll and touch.

Validate on a real Android phone (or remote device) before signing off carousel work:

- Vertical scroll through intro → enter gate → soundtrack → sheets → exit still feels continuous.
- A mostly-horizontal swipe on the plate advances/rewinds sheets without the page jumping.
- A mostly-vertical drag that begins on the plate scrolls the page instead of nudging the plate.
- Loupe, flip, and replace still work after axis-lock changes.

iOS Safari and desktop Chromium are secondary checks; do not optimize nested scroll only for desktop `wheel` behavior.
