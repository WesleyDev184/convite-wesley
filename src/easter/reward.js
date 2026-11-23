import { createKonami, keyFromEvent } from './konami.js';

export function whatsappLink(number, message) {
  const digits = String(number ?? '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}

export function setupEasterEggs({ number, message }) {
  const gamepad = document.getElementById('gamepad');
  const reward = document.getElementById('reward');
  const link = document.getElementById('reward-link');
  const fallback = document.getElementById('reward-fallback');

  const unlock = () => {
    gamepad.hidden = true;
    const href = whatsappLink(number, message);
    link.hidden = !href;
    fallback.hidden = Boolean(href);
    if (href) link.href = href;
    reward.showModal();
  };
  const konami = createKonami(unlock);

  const onKey = (e) => {
    const key = keyFromEvent(e);
    if (key) konami.press(key);
    if (e.key === 'Escape') gamepad.hidden = true;
  };
  document.addEventListener('keydown', onKey);

  // Mobile: 3 quick taps on the Faixa 04 equalizer reveal the gamepad.
  const eq = document.querySelector('#faixa-04 .eq');
  let taps = 0;
  let last = 0;
  const onTap = () => {
    const now = Date.now();
    taps = now - last < 2000 ? taps + 1 : 1;
    last = now;
    if (taps >= 3) {
      taps = 0;
      gamepad.hidden = false;
    }
  };
  eq?.addEventListener('pointerdown', onTap);

  const onPad = (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-close')) gamepad.hidden = true;
    else if (button.dataset.key) konami.press(button.dataset.key);
  };
  gamepad.addEventListener('click', onPad);

  return () => {
    document.removeEventListener('keydown', onKey);
    eq?.removeEventListener('pointerdown', onTap);
    gamepad.removeEventListener('click', onPad);
  };
}
