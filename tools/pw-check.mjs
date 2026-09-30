#!/usr/bin/env node
// Playwright render check of every sitemap page at 1366x800 and 390x844.
// Serves the repo with `npx http-server -p 8080 -s -c-1 .` (started here if
// port 8080 is free). Uses the preinstalled Chromium (PLAYWRIGHT_BROWSERS_PATH).
// Reports console errors, failed requests, broken images, horizontal overflow,
// LCP element/time, bytes by type, third-party requests, sticky bar/FAB
// visibility and tap targets under 44px. Screenshots → audit-shots/.
// Usage: node tools/pw-check.mjs [--strict] [--only=/cocinas/,/cotizar/] [--out=audit-shots/pw.json]
//   --strict: exit 1 on console errors, failed requests, broken images,
//             overflow or any third-party request.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { chromium } from 'playwright';
import { REPO_ROOT, sitemapPaths } from './lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const PORT = 8080;
const BASE = `http://127.0.0.1:${PORT}`;
const shots = path.join(REPO_ROOT, 'audit-shots');
fs.mkdirSync(shots, { recursive: true });

const portFree = () => new Promise((res) => { const s = net.createServer().once('error', () => res(false)).once('listening', () => s.close(() => res(true))).listen(PORT, '127.0.0.1'); });
let server = null;
if (await portFree()) {
  server = spawn('npx', ['--yes', 'http-server', '-p', String(PORT), '-a', '127.0.0.1', '-s', '-c-1', '.'], { cwd: REPO_ROOT, stdio: 'ignore' });
  for (let i = 0; i < 50; i++) { await new Promise((r) => setTimeout(r, 200)); if (!(await portFree())) break; }
}

let paths = [...await sitemapPaths(REPO_ROOT), '/404.html'];
if (args.only) paths = args.only.split(',');
const viewports = [{ name: 'desktop', width: 1366, height: 800, dpr: 1 }, { name: 'mobile', width: 390, height: 844, dpr: 2 }];

const browser = await chromium.launch();
const results = [];
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, isMobile: vp.name === 'mobile', hasTouch: vp.name === 'mobile' });
  for (const p of paths) {
    const page = await ctx.newPage();
    const consoleErrors = []; const failed = []; const thirdParty = new Set(); const bytes = {};
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => failed.push({ url: r.url(), err: r.failure()?.errorText }));
    page.on('request', (r) => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname) && u.protocol.startsWith('http')) thirdParty.add(u.hostname); });
    page.on('response', async (r) => {
      if (r.status() >= 400 && !(p === '/404.html' && r.url().endsWith('/404.html'))) failed.push({ url: r.url(), status: r.status() });
      const t = r.request().resourceType();
      const len = Number(r.headers()['content-length'] || 0) || (await r.body().catch(() => Buffer.alloc(0))).length;
      bytes[t] = (bytes[t] || 0) + len;
    });
    await page.addInitScript(() => {
      window.__lcp = null;
      try {
        new PerformanceObserver((l) => { const e = l.getEntries().at(-1); window.__lcp = { t: Math.round(e.startTime), el: e.element ? `${e.element.tagName}${e.element.className ? `.${String(e.element.className).split(' ')[0]}` : ''}${e.url ? ` ${e.url}` : ''}` : null, size: e.size }; }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (_) { /* no LCP support */ }
    });
    let status = 0;
    try {
      const resp = await page.goto(`${BASE}${p}`, { waitUntil: 'load', timeout: 20000 });
      status = resp?.status() || 0;
    } catch (e) { consoleErrors.push(`goto: ${e.message.split('\n')[0]}`); }
    await page.waitForTimeout(400);
    const info = await page.evaluate(() => {
      const vis = (el) => { if (!el) return null; const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0.05 && r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight; };
      const small = [];
      document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary').forEach((el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || r.width === 0 || r.height === 0) return;
        if (el.closest('.mega-menu,.mobile-panel:not(.is-open)')) return;
        if (el.matches('p a, li p a, .faq-item p a')) return; // inline text links are exempt (WCAG 2.5.8)
        if (r.height < 44 || r.width < 44) small.push(`${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).split(' ')[0]}` : ''} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24)}"`);
      });
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map((i) => i.currentSrc || i.src),
        lcp: window.__lcp,
        stickyTop: { fab: vis(document.querySelector('.whatsapp-fab')), bar: vis(document.querySelector('.mobile-bar')), privacy: vis(document.querySelector('.privacy-note')) },
        smallTapTargets: small,
      };
    });
    await page.screenshot({ path: path.join(shots, `${(p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home')}-${vp.name}.png`) });
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, document.documentElement.scrollHeight); });
    await page.waitForTimeout(500);
    const stickyBottom = await page.evaluate(() => {
      const vis = (el) => { if (!el) return null; const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0.05 && r.width > 0 && r.bottom > 0 && r.top < innerHeight; };
      const bar = document.querySelector('.mobile-bar');
      const foot = document.querySelector('.site-footer');
      let coversFooter = false;
      if (bar && foot && vis(bar)) { const b = bar.getBoundingClientRect(); const lastLine = foot.querySelector('.footer-bottom')?.getBoundingClientRect(); coversFooter = !!lastLine && lastLine.bottom > b.top + 1; }
      return { fab: vis(document.querySelector('.whatsapp-fab')), bar: vis(bar), coversFooter };
    });
    await page.close();
    results.push({ path: p, viewport: vp.name, status, consoleErrors, failedRequests: failed, thirdParty: [...thirdParty], bytesByType: bytes, ...info, stickyBottom });
  }
  await ctx.close();
}
await browser.close();
if (server) server.kill();

