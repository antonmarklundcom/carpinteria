# carpinteria.com.py: improvement report (2026-10-12)

Scope: the repo at `main` (`6bda08a`), 22 pages + `404.html`, static HTML on Hostinger. Read-only review; nothing on the site was changed. The live site could not be checked from this session (proxy 403 on `carpinteria.com.py`), so every "live" item below is marked as such.

Priority: **P1** do first (traffic, leads or trust at stake) · **P2** clear win, low risk · **P3** nice to have.

Items that need a decision from Anton are marked **[ask]**.

---

## A. Deploy and operations

### 1. The repo is probably not live yet (P1, live)
`docs/IMPROVE-PLAN.md` "Status after window E" says live still served the 2026-09-06 build on 2026-09-30: Google Fonts, old phone format, no `data-wa`, the retired number in `/assets/js/site.js`, and `/vanitorys/`, `/ventanas/`, `/trabajos/` returning 404. Four more PRs merged since. Until the zip is uploaded (or Git auto-deploy is connected), none of the work in this repo exists for visitors or Google.
**Fix:** upload `main` to Hostinger, then run `tools/live-check.mjs` and `tools/audit.mjs https://carpinteria.com.py audit-live-after.json`. **[ask]** zip upload again, or connect Hostinger Git deploy once so every merge goes live.

### 2. No deploy-zip builder (P1)
The README says "upload via zip" but nothing in `tools/` builds the zip. Each window hand-picked files. Risk: a zip that misses a folder (that is the most likely cause of the three 404 pages).
**Fix:** `tools/build-zip.mjs` that writes `carpinteria-deploy.zip` with exactly the public set (`*.html`, `*/index.html`, `assets/`, `sitemap.xml`, `robots.txt`, `.htaccess`, future `favicon.ico`, `site.webmanifest`), prints the file list and count, and fails if any sitemap URL has no file in the zip. Add `npm run zip` in `tools/package.json`.

### 3. CSS and JS have no cache busting (P1)
`.htaccess` caches CSS and JS for 7 days, but pages link `/assets/css/site.css` and `/assets/js/site.js` with no version. After every deploy returning visitors can get new HTML with a stale stylesheet for up to a week (broken layout, old CTA behaviour).
**Fix:** `tools/stamp-assets.mjs` that rewrites every `site.css`, `site.js`, `cotizar.js`, `wa-config.js` reference to `...?v=<8-char content hash>` (idempotent, like `apply-wa.mjs`); add a verify rule that every asset reference carries the current hash. Then the expires window can go up to 1 year.

### 4. One command for all local gates (P2)
There are 7 tools but no `npm run check`. Each window re-invented the sequence.
**Fix:** `"check": "node verify.mjs && node linkcheck.mjs && node overlap.mjs && node seo-diff.mjs ../audit-before.json ../audit-after.json"` plus `"check:full"` that also runs `pw-check.mjs`. Document it in the README. Optionally a SessionStart hook for cloud sessions that runs `npm ci` in `tools/`.

### 5. README and project rules live only in long prompt docs (P2)
`README.md` is 8 lines. The hard rules (one number, one map file, no obra/arq links, no title/H1 change without approval, no GitHub Actions without a yes) are buried in `docs/NEXT-WINDOW-PROMPT.md`.
**Fix:** a real README (structure, tools, deploy, gates) and a `CLAUDE.md` at the root with the rules, so every future session (Claude Code or Codex) reads them automatically.

### 6. Repo bloat and an ignored file that is tracked (P2)
`docs/` is 7.9 MB, almost all before/after PNG screenshots from windows D and E. `audit-after.json` is listed in `.gitignore` but is tracked (so changes to it still show up as diffs and the ignore does nothing).
**Fix:** `git rm --cached audit-after.json` (or drop it from `.gitignore` and treat it as a committed baseline, one or the other); move the screenshots out of the repo (PR attachments or a release asset) and keep the two small README notes. **[ask]** keep screenshots in git or not.

### 7. Docs sprawl (P3)
`IMPROVE-PLAN.md` has four "Status after window" sections stacked newest-first, `NEXT-WINDOW-PROMPT.md` holds prompts A and E, `BUILD-REPORT-2026-09-30.md` has addenda. A new session reads 60 KB to find the current state.
**Fix:** one `docs/STATUS.md` (what is live, what is merged but not live, open questions Q1–Q8) and move old windows under `docs/archive/`.

