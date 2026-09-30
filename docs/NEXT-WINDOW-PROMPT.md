# Build window prompts: carpinteria.com.py

Two windows, run one after the other:

| Window | Model / effort | Does | Start when |
|---|---|---|---|
| **A** | **Opus 5.5, medium** | Tools, hotfix (3 dead pages, number, `.htaccess`), conversion layer (WhatsApp map, form, CTAs, video, fonts), obra handover, keyword map. Fans out mechanical edits to Sonnet 5.5 low subagents. | Tomorrow, first |
| **B** | **Sonnet 5.5, medium** | Content deepening of all service pages, internal links, schema polish, final before/after verification and report. | After window A has merged and live-checked its PRs (`docs/seo/keyword-map.md` exists on `main`) |

Why medium and not high: the plan, message drafts and gates are already written, and every risky step is checked by a script (verify, SEO diff, live check). High costs more without changing the outcome. Switch window A to high only if the 3 pages still 404 after a verified deploy and the cause needs real debugging.

Never use Fable in either window (no subagent, session, workflow or routine on Fable).

---

## Prompt A (Opus 5.5, medium) — paste as the first message

```text
You are the director of the carpinteria.com.py improvement build, window A of 2. Repo: antonmarklundcom/carpinteria (static HTML on Hostinger, 22 sitemap URLs, no build step, no CI). Read docs/IMPROVE-PLAN.md and audit-before.json on main first; they are the spec. Model rules: you run on Opus 5.5; any subagent you spawn is Sonnet 5.5 at the effort named below. Never Fable.

HARD RULES (every phase, every subagent)
1. One WhatsApp number only: +595 992 279599. Links https://wa.me/595992279599?text=..., calls tel:+595992279599, visible text "+595 992 279 599", JSON-LD telephone "+595992279599". The retired old number (any spacing; pattern in tools/lib.mjs OLD_PATTERNS) must appear nowhere in the repo or on the live site. Known leftovers: assets/js/site.js:139 and 4 files in docs/seo/.
2. Every WhatsApp CTA has a pre-written Spanish message: Paraguay voseo, visitor's voice, no prices, PYG only if money is ever mentioned, never "tú/tienes/puedes". Messages differ per page and per service and live in ONE map file, data/whatsapp.json. QA fails on any other number or an empty/missing text.
3. Scope: carpinteria = wood + aluminium/blindex only. /pergolas/, /decks/, /machimbre/ stay indexable, in the sitemap, content kept, but hand over to obra.com.py with ONE link and a sentence saying Obra.com.py coordinates that work. obra = build/execution, arq = design. At most one contextual cross-domain link per page. Briefs go in docs/seo/.
4. Keywords: keyword-library MCP (list_projects, project_overview, list_groups, get_group, keyword_lookup). One meaning group = one page or one section. Never plan pages for brand or competitor phrases. Volumes are Paraguay only.
5. SEO contract: all 22 URLs keep slug, canonical, indexability and sitemap entry. No URL changes, so no 301s except the .htaccess guard rules below. Do not change titles or H1s in this window.
6. Never print or commit secrets or private config; only *.example files belong in git. No GitHub Actions workflows unless Anton says yes in this chat (budget policy).
7. The git flow is yours end to end: branch from main, focused commits, PR, wait for checks (there is no CI; the checks are the local gates below, pasted into the PR body), fix review comments and merge conflicts (merge main into the branch; never force-push), merge only after local verification passes, then verify live. A merge to main may auto-deploy on Hostinger, so run tools/live-check.mjs right after every merge. Fix what you find (broken links, HTML errors, verify failures, conflicts) instead of only reporting it. Stop only for Anton's decisions (Q1–Q7 in the plan).
8. Do not generate images or video with Higgsfield or any other tool. Transcoding the existing hero videos is fine.

PRECONDITIONS (first 5 minutes)
- curl -sI https://carpinteria.com.py/ must return a real status, not a proxy 403. If blocked: tell Anton to allow carpinteria.com.py, obra.com.py, arq.com.py and d8j0ntlcm91z4.cloudfront.net in the environment's network settings; continue with local-only work and mark every live step NOT RUN.
- keyword-library MCP answers list_projects. If not, skip phase A4 and say so.
- Deploy path (Q1): if Anton has not answered, assume a merge to main may deploy immediately.

PHASE A0: TOOLS AND BASELINE (you, no subagents)
Create tools/ with a minimal package.json (devDeps cheerio, playwright; use the preinstalled Chromium in /opt/pw-browsers, never "playwright install"). Add audit-shots/ and node_modules/ to .gitignore.
- tools/audit.mjs <repoRoot|https://carpinteria.com.py> <out.json>: per sitemap URL: status, title, description, H1s, canonical, robots, word count (main and body), internal links out/in (and in-body only), images without alt, schema types, WhatsApp numbers and texts, tel links, phone display strings, cross-domain links. Same shape as audit-before.json.
- tools/verify.mjs: rules 1–2 (any wa.me/api.whatsapp.com number other than 595992279599, any tel: other than +595992279599, the retired old number (pattern in tools/lib.mjs OLD_PATTERNS) anywhere in the repo, wa link with empty text, two pages sharing a page message, price/"Gs"/"$"/"USD"/"tú/tienes/puedes" in a message, JSON-LD telephone not +595992279599) + HTML sanity (1 H1, self canonical, title and description present, JSON-LD parses, every internal href and /assets/ path exists, sitemap and pages match). Exit 1 on failure.
- tools/apply-wa.mjs: reads data/whatsapp.json, rewrites every a[data-wa] href, visible numbers, tel: and JSON-LD telephone; writes assets/js/wa-config.js for the form. Idempotent.
- tools/pw-check.mjs: Playwright at 1366x800 and 390x844 on every page served by "npx http-server -p 8080 -s -c-1 .": console errors, failed requests, broken images, horizontal overflow, LCP element and time, bytes by type, sticky bar/FAB visibility, tap targets under 44px. Screenshots to audit-shots/ (never committed).
- tools/linkcheck.mjs: internal links plus cross-domain links (expect 200).
- tools/seo-diff.mjs <before.json> <after.json> [--approved-titles file]: fails on status not 200, canonical changed, noindex added, H1 count not 1, unapproved title change, main word count down >10%, lost in-links, lost schema type, URL left sitemap. Prints a diff table.
- tools/live-check.mjs: every sitemap URL live returns 200 with title equal to the repo title, self canonical, contains 595992279599 and not the retired old number; /no-existe/ returns 404; /docs/seo/entrega.md, /data/whatsapp.json, /audit-before.json, /tools/verify.mjs return 403 or 404; live /assets/js/site.js has no old number.
Then: node tools/audit.mjs https://carpinteria.com.py audit-live-before.json (commit it), compare with audit-before.json, record the 404s, www behaviour, response headers and the 4 hero video sizes. Run pw-check on the untouched repo as the local baseline.

PHASE A1: HOTFIX PR (you + one Sonnet 5.5 low subagent)
- site.js:139 gets the number from the map/config; replace the old number in docs/seo/*.md.
- Sonnet low subagent: phone display "+595 992 279 599", tel:+595992279599 and JSON-LD "+595992279599" on all 22 pages and 404.html. You check with verify.mjs.
- .htaccess: return 404 for ^/(docs|tools|data|audit-shots|node_modules)/, \.(md|json|mjs)$ and package(-lock)?.json; 301 /(.*/)?index.html to /$1; www to apex only if live does not already do it. Keep the existing rules. Test every rule with curl after deploy; if any rule causes a 500, revert that rule immediately in a follow-up PR.
- Gates: verify.mjs, linkcheck (internal), pw-check, seo-diff audit-before.json vs a fresh local audit (only phone strings may differ).
- PR "Hotfix: missing pages, one WhatsApp number, hide non-public files". Merge after the gates pass. Deploy: Git auto-deploy, or build carpinteria-deploy.zip with only public files (html, assets, sitemap.xml, robots.txt, .htaccess, 404.html) and ask Anton to upload it. Run live-check. /vanitorys/, /ventanas/ and /trabajos/ must return 200. If they still 404 after a verified deploy, report exactly what the live responses show.

PHASE A2: CONVERSION + PERFORMANCE PR (you + Sonnet 5.5 subagents)
- Sonnet 5.5 medium subagent writes data/whatsapp.json: number/display/tel, 23 page messages (22 pages + 404), 18 service messages (home cards and form), and form templates, starting from the drafts in plan sections 5.2 and 5.3. You review every message against rule 2 and make sure all are distinct.
- You add data-wa to every CTA (header, hero, mid-page, final block, footer, FAB, mobile bar, home service cards) and run apply-wa.mjs.
- You rebuild the /cotizar/ form per plan 5.3: grouped project type select, zone select with Gran Asunción cities plus "Otra ciudad" (shows a city input), optional barrio, medidas yes/no, plazo, type-specific hints, live message preview, ?servicio=<key> preselect from service pages, obra note and "Consulta para el equipo de Obra.com.py:" prefix for pérgola/deck/machimbre, no-JS fallback form action="https://wa.me/595992279599" method="get" with hidden text, location.href on mobile and window.open on desktop, 1,200 char cap, nothing stored or sent to a server.
- Sonnet 5.5 low subagent: mobile bar appears after the hero scrolls out (IntersectionObserver), safe-area padding, body bottom padding; FAB hidden at 768px and below; privacy overlay removed and its sentence moved to the footer and /privacidad/ (if Anton said no to Q7, make it a slim bottom line that never covers CTAs).
- Sonnet 5.5 low subagent: obra handover block on /pergolas/, /decks/, /machimbre/ and the cross-link map in plan 4.5. You first verify the target URLs live on obra.com.py and arq.com.py (their sitemaps) and give the subagent the exact URLs.
- You: hero video. Download the 4 cloudfront MP4s, ffmpeg -vf scale=-2:720 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart, target 1.5 MB or less each, WebP posters, into assets/video/. Poster only below 1024px or when navigator.connection.saveData; remove every cloudfront reference. If Anton chose a still image for Q5, do that instead.
- Sonnet 5.5 low subagent: self-host fonts (Archivo 700/800, Inter 400/600, latin WOFF2, font-display swap, preload 2 files), remove googleapis/gstatic.
- Gates: everything from A1, plus pw-check shows 0 overflow, 0 console errors, 0 failed requests, no third-party requests, local LCP element. Put form screenshots and 3 generated messages in the PR body. Merge, deploy, live-check.

PHASE A3: KEYWORD MAP (you, no subagents)
- MCP: list_projects, then the carpinteria project: project_overview, list_groups, get_group per relevant group, keyword_lookup for gaps.
- Write docs/seo/keyword-map.md: group ID, head phrase, PY volume, owner (carpinteria page or section / obra / arq / none), action (keep / deepen / new page / route), plus for each of the 22 pages: primary group, secondary terms for H2s, and whether a title change is justified (old, proposed, group ID). Drop brand and competitor groups. Confirm or correct plan section 4. Choose at most 3 new pages.
- Write docs/seo/obra-handover-brief.md (groups obra should own, source pages, anchors, target URLs).
- If a new page or title change is proposed, ask Anton (Q2) in one short message and keep going; window B only builds what he approved.
- Docs-only PR, merge.

PHASE A4: HANDOFF (you)
- Update docs/IMPROVE-PLAN.md with a "Status after window A" section: what shipped (PR links), live-check result, answers to Q1–Q7 so far, approved titles and new pages, anything NOT RUN. Commit via a small PR and merge.
- Final message to Anton: PR links, live-check output, what window B should start with, open questions.
```

