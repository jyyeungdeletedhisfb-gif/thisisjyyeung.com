# Motion and interaction — thisisjyyeung.com

Version: **1.1**  
Last updated: **2026-10-07** (HKT)

Living handbook of how the site moves and responds. Seed from **live CSS/JS/HTML**, not aspiration. Rachel owns the doc; Steve flags gaps in smoke notes; Jy taste-locks anything that reads on glass.

**Related:** brand / About / chrome locks → [`design-taste.md`](./design-taste.md) · scroll / plate input language → [`design-handbook-scroll.md`](./design-handbook-scroll.md) · UAT → [`uat-checklist.md`](./uat-checklist.md).

---

## 1. Purpose / how to update

This file is the motion/interaction source of truth for Dex, Rachel, Steve and future bots. Prefer it over re-deriving timings from chat.

**Cadence (match the ship cycle)**

- Update this doc in the **same ship** whenever motion/interaction behavior changes (timings, triggers, axis-lock, gates, fades, page transitions, reduced-motion). Don’t wait for a later docs pass.
- If a ship is copy / assets / docs-only with no motion change, leave this file alone (no empty bumps).
- Once a week after Monday’s standup, skim for drift vs live. Steve can flag gaps in morning smoke notes.

**Ownership**

| Role | Owns |
| --- | --- |
| Rachel | Doc accuracy, structure, same-ship updates |
| Steve | Gap flags from smoke / UAT (blocker-only) |
| Jy | Taste lock on phone / glass |

**Versioning**

- Top of file: `Version: X.Y` and `Last updated: YYYY-MM-DD` (HKT).
- Bump **minor** (`X.Y` → `X.Y+1`) for module tweaks, quirk notes or lesson-learned lines.
- Bump **major** (`X` → `X+1.0`) when a pattern changes site-wide (new scroll language, plate input model, etc.).
- Keep a short **Changelog** at the bottom (newest first).

---

## 2. Global rules

### `prefers-reduced-motion`

Every float-in, scrub flourish, brand scramble and drawer stagger must respect `prefers-reduced-motion: reduce`.

- **Do:** settle content immediately (`opacity: 1`, `transform: none`, add `.is-in`). Skip glyph scramble; still settle the destination brand face.
- **Don’t:** leave anything stuck at `opacity: 0` waiting for a transition that never runs.
- Gate scrub under reduce snaps to settled states (intro / soundtrack live / exit done) from scroll position — no continuous scale/blur scrub.
- Load gate under reduce: shorter timeout (400ms), no min hold, spinner animation off.

### Timing bands

Shared ease: `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease` / `--nav-ease`).

| Band | Typical range | Used for |
| --- | --- | --- |
| Instant chrome | 0.2–0.25s | Link / button color, border |
| Short UI | 0.35–0.48s | Work tile float-in, nav item fade, load-gate dismiss |
| Drawer / panel | ~0.42s (`--nav-duration`) | Hamburger panel slide + scrim |
| Medium beat | 0.55–0.72s | Plate commit, title swap, brand shuffle (720ms, capped ≤800ms) |
| Soft reveal | ~1.05–1.15s | Dysphoria intro / About enter float-ins |

### Never hide LCP behind `opacity: 0`

- Work tiles start at `opacity: 0` only after `.float-up` is armed, then reveal on **per-tile decode** (double-rAF → `.is-in`). Hard fallback `setTimeout(reveal, 2200)` so a broken image never leaves a blank tile.
- Dysphoria intro float waits for load-gate dismiss (or 900ms fallback) — the load gate itself is the first paint, not an invisible hero.
- About hero enter uses opacity only (no `translateY` on the fixed layer — that reads as a glitch against the parked photo).

### Chrome vs era exceptions

- Site chrome (Geist): hamburger drawer, Work float-ins, brand shuffle on Geist↔Clarendon navigations. Details in [`design-taste.md`](./design-taste.md).
- Dysphoria era: Clarendon brand, sticky gate scrubs, plate carousel, soundtrack crossfade — era physics, not chrome.
- Future eras: any brand **face change** must scramble with `fromFace` = **destination** face; seed glyphs before paint. Never flash the previous face for a frame.

---

## 3. Per module

### Home (`index.html`, `body.home-dummy`)