---

## B. SEO

### 8. Sitemap `lastmod` is stale and hand-maintained (P1)
`/`, `/trabajos/`, `/cotizar/`, `/privacidad/` say `2026-08-31` but were changed on 2026-09-30, and six pages got new hero images on 2026-10-01 with no `lastmod` change. Wrong `lastmod` trains Google to ignore the field.
**Fix:** `tools/sitemap.mjs` that generates `sitemap.xml` from the page list with `lastmod` = last git commit date of each `index.html` (fallback: file mtime), and a verify rule that fails when the generated file differs from the committed one.

### 9. LocalBusiness schema is thin (P2, [ask])
`HomeAndConstructionBusiness` on the home page has only name, url, telephone, areaServed and contactPoint. No `address` (at least `addressLocality` + `addressCountry: PY`), no `geo`, no `openingHoursSpecification`, no `image`, no `sameAs`, no `priceRange`. These feed the Maps/GBP match and rich results.
**Fix:** add the fields that are true (Anton supplies: city, hours, Instagram/Facebook/GBP URLs). Do not invent an address.

### 10. Social sharing tags incomplete (P2)
No `twitter:card`, no `og:image:width/height/alt`. WhatsApp link previews (the main share channel in Paraguay) use OG; the image dimensions avoid the "no preview" case on first share.
**Fix:** add `og:image:width="1536" og:image:height="1024" og:image:alt` and `twitter:card="summary_large_image"` on all 23 pages. Mechanical, one pass.

### 11. The `/trabajos/` page is a portfolio with no real work (P2, [ask])
228 words, seven AI "ilustrativa" images, H2s like "Elegí una idea y abrí su servicio específico". It ranks for nothing, and a visitor who clicks "Trabajos" expecting real jobs sees stock-like renders.
**Fix:** needs 8–12 real photos from Anton (phone photos are fine), each with a one-line caption (what, material, city) and an `ImageGallery` or `ItemList` schema. Until then, nothing to build; title/H1 stay as they are per the SEO contract.

### 12. The same CTA H2 on 19 pages (P3)
"Mandá fotos, medidas y contanos qué necesitás." is an `<h2>` on 19 pages, and "Servicios relacionados" on 16. These are chrome, not content, and they dilute the heading outline Google reads.
**Fix:** keep the visuals, change those two to `<p class="h2">` (or `<h2>` with the page keyword: "Mandá fotos y medidas de tu cocina"). Pure markup change, no copy loss.

### 13. Keyword map is still a hypothesis (P2, [ask])
`docs/seo/keyword-map.md` has no group IDs or Paraguay volumes because the keyword-library MCP was never connected in the build sessions; `approved-titles.txt` is empty. No title or new-page decision can be made safely.
**Fix:** run the next session with the MCP connected, or run `list_groups`/`get_group` on the PC and paste the table.

---

## C. Performance

### 14. Hero image has no fetch priority (P2)
Service pages have a hero `<img>` with `srcset` and no `loading="lazy"` (correct) but no `fetchpriority="high"` and no preload. The LCP image competes with the two font preloads and the CSS.
**Fix:** `fetchpriority="high"` on the hero `<img>` of every service page (and the first `<picture>` on home if the video poster is the LCP on mobile). Measure with `pw-check.mjs` before and after.

### 15. Longer cache for immutable assets (P3, after item 3)
Once assets are hashed, `ExpiresByType` for CSS/JS/WebP/MP4 can be `access plus 1 year` with `Cache-Control: immutable`. HTML stays short.

### 16. `wa-config.js` is 16 KB and loaded only on `/cotizar/` (OK, no change)
Checked: only `/cotizar/` includes it. Listed so nobody "fixes" it.

---

## D. Security and headers

### 17. Missing HSTS, CSP and Permissions-Policy (P2)
`.htaccess` sets `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` only. The site has no inline scripts (JSON-LD is not executed), no third parties, no iframes, so a strict CSP is cheap.
**Fix:** add
```
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
Header always set Content-Security-Policy "default-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; style-src 'self'; script-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://wa.me"
```
`form-action` must allow `wa.me` because the no-JS quote form posts there. Test on LiteSpeed after deploy with curl; `live-check.mjs` should assert the headers. HSTS only after confirming `www` and apex both serve valid HTTPS (the plan says they do).

