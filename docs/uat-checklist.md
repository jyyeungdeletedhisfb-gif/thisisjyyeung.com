# UAT checklist — thisisjyyeung.com

## Purpose

A ladder that catches real failure modes. Not every device. Jy owns taste on his glass; Steve owns morning smoke / regression on the mirror.

## Device ladder

1. Android Chrome (major)
2. iPad Chrome or Safari (landscape About matters)
3. MacBook Chrome

Prefer `jy-site` URLs with `?v=…` after a ship. Custom domain unreliable.

## Pass (~10–15 min) — same every time

- [ ] Home → Work → Dysphoria → About (I/He) → Contact → Privacy
- [ ] Hamburger: open/close, current-page left-dot, IG/Contact icons
- [ ] Dysphoria: intro cue sits close under copy (no tall white void); enter gate→soundtrack scale/blur handoff continuous; plate Prev/Next ends; soundtrack embed (no empty bordered gap); one Flip plate; exit gate contract
- [ ] About: portrait sticky sheet / no hero leak to footer; on iPad landscape: locked sharp 50/50 (browser pinch-zoom must still work — see pinch-zoom below)
- [ ] Work grid: Dysphoria live tile + soon covers (Front/A+I/State)
- [ ] Footer: Back home (non-home), WEBSITE BY + Privacy same size (11px), links underlined
- [ ] Pinch-zoom not blocked: every page's viewport meta is `width=device-width, initial-scale=1` with no `maximum-scale` or `user-scalable=no`. Check with `rg -n 'name="viewport"' --glob '*.html' .`, then pinch on Android Chrome on each page, including on a Dysphoria plate.
- [ ] No horizontal overflow (measured): at each test width, scroll to the bottom (so float-ins have run), then run `[document.documentElement.scrollWidth, document.documentElement.clientWidth]` in the console. The two numbers must match. Repeat after rotating on iPad. If a page fails, log the culprit element.
- [ ] Touch on real glass, not only mouse drag in device mode: swipe all 15 plates both ways, tap side Prev/Next at both ends, hamburger, I/He toggle, Apple Music embed. The page must not scroll sideways during a plate swipe. Android Chrome and iPad Chrome.

## Test widths

Fixed sizes for MacBook device mode and for every check above that says "each width". Not every width in between.

| Width | Stands in for |
|---|---|
| 375 × 812 | Small phone |
| 390 × 844, 430 × 932 | Common phones (Android Chrome is rung 1) |
| 768 × 1024 | iPad portrait |
| 1024 × 768 | iPad landscape (About soft park lives here) |
| 1280 × 800 | MacBook Chrome |

Hunt overlap, clipped type, horizontal scrollbar and broken 50/50.

## Ignore unless unreadable

Every OEM Android skin, perfect Chrome↔Safari parity and extreme zoom/split-screen. (Ordinary pinch-zoom is not "extreme". It must work.)

## After a ship

Android full Dysphoria+About first → iPad landscape About + Work → MacBook gate scrub. If those three feel good, confidence is high.

## Responsive and a11y (post-ship or weekly)

Not part of the 10–15 min pass. Run after a ship that touches layout, type or images, or weekly.

- [ ] **Hamburger semantics:** the button keeps `aria-label`, `aria-controls="site-menu"` and an `aria-expanded` that flips true/false on open/close. Toggle in DevTools Elements; on MacBook open/close with Enter and Space. (Regression guard; passing on all six pages as of 5 Oct 2026.)
- [ ] **Reduced motion:** DevTools > Rendering > "Emulate CSS prefers-reduced-motion: reduce", then walk Dysphoria and About top to bottom. Float-ins, the intro/exit font shuffle, the About blur and the gate scale/blur handoff are off or calm. No content is left hidden at opacity 0.
- [x] **Image weight:** DevTools Network at 390 wide, "Fast 4G", filter Img. No single image over about 500 KB; plates, Dysphoria cover, gate images, Work tiles and About heroes use sized JPEG variants with `srcset`/`sizes` (HTML) or JS responsive picks (background-image). Shipped `img-srcset-v1` (6 Oct 2026). Desktop gate masters remain large on purpose for the 6.4× expand.
- [ ] **Display type scaling:** in device mode drag slowly from 375 to 1280 on Home, Dysphoria and About. Hero, era title and About name show no clipping, overlap or one-word orphan lines.
- [ ] **Long strings wrap:** at 375, edit a plate caption, a heading and the About bio (I and He) to a 60-character unbroken string in DevTools, then re-run the overflow check.
- [ ] **Embed fit:** load Dysphoria at 375, 768 × 1024 and 1280 on "Slow 4G". The Apple Music embed shows its controls in full before and after it loads, with no inner double scroll, clipped edge or layout jump.

## Steve morning smoke

Fold latest tip SHA + mirror URL from group ping. Report pass/fail with URL + device. Soft parks ok; material blockers to Dex+Rachel.

## Related

[`design-taste.md`](./design-taste.md) · [`design-handbook-scroll.md`](./design-handbook-scroll.md)
