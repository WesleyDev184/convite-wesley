import { describe, it, expect, vi, afterEach } from 'vitest';
import { countdownVariants, swapText, startGlitch } from '../src/easter/glitch.js';

afterEach(() => vi.useRealTimers());

describe('countdownVariants', () => {
  it('builds seconds, binary, coffee and the konami hint before the event', () => {
    expect(countdownVariants({ state: 'before', days: 55, hours: 7, minutes: 0 })).toEqual([
      '4.777.200 segundos',
      '110111 dias (em binário)',
      '≈ 165 cafés até a festa',
      '↑↑↓↓←→←→BA',
    ]);
  });

  it('has nothing to swap on or after the day', () => {
    expect(countdownVariants({ state: 'today', days: 0, hours: 0, minutes: 0 })).toEqual([]);
    expect(countdownVariants({ state: 'after', days: 0, hours: 0, minutes: 0 })).toEqual([]);
  });
});

describe('swapText', () => {
  it('shows an aria-hidden alternative and keeps the original for screen readers, then restores', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<p id="t">original</p>';
    const el = document.getElementById('t');
    swapText(el, 'trocado', 4000);
    const alt = el.nextElementSibling;
    expect(alt.textContent).toBe('trocado');
    expect(alt.getAttribute('aria-hidden')).toBe('true');
    expect(el.classList.contains('glitch-hidden')).toBe(true);
    expect(el.textContent).toBe('original');
    vi.advanceTimersByTime(4000);
    expect(el.nextElementSibling).toBeNull();
    expect(el.classList.contains('glitch-hidden')).toBe(false);
  });
});

describe('startGlitch', () => {
  it('waits a random 12–25s, swaps one visible target for 4s, and repeats', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<p id="a">A</p><p id="b">B</p>';
    const targets = [
      { el: document.getElementById('a'), variants: () => ['A!'] },
      { el: document.getElementById('b'), variants: () => ['B!'] },
    ];
    const stop = startGlitch(targets, { rand: () => 0, isVisible: (el) => el.id === 'b' });
    vi.advanceTimersByTime(11_999);
    expect(document.querySelector('.glitch-alt')).toBeNull();
    vi.advanceTimersByTime(1);
    expect(document.querySelector('.glitch-alt').textContent).toBe('B!');
    vi.advanceTimersByTime(4000);
    expect(document.querySelector('.glitch-alt')).toBeNull();
    vi.advanceTimersByTime(8000); // next swap 12s after the previous one started
    expect(document.querySelector('.glitch-alt').textContent).toBe('B!');
    stop();
    vi.advanceTimersByTime(60_000);
    expect(document.querySelectorAll('.glitch-alt')).toHaveLength(0);
  });

  it('skips when no target is visible or has variants', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<p id="a">A</p>';
    startGlitch([{ el: document.getElementById('a'), variants: () => [] }], { rand: () => 0, isVisible: () => true });
    vi.advanceTimersByTime(30_000);
    expect(document.querySelector('.glitch-alt')).toBeNull();
  });
});