| | |
| --- | --- |
| **Intent** | Placeholder full-bleed “still creating” hero. Float hamburger only (no title bar). Quiet Work / Contact / About text links. |
| **Timings** | No page float-in. Nav drawer uses global `--nav-duration` (0.42s). Link hover opacity ~0.7. |
| **Triggers** | Hamburger open/close; same-origin links into Dysphoria mark brand shuffle enter via `chrome.js`. |
| **Reduced motion** | Drawer transitions none; items visible immediately. |
| **Quirks** | Dummy home ships with white shell (`home-dummy`); chrome.css opts white via `body.home-dummy` only. No LCP image. |
| **Lessons** | Keep home motion near-zero until the real hub lands — don’t invent float-ins for a placeholder. |

### Work (`work/index.html`, `initWorkFloat` / `initWorkTileWarm` in `chrome.js`)

| | |
| --- | --- |
| **Intent** | Grid of era tiles. Each tile **eager-loads** (`loading="eager"`; Dysphoria also `fetchpriority="high"`) and **float-ins after its own decode** (`work-tile-load-v1`). |
| **Timings** | `opacity` + `translateY(12px)` → settled over **0.38s** ease. Warm of 1080w cover URLs on pointerenter / focus / touchstart toward `/work/` (skips Save-Data). |
| **Triggers** | Per-tile: `img.decode()` (or load/error) → double-rAF → `.is-in`. Timeout 2200ms failsafe. |
| **Reduced motion** | Tiles get `.is-in` immediately; no transition. |
| **Quirks** | Covers use `srcset` (`img-srcset-v1` / `v2`). Front stays intentional 1080 brat low-res. Order matches About trail: Dysphoria → Front → A+I → State. |
| **Lessons** | Eager + per-tile reveal beats one shared IO reveal — slow tiles don’t hold the grid hostage; fast tiles don’t pop blank. |

### About (`about.js`, `about.css`)

Brand / layout locks (I/He crops, landscape 50/50, hero park) live in [`design-taste.md`](./design-taste.md) — don’t duplicate. Motion only:

| | |
| --- | --- |
| **Intent** | Soft page enter; scroll-driven hero fade/blur under the sheet (portrait); voice toggle crossfades. |
| **Timings** | Hero enter: opacity **1.15s**. Intro enter: opacity + `translateY(14px)` **1.08s** with **0.1s** delay. Voice img crossfade **0.42s**; bio fade out ~180ms then swap; ground/theme **0.45s**. Hero blur max **14px** over scroll (`progress = y / (heroH * 0.7)`); `.is-parked` at progress ≥ 0.98. |
| **Triggers** | Double-rAF arm `.is-entering` + `.is-in` once per load (fixed hero never “enters” for IO). Scroll/resize rAF for park. Voice buttons + arrow keys on tablist. |
| **Reduced motion** | Enter instant; blur forced `0px`; voice applies instantly (`opts.instant`). Landscape split skips park fade entirely (image stays solid). |
| **Quirks** | `.is-entering` removed after 1500ms so scroll-driven fade isn’t CSS-eased. Name (`JY YEÜNG`) never fades on voice change. |
| **Lessons** | Don’t `translateY` the fixed hero. Double-rAF before `.is-in` or the first paint skips and the transition never runs. |

### Dysphoria — intro

| | |
| --- | --- |
| **Intent** | Cover + copy soft-land after load gate; natural-height intro (no `min-height: 100vh` void under the scroll cue — `dysphoria-ux-v1`). |
| **Timings** | Float-up **1.05s**, `translateY(28px)`. Cover delay 0.05s; h1 0.18s; p 0.32s (h1/p use `translateY(22px)`). |
| **Triggers** | Load-gate `transitionend` (fallback 900ms) → `markFloatIn`. Cover URL from single best `srcset` variant (`img-srcset-v2` / `coverDisplayUrl`). |
| **Reduced motion** | Immediate `.is-in`; no delay. |
| **Quirks** | Cue sits close under copy — don’t reintroduce tall white void. |
| **Lessons** | Intro reveal is gated on load dismiss so users never see content float under a spinner. |

### Dysphoria — load gate

| | |
| --- | --- |
| **Intent** | First-open preload of cover, backdrop, both gates and display-sized plates (not loupe masters). |
| **Timings** | Race preload vs **2200ms** timeout; min hold **320ms**; dismiss opacity **0.45s**; DOM remove by 700ms. Spinner `loadSpin` 0.85s linear. |
| **Triggers** | After first paint of chrome (`runLoadGate` post-boot). |
| **Reduced motion** | Timeout 400ms, min hold 0, spinner off, faster dismiss (0.15s). |
| **Quirks** | Soft backlog: lazy-load plates beyond neighbors (see `backlog.md`) — not shipped. |
| **Lessons** | Cap phone gate variants at 1600w so mid-expand stays under ~500KB; desktop keeps full master for 6.4× expand. |

