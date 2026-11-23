import { describe, it, expect } from 'vitest';
import { buildIcs } from '../src/ics.js';
import { content } from '../src/content.js';

const ics = buildIcs(content.event, content.venue);

describe('buildIcs', () => {
  it('has UTC start and end', () => {
    expect(ics).toContain('DTSTART:20270116T220000Z');
    expect(ics).toContain('DTEND:20270117T030000Z');
  });

  it('has summary and location', () => {
    expect(ics).toContain('SUMMARY:Formatura do Wesley — Ciência da Computação');
    expect(ics).toContain('LOCATION:Loja Maçônica Acácia do Araguaia');
  });

  it('includes the maps link and escapes commas/semicolons', () => {
    const ics2 = buildIcs(content.event, { ...content.venue, name: 'Salão A, Bloco; 2' });
    expect(ics2).toContain('LOCATION:Salão A\\, Bloco\\; 2');
    expect(ics).toMatch(/DESCRIPTION:.*https:\/\/maps\.app\.goo\.gl\/Uh7gPGWeX3BZjBfYA/);
  });

  it('is a well-formed calendar with CRLF lines', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/\n/);
    expect(ics).toMatch(/\r\nUID:.+\r\n/);
    expect(ics).toMatch(/\r\nDTSTAMP:\d{8}T\d{6}Z\r\n/);
  });
});
