# carpinteria.com.py: keyword map

> **2026-09-30, window E:** the keyword-library MCP was **still not connected**, so group IDs stay provisional (`H-xx`), volumes stay `?`, and every title verdict stays **keep** (IMPROVE-PLAN §3.3 needs group data to justify a change). No new pages are proposed. Which domain owns which group (carpinteria / obra / arq), and every overlap with obra's and arq's real pages, is now in [`domain-split.md`](domain-split.md); that file wins where the two differ. H-20 is corrected there: arq has no interiores/diseño page, so the group has no owner page today (A-04).

> **2026-09-30, window D:** no cross-domain links any more (Anton). "route" below now means "that domain owns the keyword; carpinteria does not target it", never a link. H-17 to H-19 (pergolas, decks, machimbre) wait on Anton's Q8.

Written 2026-09-30, window C (phase C3).

**Source status: HYPOTHESIS, not MCP data.** The keyword-library MCP (`list_projects`, `project_overview`, `list_groups`, `get_group`, `keyword_lookup`) was **not connected** in window C either. As the window C prompt requires, this map is built from `docs/IMPROVE-PLAN.md` §4 and the 60-term KWP list in `docs/seo/carpinteria-com-py-site-structure.md`. Consequences:

- Group IDs below are **provisional** (`H-xx`). Replace them with the MCP group IDs when the MCP is connected.
- **PY volumes are unknown** (column shows `?`). The priority order uses ticket size and the plan's ranking, not volume.
- **No title changes and no new pages** are proposed or approved. `docs/seo/approved-titles.txt` stays empty. The content windows only deepen existing pages under their current title and H1.
- Brand and competitor phrases are excluded. So are retail/boundary terms (mueblerias, muebles paraguay, pisos laminados, piso de madera): they belong to a future muebleria.com.py, with no page and no section here.

## 1. Groups → owner → action

| ID | Head phrase | Related phrases (same meaning) | PY vol | Owner | Action |
|---|---|---|---|---|---|
| H-01 | carpinteria | carpintero, carpinteria asuncion, carpinteria a medida | ? | `/` | keep, deepen |
| H-02 | muebles a medida | muebles a pedido, muebles de melamina*, melamina, mdf | ? | `/muebles/` (hub) | deepen; material section |
| H-03 | cocinas a medida | muebles de cocina, amoblamientos de cocina, mesada de granito, mesada de cuarzo | ? | `/cocinas/` | deepen (batch 1) |
| H-04 | placares | placares a medida, closets, closet a medida, vestidores* | ? | `/placares/` | deepen (batch 1) |
| H-05 | muebles de tv | rack tv, rack para tv | ? | `/muebles-tv/` | deepen |
| H-06 | escritorios | bibliotecas, muebles de oficina* | ? | `/escritorios/` | deepen |
| H-07 | vanitory | muebles de baño | ? | `/vanitorys/` | deepen |
| H-08 | muebles comerciales | mostradores, gondolas, recepción | ? | `/comercial/` | deepen |
| H-09 | puertas de madera | puertas placa, puertas de interior, puertas de exterior, lapacho, cedro | ? | `/puertas/` | deepen |
| H-10 | portones de madera | portón corredizo de madera, portón de entrada | ? | `/portones/` | deepen |
| H-11 | carpinteria de aluminio | aberturas, aberturas de aluminio | ? | `/aluminio/` (hub) | deepen (batch 1) |
| H-12 | ventanas de aluminio | ventanas corredizas, ventana de abrir, vidrio DVH | ? | `/ventanas/` | deepen (batch 1) |
| H-13 | blindex | mamparas, mamparas de blindex, divisiones de vidrio | ? | `/blindex/` | deepen (batch 1) |
| H-14 | cerramientos | cerramientos de aluminio, cerramiento de galería, cerramiento de balcón | ? | `/cerramientos/` | deepen |
| H-15 | escaleras de madera | barandas*, barandas de madera | ? | `/escaleras/` | deepen |
| H-16 | restauracion de muebles | restaurar muebles de madera, lustre | ? | `/restauracion/` | deepen |
| H-17 | pergolas | pergolas de madera | ? | obra (`/patios/pergolas/`) | route; keep `/pergolas/` + handover |
| H-18 | decks | deck de madera | ? | obra (`/patios/decks/`) | route; keep `/decks/` + handover |
| H-19 | machimbre | techos de madera, techado de quincho, quincho de madera | ? | obra (`/quinchos/techo-madera/`) | route; keep `/machimbre/` + handover |
| H-20 | diseño de cocinas / interiores | diseño de interiores, planos | ? | arq (A-04, no page yet) | not targeted by carpinteria; no link |