### Dysphoria — enter / exit gates + soundtrack

| | |
| --- | --- |
| **Intent** | Scroll-scrubbed sticky float (~**240vh** sections). Enter expands circle into soundtrack; exit contracts. No darken wipe over soundtrack text/widget. |
| **Timings (enter progress 0→1)** | Gate fade-in 0.00–0.10; scale 0.32→**6.4** and clip 32%→82% over 0.06–0.72; soundtrack fade 0.48–0.72 (blur→18px, brightness→0.45); gate opacity soft-out after 0.68. Soundtrack layer `.is-live` when snd > 0.4. |
| **Timings (exit)** | Hold ~0–0.12; contract scale 4.4→0.28 / clip 78%→34% over 0.12–0.80; fade 0.78–0.96. |
| **Triggers** | Passive scroll → `sectionProgress` from layout geometry (not wheel hijack). Topbar `.on-dark` once past intro. |
| **Reduced motion** | Snap scrubEnter/Exit to 0 or 1 from mid-viewport vs section tops. Soundtrack bg: blur 8px, no transform. |
| **Quirks** | Pointer-events stay off decorative gate layers; live only on soundtrack when faded in. Edge-sampled blacks `#030303` enter / `#000` exit. |
| **Lessons** | Keep expanding through the soundtrack crossfade (`dysphoria-ux-v1`) — early settle reads as a hard cut. |

### Dysphoria — plates (carousel)

| | |
| --- | --- |
| **Intent** | Axis-locked nested horizontal carousel inside vertical page scroll. Toolbar: Prev \| Loupe \| Flip \| Replace \| Next. Peeks in side gutters. |
| **Timings** | Commit exit 0.55s / 0.45s opacity; enter 0.6s / 0.5s; settle clear 620ms. Snap-back 0.4s / 0.35s. Title exit class 160ms then enter keyframes 0.55s. Flip 0.65s on `.plate-card` (border + faces rotate together; faces static 0°/180°). Soft scroll lock via `.is-flipping` so WebKit backface holds. Replace swap ~520ms + 550ms unlock. Loupe zoom **2.2×**. |
| **Triggers** | Touch owns mobile (single `touch.identifier`); pointer owns mouse/pen only (`ipad-swipe-v1`). `.is-gesture` at **gesture start**; axis lock at **6px**; equal travel biases **x**. Commit threshold `min(44, plateW * 0.12)`. Gutter / peek swipe allowed; ignore `.icon-btn` / `.plate-controls` / `.plate-nav` (`plate-gutter-swipe-v1`). Second finger aborts (no plate pinch). Keyboard ←/→ and `f` flip. |
| **Reduced motion** | Plate CSS transitions none where media-query’d; commit path still swaps content (functional). |
| **Quirks** | `touch-action: pan-y` default; `.is-gesture` / `.is-axis-x` / `.is-loupe` → `none`. `overscroll-behavior-x: none` on html/body/stage blocks iPadOS history back-swipe. Vertical lock forwards via `window.scrollBy`. After a swipe commit, `animating` holds ~900ms; Prev/Next and ←/→ with `fromNav` **queue** the next plate and flush in `endAnimate` (`plate-nav-after-swipe-v1`) — bare `go(d)` (peek/plate ghost) still drops during that window. Peek intentional tap within ~450ms of an axis-x swipe is suppressed. See [`design-handbook-scroll.md`](./design-handbook-scroll.md). |
| **Lessons** | WebKit ignores mid-gesture `touch-action` changes and late `preventDefault` — claim `.is-gesture` in the starting handler. Dual pointer+touch paths race on iPad; touch-only id on mobile fixed A→B→C swipes. A “swallowed” first Next after swipe was `animating` blocking `go()`, not leftover click-suppress — queue nav intent instead of lengthening suppress windows. |

### Dysphoria — exit (page leave)

Leaving Dysphoria marks brand shuffle `exit` (click or `pagehide`); scramble plays **once on Geist arrival**. See §4 and [`design-taste.md`](./design-taste.md).

### Contact / Privacy

| | |
| --- | --- |
| **Intent** | Quiet Geist pages. Contact is placeholder (“form coming soon”); Privacy is static prose. |
| **Timings** | Chrome drawer only — no page float-ins. |
| **Triggers** | Nav / footer links; Privacy prose links always underlined (taste lock). |
| **Reduced motion** | Drawer only. |
| **Quirks** | No form motion yet. Disclaimer copy parked in `backlog.md` until form ships. |
| **Lessons** | Don’t add decorative motion to legal/placeholder pages. |

