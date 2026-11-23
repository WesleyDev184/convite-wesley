export function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

const isEmpty = (v) => v == null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);

export function renderPage(content, root = document) {
  const doc = root.ownerDocument ?? root;
  for (const el of root.querySelectorAll('[data-requires]')) {
    el.hidden = isEmpty(getPath(content, el.dataset.requires));
  }
  for (const el of root.querySelectorAll('[data-field]')) {
    const v = getPath(content, el.dataset.field);
    if (!isEmpty(v)) el.textContent = v;
  }
  for (const el of root.querySelectorAll('[data-href]')) {
    const v = getPath(content, el.dataset.href);
    if (!isEmpty(v)) el.href = v;
  }
  for (const list of root.querySelectorAll('[data-list="setlist"]')) {
    list.replaceChildren(...content.setlist.map((track, i) => {
      const li = doc.createElement('li');
      li.className = 'track';
      const add = (cls, text) => {
        const span = doc.createElement('span');
        span.className = cls;
        span.textContent = text;
        li.append(span);
      };
      add('track-num', String(i + 1).padStart(2, '0'));
      add('track-title', track.title);
      if (track.time) add('track-time', track.time);
      return li;
    }));
  }
}
