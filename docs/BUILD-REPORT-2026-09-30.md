# carpinteria.com.py: build report (windows A and C), 2026-09-30

Director: Opus 5.5. Page writers and mechanical edits: Sonnet 5.5 subagents. No Fable was used anywhere.

**Everything below was verified locally against the repo. None of it was verified live.** In both windows the cloud environment's egress proxy blocked `carpinteria.com.py`, `obra.com.py`, `arq.com.py` and `d8j0ntlcm91z4.cloudfront.net` (HTTP 403 on CONNECT). The keyword-library MCP was not connected either. See "NOT RUN" below.

## 1. Pull requests (all merged to `main`)

| PR | Window / phase | What | Merge commit |
|---|---|---|---|
| [antonmarklundcom/carpinteria#2](https://github.com/antonmarklundcom/carpinteria/pull/2) | A0 + A1 | QA tools, retired number removed, phone format, `.htaccess` guard | – |
| [antonmarklundcom/carpinteria#3](https://github.com/antonmarklundcom/carpinteria/pull/3) | A2 | WhatsApp map + `data-wa` CTAs, quote builder, mobile CTA cleanup, obra handover, self-hosted fonts, hero video desktop-only | – |
| [antonmarklundcom/carpinteria#4](https://github.com/antonmarklundcom/carpinteria/pull/4) | A4 | Status after window A + Prompt C | `60b8caf` |
| [antonmarklundcom/carpinteria#5](https://github.com/antonmarklundcom/carpinteria/pull/5) | C2 | Cross-links to repo-verified obra/arq pages; per-type obra link in the quote form | `5cf2494` |
| [antonmarklundcom/carpinteria#6](https://github.com/antonmarklundcom/carpinteria/pull/6) | C3 | `docs/seo/keyword-map.md` (hypothesis) + empty `approved-titles.txt` | `28ba848` |
| [antonmarklundcom/carpinteria#7](https://github.com/antonmarklundcom/carpinteria/pull/7) | B1 | Deepen cocinas, placares, aluminio, ventanas, blindex; `tools/overlap.mjs` | `5d3e10b` |
| [antonmarklundcom/carpinteria#8](https://github.com/antonmarklundcom/carpinteria/pull/8) | B2 | Deepen the other 13 service pages | `f917277` |
| [antonmarklundcom/carpinteria#9](https://github.com/antonmarklundcom/carpinteria/pull/9) | B4 | `areaServed` city list; 44px mobile tap targets | `a67f22e` |
| this PR | B5 | This report + `audit-after.json` (local) | – |

B3 (new pages) was **skipped**: no new page is approved (see §5).

## 2. What shipped, per plan item (IMPROVE-PLAN §6)

| # | Item | Status |
|---|---|---|
| 1 | Live re-crawl (`audit-live-before.json`) | **NOT RUN** (proxy) |
| 2 | Deploy fix for `/vanitorys/` `/ventanas/` `/trabajos/` + `live-check.mjs` | Tool shipped (#2); deploy **not verified** (Q1 + proxy) |
| 3 | Old number removed, phone format, verify gate | Done (#2). `verify.mjs` finds 0 old-number hits in the repo |
| 4 | `.htaccess` guard (deny docs/tools/data/md/json/mjs, `index.html` → slug, www → apex) | Done (#2), tested on local Apache only; **live curl NOT RUN** |
| 5 | `data/whatsapp.json`, `apply-wa.mjs`, `data-wa` on every CTA | Done (#3); 23 distinct page messages |
| 6 | Adaptive quote form | Done (#3); obra link per type (#5) |
| 7 | Mobile CTA cleanup | Done (#3) |
| 8 | Obra handover + cross-link map | Done (#3, #5). One cross-domain link on 8 pages; targets verified against the obra/arq repos |
| 9 | Self-host hero video | **NOT RUN** (CloudFront blocked). Video is desktop-only (≥1024px, no saveData) since #3 |
| 10 | Self-host fonts | Done (#3) |
| 11 | Keyword map | Done as a **hypothesis** (#6); MCP not connected |
| 12 | Deepen 5 anchor pages | Done (#7) |
| 13 | Deepen remaining 13 service pages | Done (#8) |
| 14 | Internal linking | Done (#7, #8): 4–9 in-body links per service page; `/trabajos/` linked from every service page; every `/muebles/` and `/aluminio/` child links its hub in body |
| 15 | New pages | Skipped (not approved) |
| 16 | Schema polish | Done: telephone E.164, `Service.provider` → `#business`, `areaServed` with 11 Gran Asunción cities + Gran Asunción (#9); FAQPage JSON-LD matches the visible FAQ on every service page |
| 17 | Sitemap `lastmod` only for changed pages | Done: the 18 service pages are 2026-09-30 |
| 18 | Mobile tap targets ≥ 44px | Done (#9): nav, footer and breadcrumb are clean on mobile; 2 inline body links remain (WCAG exempts inline links) |
| 19 | Shared partials script | Not done (optional) |
| 20 | Off-site (GBP, photos, reviews) | Anton |

## 3. SEO diff (local, `audit-before.json` → `audit-after.json`)
`seo-diff: 22 URLs, 95 differences, 0 failing`. There are no status, canonical, robots, H1-count, title or sitemap changes, and no lost in-links or schema types. The differences are expected: word counts up, WhatsApp texts, phone format and cross-domain links. **Title changes: none** (`approved-titles.txt` is empty).

### Word count in `<main>`, before → after
| Page | Before | After | FAQ (after) | Cross-domain link |
|---|---|---|---|---|
| / | 568 | 584 | – | – |
| /cocinas/ | 451 | 1229 | 8 | arq `/arquitectos` |
| /placares/ | 446 | 1205 | 8 | arq `/arquitectos` |
| /aluminio/ | 365 | 1219 | 8 | obra `/reformas/` |
| /ventanas/ | 404 | 1234 | 8 | obra `/reformas/` |
| /blindex/ | 385 | 1159 | 8 | – |
| /muebles/ | 483 | 1140 | 7 | – |
| /puertas/ | 405 | 910 | 6 | – |
| /comercial/ | 404 | 825 | 7 | – |
| /cerramientos/ | 379 | 888 | 6 | obra `/ampliaciones/galeria/` |
| /muebles-tv/ | 423 | 883 | 6 | – |
| /escritorios/ | 414 | 898 | 7 | – |
| /vanitorys/ | 406 | 897 | 6 | – |
| /portones/ | 411 | 900 | 6 | – |
| /escaleras/ | 394 | 892 | 6 | – |
| /restauracion/ | 394 | 877 | 7 | – |
| /pergolas/ | 393 | 880 | 6 | obra `/patios/pergolas/` |
| /decks/ | 400 | 897 | 8 | obra `/patios/decks/` |
| /machimbre/ | 389 | 898 | 6 | obra `/quinchos/techo-madera/` |
| /trabajos/ | 229 | 230 | – | – |
| /cotizar/ | 249 | 357 | – | obra `/patios/` (per type with JS) |
| /privacidad/ | 76 | 82 | – | – |
| **Total** | **8,468** | **19,084** | | |

The shared H2 skeleton is gone. `node tools/overlap.mjs` (8-word shingles) reports **0 repeated paragraphs** across the 20 content pages.

## 4. Playwright (local, `http-server`)
| Metric | Before (main, start of window C) | After |
|---|---|---|
| Overflow at 1366 / 390 | 0 | 0 |
| Broken images | 0 | 0 |
| Console errors / failed requests | 1 / 1 (CloudFront video, blocked host) | 1 / 1 (same) |
| Home bytes, desktop | doc 32.4 KB, css 31.1 KB, img 175.9 KB, font 77.0 KB, js 6.2 KB | doc 33.9 KB, css 31.7 KB, img 175.9 KB, font 77.0 KB, js 6.2 KB |
| Home LCP | 392 ms (desktop) | 152 ms desktop / 128 ms mobile (local timings vary) |
| Small tap targets, max per render | 15 mobile | 2 mobile (inline body links) |
| Mobile FAB on load / bar covers footer / privacy overlay | 0 / 0 / 0 | 0 / 0 / 0 |

The home page still has no third-party request except the CloudFront hero video on desktop. It goes away once the video is self-hosted.

## 5. NOT RUN, and why
1. **Live checks.** The proxy blocked `live-check.mjs` after every merge, the live audit (`audit-live-before.json` / live `audit-after.json`), the `.htaccess` curls, the www/header/404 checks and `linkcheck --external`. As a result, **it is unknown whether any of #2–#9 is live** (Q1).
2. **Hero video self-hosting.** CloudFront was blocked.
3. **Keyword-library MCP.** It was not connected. The keyword map is a hypothesis, so no title changes and no new pages were made.
4. **obra/arq live URLs.** These were verified against their GitHub repos, not live.

## 6. Open decisions for Anton
- **Q1 deploy.** Is Hostinger Git auto-deploy connected to `main`? If not, upload a zip with only the public files. From the repo root:
  `zip -r carpinteria-deploy.zip index.html 404.html robots.txt sitemap.xml .htaccess assets */index.html -x 'docs/*' 'tools/*' 'data/*'`.
  Git auto-deploy is better; the `.htaccess` already hides `docs/`, `tools/`, `data/` and `*.json`/`*.md`/`*.mjs`.
- **Network.** Allow `carpinteria.com.py`, `obra.com.py`, `arq.com.py` and `d8j0ntlcm91z4.cloudfront.net` in the cloud environment (environment menu → Edit → Network access), and connect the keyword-library MCP.
- **Q2 new pages / titles.** Nothing to approve until the MCP data exists.
- **Q5 hero video.** Keep 4 self-hosted videos (desktop only) or switch to one still image?
- **Q6 obra brief.** The obra repo now exists. Should `docs/seo/obra-handover-brief.md` be copied there?
- **arq target.** arq has no `/interiores/` page, so `/cocinas/` and `/placares/` link to `https://arq.com.py/arquitectos`. Is that OK, or should arq build an interiores page?
- Q3 (message tone) and Q7 (privacy overlay removed) run on the defaults.

## 7. Suggested next steps
1. Run the next window with network and MCP access: live check and deploy, video, real keyword map (see `docs/NEXT-WINDOW-PROMPT.md`, Prompt D).
2. Google Business Profile for Carpinteria.com.py (the gbp-optimizer skill), with the same number and categories that match the pages.
3. Replace the "visual de referencia" images with first real job photos as they come in, and add them to `/trabajos/`.
4. Collect first reviews and link them from `/trabajos/`.
5. Two to four weeks after the content deploy, compare Search Console impressions per page before any title change.

## Window D addendum (2026-09-30)

**Result: blocked. No live step ran, so this addendum has no live-check output and no live seo-diff.**

### Preconditions
| Check | Result |
|---|---|
| `curl -sI https://carpinteria.com.py/` | 403 from the egress proxy (CONNECT denied) |
| `curl -sI https://obra.com.py/` | 403 from the egress proxy |
| `curl -sI https://arq.com.py/` | 403 from the egress proxy |
| `curl -sI https://d8j0ntlcm91z4.cloudfront.net/` | 403 from the egress proxy |
| keyword-library MCP `list_projects` | not connected (no such tool in the session) |

### NOT RUN
1. D1: `live-check.mjs`, live `audit-live-after.json`, live seo-diff vs `audit-before.json`, `.htaccess` curls, www/404 checks, pw-check on live. **Whether live has PRs #2–#11 is still unknown.**
2. Anton's extra check: `linkcheck --external` (every obra/arq link must return 200 live). No link was replaced, because no failure could be observed.
3. D2: hero video self-hosting (CloudFront blocked). Q5 was also still a placeholder.
4. D3: real keyword map (no MCP), so no title changes and no new pages.

### What ran (local, on `main` at `b53d23f`)
```
verify: OK — 23 pages, 63 text files scanned, 23 distinct page messages
linkcheck: 1760 internal refs in 23 pages, 0 broken; 7 cross-domain links not fetched
overlap: OK — 20 page(s) checked against 20
seo-diff audit-before.json → local audit: 22 URLs, 95 differences, 0 failing
pw-check: 0 overflow, 0 broken images; the only console error / failed request / third-party host is the
          CloudFront hero video on / desktop (ERR_TUNNEL_CONNECTION_FAILED, the proxy block)
```

### Cross-domain links, checked against the repos (not live)
| carpinteria page | Target | In the target's sitemap (generated from its repo `main`) |
|---|---|---|
| /pergolas/ | https://obra.com.py/patios/pergolas/ | yes |
| /decks/ | https://obra.com.py/patios/decks/ | yes |
| /machimbre/ | https://obra.com.py/quinchos/techo-madera/ | yes |
| /aluminio/, /ventanas/ | https://obra.com.py/reformas/ | yes |
| /cerramientos/ | https://obra.com.py/ampliaciones/galeria/ | yes |
| /cotizar/ | https://obra.com.py/patios/ | yes |
| /cocinas/, /placares/ | https://arq.com.py/arquitectos | yes (`sitemap.php` list; canonical has no trailing slash) |

obra's sitemap was produced by running its `sitemap.php` with PHP locally (56 URLs). arq's `docs/seo/arq-urls.md` does not exist on arq `main` yet, so, per Anton's rule, no other arq URL may be linked. Links changed in window D: **all 7 removed**, on Anton's decision after the run ("no cross-linking between the domains; they must just not target the same SEO pages"). Each anchor was removed together with the sentence written to hold it; `verify.mjs` now fails on any obra/arq URL in served files. Gates after the change: verify OK, linkcheck 1760 refs / 0 broken / 0 cross-domain, overlap OK, seo-diff 0 failing, pw-check unchanged (the only problem is the blocked CloudFront video).
