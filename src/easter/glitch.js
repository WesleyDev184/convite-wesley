const nf = new Intl.NumberFormat('pt-BR');

export function countdownVariants(c) {
  if (c.state !== 'before') return [];
  const seconds = ((c.days * 24 + c.hours) * 60 + c.minutes) * 60;
  return [
    `${nf.format(seconds)} segundos`,
    `${c.days.toString(2)} dias (em binário)`,
    `≈ ${nf.format(c.days * 3)} cafés até a festa`,
    '↑↑↓↓←→←→BA',
  ];
}

// Visually swaps the text for a while; the original stays in the accessibility tree.
export function swapText(el, text, duration) {
  const alt = document.createElement('span');
  alt.className = 'glitch-alt';
  alt.setAttribute('aria-hidden', 'true');
  alt.textContent = text;
  el.classList.add('glitch-hidden');
  el.after(alt);
  setTimeout(() => {
    alt.remove();
    el.classList.remove('glitch-hidden');
  }, duration);
}

const inViewport = (el) => {
  const r = el.getBoundingClientRect();
  return r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
};

export function startGlitch(targets, { rand = Math.random, isVisible = inViewport, duration = 4000 } = {}) {
  let timer;
  const schedule = () => {
    timer = setTimeout(tick, 12_000 + Math.floor(rand() * 13_000));
  };
  const tick = () => {
    const ready = targets
      .filter((t) => !t.el.classList.contains('glitch-hidden') && isVisible(t.el))
      .map((t) => ({ el: t.el, options: t.variants() }))
      .filter((t) => t.options.length);
    if (ready.length && !document.hidden) {
      const target = ready[Math.floor(rand() * ready.length)];
      swapText(target.el, target.options[Math.floor(rand() * target.options.length)], duration);
    }
    schedule();
  };
  schedule();
  return () => clearTimeout(timer);
}