\* These could become their own group once the MCP data arrives. The plan §4.3 candidates are `/melamina/` (H-02), `/oficina/` (H-06), `/vestidores/` (H-04), `/barandas/` (H-15) and `/mosquiteros/` (not in the KWP list). **None is proposed now.** Each stays a section of its owner page until the MCP shows a distinct group with PY volume. Then ask Anton (Q2), with a hard cap of 3 pages.

## 2. Per page: primary group, H2 secondary terms, title verdict

The title verdict is "keep" for every page. Without MCP volumes, no page has a group-backed reason to change its title (IMPROVE-PLAN §3.3).

| Page | Primary | Secondary terms for H2s / sections | Title (kept) |
|---|---|---|---|
| `/` | H-01 | carpintería a medida, muebles a medida, carpintería de aluminio, Asunción y Gran Asunción | Carpintería a medida en Paraguay |
| `/muebles/` | H-02 | muebles a pedido, muebles de melamina, MDF, madera maciza, herrajes | Muebles a medida en Asunción |
| `/cocinas/` | H-03 | muebles de cocina, amoblamientos de cocina, bajo mesada y alacenas, melamina y MDF, herrajes, mesada de granito o cuarzo (coordinación) | Cocinas a medida en Asunción |
| `/placares/` | H-04 | placares a medida, closets, vestidores, puertas corredizas o batientes, interiores (cajoneras, barrales, zapateros) | Placares y vestidores en Asunción |
| `/muebles-tv/` | H-05 | rack tv, mueble flotante o de piso, pasacables, estantes | Muebles de TV a medida en Asunción |
| `/escritorios/` | H-06 | bibliotecas, escritorio para home office, muebles de oficina (section) | Escritorios a medida en Asunción |
| `/vanitorys/` | H-07 | muebles de baño, vanitory suspendido o de piso, humedad y materiales | Vanitorys y muebles de baño en Asunción |
| `/comercial/` | H-08 | mostradores, góndolas, recepción, exhibidores, muebles para oficina comercial | Muebles comerciales a medida en Asunción |
| `/puertas/` | H-09 | puertas placa, puertas de interior, puertas de exterior, lapacho, cedro, marcos y herrajes | Puertas de madera en Asunción |
| `/portones/` | H-10 | portón corredizo o de abrir, madera para exterior, herrajes y mantenimiento | Portones de madera en Asunción |
| `/aluminio/` | H-11 | aberturas de aluminio, líneas de aluminio, vidrios, ventanas / blindex / cerramientos (hub) | Carpintería de aluminio en Asunción |
| `/ventanas/` | H-12 | ventanas corredizas, de abrir, oscilobatientes, vidrio simple o DVH, mosquiteros (section) | Ventanas de aluminio en Asunción |
| `/blindex/` | H-13 | mamparas de baño, divisiones de vidrio templado, herrajes, espesores | Mamparas de blindex en Asunción |
| `/cerramientos/` | H-14 | cerramiento de galería, balcón, quincho; paños corredizos o fijos | Cerramientos de aluminio en Asunción |
| `/escaleras/` | H-15 | barandas de madera, escalones, pasamanos, escalera recta o en L | Escaleras de madera en Asunción |
| `/restauracion/` | H-16 | restaurar muebles de madera, lustre, cambio de herrajes, tapizado (coordination only) | Restauración de muebles en Asunción |
| `/pergolas/` | H-17 | pérgola de madera, medidas y orientación, maderas para exterior (planning only; execution = obra) | Pérgolas de madera en Asunción |
| `/decks/` | H-18 | deck de madera, deck de piscina, maderas y mantenimiento (planning only) | Decks de madera en Asunción |
| `/machimbre/` | H-19 | techos de madera, machimbre para quincho, barniz y mantenimiento (planning only) | Machimbre y techos de madera en Asunción |
| `/trabajos/` | – | ideas visuales, referencias (links to every service) | Ideas de carpintería a medida |
| `/cotizar/` | – | cotizar carpintería (utility page) | Cotizar carpintería a medida |
| `/privacidad/` | – | – | Privacidad |

## 3. Plan §4 check
§4.1, §4.4 and §4.5 are confirmed as the working map. §4.5 cross-links shipped in PR #5, with one correction: arq has no `/interiores/` page, so `/cocinas/` and `/placares/` link to `https://arq.com.py/arquitectos`. §4.3 new pages stay on hold until the MCP is available.

## 4. When the MCP is connected (next window)
Run `list_projects` → carpinteria project → `project_overview`, `list_groups`, `get_group` per group, and `keyword_lookup` for melamina / muebles de oficina / vestidores / barandas / mosquiteros. Replace the `H-xx` IDs and the `?` volumes, re-check each title verdict, and propose at most 3 new pages to Anton (Q2).
