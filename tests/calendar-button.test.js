import { describe, it, expect, beforeEach } from 'vitest';
import { calendarTarget, applyCalendarTarget } from '../src/calendar-button.js';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const IPAD_DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; SM-A546E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36';
const WINDOWS = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

describe('calendarTarget', () => {
  it('iPhone gets the .ics', () => expect(calendarTarget(IPHONE, 5)).toBe('ics'));
  it('iPad reporting a desktop Mac UA (touch) gets the .ics', () => expect(calendarTarget(IPAD_DESKTOP_UA, 5)).toBe('ics'));
  it('a real Mac (no touch) goes to Google, like any computer', () => expect(calendarTarget(IPAD_DESKTOP_UA, 0)).toBe('google'));
  it('Android goes to Google', () => expect(calendarTarget(ANDROID, 5)).toBe('google'));
  it('Windows goes to Google', () => expect(calendarTarget(WINDOWS, 0)).toBe('google'));
});

describe('applyCalendarTarget', () => {
  const GOOGLE = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  beforeEach(() => {
    document.body.innerHTML = `
      <a id="add-calendar" href="${GOOGLE}" target="_blank" rel="noopener">Adicionar à agenda</a>
      <a id="calendar-alt" href="/formatura-wesley.ics">Outro calendário? Baixar arquivo .ics</a>`;
  });

  it('on iOS the main button downloads the .ics and the alternative opens Google', () => {
    applyCalendarTarget('ics');
    const main = document.getElementById('add-calendar');
    const alt = document.getElementById('calendar-alt');
    expect(main.getAttribute('href')).toBe('/formatura-wesley.ics');
    expect(main.hasAttribute('target')).toBe(false);
    expect(alt.getAttribute('href')).toBe(GOOGLE);
    expect(alt.target).toBe('_blank');
    expect(alt.textContent).toBe('Usa Google Agenda? Abrir no Google');
  });

  it('on other devices keeps the prerendered Google default', () => {
    applyCalendarTarget('google');
    expect(document.getElementById('add-calendar').getAttribute('href')).toBe(GOOGLE);
    expect(document.getElementById('calendar-alt').getAttribute('href')).toBe('/formatura-wesley.ics');
  });
});
