# Design taste — Jy Yeüng / thisisjyyeung.com

**Locked as of chrome-geist-v11** (mirror SHA `bbcc75f` / primary `862b95b`). Phone taste gate still Jy. Don’t reopen chrome unless Jy sends new phone notes.

Living handbook of brand, UX, visual, chrome, and process preferences for Dex, Rachel, and future bots. Prefer this over re-deriving taste from chat history.

**Related:** scroll / nested-carousel language → [`design-handbook-scroll.md`](./design-handbook-scroll.md).

---

## Positioning / brand

- Site for **knowing Jy as a person** and craft thoughts — not monetization or selling at this stage.
- **Era-based portfolio:** each era has a distinct visual identity (not one template recolored).
- Reference love: **i-D Magazine** site — each page feels completely different.
- Launch order: **Dysphoria first** → EHW → Authenticity + Imitation → hub / About later.
- **Writing:** no Oxford comma.
- Prefer **jy-site phone URLs** for taste checks; custom domain still unreliable.

---

## Locked chrome / type (chrome-geist-v11)

### Universal Geist brand mark

- **Geist Black 900 Snug** (`letter-spacing: 0`) **ALL CAPS** “**JY YEÜNG**” is universal chrome on:
  - About hero name
  - Non-home title bars (left brand)
  - Work / Contact / Privacy page titles
  - Hamburger drawer labels
- **Homepage:** no title bar — float hamburger only.
- Helvetica (or quiet system sans) for non-brand UI chrome; keep Geist reserved for the brand mark.

### Dysphoria era brand (exception)

- Dysphoria top-bar brand: **Clarendon**, **title case** “**Jy Yeüng**” (not ALL CAPS).
- Era Clarendon **section titles** stay untouched (era type system, not site chrome).
- Cascade note: `chrome.css` restores Clarendon on the Dysphoria topbar brand after Geist chrome loads.

### Interactive text

- Text links that act as buttons (e.g. Privacy prose links): **always underline** (`text-underline-offset` ~0.18em, 1px thickness).

---

## Page-to-page transitions (brand text-shuffle)

Implementation: `js/chrome.js` (`markShuffle` / `takeShuffle` / `scrambleBrand` / `playEnterDysphoria` / `playExitArrival`). Flag key: `sessionStorage` `jy-brand-shuffle`.

Jy emphasis: get enter/exit faces right. Wrong face for even one frame is a blocker.

### When shuffle runs

1. Shuffle **ONLY** on real **font-change** navigation: **Geist chrome ↔ Dysphoria Clarendon**.
2. **Not** on refresh / same-URL reload (`navigationType() === "reload"` clears the flag and settles label).
3. **Not** between two Geist pages (About ↔ Work ↔ Contact ↔ Privacy ↔ home) — no scramble.
4. Refresh while already on Dysphoria: **no shuffle**.

### Enter Dysphoria (from About / Work / home / etc.)

1. On click of a same-origin link into `/dysphoria`: Geist page calls `markShuffle("enter")`.
2. On Dysphoria load, if flag is `"enter"` → `playEnterDysphoria` with **`fromFace: "clarendon"`**.
3. First scramble glyphs are seeded **synchronously before paint** so the first frame is already mid-scramble on Clarendon.
4. Glyphs decode to title-case **“Jy Yeüng”**.
5. **Never flash Geist** on enter. Page CSS keeps Clarendon after settle.

### Exit Dysphoria (to any Geist page)

1. On click leaving Dysphoria (or `pagehide` for Back / tab discard): mark `exit`.
2. Scramble plays **once on Geist arrival** via `playExitArrival` with **`fromFace: "geist"`** (do not scramble on the Dysphoria document or destinations double-shuffle).
3. Lands instantly on Geist **ALL CAPS** “JY YEÜNG”.
4. **Never flash Clarendon** on exit — no title-case → ALL CAPS intermediate frame.
5. `pageshow` with `persisted` (bfcache Back) re-checks the exit flag.

### Future eras rule

Every era brand **face change** must set `fromFace` to the **DESTINATION** face for the whole scramble; never paint the previous face for a frame. Seed glyphs before paint. Add this to Steve QA for each new era font.

### Taste URL preference

Prefer **jy-site** phone URLs when judging transitions; custom domain still unreliable.

---

## About page (locked)

### Portrait (phone)

- Portrait: **sticky/fixed hero** + **scrolling sheet** with **top veil dissolve** (image → sheet).
- Sheet has **deeper overlap**; hero fades and parks (`.is-parked`) so there is **no leak** between Instagram/Contact and footer (no dark blurry strip).
- Opaque ground through close → footer.
- Portrait top veil stays on.

### I / He dual portrait

- Dual-layer **opacity crossfade** only (no mid-fade crop swap).
- **I:** `object-position: center 60%` (tightened in v10 from `center 48%` — less crown air, face fills more; still horizontally centered).
- **He:** `object-position: center 12%` + **soft crown on the He img layer only**.
- No body-class mid-fade crop flash — each img keeps its own crop for the whole fade.

### Work trail order

Matches Work page order:

1. Dysphoria  
2. Front  
3. Authenticity + Imitation  
4. State (last)

### Landscape / iPad (`min-width: 768px` + `orientation: landscape`)

