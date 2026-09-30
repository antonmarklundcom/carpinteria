# Obra.com.py handover brief (from carpinteria.com.py)

> **Superseded 2026-09-30 (window D).** Anton decided: no links between carpinteria, obra and arq, and this brief is not copied to the obra repo. The links in the table below were removed. The keyword ownership part moves to `docs/seo/domain-split.md` in window E. Kept for history only.

Written 2026-09-30, window A. The obra repo now exists (`antonmarklundcom/obra`); copy this file to its `docs/seo/` when Anton says so (Q6).

**Status of the data (updated window C, 2026-09-30):** target URLs are now **verified against the obra and arq repositories** (`antonmarklundcom/obra` main, `obra_routes()` in `app/routes.php`; `antonmarklundcom/arq` main, `sitemap.php`). They are **not yet verified live**: the egress proxy still blocked obra.com.py and arq.com.py in window C, so `linkcheck.mjs --external` is NOT RUN. The keyword-library MCP was still not connected, so volumes and group IDs are still missing. Obra's config defaults its WhatsApp to `595992279599` (same number, answers Q4 part 2 at repo level).

## Rule
carpinteria = wood + aluminium/blindex (furniture, doors, openings). obra = building/execution. arq = design.
Pérgolas, decks and machimbre/techos de quincho involve foundations, structure and roofing, so **obra executes** them. Carpinteria keeps its three ranking pages (`/pergolas/`, `/decks/`, `/machimbre/`): same URLs, indexable, in the sitemap, content kept. Each page now has a "Quién coordina este trabajo" block with one link to obra. The WhatsApp number is the same (+595 992 279 599), and those messages open with "Entiendo que lo coordina el equipo de Obra.com.py" so the lead is routed.

## Groups obra should own

| Group (head phrase) | Related phrases | Source page on carpinteria | Anchor used on carpinteria | Target on obra (repo-verified) |
|---|---|---|---|---|
| pérgolas | pérgolas de madera, pérgola para patio | `/pergolas/` | "pérgolas y patios con Obra.com.py" | `https://obra.com.py/patios/pergolas/` |
| decks | deck de madera, deck para piscina | `/decks/` | "decks y patios con Obra.com.py" | `https://obra.com.py/patios/decks/` |
| techos de madera | machimbre, techado de quincho, quincho de madera | `/machimbre/` | "techos de madera para quinchos con Obra.com.py" | `https://obra.com.py/quinchos/techo-madera/` |
| reformas con aberturas | cambio de aberturas en reforma | `/aluminio/` `/ventanas/` | "reformas con Obra.com.py" | `https://obra.com.py/reformas/` |
| cerrar galería / ampliación | cerramiento de galería | `/cerramientos/` | "ampliación de galería con Obra.com.py" | `https://obra.com.py/ampliaciones/galeria/` |

Arq (design): `/cocinas/` and `/placares/` link to `https://arq.com.py/arquitectos` (arq has no `/interiores/` page; it is an architect directory: `/`, `/obras`, `/arquitectos`, `/contacto`…).

Quote form: `/cotizar/` has an "Exterior con Obra.com.py" group (pérgola, deck, machimbre). It shows the note "Estos trabajos los coordina el equipo de Obra.com.py…" with one link to obra (per type: the pérgola, deck or techo-madera page above; `https://obra.com.py/patios/` without JS), and the message starts with "Consulta para el equipo de Obra.com.py:".

## What obra should do
1. Keep the five target URLs above stable (they are linked from carpinteria). If any slug changes, add a 301 on obra and tell carpinteria.
2. Build or deepen the obra pages for these groups: structure, bases, anclajes, techado, permits. Leave the wood-finish detail to carpinteria.
3. On obra, one contextual link back to carpinteria where the wood itself is the topic (e.g. from `/quinchos/techo-madera/` to `https://carpinteria.com.py/machimbre/`). At most one cross-domain link per page.
4. Use the same WhatsApp number and the same message style (voseo, visitor's voice, no prices).

## Not for obra
- Muebles, cocinas, placares, puertas, portones, escaleras, aluminio, blindex: these stay on carpinteria.
- Diseño de interiores / diseño de cocinas / planos: arq.com.py (`/arquitectos`).