const out = args.out || path.join(shots, 'pw.json');
fs.writeFileSync(out, JSON.stringify(results, null, 2));
const sum = (k) => results.filter((r) => (Array.isArray(r[k]) ? r[k].length : r[k] > 0)).length;
const tp = [...new Set(results.flatMap((r) => r.thirdParty))];
console.log(`pw-check: ${results.length} renders (${paths.length} pages × 2) → ${path.relative(REPO_ROOT, out)}`);
console.log(`  renders with console errors: ${sum('consoleErrors')}, failed requests: ${sum('failedRequests')}, broken images: ${sum('brokenImages')}, overflow>0: ${results.filter((r) => r.overflow > 0).length}`);
console.log(`  third-party hosts: ${tp.join(', ') || 'none'}`);
const mob = results.filter((r) => r.viewport === 'mobile');
console.log(`  mobile: FAB visible on load ${mob.filter((r) => r.stickyTop.fab).length}/${mob.length}, bar visible on load ${mob.filter((r) => r.stickyTop.bar).length}, bar visible at bottom ${mob.filter((r) => r.stickyBottom.bar).length}, bar covers footer ${mob.filter((r) => r.stickyBottom.coversFooter).length}, privacy overlay on load ${results.filter((r) => r.stickyTop.privacy).length}/${results.length}`);
console.log(`  LCP: ${results.map((r) => `${r.path}[${r.viewport[0]}] ${r.lcp?.t ?? '-'}ms ${r.lcp?.el ?? '-'}`).filter((_, i) => i < 4).join(' | ')} …`);
console.log(`  max small tap targets per render: ${Math.max(...results.map((r) => r.smallTapTargets.length))}`);
const totals = {}; results.filter((r) => r.path === '/').forEach((r) => { totals[r.viewport] = r.bytesByType; });
console.log(`  home bytes by type: ${JSON.stringify(totals)}`);
const bad = results.filter((r) => r.consoleErrors.length || r.failedRequests.length || r.brokenImages.length || r.overflow > 0 || r.thirdParty.length);
if (bad.length) console.log(`  problems:\n    ${bad.slice(0, 12).map((r) => `${r.path} ${r.viewport}: ${[...r.consoleErrors, ...r.failedRequests.map((f) => `${f.status || f.err} ${f.url}`), ...r.brokenImages.map((b) => `broken ${b}`), r.overflow > 0 ? `overflow ${r.overflow}px` : '', ...r.thirdParty.map((h) => `3p ${h}`)].filter(Boolean).slice(0, 4).join('; ')}`).join('\n    ')}`);
if (args.strict && bad.length) process.exit(1);
