const SCRIPT_SRC = 'https://tally.so/widgets/embed.js';
let scriptPromise;

export function loadTallyScript() {
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = Object.assign(document.createElement('script'), { src: SCRIPT_SRC, async: true });
    const timer = setTimeout(() => reject(new Error('Tally timeout')), 8000);
    script.onload = () => { clearTimeout(timer); resolve(); };
    script.onerror = () => { clearTimeout(timer); reject(new Error('Tally script failed')); };
    document.head.append(script);
  }).catch((err) => { scriptPromise = undefined; throw err; });
  return scriptPromise;
}

function link(href, text) {
  return Object.assign(document.createElement('a'), { href, textContent: text, target: '_blank', rel: 'noopener' });
}

export async function mountTally(container, { embedUrl, formUrl }, loadScript = loadTallyScript) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('data-tally-src', embedUrl);
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '400');
  iframe.setAttribute('frameborder', '0');
  iframe.title = 'Confirmação de presença';

  const help = document.createElement('p');
  help.className = 'tally-help';
  help.append('Problemas com o formulário? ', link(formUrl, 'Abrir em nova aba'));

  try {
    await loadScript();
    container.replaceChildren(iframe, help);
    window.Tally.loadEmbeds();
    return 'embedded';
  } catch {
    const fallback = document.createElement('p');
    fallback.className = 'tally-fallback';
    const a = link(formUrl, 'Abrir formulário');
    a.className = 'button';
    fallback.append(a);
    container.replaceChildren(fallback);
    return 'fallback';
  }
}
