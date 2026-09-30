# Auditoría de carpinteria.com.py
**Fecha:** 2026-09-06
**Método:** escaneo automatizado con Playwright (desktop 1432×900 y mobile 390×844), inspección de DOM/red, `robots.txt` y `sitemap.xml`.

## Resumen ejecutivo

El sitio está bien construido a nivel de contenido y arquitectura SEO (metadatos únicos por página, sitemap completo, buen copy orientado a WhatsApp). El problema más serio y accionable es de **rendimiento**: la home descarga 4 videos completos (no solo el activo) apenas carga la página, incluso en el viewport móvil, generando un consumo de datos innecesario que puede ser costoso para visitantes con planes de datos limitados en Paraguay. Hay además un bloqueo temporal de acceso (challenge anti-bot) que vale la pena revisar, y varias mejoras menores de accesibilidad y SEO técnico.

---

## 🔴 Crítico

### 1. Los 4 videos del hero se descargan todos al cargar la página (incluso en mobile)
Al inspeccionar la red, los 4 `<video>` del selector "Inspiración para tu proyecto" (madera, cocina, placares, aluminio) se descargan casi de inmediato — no solo el video activo (tab "01"). Se observaron **múltiples requests GET duplicados** (206 Partial Content) a los 4 archivos `.mp4` alojados en CloudFront, tanto en desktop como al emular un viewport de 390px de ancho.

- **Por qué importa:** son videos generados (nombres tipo `hf_20260829_194555_*.mp4`), probablemente varios MB cada uno. Descargar 4 videos completos en la carga inicial —especialmente en 3G/4G paraguayo con planes de datos limitados— es un desperdicio real de datos del visitante y ralentiza el LCP (Largest Contentful Paint), lo que puede penalizar el sitio tanto en experiencia de usuario como en Core Web Vitals / SEO.
- **Recomendación:** solo el video del tab activo debería tener `preload="metadata"` (o `auto`); los otros 3 deberían quedar sin ninguna descarga (`preload="none"` real, sin precarga JS) hasta que el usuario haga clic en su tab. Revisar el `site.js` — probablemente está iterando y llamando `.load()` o similar sobre los 4 `<video>` al iniciar. Considerar además comprimir los videos (H.264 con bitrate más bajo, o generar un poster/thumbnail estático y cargar el video solo on-demand).

### 2. El sitio devuelve 403 "Checking your browser" de forma intermitente
El primer intento de carga devolvió un **403** con la pantalla de verificación tipo Cloudflare ("Just a moment..."). Un segundo intento cargó normalmente.

- **Por qué importa:** si esto ocurre con cierta frecuencia a visitantes reales (no solo bots), se pierden clientes potenciales que llegan por Google Ads, WhatsApp compartido, o redes sociales y ven una pantalla de error en vez del sitio. También puede afectar el rastreo de Googlebot si el challenge se dispara contra crawlers legítimos.
- **Recomendación:** revisar la configuración de protección anti-bot del hosting/CDN (reglas de Cloudflare, rate limiting) para asegurarse de que no esté bloqueando tráfico legítimo o el propio Googlebot. Confirmar con Google Search Console si hay errores de rastreo.

---

## 🟠 Importante

### 3. Sin `srcset`/tamaños responsivos en las imágenes
Las 3 imágenes ilustrativas de la sección "Ideas para conversar mejor tu proyecto" (`cocina-ilustrativa.webp`, `placard-ilustrativo.webp`, `aluminio-ilustrativo.webp`) no tienen `srcset` ni `sizes`. Se sirve la misma imagen a un celular de 390px que a un monitor de 1432px+.

- **Recomendación:** generar 2–3 anchos por imagen (ej. 480w/960w/1600w) y usar `srcset`/`sizes`, o `<picture>`. Esto es exactamente lo que resuelve la herramienta `webimg` que ya usás en otros proyectos — vale la pena aplicarla acá también.

### 4. Dependencia total de JavaScript para la navegación principal
Los tres menús desplegables del header ("Muebles", "Madera exterior", "Aluminio y blindex") son `<button>` sin `href`, sin ningún link de respaldo. Si `site.js` falla en cargar (error de red, bloqueador de contenido agresivo, etc.), esas 12+ subpáginas (muebles-tv, escritorios, vanitorys, portones, ventanas, cerramientos, escaleras, machimbre, blindex...) quedan sin ninguna forma de navegación desde el header — solo accesibles por el footer, el sitemap, o buscador.

- **Recomendación:** no es urgente cambiar el patrón (funciona bien con JS activo, que es el caso normal), pero sería más robusto que los botones fueran `<a href="/muebles/">` con el dropdown como mejora progresiva, en vez de depender 100% del JS.

