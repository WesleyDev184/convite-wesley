import { pathToFileURL } from 'node:url';
import { getPath } from '../src/render.js';

export function findEmptyFields(content, required) {
  return required.filter((path) => {
    const v = getPath(content, path);
    return v == null || String(v).trim() === '';
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { content, REQUIRED_FIELDS } = await import('../src/content.js');
  const empty = findEmptyFields(content, REQUIRED_FIELDS);
  if (empty.length) {
    console.error('Campos vazios em src/content.js:\n' + empty.map((p) => `  - ${p}`).join('\n'));
    process.exit(1);
  }
  console.log('Conteúdo completo.');
}
