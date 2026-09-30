# Domain split: carpinteria.com.py · obra.com.py · arq.com.py

Written 2026-09-30, window E (phase E3). **This file is the single source of truth for which domain owns which keyword group.** The obra and arq sessions read it from here (`antonmarklundcom/carpinteria`, `docs/seo/domain-split.md` on `main`); it is not copied into their repos.

## Rules
1. **No links between the three domains** (Anton, window D). Not in content, not in the footer, not in JSON-LD `sameAs`. `tools/verify.mjs` enforces it for carpinteria.
2. **One keyword group = one domain = one page.** A domain that does not own a group does not put its head phrase in a title, H1, meta description or H2.
3. Owner by scope:
   - **carpinteria** = products in wood, aluminium and glass: furniture, doors, gates, openings, glass, and wooden exterior pieces as a product.
   - **obra** = building work: houses, structure, foundations, roofs, reformas, ampliaciones, quinchos, piscinas, tinglados, muros, obra civil.
   - **arq** = design, architects and studios, architectural works, plans.
4. Mentioning another trade inside a page is fine ("la mesada de piedra se coordina aparte", "el mueblero entra después de la obra civil"). Targeting its head phrase is not.

## Source status
- **keyword-library MCP: not connected in window E.** Group IDs are still provisional (`H-xx` = carpinteria, `O-xx` = obra, `A-xx` = arq) and there are **no PY volumes**. When the MCP is connected, replace the IDs and add volumes; the ownership below should not change unless the data shows two phrases are really separate groups.
- obra: `antonmarklundcom/obra` `main` at `5d7a70a`, 56 URLs from `php sitemap.php`, rendered locally with `php -S … router.php`.
- arq: `antonmarklundcom/arq` `main` at `21f84c6`, 9 URLs from `sitemap.php` (7 fixed + 1 obra + 1 architect).
- carpinteria: `main` after PR #13, 22 sitemap URLs.

## 1. Keyword groups → owning domain → owning page

### carpinteria.com.py
| ID | Group (head phrase + same-meaning phrases) | Owner page |
|---|---|---|
| H-01 | carpintería, carpintero, carpintería a medida, carpintería Asunción | `/` |
| H-02 | muebles a medida, muebles a pedido, muebles de melamina, MDF | `/muebles/` |
| H-03 | cocinas a medida, muebles de cocina, amoblamientos de cocina | `/cocinas/` |
| H-04 | placares, placares a medida, closets, vestidores | `/placares/` |
| H-05 | muebles de TV, rack TV | `/muebles-tv/` |
| H-06 | escritorios, bibliotecas, muebles de oficina | `/escritorios/` |
| H-07 | vanitory, muebles de baño | `/vanitorys/` |
| H-08 | muebles comerciales, mostradores, góndolas, recepción | `/comercial/` |
| H-09 | puertas de madera, puertas placa, puertas de interior/exterior | `/puertas/` |
| H-10 | portones de madera, portón corredizo de madera | `/portones/` |
| H-11 | carpintería de aluminio, aberturas de aluminio | `/aluminio/` |
| H-12 | ventanas de aluminio, ventanas corredizas, DVH, mosquiteros | `/ventanas/` |
| H-13 | blindex, mamparas, divisiones de vidrio templado | `/blindex/` |
| H-14 | cerramientos de aluminio, cerramiento de galería / balcón / quincho | `/cerramientos/` |
| H-15 | escaleras de madera, barandas de madera | `/escaleras/` |
| H-16 | restauración de muebles, lustre | `/restauracion/` |
| H-17 | pérgolas de madera | `/pergolas/` — **Q8 pending** (see §3) |
| H-18 | deck de madera | `/decks/` — **Q8 pending** |
| H-19 | machimbre, techos de machimbre | `/machimbre/` — **Q8 pending** |

