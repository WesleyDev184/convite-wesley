// iPhone/iPad open .ics straight into Apple Calendar; everything else (Android, PC, Mac) uses Google Calendar.
export function calendarTarget(userAgent, maxTouchPoints = 0) {
  const ios = /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && maxTouchPoints > 1);
  return ios ? 'ics' : 'google';
}

// The page is prerendered with Google as the default; on iOS swap the main button and the alternative link.
export function applyCalendarTarget(target, root = document) {
  if (target !== 'ics') return;
  const main = root.getElementById('add-calendar');
  const alt = root.getElementById('calendar-alt');
  const google = main.getAttribute('href');
  main.setAttribute('href', alt.getAttribute('href'));
  main.removeAttribute('target');
  main.removeAttribute('rel');
  alt.setAttribute('href', google);
  alt.target = '_blank';
  alt.rel = 'noopener';
  alt.textContent = 'Usa Google Agenda? Abrir no Google';
}
