# carpinteria.com.py: improvement plan

Written 2026-09-30 (planning window, read-only). Nothing on the site was changed. The only files written today are `audit-before.json` (repo root) and this plan plus `docs/NEXT-WINDOW-PROMPT.md`.

Goal: improve the site a lot (conversion, speed, content depth, scope clarity) **without losing any current ranking**, then grow it.

---

## 0. Limits of today's investigation (read first)

| What | Status | Consequence |
|---|---|---|
| Live crawl of carpinteria.com.py | **Blocked.** This cloud session's egress policy denies `carpinteria.com.py` (proxy 403 on CONNECT, WebFetch also blocked). | `audit-before.json` was built from the repo. The 2026-09-29 report (`docs/seo/site-audit-2026-09-29.md`) says the repo is byte-identical to live for 19/22 URLs, and that `/vanitorys/` `/ventanas/` `/trabajos/` return 404 live. Those statuses are copied into the JSON as `status_live_2026_09_29`. **The build window must re-crawl live before touching anything.** |
| Hero video host `d8j0ntlcm91z4.cloudfront.net` | Blocked the same way | File sizes of the 4 MP4s are unknown. The build window measures them. |
| keyword-library MCP (`list_projects`, `project_overview`, `list_groups`, `get_group`, `keyword_lookup`) | **Not connected in this session** | Section 4 maps the 60 KWP terms in `docs/seo/carpinteria-com-py-site-structure.md` to pages as a hypothesis. The build window must confirm it against the MCP groups and Paraguay volumes before changing titles, H1s or building new pages. |
| `C:\Claude 1\site-verify-report.md` | Not reachable (cloud container, not the PC) | Re-checked the facts I could from the repo (numbers, files). |

**For the build window to work, the environment needs network access to `carpinteria.com.py`, `obra.com.py`, `arq.com.py` and `d8j0ntlcm91z4.cloudfront.net`.** Add them to the environment's allowed domains (cloud environment menu → Edit → Network access), or run the build window on the PC. The keyword-library MCP must also be connected there.

---

## 1. What the site is (repo facts)

