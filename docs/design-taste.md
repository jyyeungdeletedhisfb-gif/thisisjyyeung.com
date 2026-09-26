# Design taste — Jy Yeüng / thisisjyyeung.com

Living summary of brand, UX, visual, and process preferences for Dex, Rachel, and future bots. Prefer this over re-deriving taste from chat history.

**Related:** scroll / nested-carousel language → [`design-handbook-scroll.md`](./design-handbook-scroll.md).

---

## Positioning / brand

- Site for **knowing Jy as a person** and craft thoughts — not monetization or selling at this stage.
- **Era-based portfolio:** each era has a distinct visual identity (not one template recolored).
- Reference love: **i-D Magazine** site — each page feels completely different.
- Launch order: **Dysphoria first** → EHW → Authenticity + Imitation → hub / About later.

---

## UX / interaction (site-wide language)

- Modern, fun, **interactive navigation**.
- **Apple-style scroll:** scroll-scrubbed sticky float for major beats (gates); axis-locked nested horizontal carousels (`pan-y` default + x-lock). Details in [`design-handbook-scroll.md`](./design-handbook-scroll.md).
- Soft **float-up entrances** for intro + section headings (respect `prefers-reduced-motion`).
- **QA order:** Android Chrome (primary) → iPad Chrome → MacBook Chrome.
- Plates need **two-direction nested scroll** — don’t force the user to step outside the stage to scroll the page.
- **Cylindrical / rotating 3D carousel held** — prefer 2D sticky scrub + plate peeks.

---

## Visual / Dysphoria era

- Monochrome **high-contrast B&W**; Clarendon / serif for section titles; clean sans for UI.
- Seamless gate blacks **edge-sampled** (`#030303` enter / `#000` exit); no grey outline on gate circles.
- **Tight spacing:** cut awkward gaps (para→chevron, soundtrack→sheets).
- Cover art: subtle drop shadow (~135°).
- Soundtrack stays in the enter-gate with fade-in; **no exit darken wipe** over text/widget.
- Section labels (“Soundtrack” / “The Images”) share **alignment and hierarchy**.
- Topbar: **Jy Yeüng** + era title; back-to-top.

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
- **Taste sign-off from Jy on phone.**
- Rachel: **blocker-only QA** (not full taste review on every pass).

---

## Steve QA checkgates (chrome-geist-v11)

Phone / iPad smoke — blocker-only:

- **About He ↔ I:** Toggle voice; crop / `object-position` must never flash the outgoing voice’s framing (no ~1ms jump). Dual-layer opacity only; each img keeps its own crop (I `center 60%`, He `center 12%` + soft crown on the He layer). I crop tightened in v10 (was `center 48%`) — less crown air, face fills more; still horizontally centered. He crop / soft-crown unchanged.
- **Dysphoria enter:** Enter Dysphoria from Geist chrome — brand scramble starts on Clarendon (`fromFace: "clarendon"`). **No Geist flash** on enter. Exit to Geist pages stays Geist-only (`fromFace: "geist"`). Refresh while on Dysphoria = no shuffle (keep).
- **Era brand shuffle (future eras):** Enter/exit must never flash the previous face. `fromFace` = destination face for the whole scramble; seed first scramble glyphs before paint. Gate for every new era font.
- **Hamburger drawer:** Labels ALL CAPS; tracking matches hero “JY YEÜNG” Geist Black 900 Snug (`letter-spacing: 0`).
- **iPad landscape About = sharp column cut + 50/50:** No L→R dissolve. Grid `1fr 1fr` / true 50% columns; image `object-fit: cover` (never fill-stretch) inside the 50% column. Portrait top veil stays (landscape veil off). Sticky hero, page scroll, full-width footer. Text column: top pad above “JY YEÜNG” matches bottom pad below Instagram/Contact (~80px).
- **Portrait About — no hero leak between sheet and footer:** Once scrolled past, sheet fully covers hero (deeper overlap, fade→0, `.is-parked` hides blur bleed). Opaque ground through close → footer; no dark blurry strip between Instagram/Contact and BACK HOME. Portrait top veil stays.
