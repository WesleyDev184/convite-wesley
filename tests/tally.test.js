import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mountTally } from '../src/tally.js';
import { content } from '../src/content.js';

const urls = { embedUrl: content.rsvp.tallyEmbedUrl, formUrl: content.rsvp.tallyFormUrl };

describe('mountTally', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
    delete window.Tally;
  });

  it('embeds iframe', async () => {
    const loadEmbeds = vi.fn();
    const load = () => { window.Tally = { loadEmbeds }; return Promise.resolve(); };
    const result = await mountTally(container, urls, load);
    const iframe = container.querySelector('iframe');
    expect(iframe.getAttribute('data-tally-src')).toBe(urls.embedUrl);
    expect(iframe.title).toBe('Confirmação de presença');
    expect(iframe.getAttribute('loading')).toBe('lazy');
    expect(iframe.getAttribute('width')).toBe('100%');
    expect(iframe.getAttribute('frameborder')).toBe('0');
    expect(loadEmbeds).toHaveBeenCalledTimes(1);
    expect(result).toBe('embedded');
  });

  it('falls back to a link when the script fails', async () => {
    const result = await mountTally(container, urls, () => Promise.reject(new Error('blocked')));
    const link = container.querySelector('a[href="https://tally.so/r/Qo7JpG"]');
    expect(link.textContent).toBe('Abrir formulário');
    expect(container.querySelector('iframe')).toBeNull();
    expect(result).toBe('fallback');
  });

  it('always offers a link to open in a new tab', async () => {
    const load = () => { window.Tally = { loadEmbeds() {} }; return Promise.resolve(); };
    await mountTally(container, urls, load);
    const help = [...container.querySelectorAll('a')].find((a) => a.textContent.includes('Abrir em nova aba'));
    expect(help.href).toBe(urls.formUrl);
    expect(help.closest('p').textContent).toBe('Problemas com o formulário? Abrir em nova aba');
  });
});
