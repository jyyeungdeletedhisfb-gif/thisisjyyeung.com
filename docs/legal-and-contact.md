# Legal + Contact (site notes)

Operational notes for **Contact**, **Privacy**, analytics, and cookies. Aligns with `docs/next-workstreams-misc-and-hub.md` (Telha Clarke–style short Privacy; no company-office tone).

## Contact page (`/contact/`)

- Placeholder until Formspree is wired. **Do not invent a Formspree form ID** — Jy/Dex adds the real endpoint when ready.
- **Locked disclaimer copy** (warm “I”; keep exact on the page and in the form UI when live):

  > You’ll get an email receipt when this sends. I usually reply within 5–7 days. I may not respond to spam or hostile messages.

- Footer email icon → `contact/` (`aria-label="Contact"`). Nav includes a live **Contact** link; **About** stays soon.

## Formspree plan

1. Create a Formspree form (Jy’s account).
2. Drop the action URL / form ID into `contact/index.html` only — no ID in docs or commits until live.
3. Fields: name, email, message (keep minimal).
4. Receipt + reply SLA are covered by the disclaimer above; Formspree processes submissions under their terms; use only to reply.

## Privacy page (`/privacy/`)

Light personal-artist page:

- Operator: Jy Yeüng / thisisjyyeung.com
- First-party collection: basically none today
- Embeds (Apple Music, etc.): third-party cookies/data under *their* policies
- Contact form (when live): name/email/message via Formspree → reply only
- Analytics: honest stub — **no first-party analytics today**; update this page when anything is added
- Rights: works © Jy Yeüng; All rights reserved (footer © line remains exact)

## Analytics (later)

- Prefer **privacy-respecting / cookieless** tools (Plausible, Umami) so a cookie-consent CMP is unnecessary.
- If Google Analytics or other non-essential cookies are added: update Privacy + optional simple notice.
- **Do not add analytics scripts** until Jy chooses a tool and Privacy is updated in the same change.

## Cookie banner policy

| Situation | Approach |
| --- | --- |
| Static site, no first-party tracking | No consent wall |
| Privacy-first analytics (Plausible / Umami style) | Prefer these; usually no CMP banner |
| Non-essential / ad-style cookies | Update Privacy; add a simple notice only if required |

Preference: **cookieless analytics to avoid a CMP.**

## Footer / chrome

- © exact: `© 2026 JY YEÜNG. ALL RIGHTS RESERVED`
- Quiet **Privacy** text link under/beside the © line (`.footer-links a` → `privacy/`)
- Shared on home, Dysphoria, Contact, Privacy

---

*For Dex ↔ Jy / Rachel. No secrets. No live Formspree ID or analytics IDs here.*
