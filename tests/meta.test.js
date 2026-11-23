// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest';
import { build } from 'vite';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let html;
let outDirPath;

beforeAll(async () => {
  const outDir = mkdtempSync(join(tmpdir(), 'convite-build-'));
  await build({ root: process.cwd(), logLevel: 'silent', build: { outDir, emptyOutDir: true } });
  outDirPath = outDir;
  html = readFileSync(join(outDir, 'index.html'), 'utf8');
}, 60_000);

const meta = (attr, key) => html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1];

describe('built index.html', () => {
  it('has absolute og:image and og tags for WhatsApp', () => {
    expect(meta('property', 'og:image')).toBe('https://convite-wesley.vercel.app/og.png');
    expect(meta('property', 'og:title')).toBe('Wesley · The Graduation Tour');
    expect(meta('property', 'og:description')).toBe('Você está convidado para a formatura em Ciência da Computação — 16/01/2027, 19h.');
    expect(meta('property', 'og:image:width')).toBe('1200');
    expect(meta('property', 'og:image:height')).toBe('630');
    expect(meta('property', 'og:locale')).toBe('pt_BR');
    expect(meta('name', 'twitter:card')).toBe('summary_large_image');
    expect(meta('name', 'theme-color')).toBe('#08080a');
    expect(html).toContain('<html lang="pt-BR">');
    expect(html).not.toMatch(/%OG_[A-Z]+%/);
  });

  it('has the content prerendered (readable without JS)', () => {
    expect(html).toContain('Loja Maçônica Acácia do Araguaia');
    expect(html).toContain('Foram anos de noites em claro');
    expect(html).toMatch(/<span class="track-title">Confraternização<\/span>/);
    expect(html).toContain('href="https://maps.app.goo.gl/Uh7gPGWeX3BZjBfYA"');
  });


  it('links a stylesheet (CSS works without JS)', () => {
    expect(html).toMatch(/<link rel="stylesheet"[^>]*href="\/assets\/[^"]+\.css"/);
  });

  it('shows the RSVP link before Tally loads (outside noscript)', () => {
    const container = html.match(/<div id="tally-container"[^>]*>([\s\S]*?)<\/div>/)[1];
    const outside = container.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
    expect(outside).toMatch(/href="https:\/\/tally\.so\/r\/Qo7JpG"[^>]*>Abrir formulário/);
  });

  it('serves a static .ics and links it from the calendar button', () => {
    const ics = readFileSync(join(outDirPath, 'formatura-wesley.ics'), 'utf8');
    expect(ics).toContain('DTSTART:20270116T220000Z');
    expect(html).toMatch(/<a id="calendar-alt"[^>]*href="\/formatura-wesley\.ics"/);
  });

  it('the single calendar button defaults to Google Calendar (no JS / desktop / Android)', () => {
    expect(html).toMatch(/<a id="add-calendar"[^>]*href="https:\/\/calendar\.google\.com\/calendar\/render\?action=TEMPLATE[^"]*dates=20270116T220000Z\/20270117T030000Z/);
  });
});
