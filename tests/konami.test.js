import { describe, it, expect, vi } from 'vitest';
import { createKonami, keyFromEvent } from '../src/easter/konami.js';

const CODE = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

describe('createKonami', () => {
  it('fires once the full code is entered', () => {
    const onSuccess = vi.fn();
    const k = createKonami(onSuccess);
    CODE.forEach((key) => k.press(key));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('does not fire on a wrong sequence', () => {
    const onSuccess = vi.fn();
    const k = createKonami(onSuccess);
    ['up', 'down', 'up', 'down', 'left', 'right', 'left', 'right', 'b', 'a'].forEach((key) => k.press(key));
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('tolerates extra keys before the code (e.g. three ups)', () => {
    const onSuccess = vi.fn();
    const k = createKonami(onSuccess);
    ['a', 'up', ...CODE].forEach((key) => k.press(key));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

describe('keyFromEvent', () => {
  it('maps arrows and B/A keys, ignores others', () => {
    expect(keyFromEvent({ key: 'ArrowUp' })).toBe('up');
    expect(keyFromEvent({ key: 'ArrowLeft' })).toBe('left');
    expect(keyFromEvent({ key: 'B' })).toBe('b');
    expect(keyFromEvent({ key: 'a' })).toBe('a');
    expect(keyFromEvent({ key: 'x' })).toBeNull();
  });
});
