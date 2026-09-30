# Obra.com.py handover brief (from carpinteria.com.py)

Written 2026-09-30, window A. Copy this file to the obra repo's `docs/seo/` once that repo exists (Q6).

**Status of the data:** the keyword-library MCP was **not connected** in window A, so the volumes are still unverified and there are no group IDs. The groups and phrases below come from the KWP list in `carpinteria-com-py-site-structure.md` and the plan (`docs/IMPROVE-PLAN.md` §4.4). Obra's live URLs could **not** be verified either (the egress proxy blocked obra.com.py). Replace both before building anything on obra.

## Rule
carpinteria = wood + aluminium/blindex (furniture, doors, openings). obra = building/execution. arq = design.
Pérgolas, decks and machimbre/techos de quincho involve foundations, structure and roofing, so **obra executes** them. Carpinteria keeps its three ranking pages (`/pergolas/`, `/decks/`, `/machimbre/`): same URLs, indexable, in the sitemap, content kept. Each page now has a "Quién coordina este trabajo" block with one link to obra. The WhatsApp number is the same (+595 992 279 599), and those messages open with "Entiendo que lo coordina el equipo de Obra.com.py" so the lead is routed.

## Groups obra should own

| Group (head phrase) | Related phrases | Source page on carpinteria | Anchor used on carpinteria | Target on obra (to verify) |
|---|---|---|---|---|
| pérgolas | pérgolas de madera, pérgola para patio | `/pergolas/` | "pérgolas y quinchos con Obra.com.py" | `/quinchos/`, or a pérgola page if obra builds one. **Now: `https://obra.com.py/`** |
| decks | deck de madera, deck para piscina | `/decks/` | "decks y obras exteriores con Obra.com.py" | `/patios/`, or a deck page. **Now: `https://obra.com.py/`** |
| techos de madera | machimbre, techado de quincho, quincho de madera | `/machimbre/` | "techos y quinchos con Obra.com.py" | `/quinchos/`. **Now: `https://obra.com.py/`** |
| reformas con aberturas | cambio de aberturas en reforma, ampliación | `/aluminio/` `/ventanas/` `/cerramientos/` (not linked yet) | "si la abertura es parte de una reforma" | `/reformas/` or `/ampliaciones/` |

Quote form: `/cotizar/` has an "Exterior con Obra.com.py" group (pérgola, deck, machimbre). It shows the note "Estos trabajos los coordina el equipo de Obra.com.py…" with one link to obra, and the message starts with "Consulta para el equipo de Obra.com.py:".

## What obra should do
1. Confirm which of `/quinchos/`, `/patios/`, `/reformas/` and `/ampliaciones/` are live, and whether pérgola or deck pages exist. Send the final URLs back so carpinteria's three links can point deeper than the home page (one edit per page).
2. Build or deepen the obra pages for these groups: structure, bases, anclajes, techado, permits. Leave the wood-finish detail to carpinteria.
3. On obra, one contextual link back to carpinteria where the wood itself is the topic (e.g. from `/quinchos/` to `https://carpinteria.com.py/machimbre/`). At most one cross-domain link per page.
4. Use the same WhatsApp number and the same message style (voseo, visitor's voice, no prices).

## Not for obra
- Muebles, cocinas, placares, puertas, portones, escaleras, aluminio, blindex: these stay on carpinteria.
- Diseño de interiores / diseño de cocinas / planos: arq.com.py (`/interiores/`, to verify).
