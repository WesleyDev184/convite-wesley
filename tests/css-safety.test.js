import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

it('content is only hidden under .motion (visible without JS)', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/styles/main.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const offenders = [];
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/(^|[;\s{])opacity:\s*0(?![.\d])|visibility:\s*hidden/.test(body)) continue;
    const ok = selector.split(',').every((s) => s.trim().startsWith('.motion') || s.trim() === '[hidden]');
    if (!ok) offenders.push(selector.trim());
  }
  expect(offenders).toEqual([]);
});
