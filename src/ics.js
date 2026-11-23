const toUtc = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escape = (text) => String(text).replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

// shortcut: no RFC 5545 line folding (>75 octets); current fields fit, add folding if texts grow.
export function buildIcs(event, venue) {
  const description = [venue.address, `Mapa: ${venue.mapsUrl}`].filter(Boolean).join('\n');
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
