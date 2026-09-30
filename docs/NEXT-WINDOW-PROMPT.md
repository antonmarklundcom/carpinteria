# Build window prompt: carpinteria.com.py (paste as the first message)

Run this window on **Opus 5.5, medium effort**. Subagents: **Sonnet 5.5** at the effort named per phase. Never use Fable for anything in this window (no subagent, session, workflow or routine on Fable).

---

You are the director of the carpinteria.com.py improvement build. Repo: `antonmarklundcom/carpinteria` (static HTML on Hostinger, 22 sitemap URLs). Read `docs/IMPROVE-PLAN.md` and `audit-before.json` first; they are the spec. This prompt is self-contained if they are missing.

## Hard rules (apply to every phase and every subagent)
1. **One WhatsApp number only**: +595 992 279599. Links `https://wa.me/595992279599?text=…`, calls `tel:+595992279599`, visible text `+595 992 279 599`, JSON-LD telephone `+595992279599`. The old `595995628862` (in any spacing, incl. `995 628862`) must appear **nowhere** in the repo or on the live site. Known leftover: `assets/js/site.js:139` and 4 files in `docs/seo/`.
2. Every WhatsApp CTA has a pre-written **Spanish message** (Paraguay voseo, visitor's voice, no prices, PYG only if money is ever mentioned, never "tú/tienes/puedes"). Messages differ per page and per service and live in **one map file** `data/whatsapp.json`. QA fails on any other number or an empty/missing text.
3. **Scope**: carpinteria = wood + aluminium/blindex only. `/pergolas/`, `/decks/`, `/machimbre/` stay (indexable, in sitemap, content kept) but hand over to obra.com.py with **one link** and a sentence saying Obra.com.py coordinates that work. obra = build/execution, arq = design. Exactly one contextual cross-domain link per page at most. Briefs go in `docs/seo/`.
4. **Keywords**: use the keyword-library MCP (`list_projects`, `project_overview`, `list_groups`, `get_group`, `keyword_lookup`). One meaning group = one page or one section. Never plan pages for brand or competitor phrases. Volumes are Paraguay only. If the MCP is not connected, do phases 0–3 and 6, skip phase 4/5 title changes and new pages, and say so in the report.
5. **SEO contract**: all 22 URLs stay with the same slug, canonical, indexability and sitemap entry. No URL changes → no 301s except the guard rules in phase 2. Keep each page's title/H1 primary keyword unless an MCP group justifies a change; list every title change old → new with group ID in the PR body; at most 1/3 of titles per deploy. Add content, don't remove it.
6. **Secrets**: never print or commit secrets or private config. Only `*.example` files belong in git. Do not add GitHub Actions workflows (Anton's budget policy) unless he says yes in this window.
7. **Git flow is yours end to end**: branch, focused commits, PR, wait for checks (the repo has no CI; the checks are the local gates below, pasted into the PR body), fix review comments and merge conflicts (merge the base in; never force-push), **merge only after local verification passes**, then verify live. On Hostinger a merge to `main` may auto-deploy, so run the live check right after every merge. Fix what you find (broken links, HTML errors, verify failures, conflicts) instead of only reporting. Stop only for Anton's decisions (list at the end).
8. Do not generate images or video with Higgsfield or any other tool. Reuse existing assets; transcoding existing video is fine.

## Preconditions (check in the first 5 minutes)
- `curl -sI https://carpinteria.com.py/` returns a status (not a proxy 403). If the host is blocked: tell Anton to allow `carpinteria.com.py`, `obra.com.py`, `arq.com.py`, `d8j0ntlcm91z4.cloudfront.net` in the environment's network settings, and continue with local-only phases; mark every live step as NOT RUN in the report.
- keyword-library MCP responds to `list_projects`.
- Know the deploy path (Q1). If unknown, assume a merge to `main` may deploy immediately.

## Tooling you create (phase 0, Opus itself)
Put in `tools/` with a minimal `package.json` (devDeps: `cheerio`, `playwright`; use the preinstalled Chromium at `/opt/pw-browsers`, never `playwright install`). `node_modules/` stays ignored.
- `tools/audit.mjs <root|baseURL> <out.json>`: per sitemap URL: status, title, meta description, H1s, canonical, robots, word count (main + body), internal links out/in (+ in-body only), images without alt, schema types, WhatsApp numbers/texts, tel links, phone display strings, cross-domain links. Same shape as `audit-before.json`.
- `tools/verify.mjs`: the number/message gate (rules 1–2) + HTML sanity (1 H1, self canonical, title/description present, JSON-LD parses, every internal href resolves to a file, every `/assets/` file exists, every page in sitemap and vice versa). Exit 1 on any failure.
- `tools/apply-wa.mjs`: reads `data/whatsapp.json`, rewrites all `a[data-wa]` hrefs, visible numbers, `tel:` and JSON-LD telephone; writes `assets/js/wa-config.js` for the form. Idempotent.
- `tools/pw-check.mjs`: Playwright at 1366×800 and 390×844 over every page served by `npx http-server -p 8080 -s -c-1 .`: console errors, failed requests, broken images, horizontal overflow, LCP element + time, JS/CSS/font/image bytes, sticky bar/FAB visibility, tap targets < 44 px. Screenshots to `./audit-shots/after/` (not committed).
- `tools/linkcheck.mjs`: all internal links + all cross-domain links (HEAD/GET, expect 200).
- `tools/seo-diff.mjs <before.json> <after.json> [--approved-titles file]`: fails per plan section 3.4 (status, canonical, noindex, H1, title change not approved, >10 % word drop, lost in-links, lost schema type, left sitemap); prints a diff table.
- `tools/live-check.mjs`: every sitemap URL live → 200, title equals repo title, canonical self, contains `595992279599`, contains no `595995628862`; `https://carpinteria.com.py/no-existe/` → 404; `/docs/seo/entrega.md`, `/data/whatsapp.json`, `/audit-before.json`, `/tools/verify.mjs` → 403/404; fetch live `assets/js/site.js` and grep numbers.
- Add `.gitignore` entries: `audit-shots/`, `node_modules/`.

## Phases

### Phase 0: Baseline (Opus 5.5 medium, no subagents)
- Branch `claude/<window-branch>` from `main`. Build the tools above.
- `node tools/audit.mjs https://carpinteria.com.py audit-live-before.json` (live) and compare with `audit-before.json` (repo, 2026-09-30). Record the 3 known 404s, `www` behaviour, response headers, and the 4 hero video sizes (`curl -sI`).
- Run `pw-check` on the untouched repo for a local baseline.

### Phase 1: Hotfix PR (Opus 5.5 medium; one Sonnet 5.5 low subagent for the text sweep)
Items 2, 3, 4 of the plan.
- `site.js:139` → map-driven number; remove the old number from `docs/seo/*.md` (replace with the new one, note "updated 2026-10" inline).
- Phone display `+595 992 279 599`, `tel:+595992279599`, JSON-LD `+595992279599` on all pages + `404.html` (Sonnet low sweep, then `verify.mjs`).
- `.htaccess`: deny `^/(docs|tools|data|audit-shots|node_modules)/`, `\.(md|json|mjs)$`, `package(-lock)?.json`; 301 `/(.*/)?index\.html$` → `/$1`; `www` → apex only if live does not already do it. Test every rule with `curl` after deploy.
- Gates: `verify.mjs`, `linkcheck.mjs` (internal), `pw-check`, `seo-diff audit-before.json audit-after.json` (expect no diffs except phone strings).
- PR "Hotfix: missing pages, one WhatsApp number, hide non-public files". Merge after gates pass. Deploy (Git auto-deploy, or build `carpinteria-deploy.zip` of the public files only and ask Anton to upload). Run `live-check.mjs`; the 3 pages must be 200. If they still 404 after a verified deploy, check file permissions / case / `.htaccess` on the server via the live responses and report exactly what you see.

### Phase 2: Conversion + performance PR (Opus 5.5 medium; Sonnet 5.5 subagents as named)
Items 5, 6, 7, 8, 9, 10 of the plan.
- **Sonnet 5.5 medium** writes `data/whatsapp.json`: 23 page messages + 18 service messages + form templates, from the drafts in plan §5.2/§5.3, following rule 2. Opus reviews every message (voseo, no prices, distinct).
- Opus adds `data-wa` to every CTA (header, hero, mid, final block, footer, FAB, mobile bar, home service cards) and runs `apply-wa.mjs`.
- Opus rebuilds the `/cotizar/` form per plan §5.3 (grouped type select, zone select + "Otra ciudad", medidas, plazo, type-specific hints, live preview, `?servicio=` preselect, obra note for exterior types, no-JS `action="https://wa.me/595992279599"` fallback, `location.href` on mobile).
- **Sonnet 5.5 low**: mobile bar after hero via IntersectionObserver + safe-area padding; FAB hidden ≤768 px; privacy overlay removed, sentence moved to footer/`/privacidad/` (only if Anton said yes to Q7; otherwise make it a slim bottom line that never covers CTAs).
- **Sonnet 5.5 low**: obra handover block on `/pergolas/` `/decks/` `/machimbre/` + cross-links per plan §4.5 (targets verified live on obra/arq first; one per page).
- Opus: hero video → download the 4 MP4s, `ffmpeg -vf scale=-2:720 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart`, target ≤1.5 MB each, WebP posters; `assets/video/`; poster-only below 1024 px or with `navigator.connection.saveData`; remove every cloudfront reference. (If Anton chose a still image for Q5, do that instead.)
- **Sonnet 5.5 low**: self-host fonts (Archivo 700/800, Inter 400/600, latin WOFF2, `font-display: swap`, preload 2), remove googleapis/gstatic preconnects.
- Gates: all of phase 1 + `pw-check` must show 0 overflow, 0 console errors, 0 failed requests, no third-party requests, LCP element local. Screenshot the form with each type group and paste 3 generated messages in the PR body. Merge, deploy, `live-check`.

### Phase 3: Keyword map (Opus 5.5 medium, no subagents)
- MCP: `list_projects` → carpinteria project → `project_overview` → `list_groups` → `get_group` for each relevant group; `keyword_lookup` for gaps.
- Write `docs/seo/keyword-map.md`: group ID, head phrase, PY volume, owner (carpinteria page / section / obra / arq / none), action (keep / deepen / new page / route). Drop brand and competitor groups. Confirm or correct plan §4. Pick at most 3 new pages. Write `docs/seo/obra-handover-brief.md` (which groups obra should own, source pages, anchors).
- Stop and ask Anton only if a new page or a title change needs Q2.

### Phase 4: Content PRs (fan out; Sonnet 5.5 medium, one subagent per page)
- Batch A (first PR): `/cocinas/` `/placares/` `/aluminio/` `/ventanas/` `/blindex/`. Batch B (second PR, after A is live and checked): the other 12 service pages + `/muebles/` hub. Batch C: up to 3 new pages (only if approved), each with nav/footer/sitemap entries and a map message.
- Each subagent gets: the page file, its keyword group(s) from `keyword-map.md`, the hard rules, the page template (tipos, materiales/líneas, qué medir y cómo fotografiar, qué incluye el presupuesto, 6–8 FAQ in `<details>` + FAQPage schema, 3–5 in-body sibling links, the page's one cross-link, mid-page CTA). Target 800–1,200 words unique body for batch A, 600–900 for B. Keep URL, title, H1, canonical, existing images/alt; replace the shared H2 skeleton with page-specific H2s. No prices, no invented facts (years, number of jobs, clients, guarantees), images stay "visual de referencia".
- Opus reviews every page diff (duplicate paragraphs across pages → rewrite), runs all gates + `seo-diff` with the approved-titles list, updates `lastmod` only for changed pages, merges, deploys, `live-check`.

### Phase 5: Linking and schema (Sonnet 5.5 low; Opus review)
Plan items 14, 16, 18 (and 19 if time): contextual links so `/muebles/`, `/aluminio/`, `/trabajos/` get in-body links from their children; schema telephone/provider/areaServed; tap targets ≥ 44 px. Gates, PR, merge, deploy, live-check.

### Phase 6: Final verification and report (Opus 5.5 medium)
- `tools/audit.mjs https://carpinteria.com.py audit-after.json` (live) and `seo-diff audit-before.json audit-after.json` (and against `audit-live-before.json`).
- Number check live and repo: `grep -rn "595995628862\|995 628862" .` returns nothing; `live-check.mjs` passes.
- `linkcheck.mjs` incl. cross-domain links: 0 broken.
- `pw-check` at 1366 and 390 on live: 0 overflow, 0 errors, 0 broken images.
- Write `docs/BUILD-REPORT-<date>.md`: PRs (links) and merge commits; what shipped per plan item; SEO diff table; title changes with group IDs; live-check output; Playwright summary (before vs after bytes, LCP); keyword map summary; anything NOT RUN and why; open decisions for Anton. Commit it on a final small PR (or with the last content PR) and merge.

## Decisions that are Anton's (stop and ask only for these)
Q1 deploy method (Git vs zip) · Q2 new pages · Q3 message tone · Q4 obra target URLs and obra's WhatsApp number · Q5 hero video vs still · Q6 where the obra brief lives · Q7 privacy note overlay. If a question is unanswered, take the default in `docs/IMPROVE-PLAN.md`, note it in the report, and keep going on everything else.
