# CHANGELOG — v1.3 (mirror jy-site first)

Base: primary `9d3bcfa` (v1.2). Primary not pushed; it stays on v1.2 until Jy's Final.
Taste URL: https://jyyeungdeletedhisfb-gif.github.io/jy-site/dysphoria/?v=v1.3-images-align

| # | Change | Cache tip | Mirror SHA |
|---|---|---|---|
| 1 | Footer "Back home": bordered button → plain underlined text link (12px Helvetica, uppercase, same centred position and 28px bottom margin). Border and padding removed in shared `chrome.css` `.footer-home`, so every non-home footer (Work, About I/He, Contact, Privacy, Dysphoria) matches. Hover is colour only. | `v1.3-link-embed` | `5bd183b` |
| 2 | Dysphoria Apple Music embed: removed the 24px (24px 16px) padding on `.soundtrack-inner` so the embed hugs its content. No empty bordered gap below; iframe height matches painted card (500 at 1280; 450 + 1px border at 412/390); no inner scrollbar. | `v1.3-link-embed` | `5bd183b` |
| 3 | Dysphoria "The Images" heading: removed leftover 16px left pad so its left edge matches Soundtrack (180 / 16.5 / 16px at 1280 / 412 / 390). Font, size and vertical spacing unchanged. | `v1.3-images-align` | `316d920` |
| 4 | Apple Music thumbnail: updated by Jy on Apple's side (B/W pool photo); no site code change. | n/a | n/a |

QA: `/workspace/qa/v1.3-link-embed/` (footer + embed screenshots at 1280 / 412 / 390, `results.txt`); type audit and image-weight gates PASS.

## Sign-off

| Role | Name | Result | Date | Notes |
|---|---|---|---|---|
| Build | Rachel | PASS | 2026-10-16 | Mirror `5bd183b`: Back home underlined text link on all 5 footers (12px Helvetica, 0 border/padding, centred) at 1280 / 412 / 390; embed padding 0, bottom gap 0, no inner scroll. Type audit unchanged; image weight 180 / 126 / 146 / 143 KB, ratio 1.43 PASS. Primary not pushed. |
| QA | Steve | PASS | 2026-10-16 | UI `5bd183b` / docs `0c74452` at 1280 / 412 / 390: Back home underlined, no border; embed padding 0, no gap or inner scroll; regression and type/weight gates PASS. Soft note: Soundtrack heading aligns with embed left edge (Jy taste call). Evidence `/workspace/qa/v13-mirror-2026-10-16/`. |
| PM | Dex | PASS | 2026-10-16 | Scope matches Jy's go (Back home link, embed padding; Apple Music thumb cut). Ready for Jy Final; primary stays v1.2 until then. |
| Build | Rachel | PASS | 2026-10-23 | Mirror `316d920`: The Images left pad removed; edges match Soundtrack at 1280 / 412 / 390. Shots `/workspace/qa/v1.3-images-align/`. |
| QA | Steve | PASS | 2026-10-23 | `316d920` at 1280 / 412 / 390 (emulated): AM thumb shows Jy's new photo; alignment under 0.5px; 6 pages 200, swipe after flip, track list, type and weight gates PASS. Soft: Apple's player clips last track row at 1280 (Apple-side). Evidence `/workspace/qa/v13-images-align-2026-10-23/`. |
| PM | Dex | PASS | 2026-10-23 | Scope matches Jy's 10/23 ask (Images align; AM thumb fixed by Jy). Final goes on `316d920`. |
| Final | Jy | PASS | 2026-10-24 | Final given in Dex 1:1 ("Go for it") on mirror `316d920` (`?v=v1.3-images-align`). Rachel to push `316d920` to primary; Steve apex confirm after. |
