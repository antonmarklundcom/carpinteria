# carpinteria.com.py / obra.com.py — local build locations (2026-09-13)

## obra.com.py — NEWEST build, confirmed matching live
- Canonical local folder: `C:\Users\anton\Documents\Paraguay-Local-Site\obra-com-py`
- Last modified: 2026-09-09 (newest file: `assets/js/site.js`)
- Homepage copy lives in `app/content.php` and `app/layout.php` — NOT in `index.php` (that's just routing/wiring). Don't grep `index.php` for page text.
- Also present: `app/helpers.php`, `config/site.php` (site-wide WhatsApp number + per-page message helpers), `docs/obra-com-py-site-structure.md`, `docs/LAUNCH-CHECKLIST.md`, `CLAUDE-CHANGES.md`.
- Packaged zip: `C:\Users\anton\Documents\Paraguay-Local-Site\obra-com-py-hostinger-ready-2026-09-09.zip`
- There is an older, now-superseded local copy at `C:\Claude 1\obra-com-py` (dated 2026-07-29) — a much earlier one-pager demo, not the live structure. Ignore it.
- Confirmed matching live 2026-09-13: fetched live homepage text and matched hero headline, "12 servicios y 29 especialidades" line, 5-step process, guías section, FAQ against the local content files.

## carpinteria.com.py — live build is v2, NOT the older folder
- Canonical local folder: `C:\Users\anton\Documents\Paraguay-Local-Site\carpinteria-com-py-v2`
- Last modified: 2026-09-06
- The older sibling `C:\Users\anton\Documents\Paraguay-Local-Site\carpinteria-com-py` (dated 2026-09-03, no `-v2` suffix) is STALE — superseded by v2, not what's live. Don't build on it.
- v2-specific fixes (confirm these are present if editing): hero video carousel in `assets/js/site.js` only downloads the active tab's video (others load on click, not via `requestIdleCallback`/auto-rotate); responsive `srcset`/`sizes` (480w/960w/1536w) added to all `<img>` tags via `sharp`.
- A duplicate copy also exists at `C:\Claude 1\carpinteria-com-py` (dated 2026-09-06, mirrors v2) plus an audit doc `C:\Claude 1\carpinteria-com-py-audit-2026-09-01.md` and screenshots (`carpinteria-desktop-full.png`, `carpinteria-mobile-full.png`, `carpinteria-gap-section.png`).
- Known unresolved issue: intermittent Cloudflare-style 403 "checking your browser" challenge on first load — hosting/CDN config, not fixable in the codebase.
- Confirmed matching live 2026-09-13: live page has 3 `<img>` tags, all 3 have `srcset` (matches the v2 fix); of the 4 hero-tab `<video>` elements, only the active one has a loaded `src`, the other 3 are empty (matches the v2 lazy-load fix). This was a behavioral check (DOM inspection), not a byte-for-byte file diff.

## Caveats for Codex
- Confirmation above is content/behavior spot-checking on the homepage only, not a full diff of every page or a byte-for-byte file comparison.
- If duplicate-named folders exist (e.g. `carpinteria-com-py` vs `carpinteria-com-py-v2`), check file mtimes with `find <dir> -type f -printf '%T@ %p\n' | sort -rn | head` before assuming which one is current — don't assume the non-suffixed folder is authoritative.
