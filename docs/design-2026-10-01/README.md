# Design fixes 2026-10-01

Before/after screenshots (Playwright, 390x844 and 1366x800). Not deployed (docs/ is excluded from the zip).

| Problem | Before | After |
|---|---|---|
| 1. Mobile breadcrumb ("Inicio" dropped to a second line) | before-machimbre-m-fold.png | after-machimbre-m-fold.png |
| 2. Home mobile: slider tabs over the label | before-home-m-fold.png (bottom) | after-home-m-hero-overlay.png |
| 3. Home desktop: gap between H1 and paragraph | before-home-d-fold.png | after-home-d-fold.png |
| 4. /cotizar/ mobile: photo pushed the form down | before-cotizar-m-fold.png | after-cotizar-m-fold.png |

Sweep fixes (CSS only): kicker and small-text contrast (orange kickers 2.9:1 to above 4.5:1, grey on orange 4.1:1 to above 4.5:1, dark-section aside text), inner-page heroes fit a 1366x800 first view, caption clear of the WhatsApp button, stacked hero buttons on phones, balanced last tile on /trabajos/, `.reveal` content visible without JS and in print.

## Images: not generated
Higgsfield credits were not spent: the environment cannot download from CloudFront (CONNECT 403), so results could not be pulled into the repo. Weakest or repeated heroes, worst first (6 images are reused across 22 pages):
1. /vanitorys/ uses the kitchen photo (wrong subject for a bathroom vanity).
2. /restauracion/ uses a door photo (wrong subject for furniture restoration).
3. /escaleras/ uses a door photo (no staircase or railing).
4. /escritorios/ uses the reception counter (no desk or library); also shared with /comercial/ and /cotizar/.
5. /blindex/ and /cerramientos/ use the same aluminium photo as /aluminio/ and /ventanas/.
6. /machimbre/ and /decks/ share the pergola photo; /muebles-tv/ reuses the placard photo.
