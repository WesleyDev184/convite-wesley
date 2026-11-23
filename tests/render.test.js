import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderPage } from '../src/render.js';
import { content } from '../src/content.js';

describe('renderPage', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('fills data-field text', () => {
    document.body.innerHTML = '<h1 data-field="name"></h1>';
    renderPage(content);
    expect(document.querySelector('h1').textContent).toBe('Wesley');
  });

  it('sets data-href', () => {
    document.body.innerHTML = '<a data-href="venue.mapsUrl"></a>';
    renderPage(content);
    expect(document.querySelector('a').href).toBe('https://maps.app.goo.gl/Uh7gPGWeX3BZjBfYA');
  });

  it('hides element when required field empty', () => {
    document.body.innerHTML = '<p data-requires="venue.address"><span data-field="venue.address"></span></p>';
    renderPage(content);
    expect(document.querySelector('p').hidden).toBe(true);
  });

  it('keeps element when field present', () => {
    document.body.innerHTML = '<p data-requires="venue.name"></p>';
    renderPage(content);
    expect(document.querySelector('p').hidden).toBe(false);
  });

  it('renders setlist', () => {
    document.body.innerHTML = '<ol data-list="setlist"></ol>';
    renderPage(content);
    const items = document.querySelectorAll('li');
    expect(items).toHaveLength(4);
    expect(items[0].querySelector('.track-num').textContent).toBe('01');
    expect(items[0].querySelector('.track-title').textContent).toBe('Confraternização');
    expect(items[0].querySelector('.track-time').textContent).toBe('19h');
    expect(items[1].querySelector('.track-time')).toBeNull();
  });

  it('index.html has no placeholder text', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    document.documentElement.innerHTML = html.replace(/^<!doctype html>/i, '');
    renderPage(content);
    const text = document.body.textContent;
    for (const bad of ['lorem', 'TODO', 'XX/XX']) expect(text).not.toContain(bad);
    for (const el of document.querySelectorAll('[data-field]')) {
      if (el.closest('[hidden]')) continue;
      expect(el.textContent.trim(), el.dataset.field).not.toBe('');
    }
    for (const id of ['abertura', 'faixa-01', 'faixa-02', 'faixa-03', 'faixa-04', 'lado-b', 'encerramento', 'tally-container', 'countdown', 'add-calendar']) {
      expect(document.getElementById(id), id).not.toBeNull();
    }
  });
});
