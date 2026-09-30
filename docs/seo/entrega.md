# carpinteria.com.py — status och att-göra

**Läge:** kundläge, lokal fil. Inte publicerad. Byggd med `paraguay-local-site`, designspår **PC — Taller**.

```
C:\Claude 1\carpinteria-com-py\
  index.html                    67 KB   ← hela sajten, en fil
  assets\img\hero-obra.webp    164 KB   ← hero, eager
  assets\img\quincho.webp      129 KB   ← lazy
  assets\img\quinta-patio.webp 125 KB   ← lazy
  assets\img\piscina.webp      105 KB   ← lazy
  assets\img\renovacion.webp    88 KB   ← lazy
```

Initial laddning **231 KB**, totalt 678 KB med alla bilder inlästa.

---

## MÅSTE FIXAS INNAN PUBLICERING

Sök på `data-todo` och `CONECTAR` i `index.html` — allt ligger märkt.

| # | Vad | Var | Hur |
|---|---|---|---|
| 1 | **RUC-numret** | Franja de confianza + footer | Ersätt `[RUC AQUÍ]` (2 ställen) med riktigt nummer. Ta bort `data-todo` från `<b>`-taggen så den gula markeringen försvinner. Stämmer det inte att han fakturerar — radera hela `.trust__i`-blocket i stället. |
| 2 | **Reseñas** | `<section id="resenas">` | Tre tomma slots. Klistra in **ordagrant** citat + riktigt förnamn + barrio/stad. Ta bort `data-todo` per klar kort. När alla tre är klara: radera `<p class="todobar">`. Kommer inga omdömen — radera hela sektionen, rytmen håller ändå. |
| 3 | **Formas de pago** | `<section id="presupuesto">` | Fråga honom vad han faktiskt tar emot (efectivo, transferencia, tarjeta, Tigo Money, Billetera Personal, Zimple) och lägg till som femte `<li>`. Jag listade inget ogranskat. |
| 4 | **Facebook / Instagram** | Footer | Blocket ligger med `hidden`. Ta bort `hidden` och byt `href="#"` mot riktiga URL:er. Finns de inte — låt ligga dolt, en trasig länk är sämre än ingen. |
| 5 | **Öppettider** | Footer, kontaktblock, JSON-LD | Jag antog mån–fre 07:00–17:00, lör 07:00–12:00. Bekräfta med honom — de står på tre ställen inklusive schemat. |
| 6 | **Barrios i Asunción** | `<section id="zonas">` | Jag antog Villa Morra, Recoleta, Carmelitas, Las Mercedes, Sajonia, Barrio Jara. Byt mot de han verkligen jobbat i. |
| 7 | **Geo-koordinater** | JSON-LD | Står på Asunción centrum (-25.2637, -57.5759). Byt mot verkstadens/kontorets läge om det finns en fysisk adress. |

## Bilderna

De fem bilderna är Higgsfield-genererade, inte fotograferade. De sitter som **illustrationer per tjänst** — ingen bildtext påstår ort, datum eller kund, och rubriken är "Lo que hacemos", inte "Trabajos realizados". Det är avsiktligt.

Får du riktiga jobbfoton: lägg dem i `assets\img\` med samma filnamn så byts de rakt in, ingen CSS ändras. Kör dem genom samma kommando först:

```bash
ffmpeg -y -i original.jpg -vf "scale=1100:-2" -c:v libwebp -quality 64 -compression_level 6 quincho.webp
```

Byter du till riktiga foton av verkliga jobb kan rubriken ändras till "Trabajos realizados" och bildtexterna få ort och år.

## Deploy (Hostinger, statiskt)

Ingen Node-slot, ingen databas, inget byggsteg. Ladda upp `index.html` + `assets\` till `public_html/` via hPanel File Manager. Domänen `.com.py` registreras hos NIC.py.

## Efter lansering — off-site

1. Perfil de Negocio de Google, primärkategori **"Empresa constructora"** (inte "Carpintero" — H1:n och hela sajten är byggd på bygg).
2. Alla sex tjänster inlagda som services i profilen.
3. Foton varje vecka i profilen — det är den enskilt största rankingfaktorn lokalt i PY.
4. WhatsApp-meddelande med direktlänk till omdöme efter varje avslutat jobb.
5. Facebook-sida med identisk NAP, Instagram-bio med länk till sajten.

## Verifierat

- 360 / 390 / 768 / 1024 / 1440 px — noll horisontell scroll på någon
- Ett H1, alla bilder har spansk alt-text, JSON-LD (GeneralContractor + FAQPage) parsar
- 8 WhatsApp-länkar, alla `wa.me/595995628862` med sektionsspecifik förifylld text
- Telefonnumret klickbart och synligt som text på 5 ställen
- Voseo genomgående, noll "tú"-former, noll engelska i UI
- Grön `#25D366` förekommer bara på WhatsApp-element
- Noll emoji, noll dekorativa gradienter, noll superlativ utan täckning
- Ljusa/mörka band alternerar genom hela sidan, inga två lika mönster i rad
- Träffytor ≥ 48px, consent-banner utan förikryssat val
- Formuläret behöver ingen backend — det bygger ett WhatsApp-meddelande
