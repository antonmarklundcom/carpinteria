// Quote builder for /cotizar/. Builds a WhatsApp message from the form using
// the texts in window.WA_CONFIG (generated from data/whatsapp.json). Nothing
// is stored or sent to a server: the visitor reviews the message in WhatsApp.
// Without JS the form still submits to wa.me with a generic hidden text.
(() => {
  const cfg = window.WA_CONFIG;
  const form = document.querySelector('#quote-form');
  if (!cfg || !form) return;
  const t = cfg.form.templates;
  const types = cfg.form.types;
  const MAX = 1200;
  const $ = (id) => document.getElementById(id);
  const tipo = $('f-tipo');
  const zona = $('f-zona');
  const ciudad = $('f-ciudad');
  const ciudadField = $('f-ciudad-field');
  const barrio = $('f-barrio');
  const medidas = $('f-medidas');
  const plazo = $('f-plazo');
  const detalles = $('f-detalles');
  const hints = $('f-hints');
  const obraNote = $('f-obra');
  const preview = $('f-preview');
  const error = $('f-error');

  const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  const clean = (s) => s.replace(/\s+/g, ' ').trim();

  const zoneLine = () => {
    const b = clean(barrio.value);
    if (zona.value === 'otra') {
      const c = clean(ciudad.value);
      return c ? fill(t.zone_out, { ciudad: c }) : t.zone_unknown;
    }
    if (!zona.value) return t.zone_unknown;
    return fill(t.zone_in, { barrio: b ? `Barrio ${b}, ` : '', ciudad: zona.value });
  };

  const build = () => {
    const type = types[tipo.value] || types.otro;
    const head = [];
    if (type.obra) head.push(t.obra_prefix);
    head.push(fill(t.opening, { phrase: type.phrase }));
    head.push(zoneLine());
    if (medidas.value === 'si') head.push(t.medidas_si);
    if (medidas.value === 'no') head.push(t.medidas_no);
    if (plazo.value && t.plazo[plazo.value]) head.push(t.plazo[plazo.value]);
    const tail = type.closing;
    let det = clean(detalles.value);
    const base = [...head, tail].join('\n').length + 12;
    if (det.length > MAX - base) det = `${det.slice(0, Math.max(0, MAX - base - 1))}…`;
    return [...head, det ? fill(t.detalles, { detalles: det }) : '', tail].filter(Boolean).join('\n');
  };

  const syncType = () => {
    const type = types[tipo.value];
    detalles.placeholder = type?.placeholder || 'Contanos qué querés hacer, medidas aproximadas y cualquier detalle útil.';
    hints.replaceChildren(...(type?.hints || []).map((h) => Object.assign(document.createElement('li'), { textContent: h })));
    hints.hidden = !type;
    obraNote.hidden = !type?.obra;
    if (typeof type?.obra === 'string') obraNote.querySelector('a').href = type.obra;
  };

  const syncZone = () => {
    const other = zona.value === 'otra';
    ciudadField.hidden = !other;
    ciudad.required = other;
  };

  const render = () => { preview.textContent = build(); };

  const params = new URLSearchParams(location.search);
  const pre = params.get('servicio');
  if (pre && types[pre]) tipo.value = pre;

  tipo.addEventListener('change', () => { syncType(); render(); error.hidden = true; });
  zona.addEventListener('change', () => { syncZone(); render(); });
  [ciudad, barrio, detalles].forEach((el) => el.addEventListener('input', render));
  [medidas, plazo].forEach((el) => el.addEventListener('change', render));
  detalles.maxLength = MAX;
  syncType(); syncZone(); render();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!tipo.value) { error.hidden = false; tipo.focus(); return; }
    if (zona.value === 'otra' && !clean(ciudad.value)) { ciudad.focus(); return; }
    const url = `https://wa.me/${cfg.number}?text=${encodeURIComponent(build())}`;
    const mobile = window.matchMedia('(pointer: coarse)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (mobile) window.location.href = url;
    else window.open(url, '_blank', 'noopener');
  });
})();