### Nav / footer (site chrome)

| | |
| --- | --- |
| **Intent** | Hamburger drawer from the right; staggered item fade/slide; footer quiet. |
| **Timings** | Panel/scrim **0.42s**; item opacity/transform **0.48s** with delays 0.05 / 0.11 / 0.17 / 0.23 / 0.29s. Close waits 420ms (0 if reduced) before `hidden`. |
| **Triggers** | Toggle click; scrim click; link click closes; Escape closes. |
| **Reduced motion** | Transitions none; delays 0; items opacity 1. |
| **Quirks** | Home = float hamburger only. Dysphoria topbar is era chrome (Clarendon), not Geist title bar. Footer text lines 11px; `.footer-home` 12px. |
| **Lessons** | Force a layout frame (`void panel.offsetWidth`) before `.is-open` so `translateX(100%)→0` can transition. |

---

## 4. Page-to-page (brand shuffle)

Implementation and face rules: [`design-taste.md`](./design-taste.md) § Page-to-page transitions.

Short live facts:

- Flag: `sessionStorage` `jy-brand-shuffle`. Duration **720ms** (clamp 400–800). Glyphs `A–ZÄÖÜ`.
- Shuffle **only** on Geist ↔ Dysphoria Clarendon font-change navigations — not Geist↔Geist, not refresh, not Dysphoria reload.
- Enter: `fromFace: "clarendon"`, seed before paint, decode to title-case **Jy Yeüng**.
- Exit: mark on Dysphoria; play once on Geist arrival with `fromFace: "geist"` → ALL CAPS **JY YEÜNG**. `pageshow` + `persisted` covers bfcache Back.
- Reduced motion: skip glyphs; still settle face.

---

## 5. Scroll language

Canonical patterns (sticky scrub, axis-locked plates, iPad/WebKit claim model): [`design-handbook-scroll.md`](./design-handbook-scroll.md).

Refresh that file whenever plate input or gate scrub geometry changes in the same ship as the code.

---

## 6. Soft parks / open decisions

| Item | Status | Notes |
| --- | --- | --- |
| Plate gallery lazy-load (neighbors only) | Soft park | Logged in `backlog.md` after cover-only QA — don’t start until Dex reopens |
| Real home / hub motion | Open | Dummy home stays near-zero motion until hub ships |
| Contact form motion / validation | Open | Form not live; disclaimer parked in backlog |
| Cylindrical / 3D carousel | Held | Prefer 2D sticky scrub + plate peeks ([`design-taste.md`](./design-taste.md)) |
| Soft desktop “face under veil” (About) | Parked | Unless Jy asks |
| Spotify mirror / multi-listen row | Parked | Apple Music embed primary |
| Analytics-driven Privacy motion/notice | N/A | No first-party analytics today |

---

## Changelog

### 1.4 — 2026-10-08
- **Lesson (UI language):** whole-card plate flip — rim + faces share one `rotateY` node; no mid opacity snap; overflow-lock scrollable liner during flip. Locked in [`design-taste.md`](./design-taste.md) under Flip / 3D cards. Live `?v=ig-liner-v7` (`e0415d4` / `6ca2692`).



### 1.1 — 2026-10-07

- Plate Prev/Next after swipe: queue `fromNav` while `animating` (~900ms commit); peek ghost still dropped (`plate-nav-after-swipe-v1`). Primary `119718d` · mirror `f7314fb`.
- Lesson: first tap after swipe was blocked by the commit lock, not click-suppress.

### 1.0 — 2026-10-07

- First publish from live behavior (primary tip at ship; mirror [jy-site](https://jyyeungdeletedhisfb-gif.github.io/jy-site/)).
- Captures `work-tile-load-v1`, `ipad-swipe-v1`, `plate-gutter-swipe-v1`, `img-srcset-v2`, `dysphoria-ux-v1`, dummy home, gate scrub bands and reduced-motion fail-safes.
- Cadence: same-ship updates; weekly drift skim after Monday standup.


## Plate liner caption (v1.4)

Plate flip is a whole-card `rotateY` on `.plate-card` (rim travels with the faces). Caption scroll stays overflow-locked for the 0.65s turn (`.is-flipping`) so WebKit does not drop backface mid-spin. See design-taste **Flip / 3D cards** — do not regress to rim-on-shell + mid opacity swap.

On a flipped plate, a vertical drag on a long caption scrolls the caption inside the plate. Once it hits the end, the page scrolls as before. A sideways swipe that starts on the caption still changes plates. The IG link does not start a swipe.

