import { describe, it, expect, beforeEach } from 'vitest';
import { whatsappLink, setupEasterEggs } from '../src/easter/reward.js';

const MSG = 'Desbloqueei o código secreto do convite! Quero meu brinde misterioso 🎁';

describe('whatsappLink', () => {
  it('builds a wa.me link with the encoded message', () => {
    expect(whatsappLink('5511900000000', MSG)).toBe(`https://wa.me/5511900000000?text=${encodeURIComponent(MSG)}`);
  });

  it('strips non-digits and returns null without a number', () => {
    expect(whatsappLink('+55 (11) 90000-0000', 'oi')).toBe('https://wa.me/5511900000000?text=oi');
    expect(whatsappLink('', 'oi')).toBeNull();
    expect(whatsappLink(undefined, 'oi')).toBeNull();
  });
});

describe('setupEasterEggs', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="faixa-04"><svg class="eq"></svg></section>
      <div id="gamepad" hidden>
        <button data-key="up"></button><button data-key="down"></button><button data-key="left"></button>
        <button data-key="right"></button><button data-key="b"></button><button data-key="a"></button>
        <button data-close></button>
      </div>
      <dialog id="reward"><a id="reward-link" hidden></a><p id="reward-fallback" hidden></p></dialog>`;
    HTMLDialogElement.prototype.showModal ??= function () { this.open = true; };
  });

  const tapEq = (n) => { for (let i = 0; i < n; i++) document.querySelector('#faixa-04 .eq').dispatchEvent(new Event('pointerdown')); };
  const press = (keys) => keys.forEach((k) => document.querySelector(`#gamepad [data-key="${k}"]`).click());
  const CODE = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

  it('three taps on the equalizer open the gamepad', () => {
    setupEasterEggs({ number: '5511900000000', message: MSG });
    tapEq(2);
    expect(document.getElementById('gamepad').hidden).toBe(true);
    tapEq(1);
    expect(document.getElementById('gamepad').hidden).toBe(false);
  });

  it('the code on the gamepad opens the reward with the WhatsApp link', () => {
    setupEasterEggs({ number: '5511900000000', message: MSG });
    tapEq(3);
    press(CODE);
    const link = document.getElementById('reward-link');
    expect(document.getElementById('reward').open).toBe(true);
    expect(link.hidden).toBe(false);
    expect(link.href).toBe(whatsappLink('5511900000000', MSG));
    expect(document.getElementById('gamepad').hidden).toBe(true);
  });

  it('keyboard code works too', () => {
    setupEasterEggs({ number: '5511900000000', message: MSG });
    const keys = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    keys.forEach((key) => document.dispatchEvent(new KeyboardEvent('keydown', { key })));
    expect(document.getElementById('reward').open).toBe(true);
  });

  it('without a number shows the fallback text instead of a link', () => {
    setupEasterEggs({ number: '', message: MSG });
    tapEq(3);
    press(CODE);
    expect(document.getElementById('reward-link').hidden).toBe(true);
    expect(document.getElementById('reward-fallback').hidden).toBe(false);
  });
});