- 22 hand-written static HTML pages (`/<slug>/index.html`) + `404.html`, one `assets/css/site.css` (28.7 KB), one `assets/js/site.js` (6.8 KB), 19 local WebP images (480/960/1536 widths) and a favicon. No build step, no package.json, no templates. Header, footer, mobile bar and JSON-LD are copy-pasted into all 22 files.
- `.htaccess`: HTTPS redirect, deflate, expires, 3 security headers, custom 404. No `www` rule, no rule hiding `docs/`.
- README says deploy = **zip upload** to Hostinger. It is not known whether Hostinger Git auto-deploy is connected to this repo (question Q1).
- No GitHub Actions workflows (and per Anton's budget policy none are added without his yes).

## 2. Findings

### 2.1 Critical
1. **3 sitemap URLs 404 live**: `/vanitorys/`, `/ventanas/`, `/trabajos/`. Files exist and are valid in the repo (1 H1, self canonical, schema OK, 404/404/229 words). Most likely an incomplete zip upload. Google is being told to crawl 3 dead URLs; `/ventanas/` is a head term ("ventanas de aluminio").
2. **Old number still live in the quote form**: `assets/js/site.js:139` opens `wa.me/595995628862`. Every lead from `/cotizar/` goes to the old number. Also in 4 docs files (`docs/seo/*.md`, historical text; they are not served as pages but must be cleaned so the "appears nowhere" rule holds).
3. **Docs would be public if deployed via Git**: `docs/seo/` (incl. the 35 KB arq business brief), `audit-before.json`, future `tools/`/`data/` sit in the web root. With Git deploy they are downloadable at `https://carpinteria.com.py/docs/...`. Needs a deny rule in `.htaccess` before the first Git deploy.

### 2.2 Important
4. **WhatsApp messages are one per page, repeated 7 times**, all the same template ("Hola, vi Carpinteria.com.py y quiero consultar por X. Tengo fotos y medidas para enviar."). No map file, no QA. The home service cards all send the generic home message.
5. **Phone display format** is `+595 992 279599` everywhere (visible text and JSON-LD). Required: `+595 992 279 599` visible, `+595992279599` in `tel:` and schema (E.164).
6. **Scope handover missing**: `/pergolas/`, `/decks/`, `/machimbre/` read as if carpinteria executes them. Zero links to obra.com.py or arq.com.py on any page (`pages_without_cross_domain_link` = all 22).
7. **Hero video on a third-party CDN** (Higgsfield user bucket on CloudFront). Risk: link rot if the bucket is cleaned, no cache control, contradicts the privacy note ("videos se cargan únicamente..."), unknown size. First video autoplays on mobile too.
8. **Google Fonts** loaded from googleapis (render-blocking CSS + 2 extra origins, third-party request on every page).
9. **Mobile CTA clutter**: at 390 px both the floating WhatsApp FAB and the sticky bottom bar are visible; the FAB sits on top of content just above the bar. The privacy overlay covers content on first view at both widths.
10. **Thin, templated service pages**: main content 365–483 words; all service pages share the same H2 skeleton ("Qué conviene definir / Situaciones que esta consulta puede resolver / De las fotos a un alcance... / Antes de pedir el presupuesto / Servicios relacionados"). Risk of near-duplicate signals; weak for head terms like "cocinas a medida", "placares", "ventanas de aluminio".
11. **Internal linking**: every page links to every page through the mega-menu/footer (21 in / 22 out), but contextual in-body links are uneven: `/muebles/` hub gets 0 in-body links, `/trabajos/` 0, `/portones/`, `/machimbre/`, `/vanitorys/`, `/restauracion/` only 2.
12. **Quote form is basic**: one free-text zone, 8 project types, same message shape for all; pérgola/deck/machimbre not handed over; no no-JS fallback (form does nothing without JS); `window.open` can be blocked on mobile.

### 2.3 Good (keep)
- 1 H1 per page, unique titles (31–56 chars) and descriptions (80–138 chars), self canonicals, `index,follow`, sitemap + robots OK.
- 0 images without alt; responsive srcset; LCP is a small local WebP on service pages (~250–440 ms locally).
- 0 horizontal overflow at 1366 and 390; 0 JS errors; total JS 6.8 KB.
- Schema: HomeAndConstructionBusiness + WebPage + BreadcrumbList + Service + FAQPage parse on every service page.
- Honest copy: no prices, "visual de referencia" disclosure on AI images, voseo throughout.

Full per-URL data: `audit-before.json` (title, description, H1, canonical, word counts, internal links in/out, schema types, WhatsApp texts, alt, render checks at both widths).

---

## 3. Protect SEO (URL contract)

### 3.1 URLs that must stay exactly as they are (all 22, all indexable, all in sitemap)
`/` `/cocinas/` `/placares/` `/muebles-tv/` `/escritorios/` `/vanitorys/` `/comercial/` `/puertas/` `/portones/` `/pergolas/` `/decks/` `/machimbre/` `/ventanas/` `/blindex/` `/cerramientos/` `/escaleras/` `/restauracion/` `/muebles/` `/aluminio/` `/trabajos/` `/cotizar/` `/privacidad/`

`/pergolas/`, `/decks/`, `/machimbre/` stay indexable with their content; they only gain a handover block and a link to obra. No noindex, no redirect.

### 3.2 URLs that change
**None planned.** No slug changes, so no 301s are needed. Guard rules to add in `.htaccess` (all 301, all safe):
- `www.carpinteria.com.py/*` → apex (verify current live behaviour first; skip if Hostinger already does it).
- `/index.html` and `/<slug>/index.html` → `/<slug>/`.
- Deny (404) `^/(docs|tools|data|audit-shots|node_modules)/`, `\.(md|json|mjs|example)$`, `package(-lock)?\.json`, `audit-before\.json`. (`sitemap.xml`, `robots.txt` stay public.)

New pages (section 4) are additions only and are added to the sitemap.

### 3.3 Title / H1 rule
Keep each page's current title and H1 primary keyword unless the keyword-library data shows a clearly better Paraguay phrase for the **same meaning group**. Any title change is listed in the PR body with old → new and the group ID that justifies it. Never touch more than 1/3 of titles in one deploy.

### 3.4 Before/after check (runs at the end of the build window, and again after deploy)
`tools/seo-diff.mjs audit-before.json audit-after.json` fails if, for any URL in 3.1:
- status ≠ 200 (live) or file missing (local),
- canonical changed or not self,
- `robots` gained `noindex`,
- H1 count ≠ 1, or title/description empty,
- title changed without being on the approved list in the PR body,
- `word_count_main` dropped by more than 10 %,
- internal in-links dropped,
- a schema type that existed before is gone,
- the URL left the sitemap.
It prints a table of all differences (expected ones included) for the final report.

---

## 4. Keyword groups → pages (hypothesis until the MCP confirms)

Rule: one meaning group = one page or one section. No pages for brand or competitor phrases. Volumes = Paraguay only. The build window replaces this table with the real group IDs and volumes (`list_groups` / `get_group` on the carpinteria project).

### 4.1 Pages that already match (keep, deepen)
| Group (from KWP list) | Page |
|---|---|
| carpinteria, carpintero, carpinteria asuncion, muebles a medida (brandless head) | `/` |
| muebles a medida, muebles a pedido, muebles de melamina* | `/muebles/` |
| cocinas a medida, muebles de cocina, amoblamientos de cocina | `/cocinas/` |
| placares, placares a medida, closets, closet a medida, vestidores | `/placares/` |
| muebles de tv, rack tv | `/muebles-tv/` |
| escritorios, bibliotecas, muebles de oficina* | `/escritorios/` |
| vanitory, muebles de baño | `/vanitorys/` |
| muebles comerciales, mostradores, gondolas | `/comercial/` |
| puertas de madera, puertas placa, puertas de interior, puertas de exterior | `/puertas/` |
| portones de madera | `/portones/` |
| carpinteria de aluminio, aberturas, aberturas de aluminio | `/aluminio/` |
| ventanas de aluminio | `/ventanas/` |
| blindex, mamparas, mamparas de blindex | `/blindex/` |
| cerramientos, cerramientos de aluminio | `/cerramientos/` |
| escaleras de madera, barandas, barandas de madera | `/escaleras/` |
| restauracion de muebles | `/restauracion/` |
| material terms: melamina, mdf, lapacho, cedro | sections on `/muebles/`, `/cocinas/`, `/puertas/` (no own pages) |

\* if the MCP shows "muebles de melamina" or "muebles de oficina" as its own group with meaningful PY volume, it becomes a new page (4.3).

### 4.2 Pages to rewrite (deepen, same URL, same primary keyword)
Priority by ticket and volume: `/cocinas/`, `/placares/`, `/aluminio/`, `/ventanas/`, `/blindex/`, then `/muebles/`, `/puertas/`, `/comercial/`, `/cerramientos/`, then the rest. Target 800–1,200 words of unique body per anchor page: tipos/configuraciones, materiales y herrajes (or líneas de aluminio, vidrios), qué medir y cómo fotografiar, qué incluye un presupuesto, 6–8 FAQ, one contextual cross-link, 3–5 in-body links to sibling pages. Replace the shared H2 skeleton with page-specific H2s that carry secondary terms from the page's group.

### 4.3 Missing pages worth building (only if the MCP shows a distinct group with PY volume)
| Candidate URL | Group | Why separate |
|---|---|---|
| `/melamina/` | muebles de melamina | Distinct material intent, likely the biggest non-brand furniture term in PY |
| `/oficina/` | muebles de oficina (a medida) | B2B intent different from `/escritorios/` (home) |
| `/vestidores/` | vestidores | Only if the MCP splits it from placares/closets; otherwise stays a section |
| `/barandas/` | barandas (madera, aluminio y vidrio) | Only if it is its own group; otherwise a section of `/escaleras/` |
| `/mosquiteros/` | mosquiteros / tela mosquitera de aluminio | Only if present in the MCP data |

Hard cap: at most 3 new pages in the first build window.

### 4.4 Groups that belong to a sibling domain (route, do not duplicate)
| Group | Owner | Handling on carpinteria |
|---|---|---|
| pergolas, pergolas de madera | obra.com.py | Keep `/pergolas/` (ranking), add handover block + one link to obra |
| decks, deck de madera | obra.com.py | Keep `/decks/`, same |
| machimbre, techos de madera, techado de quincho, quincho de madera | obra.com.py | Keep `/machimbre/`, same; no new page for quincho |
| diseño de cocinas / diseño de interiores / planos | arq.com.py | One cross-link from `/cocinas/` and `/placares/` to arq `/interiores/` |
| mueblerias, muebles paraguay, pisos laminados, piso de madera | none yet (future muebleria.com.py) | No page, no section |
| mesada de granito / cuarzo | none (stone) | Mention on `/cocinas/` as coordination, no page |

### 4.5 Cross-link map (exactly one contextual cross-domain link per page)
| Page | Link target | Anchor idea |
|---|---|---|
| `/pergolas/` | obra `/quinchos/` or obra's pérgola page if it exists | "pérgolas y quinchos con Obra.com.py" |
| `/decks/` | obra deck/patio page (verify; else `/patios/`) | "decks y patios con Obra.com.py" |
| `/machimbre/` | obra `/quinchos/` (techado) | "techos de quincho con Obra.com.py" |
| `/cocinas/` | arq `/interiores/` | "diseño de la cocina con Arq.com.py" |
| `/placares/` | arq `/interiores/` | "diseño de interiores" |
| `/aluminio/` `/ventanas/` `/cerramientos/` | obra `/reformas/` or `/ampliaciones/` | "si la abertura es parte de una reforma" |
| other pages | none, or obra/arq home only if natural | – |

Obra's live URLs must be verified in the build window (obra sitemap has 56 URLs; the structure doc lists only 15). Briefs for obra go in `docs/seo/` of the obra repo; that repo is not in this session's scope, so the build window writes `docs/seo/obra-handover-brief.md` here and flags it for copying (question Q6).

---

## 5. Conversion layer

### 5.1 One number, one map
- `data/whatsapp.json` (not public, see 3.2) is the only place that holds the number and every message:
  ```json
  {
    "number": "595992279599",
    "display": "+595 992 279 599",
    "tel": "+595992279599",
    "pages": { "/cocinas/": { "service": "cocinas", "text": "..." }, ... },
    "services": { "cocinas": "...", "placares": "...", ... },
    "form": { "types": { ... }, "zones": [ ... ], "templates": { ... } }
  }
  ```
- `tools/apply-wa.mjs` rewrites every `<a data-wa="page">` / `data-wa="service:cocinas"` href in the HTML from the map, rewrites every visible number and `tel:`, and generates `assets/js/wa-config.js` (tiny, public) for the form. Idempotent; run before every commit.
- `tools/verify.mjs` (the QA gate) fails on: any `wa.me/` or `api.whatsapp.com` number ≠ `595992279599`; any `tel:` ≠ `+595992279599`; any 8+ digit number starting 595/09 that is not ours in HTML/JS/CSS/XML/MD/JSON; the string `595995628862` or `995 628862` anywhere in the repo; any wa link with empty or missing `text`; two pages sharing the same page message; a message containing a price, "Gs", "$", "USD" or "tú/tienes/puedes"; a JSON-LD telephone not `+595992279599`.

### 5.2 Message map (page × service), drafts
Style: Paraguay voseo, first person from the visitor, no prices, mention the page so the lead is traceable, invite photos/measures. Each page has one page message used by all its CTAs; the home service cards and the form use service messages.

| Page | Message (draft) |
|---|---|
| `/` | Hola, vengo de Carpinteria.com.py. Quiero consultar por un trabajo a medida en madera o aluminio. ¿Te paso fotos y medidas por acá? |
| `/muebles/` | Hola, vi la sección de muebles a medida en Carpinteria.com.py. Quiero consultar por un mueble para mi casa. Te mando fotos del lugar y medidas aproximadas. |
| `/cocinas/` | Hola, vi la página de cocinas a medida en Carpinteria.com.py. Quiero presupuestar una cocina. Te paso fotos del ambiente, el largo de las paredes y qué electrodomésticos van. |
| `/placares/` | Hola, vi placares y vestidores en Carpinteria.com.py. Quiero consultar por un placar a medida. Te mando ancho, alto y fotos de la pared. |
| `/muebles-tv/` | Hola, vi muebles de TV en Carpinteria.com.py. Quiero un rack a medida. Te paso el ancho de la pared, el tamaño de la tele y fotos. |
| `/escritorios/` | Hola, vi escritorios y bibliotecas en Carpinteria.com.py. Quiero consultar por un escritorio o biblioteca a medida. Te mando medidas y fotos del espacio. |
| `/vanitorys/` | Hola, vi vanitorys en Carpinteria.com.py. Quiero un mueble de baño a medida. Te paso el ancho disponible y fotos del baño. |
| `/comercial/` | Hola, vi muebles comerciales en Carpinteria.com.py. Necesito mostrador, góndolas o recepción para mi local. Te cuento el rubro y te mando fotos y medidas. |
| `/puertas/` | Hola, vi puertas de madera en Carpinteria.com.py. Quiero consultar por puertas. Te paso cuántas son, si son de interior o exterior y las medidas del vano. |
| `/portones/` | Hola, vi portones de madera en Carpinteria.com.py. Quiero consultar por un portón. Te mando ancho, alto, si es corredizo o de abrir, y fotos de la entrada. |
| `/pergolas/` | Hola, vengo de Carpinteria.com.py por una pérgola de madera. Entiendo que la coordina el equipo de Obra.com.py. Te mando fotos del patio y medidas aproximadas. |
| `/decks/` | Hola, vengo de Carpinteria.com.py por un deck de madera. Entiendo que lo coordina el equipo de Obra.com.py. Te paso medidas del área y fotos del piso actual. |
| `/machimbre/` | Hola, vengo de Carpinteria.com.py por un techo de machimbre. Entiendo que lo coordina el equipo de Obra.com.py. Te mando fotos y medidas del quincho o ambiente. |
| `/aluminio/` | Hola, vi carpintería de aluminio en Carpinteria.com.py. Quiero consultar por aberturas de aluminio. Te paso cuántas son, medidas y fotos. |
| `/ventanas/` | Hola, vi ventanas de aluminio en Carpinteria.com.py. Quiero presupuestar ventanas. Te mando cantidad, medidas de cada vano y si son corredizas o de abrir. |
| `/blindex/` | Hola, vi mamparas y blindex en Carpinteria.com.py. Quiero consultar por una mampara o división de vidrio. Te paso medidas y fotos del lugar. |
| `/cerramientos/` | Hola, vi cerramientos de aluminio en Carpinteria.com.py. Quiero cerrar un espacio. Te mando fotos, medidas y qué quiero cerrar (galería, balcón o quincho). |
| `/escaleras/` | Hola, vi escaleras y barandas en Carpinteria.com.py. Quiero consultar por una escalera o baranda de madera. Te paso fotos, altura entre pisos y ancho. |
| `/restauracion/` | Hola, vi restauración de muebles en Carpinteria.com.py. Tengo un mueble para restaurar. Te mando fotos de cómo está y sus medidas. |
| `/trabajos/` | Hola, vi las ideas de proyectos en Carpinteria.com.py y me gustó una referencia. Te cuento qué quiero hacer y te mando fotos de mi espacio. |
| `/cotizar/` | (form generates the message; page CTAs:) Hola, estoy en la página de cotizar de Carpinteria.com.py y prefiero contarte mi proyecto directamente por acá. |
| `/privacidad/` | Hola, leí la página de privacidad de Carpinteria.com.py y tengo una consulta sobre mis datos o un proyecto. |
| `404.html` | Hola, llegué a una página que no existe en Carpinteria.com.py. Busco información sobre un trabajo a medida. |

Service messages (home service cards, form defaults): one per service key above (cocinas, placares, muebles-tv, escritorios, vanitorys, comercial, puertas, portones, pergolas, decks, machimbre, aluminio, ventanas, blindex, cerramientos, escaleras, restauracion, otro) — same text as the page message but opening with "Hola, vengo de la página principal de Carpinteria.com.py" so page and service texts are distinct.

### 5.3 Quote form (`/cotizar/`, client-side only, WhatsApp output)
Fields:
1. **Tipo de proyecto** (select, grouped): Muebles (cocina, placar/vestidor, mueble de TV, escritorio/biblioteca, vanitory, comercial/oficina, restauración, otro mueble) · Madera (puertas, portones, escaleras/barandas) · Aluminio y blindex (ventanas, mampara/blindex, cerramiento, otras aberturas) · Exterior con Obra.com.py (pérgola, deck, machimbre/techo de quincho).
2. **Zona** (select): Asunción, Lambaré, Fernando de la Mora, San Lorenzo, Luque, Mariano Roque Alonso, Villa Elisa, Ñemby, Capiatá, Limpio, San Antonio, Otra ciudad → shows a text input "¿Qué ciudad?". Optional "Barrio" text.
3. **¿Tenés medidas?** Sí, aproximadas / Todavía no.
4. **¿Para cuándo?** Lo antes posible / En 1 a 3 meses / Estoy averiguando.
5. **Detalles** (textarea) with a type-specific placeholder and 2–3 hint questions shown under it (e.g. cocina: largo de paredes, mesada, electrodomésticos; ventanas: cantidad, medidas del vano, corrediza o de abrir; placar: ancho × alto, puertas corredizas o batientes).

Message assembly (`form.templates` in the map):
- Opening per type: "Hola, vengo de Carpinteria.com.py y quiero cotizar {tipo_frase}."
- Zone: inside Gran Asunción → "Estoy en {barrio, }{ciudad}."; Otra ciudad → "Estoy en {ciudad}, fuera de Gran Asunción. ¿Pueden evaluar si llegan hasta acá?"
- Medidas: sí → "Tengo medidas aproximadas."; no → "Todavía no tengo medidas, ¿me decís qué tengo que medir?"
- Plazo line, then "Detalles: …" if filled, then the type-specific closing ("Te mando fotos de las paredes de la cocina." / "Te mando fotos de cada abertura.").
- Exterior types (pérgola/deck/machimbre): an inline note appears before submit: "Estos trabajos los coordina el equipo de Obra.com.py. Tu mensaje llega al mismo WhatsApp y lo derivamos." + one link to the obra page. Message is prefixed "Consulta para el equipo de Obra.com.py:".
Behaviour:
- `?servicio=<key>` preselects the type (service pages link "Armar mi consulta" → `/cotizar/?servicio=cocinas`).
- Mobile: `location.href = wa.me…` (no popup blocking); desktop: `window.open(…, '_blank', 'noopener')`.
- No-JS fallback: `<form action="https://wa.me/595992279599" method="get">` with a hidden `text` holding the generic cotizar message, so submit still opens WhatsApp.
- Nothing is sent to any server; no storage. Max length 1,200 chars (trim details).
- Live preview of the message under the button ("Así se verá tu mensaje"), so the visitor sees what they send.

### 5.4 CTA placement (every service page)
1. Header: "Escribinos" (desktop) — page message.
2. Hero primary: WhatsApp (page message) + secondary "Armar mi consulta" → `/cotizar/?servicio=…` (replaces the second "Llamanos" in the hero; call stays in header and bottom bar).
3. Mid-page CTA after the "qué medir / cómo fotografiar" section.
4. Final quote block (existing).
5. Mobile sticky bar: WhatsApp + Llamar, shown after the hero scrolls out of view (IntersectionObserver), `padding-bottom: env(safe-area-inset-bottom)`, body gets bottom padding so the footer is never covered.
6. Floating FAB: desktop only (hidden ≤768 px, where the bar exists).
7. Privacy overlay: removed; the same sentence moves to the footer and `/privacidad/` (the site sets no cookies, so no banner is required). Q7 if Anton wants to keep a banner.

---

## 6. Ranked work items

Effort: S < 1 h, M 1–3 h, L > 3 h of agent time. Risk = risk to current rankings.
Models: **Opus 5.5 medium** is the build-window director; subagents are **Sonnet 5.5** at the effort shown. No Fable anywhere.

| # | Item | Effort | Ranking risk | Model | Human decision |
|---|---|---|---|---|---|
| 1 | Re-crawl live into `audit-live-before.json`; confirm 404s, `www`, headers, video sizes; keep repo `audit-before.json` as the local baseline | S | none | Opus 5.5 medium (director) | – |
| 2 | Deploy fix for `/vanitorys/` `/ventanas/` `/trabajos/` + `tools/live-check.mjs` (every sitemap URL 200, title = repo title, canonical self, number present, old number absent, `/no-existe/` → 404) | S | positive | Opus 5.5 medium | Q1 deploy method |
| 3 | Replace old number in `site.js:139` and docs; phone display/tel/schema format; `tools/verify.mjs` number gate | S | none | Sonnet 5.5 low | – |
| 4 | `.htaccess`: deny docs/tools/data/json/md, `index.html` → slug 301, `www` → apex (if needed) | S | low (verify with curl) | Opus 5.5 medium | – |
| 5 | WhatsApp map (`data/whatsapp.json`), `apply-wa.mjs`, `data-wa` attributes on all CTAs, all 23 messages | M | none | Sonnet 5.5 medium (messages) + Opus review | Q3 tone OK? (drafts in 5.2) |
| 6 | Adaptive quote form (5.3) + `?servicio=` + no-JS fallback + preview | M | none | Opus 5.5 medium | – |
| 7 | Mobile CTA cleanup: bar after hero, FAB desktop-only, privacy overlay → footer | S | none | Sonnet 5.5 low | Q7 |
| 8 | Obra handover on `/pergolas/` `/decks/` `/machimbre/` (block + 1 link + message), cross-link map (4.5) on the other pages | S | low (adds 1 external link per page) | Sonnet 5.5 low | Q4 obra target URLs |
| 9 | Self-host hero video (ffmpeg → 720p H.264 ≤1.5 MB each + WebP poster), poster-only on mobile / `saveData`, video only ≥1024 px | M | none (LCP improves) | Opus 5.5 medium | Q5 keep video at all? |
| 10 | Self-host fonts (Archivo 700/800 + Inter 400/600, latin subset WOFF2, `font-display: swap`, preload 2 files); drop googleapis | S | none | Sonnet 5.5 low | – |
| 11 | Keyword mapping with the MCP → `docs/seo/keyword-map.md` (group ID → URL/section, volumes PY) | M | none (doc) | Opus 5.5 medium | – |
| 12 | Content deepening of 5 anchor pages (4.2) | L | medium (body change on ranking pages) — mitigated by keeping title/H1/URL and only adding | Sonnet 5.5 medium, one subagent per page | – |
| 13 | Content deepening of remaining 12 service pages + unique H2s | L | medium, same mitigation | Sonnet 5.5 medium fan-out | – |
| 14 | Internal linking: 3–5 in-body links per page, hub `/muebles/` and `/aluminio/` get links from every child, `/trabajos/` linked from each service page | S | positive | Sonnet 5.5 low | – |
| 15 | Up to 3 new pages from 4.3 if the MCP supports them; add to nav, footer, sitemap | M each | none (additions) | Sonnet 5.5 medium | Q2 approve new pages |
| 16 | Schema polish: telephone E.164, `Service.provider` → `#business`, `areaServed` cities list, `sameAs` when socials exist | S | low | Sonnet 5.5 low | – |
| 17 | Sitemap `lastmod` updated only for pages whose content changed | S | none | Opus 5.5 medium | – |
| 18 | Accessibility: nav/footer tap targets ≥ 44 px on mobile | S | none | Sonnet 5.5 low | – |
| 19 | Optional: shared header/footer via `tools/sync-partials.mjs` (one partial file, script copies it into all pages between markers) so future edits touch one file | M | none | Opus 5.5 medium | – |
| 20 | Off-site (not code): Google Business Profile, first real job photos, reviews | – | positive | – | Anton |

Order in the build window: 1 → 2/3/4 (hotfix PR, deploy, live-verify) → 5–10 (conversion + performance PR) → 11 → 12–16 (content PRs) → 17–19.

### 6.1 Git flow (Claude owns it end to end)
In the build window Claude runs the whole git flow itself: creates the branch, makes small focused commits, opens the PR, waits for checks (there are no GitHub Actions in this repo, so the gate is the local `tools/verify.mjs` + Playwright + link check + SEO diff, whose output goes in the PR body), fixes review comments and merge conflicts (merge base into the branch, never force-push someone else's branch), merges only when everything is verified locally, and after deploy re-crawls the live URLs to confirm the live site matches the merged commit. On Hostinger a merge to `main` may auto-deploy, so **merge only after local verification**, and run `tools/live-check.mjs` right after the merge. Claude fixes what it finds along the way (broken links, lint, HTML errors, build/verify failures) instead of only reporting it, and stops only for decisions listed in section 7. No GitHub Actions workflow is added without Anton's explicit yes (budget policy).

### 6.2 Top 3 risks
1. **Deploy mismatch**: if Hostinger deploys from a zip (not Git), a merge does not reach live and the 3 pages stay 404; if it deploys from Git root, docs/JSON become public unless the `.htaccess` deny lands in the same or an earlier deploy.
2. **Content rewrites move rankings**: rewriting bodies of pages that rank today. Mitigation: keep URL/title/H1/primary keyword, add rather than remove, max 1/3 titles per deploy, SEO diff gate, and stagger content PRs over two deploys a week apart.
3. **Wrong WhatsApp target**: any leftover old number or empty text loses leads silently. Mitigation: map file + verify gate + live-check greps the live HTML and `site.js` for the old number after every deploy.

---

## 7. Open questions for Anton (real decisions only)

- **Q1 Deploy**: Is Hostinger Git auto-deploy connected to `main` of this repo, or is it still zip upload? If zip: do you want to connect Git (hPanel → site → Advanced → Git) so Claude can deploy by merging? Otherwise Claude produces the zip and you upload it.
- **Q2 New pages**: Approve building up to 3 new pages (e.g. `/melamina/`, `/oficina/`) if the keyword-library shows real PY volume for those groups?
- **Q3 Messages**: OK with the message tone in 5.2 (visitor's voice, mentions the page and "Obra.com.py" on exterior pages)?
- **Q4 Obra targets**: For pérgolas / decks / machimbre, which obra.com.py pages should receive the one link (does obra have dedicated pérgola/deck pages, or should they point to `/quinchos/` and `/patios/`)? And is obra's WhatsApp also +595 992 279 599 (it must be, per the one-number rule — confirm obra has been updated too)?
- **Q5 Hero video**: Keep the 4-video hero (self-hosted, desktop only, poster on mobile) or replace it with one still image for speed?
- **Q6 Obra brief**: The obra repo is not on GitHub yet. Should the obra handover brief live only in this repo for now?
- **Q7 Privacy note**: OK to remove the overlay and keep the sentence in the footer and `/privacidad/`?
- **Network**: allow `carpinteria.com.py`, `obra.com.py`, `arq.com.py`, `d8j0ntlcm91z4.cloudfront.net` in the cloud environment, and connect the keyword-library MCP there (or run the build window on the PC).