---

## E. Front-end quality

### 18. No icon fallbacks, no manifest, no theme-color (P2)
Only `favicon.svg`. Safari, older Android browsers and Google's favicon crawler want `favicon.ico` and `apple-touch-icon.png` (180×180); search results show the favicon. `.htaccess` returns 404 for `*.json`, so the manifest must be `site.webmanifest`.
**Fix:** generate `favicon.ico` (16/32/48), `apple-touch-icon.png`, `site.webmanifest`, `<meta name="theme-color">`, link them on all 23 pages, add the three files to the zip builder.

### 19. Header, nav and footer are copy-pasted into 23 files (P2)
Every page carries ~200 lines of identical chrome (mega-menu with 64 links, footer, mobile bar). Each header is unique only because of the per-page WhatsApp text, which `apply-wa.mjs` already manages. A nav change today means 23 hand edits and a chance of drift (that is how the three pages went missing from the zip).
**Fix:** without adding a build step, a `tools/sync-chrome.mjs` that stamps `<header>`, `<footer>` and the mobile bar from `tools/partials/*.html` into every page (idempotent, same pattern as `apply-wa.mjs`, then `apply-wa.mjs` runs after it), plus a verify rule that the set of nav links is identical on every page.

### 20. Accessibility has no automated gate (P2)
Manual work done: skip link, `aria-expanded`, `prefers-reduced-motion`, 44 px targets (2 small inline ones remain per the window C status), contrast fixes in window on 2026-10-01. Nothing stops a regression.
**Fix:** add `axe-core` to `pw-check.mjs` (inject the script from `node_modules`, run on both viewports, fail on serious/critical) and fix what it finds (likely: the two small tap targets, landmark names, any contrast left).

### 21. Mobile WhatsApp bar and sticky elements: measure, not guess (P3, live)
The 2026-10-01 design pass fixed the hero overlay and the bar. Still unmeasured on real devices: iOS safe-area bottom padding and whether the bar covers the last FAQ answer. Run `pw-check.mjs` with `deviceScaleFactor` and `isMobile` for iPhone 14 and a 360×800 Android and screenshot the page bottom.

### 22. Quote form: small robustness wins (P3)
`cotizar.js` is good (no-JS fallback, preview, 1,200 cap). Three small things: no `autocomplete` on city/barrio; `?servicio=` preselect does not scroll to or announce the form; the preview `<pre>`/box has no `aria-live="polite"`, so screen readers never hear the generated message change.

---

## F. Content

### 23. Home page says less than the service pages (P2, [ask])
The service pages were deepened to 800–1,200 words in window C; the home still has the original short copy plus cards. The home targets the head terms (carpintería, carpintería Asunción, muebles a medida). Worth a 300–400 word "Cómo trabajamos" + "Dónde trabajamos" (the 11 `areaServed` cities, as text) + 4–6 FAQ block, without touching the title or H1.

### 24. Pérgolas, decks, machimbre still half-handed to Obra (P2, [ask], Q8 open)
The three pages and their WhatsApp messages say "lo coordina el equipo de Obra.com.py" but the link was removed. The visitor reads a handover with nowhere to go. Anton has to decide (Q8) which domain owns those keywords; then either remove the handover sentence (carpinteria owns) or add the single link back (obra owns). Nothing to build before that answer.

---

## What is already good (keep)
One H1, self canonical, unique title/description per page, JSON-LD parses on every page, 0 third-party requests, fonts self-hosted, videos 0.9 MB total and desktop-only, WebP with srcset and width/height, 7 QA tools with a verify gate that enforces the one-number and one-map rules, honest copy (no prices, AI images disclosed, voseo).

## Suggested order
1. Items 1, 2, 3, 8 (deploy, zip builder, cache busting, sitemap generator) in one PR: this is what makes the next upload safe.
2. Items 10, 14, 17, 18, 12 (meta, fetchpriority, headers, icons, CTA headings): mechanical, one PR.
3. Items 4, 5, 6, 19, 20 (gates, README/CLAUDE.md, cleanup, chrome sync, axe): tooling PR.
4. Items 9, 11, 13, 23, 24 wait for Anton's data and answers.