### 5. Popup de aviso de privacidad se superpone al contenido
El aviso fijo ("Este sitio no usa analítica ni cookies publicitarias...") aparece sobre el hero/video y, en ciertos scrolls, tapa parcialmente las tarjetas de servicio (ej. "Placares y vestidores"). No es bloqueante — tiene botón "Entendido" — pero es una interferencia visual innecesaria para un mensaje que podría ir en el footer o como banner más discreto en la parte inferior.

- **Recomendación:** moverlo a un banner inferior tipo cookie-banner clásico, más chico y menos intrusivo, o integrarlo directamente en el footer sin necesidad de overlay.

### 6. FAQ con contenido oculto — verificar accesibilidad del acordeón
Los ítems de FAQ usan elementos `generic` con cursor pointer en vez de `<button>` semánticos con `aria-expanded`. Esto puede afectar a usuarios de lectores de pantalla que no reciban el estado expandido/colapsado.

- **Recomendación:** usar `<button aria-expanded="true/false">` reales para cada pregunta del acordeón.

---

## 🟡 Menor / oportunidades

### 7. Sin analítica de ningún tipo
El sitio declara explícitamente "Este sitio no usa analítica ni cookies publicitarias." Si bien es una decisión de privacidad válida, esto significa que no hay forma de saber cuántas visitas llegan, de dónde, ni qué tan bien convierte el botón de WhatsApp vs. llamada.

- **Recomendación (opcional):** considerar una analítica minimalista y respetuosa de la privacidad (ej. Plausible o Umami, sin cookies) solo para medir conversión a WhatsApp, sin comprometer la promesa de privacidad actual.

### 8. Falta de prueba social real
El texto aclara honestamente "Estas imágenes son ilustrativas. No representan trabajos realizados, clientes ni inventario disponible" — una decisión transparente y correcta, pero deja al sitio sin ningún elemento de confianza real (testimonios, fotos de trabajos reales, años de experiencia, cantidad de proyectos).

- **Recomendación:** en cuanto haya banco de fotos reales de trabajos, reemplazar gradualmente las imágenes ilustrativas y sumar 2–3 testimonios reales (aunque sean cortos, vía WhatsApp/Google) para reforzar confianza sin inventar nada.

### 9. Contenido de página de servicio es correcto pero liviano
`/pergolas/` tiene ~483 palabras — adecuado pero en el límite bajo para posicionar bien por keywords específicas de la categoría (ej. "pérgolas de madera Lambaré", tipos de madera, mantenimiento). No es un error, pero es una oportunidad de SEO on-page si se quiere competir mejor en búsquedas de esa categoría específica.

### 10. Falta `hreflang`/verificación de unicidad de contenido entre páginas similares
No se detectó problema de contenido duplicado en las páginas revisadas (títulos y meta description únicos), pero con ~18 páginas de servicio muy similares en estructura, vale la pena un chequeo periódico con una herramienta como Screaming Frog para confirmar que no haya bloques de texto reciclados al 90%+ entre categorías (cosa común en sitios con muchas landing pages por servicio).

---

## ✅ Lo que está bien hecho

- **Metadatos únicos por página** (title, meta description, og:image) — confirmado en home, `/cotizar/` y `/pergolas/`.
- **Schema.org `HomeAndConstructionBusiness`** con `@graph` implementado.
- **Sitemap.xml completo** (22 URLs) y `robots.txt` correcto, apuntando al sitemap.
- **Todas las imágenes tienen `alt` descriptivo** en español, relevante para SEO local.
- **Buen copy orientado a conversión**: instrucciones claras de qué información mandar (fotos, medidas, uso, terminación) antes de cotizar — reduce fricción real en el proceso de venta.
- **`/cotizar/` con selector de tipo de proyecto** que arma un mensaje de WhatsApp prellenado — mejor que un simple botón genérico.
- **Botón flotante de WhatsApp** presente en todas las páginas revisadas.
- **Diseño responsive** correcto en el breakpoint móvil probado (390px) — sin overflow horizontal ni elementos rotos.
- **Un solo `<h1>` por página**, jerarquía de encabezados ordenada.
- **Honestidad editorial**: aclara explícitamente que las imágenes son ilustrativas y que no inventa precios/plazos — buena práctica de confianza, poco común en sitios de la competencia.

---

## Prioridad sugerida de arreglos

1. Videos del hero: descargar solo el activo (impacto directo en datos móviles y Core Web Vitals).
2. Investigar el 403 intermitente del challenge anti-bot.
3. `srcset` responsivo en imágenes ilustrativas.
4. Reposicionar el aviso de privacidad para que no tape contenido.
5. Resto de ítems menores, según tiempo disponible.