### obra.com.py
| ID | Group | Owner page |
|---|---|---|
| O-01 | constructora, construcción llave en mano | `/`, `/servicios/`, `/como-trabajamos/` |
| O-02 | construcción de casas, dúplex, casas minimalistas, casas por etapas, prefabricadas vs tradicional | `/casas/` + 4 subpages |
| O-03 | quintas, casas de campo, refacción de quintas | `/quintas/` + 2 |
| O-04 | construcción de piscinas (chicas, quinta, desbordante, renovación) | `/piscinas/` + 4 |
| O-05 | quinchos, quinchos cerrados, parrillas, asadores | `/quinchos/` + `/cerrados/`, `/parrillas/` |
| O-06 | quincho con techo de madera | `/quinchos/techo-madera/` — overlaps H-19, see §2 |
| O-07 | reformas, remodelación de casas | `/reformas/` |
| O-08 | remodelación de cocinas (obra civil) | `/reformas/cocinas/` |
| O-09 | remodelación de baños (obra civil) | `/reformas/banos/` |
| O-10 | renovación de fachadas | `/reformas/fachadas/` |
| O-11 | cambio y reparación de techos (tejas, chapa, losa) | `/reformas/techos/` |
| O-12 | ampliaciones, planta alta, dormitorio y baño | `/ampliaciones/` + 2 |
| O-13 | galería cubierta (construcción) | `/ampliaciones/galeria/` |
| O-14 | patios, veredas, contrapisos | `/patios/`, `/patios/veredas/` |
| O-15 | construcción de pérgolas (metal, hormigón, galería liviana) | `/patios/pergolas/` — overlaps H-17 |
| O-16 | construcción de decks (WPC, estructura) | `/patios/decks/` — overlaps H-18 |
| O-17 | tinglados, galpones, cocheras | `/tinglados/` + 2 |
| O-18 | muros perimetrales, portones metálicos y accesos (obra civil, automatización) | `/muros/`, `/muros/portones/` |
| O-19 | obras comerciales, adecuación de locales, remodelación de oficinas | `/comerciales/` + 2 |
| O-20 | supervisión, fiscalización, dirección técnica de obra | `/supervision/` + 1 |
| O-21 | presupuesto de obra, cómputo métrico | `/presupuesto/` |
| O-22 | guías: costo de construir, terreno, plazos, permisos, platea, ladrillo o bloque, albañil | `/guias/` + 7 |
| O-23 | crédito para construir (banco, AFD) | `/credito/` |

### arq.com.py
| ID | Group | Owner page |
|---|---|---|
| A-01 | arquitectura paraguaya, arquitectura del Paraguay | `/` |
| A-02 | obras de arquitectura (paraguaya) | `/obras`, `/obras/{slug}` |
| A-03 | arquitectos Paraguay, estudios de arquitectura | `/arquitectos`, `/arquitectos/{slug}` |
| A-04 | diseño de interiores, diseño de cocinas, planos | **no page today.** Owned by arq if it ever builds one; carpinteria and obra do not target it. |

Not owned by anyone (no page anywhere): mueblerías / muebles Paraguay, pisos laminados / piso de madera (future muebleria.com.py), mesada de granito / cuarzo (stone trade), brand and competitor phrases.

## 2. Overlaps today

Checked by URL, title, H1, meta description and H2s of every page on the three domains.

### Hard overlaps (same group, both sides target it)
| # | carpinteria page | Other page | Shared phrase | Proposed fix |
|---|---|---|---|---|
| 1 | `/pergolas/` "Pérgolas de madera en Asunción" | obra `/patios/pergolas/` "Construcción de pérgolas en Paraguay" (+ `/patios/` "Patios, decks y pérgolas") | pérgolas | Depends on Q8, §3. Recommended: carpinteria keeps **pérgolas de madera** (product: wood, sizes, finish); obra re-angles to **construcción de pérgolas de metal y hormigón / galerías livianas** and drops "madera" from its title, H1, description and H2s. |
| 2 | `/decks/` "Decks de madera en Asunción" | obra `/patios/decks/` "Construcción de decks de madera y WPC" | deck de madera | Recommended: carpinteria keeps **deck de madera**; obra re-angles to **deck de WPC / deck de piscina con estructura y base** and drops "madera" from title and H1. |
| 3 | `/machimbre/` "Machimbre y techos de madera" | obra `/quinchos/techo-madera/` "Quinchos con techo de madera y machimbre" | machimbre, techo de madera | Recommended: carpinteria keeps **machimbre / techos de machimbre**; obra keeps the **quincho** group and retitles the page to the quincho build (e.g. "Quinchos con techo de tejas y estructura de madera") with no "machimbre" in title, H1 or description. |