- Sharp **50/50** columns: image left / text right (`1fr 1fr` / true 50%).
- Image: `object-fit: cover` — **never** stretch/fill; crop inside the 50% column.
- Sticky photo + **one page scroll**; **full-width footer**.
- **NO L→R dissolve** (tried v7–v9 and rejected — clips subject). Landscape veil off; hard column edge.
- Text column: top pad above “JY YEÜNG” ≈ bottom pad below IG/Contact (**~80px**).

### About grounds

- I voice: `#bebebe`
- He voice: `#6e6e6e`

---

## Rejected / parked (don’t reopen without Jy)

| Item | Status | Notes |
|------|--------|--------|
| Landscape L→R dissolve / overlap veil (v7–v9) | **Rejected** | Sharp 50/50 cut locked |
| Nested text-only scroll lock that hid footer (v7) | **Rejected** | Sticky hero + page scroll locked |
| Cylindrical / rotating 3D carousel | **Held** | Prefer 2D sticky scrub + plate peeks |
| Soft desktop “face under veil” | **Parked** | Unless Jy asks |

---

## UX / interaction (site-wide language)

- Modern, fun, **interactive navigation**.
- **Apple-style scroll:** scroll-scrubbed sticky float for major beats (gates); axis-locked nested horizontal carousels (`pan-y` default + x-lock). Details in [`design-handbook-scroll.md`](./design-handbook-scroll.md).
- Soft **float-up entrances** for intro + section headings (respect `prefers-reduced-motion`).
- **QA order:** Android Chrome (primary) → iPad Chrome → MacBook Chrome.
- Plates need **two-direction nested scroll** — don’t force the user to step outside the stage to scroll the page.

---

## Visual / Dysphoria era

- Monochrome **high-contrast B&W**; Clarendon / serif for section titles; clean sans for UI.
- Seamless gate blacks **edge-sampled** (`#030303` enter / `#000` exit); no grey outline on gate circles.
- **Tight spacing:** cut awkward gaps (para→chevron, soundtrack→sheets).
- Cover art: subtle drop shadow (~135°).
- Soundtrack stays in the enter-gate with fade-in; **no exit darken wipe** over text/widget.
- Section labels (“Soundtrack” / “The Images”) share **alignment and hierarchy**.
- Topbar: Clarendon title-case **Jy Yeüng** + era title; back-to-top.

---

## Embeds / music

- **Apple Music embed primary** + “Listen on” for multi-platform once a Spotify mirror exists (not Apple-only forever).
- Embed chrome (Rachel preference):
  - Never taller bordered iframe than the visible card
  - Hug the white embed
  - Borderless on tablet+
  - No empty bordered gap / inner scrollbars

---

## Content editability / tech

- **Zero-code edits** for images, text, and minor tweaks; eras via content JSON (etc.).
- Static / fast for image-heavy pages.
- Light SEO: titles, meta, OG, alt, sitemap — light GEO/AEO only.
- **GitHub + Pages** for alpha; custom domain after Dysphoria feels right.
- No e-commerce yet, but don’t block it later.
- Preserve Pages base paths when moving assets / routes.

---

## Process taste

- Lean bot roster.
- **Taste sign-off from Jy on phone / Android.**
- Rachel: **blocker-only QA** (not full taste review on every pass).
- **Rachel pings the group** with ship **SHA + jy-site URL** on every ship.
- **Steve** weekday morning ~**7:49 HKT** primary smoke; **Dex** ~**7:56** backup + weekends; **one run enough**; ad-hoc only if Jy or Dex asks.

---

## Steve QA checkgates (chrome-geist-v11)

Phone / iPad smoke — blocker-only:

- **About He ↔ I:** Toggle voice; crop / `object-position` must never flash the outgoing voice’s framing (no ~1ms jump). Dual-layer opacity only; each img keeps its own crop (I `center 60%`, He `center 12%` + soft crown on the He layer). I crop tightened in v10 (was `center 48%`) — less crown air, face fills more; still horizontally centered. He crop / soft-crown unchanged.
- **Dysphoria enter:** Enter Dysphoria from Geist chrome — brand scramble starts on Clarendon (`fromFace: "clarendon"`). **No Geist flash** on enter. Exit to Geist pages stays Geist-only (`fromFace: "geist"`). Refresh while on Dysphoria = no shuffle (keep).
- **Era brand shuffle (future eras):** Enter/exit must never flash the previous face. `fromFace` = destination face for the whole scramble; seed first scramble glyphs before paint. Gate for every new era font.
- **Hamburger drawer:** Labels ALL CAPS; tracking matches hero “JY YEÜNG” Geist Black 900 Snug (`letter-spacing: 0`).
- **iPad landscape About = sharp column cut + 50/50:** No L→R dissolve. Grid `1fr 1fr` / true 50% columns; image `object-fit: cover` (never fill-stretch) inside the 50% column. Portrait top veil stays (landscape veil off). Sticky hero, page scroll, full-width footer. Text column: top pad above “JY YEÜNG” matches bottom pad below Instagram/Contact (~80px).
- **Portrait About — no hero leak between sheet and footer:** Once scrolled past, sheet fully covers hero (deeper overlap, fade→0, `.is-parked` hides blur bleed). Opaque ground through close → footer; no dark blurry strip between Instagram/Contact and BACK HOME. Portrait top veil stays.
