import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Barras em loop leve (pausadas fora da tela); toque dá um pico.
export function equalizer() {
  const cleanups = [];
  for (const eq of gsap.utils.toArray('.eq')) {
    const tweens = gsap.utils.toArray(eq.querySelectorAll('.eq-bar')).map((bar) =>
      gsap.fromTo(bar, { scaleY: 0.25 }, {
        scaleY: 1, transformOrigin: '50% 100%', ease: 'sine.inOut', yoyo: true, repeat: -1,
        duration: gsap.utils.random(0.35, 0.8), delay: gsap.utils.random(0, 0.6),
      }));
    const st = ScrollTrigger.create({
      trigger: eq,
      onToggle: (self) => tweens.forEach((t) => (self.isActive ? t.resume() : t.pause())),
    });
    const peak = () => gsap.fromTo(eq, { scaleY: 1.35 }, { scaleY: 1, transformOrigin: '50% 100%', duration: 0.45, ease: 'power2.out', overwrite: true });
    eq.addEventListener('pointerdown', peak);
    cleanups.push(() => { st.kill(); eq.removeEventListener('pointerdown', peak); });
  }
  return () => cleanups.forEach((fn) => fn());
}