### Soft overlaps (different groups, wording to keep apart)
| # | carpinteria | obra | Why it is not a hard overlap | Rule for both sides |
|---|---|---|---|---|
| 4 | `/cocinas/` cocinas a medida | `/reformas/cocinas/` remodelación de cocinas | Furniture vs obra civil (instalaciones, revestimientos). | carpinteria never says "remodelación de cocinas"; obra never says "cocinas a medida" or "muebles de cocina" in title/H1/H2. Today both comply. |
| 5 | `/vanitorys/` muebles de baño | `/reformas/banos/` remodelación de baños | Furniture vs obra civil. | Same rule; obra's "mampara" mentions stay body text, never H2 (H-13 is carpinteria's). |
| 6 | `/portones/` portones de madera | `/muros/portones/` portones y accesos | Wood gate vs metal gate + columns, guides, automation. | obra keeps "portones metálicos", "automatización", "acceso vehicular"; it should not use "portones de madera". Its title "Construcción de portones y accesos" is generic; adding "metálicos" would remove any doubt (optional). |
| 7 | `/cerramientos/` cerramientos de aluminio | `/ampliaciones/galeria/` galería cubierta | Aluminium/glass closing vs building the covered gallery. | obra's H2 "Orientación, sol y cerramiento futuro" is fine as body context; obra must not target "cerramiento de galería". |
| 8 | `/comercial/` muebles comerciales; `/escritorios/` muebles de oficina | `/comerciales/locales/`, `/comerciales/oficinas/` | Furniture vs adecuación / remodelación of the space. | carpinteria never says "adecuación de locales" / "remodelación de oficinas"; obra never says "muebles comerciales" / "muebles de oficina". Today both comply. |
| 9 | `/machimbre/` techos de madera | `/reformas/techos/` cambio y reparación de techos | Wood ceiling product vs roof repair (tejas, chapa, losa). | Resolved together with #3. |

### carpinteria ↔ arq and obra ↔ arq
No overlap. arq is an architecture monograph and directory (A-01 to A-03); neither carpinteria nor obra targets "arquitectos", "arquitectura" or "planos" in any title, H1 or H2.

### Links between the domains (rule 1)
- carpinteria: 0 links to obra or arq (verify.mjs).
- arq: 0 links to obra or carpinteria.
- **obra: 56 of 56 pages link to `https://carpinteria.com.py/` and `https://arq.com.py/`** from the footer ("Parte del mismo grupo: …", `app/layout.php`, driven by `partners` in `config/site.php`). **Fix on the obra side:** render the footer sentence without `<a>` (or drop it), e.g. set both partners to `'live' => false`, which the layout already handles as plain text.

## 3. Pérgolas / decks / machimbre (Q8, still open)
Anton's Q8 answer did not arrive in window E (placeholder again), so nothing changed on these three pages or their WhatsApp messages. They still say "lo coordina el equipo de Obra.com.py".

| Option | carpinteria | obra |
|---|---|---|
| **carpinteria (recommended)** | Keeps H-17/18/19. Window E4 removes every Obra mention and replaces it with wood planning content; foundations, structure and roofing become "se define en la visita". | Re-angles overlaps #1–#3 as in §2. |
| obra | Needs Anton's explicit OK before any change: keep the pages with a different angle (e.g. "mantenimiento y barniz de pérgolas y decks") or noindex + out of sitemap. | Keeps pérgolas, decks, techo de madera as they are. |
| keep as today | No change (both domains keep targeting the same three groups, which breaks rule 2). | No change. |

Why carpinteria is recommended: the three head phrases are "…de madera" / "machimbre", a wood product, which is carpinteria's scope; obra's pages are broader (metal, hormigón, WPC, quinchos) and can keep a distinct construction angle without losing their pages.