---

## Prompt C (Opus 5.5, medium) — use this next: finish window A, then run window B

Window A (2026-09-30) shipped PRs #2 and #3 but could not reach the live site, CloudFront, obra/arq or the keyword-library MCP. Prompt B alone would stop because `docs/seo/keyword-map.md` is missing, so this prompt finishes those items first and then runs Prompt B's phases.

```text
You are the director of the carpinteria.com.py build, window C. Repo: antonmarklundcom/carpinteria (static HTML on Hostinger, 22 sitemap URLs, no CI). Read on main first: docs/IMPROVE-PLAN.md (especially "Status after window A"), docs/NEXT-WINDOW-PROMPT.md (Prompt B = the content phases you run later), docs/seo/obra-handover-brief.md, audit-before.json, data/whatsapp.json and tools/*.mjs (run `cd tools && npm ci` first; Playwright uses the preinstalled Chromium in /opt/pw-browsers, never "playwright install").
Model rules: you run on Opus 5.5. Subagents are Sonnet 5.5 only (low for mechanical edits, medium for page writing). Never Fable.

All HARD RULES and GATES of Prompt B apply to you and every subagent. Tools that exist and must be used: verify.mjs, apply-wa.mjs (after any CTA or message change), linkcheck.mjs [--external], pw-check.mjs [--strict], audit.mjs, seo-diff.mjs, live-check.mjs (run with NODE_USE_ENV_PROXY=1 in the cloud).

PRECONDITIONS (first 5 minutes)
- curl -sI https://carpinteria.com.py/, https://obra.com.py/, https://arq.com.py/ and https://d8j0ntlcm91z4.cloudfront.net/ must return a real status, not a proxy 403. If any is blocked, tell Anton in one short message to add it under the environment's Network access, then continue with what does not need it and mark the rest NOT RUN.
- keyword-library MCP must answer list_projects. If it does not, say so and do phase C3 from the hypothesis in IMPROVE-PLAN section 4 (no title changes, no new pages).

PHASE C1: LIVE BASELINE AND DEPLOY CHECK (you)
- NODE_USE_ENV_PROXY=1 node tools/live-check.mjs. If live still serves the old site (old title/number, /vanitorys/ /ventanas/ /trabajos/ 404), the deploy did not happen: ask Anton (Q1) whether Git auto-deploy is connected; if not, give him the zip command from the status section (public files only: html, assets, sitemap.xml, robots.txt, .htaccess, 404.html) and wait for his upload before C2's live checks.
- node tools/audit.mjs https://carpinteria.com.py audit-live-before.json (commit it). Record www behaviour, response headers, /no-existe/ status.
- Curl every .htaccess rule live (docs/tools/data/*.md/*.json/*.mjs/package.json/.git → 404; /cocinas/index.html → 301 /cocinas/; www → apex). Any 500 → revert that rule in a small PR at once.

PHASE C2: WINDOW A LEFTOVERS PR (you + one Sonnet 5.5 low subagent)
- Hero video: download the 4 CloudFront MP4s referenced in index.html, ffmpeg -vf scale=-2:720 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart (≤1.5 MB each, raise crf if needed), WebP posters (first frame) into assets/video/, point data-src/poster at them, remove every cloudfront reference. Keep the desktop-only loading logic in site.js. Transcoding is fine; never generate images or video.
- Cross-links: read obra.com.py/sitemap.xml and arq.com.py/sitemap.xml. Point the 3 handover links (pergolas, decks, machimbre) and the /cotizar/ obra note at the best live obra page (quinchos / patios / pérgola / deck), and add the plan 4.5 links (cocinas and placares → arq interiores page; aluminio, ventanas, cerramientos → obra reformas or ampliaciones) as one sentence each, max one cross-domain link per page. Give the subagent the exact verified URLs. Update docs/seo/obra-handover-brief.md with the URLs.
- Gates incl. pw-check --strict (now 0 third-party requests) and linkcheck --external. PR, merge, live-check.

PHASE C3: KEYWORD MAP PR (you, no subagents)
As in the original window A phase A3: list_projects → carpinteria project → project_overview, list_groups, get_group per relevant group, keyword_lookup for gaps. Write docs/seo/keyword-map.md (group ID, head phrase, PY volume, owner, action; per page: primary group, secondary H2 terms, title-change verdict old → proposed → group ID) and docs/seo/approved-titles.txt (empty until Anton approves). Drop brand/competitor groups. Choose at most 3 new pages. If any title change or new page is proposed, ask Anton (Q2) in ONE short message and keep going without them. Docs-only PR, merge.

PHASE C4: RUN PROMPT B PHASES B1–B5 as written in docs/NEXT-WINDOW-PROMPT.md, with you as director (Sonnet 5.5 medium subagents write pages, one per page, max 6 in parallel; you review every diff for voice, invented facts, duplicates and rule 2 before the PR). Only build new pages or titles Anton approved in this chat.

FINISH: update "Status after window A" in IMPROVE-PLAN.md into "Status after window C" (PR links, live-check output, answers to Q1–Q7, NOT RUN items), small PR, merge. Final message to Anton: PR links, live-check result, open questions, what the next window should do.
```

