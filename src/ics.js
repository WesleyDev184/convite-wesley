const toUtc = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escape = (text) => String(text).replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

// shortcut: no RFC 5545 line folding (>75 octets); current fields fit, add folding if texts grow.
const describe = (venue) => [venue.address, `Mapa: ${venue.mapsUrl}`].filter(Boolean).join('\n');

export function buildIcs(event, venue) {
  const description = describe(venue);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//convite-wesley//PT-BR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${toUtc(new Date(event.start))}-formatura-wesley@convite`,
    `DTSTAMP:${toUtc(new Date())}`,
    `DTSTART:${toUtc(new Date(event.start))}`,
    `DTEND:${toUtc(new Date(event.end))}`,
    `SUMMARY:${escape(event.title)}`,
    `LOCATION:${escape(venue.name)}`,
    `DESCRIPTION:${escape(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

export function googleCalendarLink(event, venue) {
  const q = (v) => encodeURIComponent(v);
  const dates = `${toUtc(new Date(event.start))}/${toUtc(new Date(event.end))}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${q(event.title)}&dates=${dates}`
    + `&location=${q(venue.name)}&details=${q(describe(venue))}`;
}
