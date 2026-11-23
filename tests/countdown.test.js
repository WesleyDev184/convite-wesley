import { describe, it, expect, afterEach } from 'vitest';
import { getCountdown, startCountdown } from '../src/countdown.js';
import { content } from '../src/content.js';

const at = (iso) => getCountdown(new Date(iso), content.event);

describe('getCountdown', () => {
  const originalTz = process.env.TZ;
  afterEach(() => { process.env.TZ = originalTz; });

  it('counts days/hours/minutes before the event', () => {
    expect(at('2026-11-22T12:00:00-03:00')).toEqual({ state: 'before', days: 55, hours: 7, minutes: 0 });
  });

  it('is "today" on the event day before 19h', () => {
    expect(at('2027-01-16T08:00:00-03:00').state).toBe('today');
  });

  it('is "today" during the party', () => {
    expect(at('2027-01-16T23:30:00-03:00').state).toBe('today');
  });

  it('is "after" the next day', () => {
    expect(at('2027-01-17T00:30:00-03:00')).toEqual({ state: 'after', days: 0, hours: 0, minutes: 0 });
  });

  it('decides the day in São Paulo time, not device time', () => {
    process.env.TZ = 'Asia/Tokyo';
    expect(at('2027-01-16T02:00:00Z').state).toBe('before');
  });
});

describe('startCountdown', () => {
  it('renders units before the event and a message on the day', () => {
    const el = document.createElement('div');
    const stop = startCountdown(el, content.event, () => new Date('2026-11-22T12:00:00-03:00'));
    expect([...el.querySelectorAll('.cd-num')].map((n) => n.textContent)).toEqual(['55', '07', '00']);
    stop();
    startCountdown(el, content.event, () => new Date('2027-01-16T10:00:00-03:00'))();
    expect(el.textContent).toBe('É hoje!');
    startCountdown(el, content.event, () => new Date('2027-01-18T10:00:00-03:00'))();
    expect(el.textContent).toBe('Obrigado por fazer parte');
  });
});
