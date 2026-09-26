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

## Steve QA checkgates (chrome-geist-v10)

Phone / iPad smoke — blocker-only:

- **About He ↔ I:** Toggle voice; crop / `object-position` must never flash the outgoing voice’s framing (no ~1ms jump). Dual-layer opacity only; each img keeps its own crop (I `center 60%`, He `center 12%` + soft crown on the He layer). I crop tightened in v10 (was `center 48%`) — less crown air, face fills more; still horizontally centered. He crop / soft-crown unchanged.
- **Dysphoria exit:** Leave Dysphoria to Work / About / Home / Contact — brand shuffle lands Geist-only (`fromFace: "geist"`). **No Clarendon flash** on arrival. Refresh while on Dysphoria = no shuffle (keep).
- **Hamburger drawer:** Labels ALL CAPS; tracking matches hero “JY YEÜNG” Geist Black 900 Snug (`letter-spacing: 0`).
- **iPad landscape About = sharp column cut:** No L→R dissolve. No `--dissolve-w`, no sheet `margin-left` overlap, no left hanging `.about-sheet__veil`, no dissolve-based intro/trail padding, no `.about-main::after` seam stripe. Sheet solid `background: var(--about-ground)`; `.about-sheet__veil { display: none }` in landscape (portrait top veil stays). Text column padding normal split (`28px` / pre-v9). Grid 1fr 1fr, sticky hero, page scroll, full-width footer from v8 kept.