## Prompt B (Sonnet 5.5, medium) — paste as the first message after window A is done

```text
You run window B of 2 for the carpinteria.com.py improvement build. Repo: antonmarklundcom/carpinteria (static HTML on Hostinger, 22 sitemap URLs). Window A already shipped the tools/ folder, data/whatsapp.json, the new form and CTAs, and docs/seo/keyword-map.md. Read these on main first: docs/IMPROVE-PLAN.md (especially "Status after window A"), docs/seo/keyword-map.md, audit-before.json, audit-live-before.json, tools/*.mjs. If keyword-map.md is missing, stop and tell Anton window A is not finished.
You may spawn Sonnet 5.5 subagents (medium for page writing, low for mechanical edits). Never Fable, never Opus subagents unless Anton says so.

HARD RULES (every page, every subagent)
1. One WhatsApp number only: +595 992 279599 (wa.me/595992279599, tel:+595992279599, visible "+595 992 279 599"). The retired old number must appear nowhere. New CTAs use data-wa and messages from data/whatsapp.json only, then run node tools/apply-wa.mjs. New pages need a new distinct message in the map.
2. Spanish copy: Paraguay voseo, no prices, PYG only if money is mentioned, never "tú/tienes/puedes". No invented facts (years, number of jobs, clients, guarantees, plazos). Images stay "visual de referencia". Do not generate images or video.
3. Scope: wood + aluminium/blindex only. /pergolas/, /decks/, /machimbre/ keep their obra handover; do not add execution promises there. One contextual cross-domain link per page at most (window A placed them; keep them).
4. SEO contract: never change a URL, canonical, robots or sitemap membership. Keep every title and H1 unless docs/seo/keyword-map.md lists an approved change for that page; list each change old -> new with group ID in the PR body; at most 1/3 of titles per deploy. Add content, never remove existing sections without replacing them with something richer. One meaning group = one page or section; no pages for brand or competitor phrases; volumes are Paraguay only.
5. Never print or commit secrets or private config; only *.example files in git. No GitHub Actions workflows.
6. The git flow is yours end to end: branch from main, focused commits, PR, wait for checks (no CI; paste the gate output in the PR body), fix review comments and merge conflicts (merge main in; never force-push), merge only after local gates pass, then run node tools/live-check.mjs because a merge may auto-deploy. Fix what you find (broken links, HTML errors, verify failures) instead of only reporting it. Stop only for decisions that are Anton's.

GATES (run before every merge)
node tools/verify.mjs; node tools/linkcheck.mjs; node tools/pw-check.mjs (1366 and 390: 0 overflow, 0 console errors, 0 broken images); node tools/audit.mjs . audit-local.json && node tools/seo-diff.mjs audit-before.json audit-local.json --approved-titles docs/seo/approved-titles.txt. After merge: node tools/live-check.mjs.

PAGE TEMPLATE for service pages (give it to every page subagent with the page file, its groups from keyword-map.md and the rules above)
- Keep: URL, title, H1 (unless approved), canonical, hero, existing images and alt, breadcrumb, the page's cross-link and handover block.
- Replace the shared H2 skeleton ("Qué conviene definir / Situaciones que esta consulta puede resolver / De las fotos a un alcance... / Antes de pedir el presupuesto") with page-specific H2s that use the secondary terms of the page's group.
- Sections: tipos or configuraciones; materiales, herrajes or líneas de aluminio and vidrios; qué medir y cómo sacar las fotos; qué incluye un presupuesto (no prices); 6–8 FAQ in <details> plus a matching FAQPage JSON-LD; 3–5 in-body links to sibling pages and the hub; a mid-page WhatsApp CTA (data-wa) and a "Armar mi consulta" link to /cotizar/?servicio=<key>.
- Length of unique body: 800–1,200 words for batch 1, 600–900 for batch 2. No paragraph may repeat across pages; you check this with a simple shingle/overlap script before the PR.

PHASE B1: BATCH 1 CONTENT PR (5 Sonnet 5.5 medium subagents in parallel, one per page)
/cocinas/, /placares/, /aluminio/, /ventanas/, /blindex/. Review every diff yourself (voice, facts, duplicates, rule 2), run the gates, update sitemap lastmod only for changed pages, PR, merge, deploy, live-check.

PHASE B2: BATCH 2 CONTENT PR (Sonnet 5.5 medium subagents, max 6 at a time)
/muebles/ (hub: also links every child), /puertas/, /comercial/, /cerramientos/, /muebles-tv/, /escritorios/, /vanitorys/, /portones/, /escaleras/, /restauracion/, /pergolas/, /decks/, /machimbre/ (these three: deepen the planning/measuring content, keep the obra handover, no execution promises). Same review, gates, PR, merge, live-check. If batch 1 went live less than a few days ago, still ship batch 2, but do not change any title in it.

PHASE B3: NEW PAGES PR (only pages Anton approved in keyword-map.md or the plan status; else skip)
Each: same template, own map message, nav and footer entries, sitemap entry, in-body links from its hub and 2 siblings. Gates, PR, merge, live-check.

PHASE B4: LINKS, SCHEMA, ACCESSIBILITY PR (Sonnet 5.5 low subagents)
/trabajos/ linked from every service page; /muebles/ and /aluminio/ linked in-body from all their children; JSON-LD: telephone +595992279599, Service.provider -> {"@id":"https://carpinteria.com.py/#business"}, areaServed with the Gran Asunción cities; nav, footer and breadcrumb tap targets at least 44px on mobile. Gates, PR, merge, live-check.

PHASE B5: FINAL VERIFICATION AND REPORT
- node tools/audit.mjs https://carpinteria.com.py audit-after.json; seo-diff against audit-before.json and audit-live-before.json.
- node tools/verify.mjs reports no old-number hits; live-check passes; linkcheck incl. cross-domain links has 0 broken; pw-check on live at 1366 and 390 is clean.
- Write docs/BUILD-REPORT-<date>.md: all PRs from windows A and B (links) and merge commits; what shipped per plan item; SEO diff table; title changes with group IDs; word counts before/after per page; live-check output; Playwright before/after (bytes, LCP); anything NOT RUN and why; open decisions for Anton; suggested next steps (Google Business Profile, real job photos, reviews). Commit audit-after.json and the report in a final small PR and merge.
- Final message to Anton: link to the report, the 3 most important changes, anything that needs him.
```
