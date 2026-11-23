import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

class NoopObserver { observe() {} unobserve() {} disconnect() {} }

beforeAll(() => {
  window.matchMedia ??= (query) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  window.IntersectionObserver ??= NoopObserver;
  window.ResizeObserver ??= NoopObserver;
  globalThis.ResizeObserver ??= NoopObserver;
});

let initMotion, gsap, Lenis, motion;

beforeEach(async () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  document.documentElement.innerHTML = html.replace(/^<!doctype html>/i, '');
  document.documentElement.className = '';
  ({ initMotion } = await import('../src/motion/index.js'));
  ({ default: gsap } = await import('gsap'));
  ({ default: Lenis } = await import('lenis'));
});

afterEach(() => { motion?.destroy(); motion = undefined; });

describe('initMotion', () => {
  it('reduced motion: no Lenis and no spinning vinyl', () => {
    motion = initMotion({ reduceMotion: true });
    expect(motion.lenis).toBeNull();
    expect(gsap.getTweensOf('.vinyl-disc')).toHaveLength(0);
    expect(document.documentElement.classList.contains('motion')).toBe(true);
  });

  it('full motion: creates Lenis', () => {
    motion = initMotion({ reduceMotion: false });
    expect(motion.lenis).toBeInstanceOf(Lenis);
    expect(document.documentElement.classList.contains('motion')).toBe(true);
  });

  it('destroy removes the motion class', () => {
    motion = initMotion({ reduceMotion: false });
    motion.destroy();
    motion = undefined;
    expect(document.documentElement.classList.contains('motion')).toBe(false);
  });

  it('if setup throws, nothing stays hidden and the motion class is removed', async () => {
    const { SplitText } = await import('gsap/SplitText');
    const spy = vi.spyOn(SplitText, 'create').mockImplementation(() => { throw new Error('boom'); });
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    motion = initMotion({ reduceMotion: false });
    spy.mockRestore();
    errSpy.mockRestore();
    expect(document.documentElement.classList.contains('motion')).toBe(false);
    const hidden = [...document.querySelectorAll('[style]')].filter((el) => /opacity:\s*0|visibility:\s*hidden/.test(el.getAttribute('style')));
    expect(hidden.map((el) => el.id || el.className)).toEqual([]);
  });
});
