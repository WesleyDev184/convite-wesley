import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Mini vinil fixo: aparece depois da abertura, agulha acompanha a rolagem, some no Lado B (formulário).
export function player() {
  const el = document.querySelector('#mini-player');
  gsap.set(el, { autoAlpha: 0 });
  const spin = gsap.to('.mini-disc', { rotation: 360, svgOrigin: '32 32', duration: 4, ease: 'none', repeat: -1, paused: true });
  const show = (visible) => {
    gsap.to(el, { autoAlpha: visible ? 1 : 0, duration: 0.3, overwrite: true });
    visible ? spin.play() : spin.pause();
  };

  const triggers = [
    ScrollTrigger.create({
      trigger: '#abertura', start: 'bottom top+=80',
      endTrigger: '#lado-b', end: 'top bottom',
      onToggle: (self) => show(self.isActive),
    }),
    ScrollTrigger.create({ trigger: '#encerramento', start: 'top center', end: 'bottom top', onToggle: (self) => show(self.isActive) }),
  ];
  gsap.fromTo('.mini-needle', { rotation: 0 }, {
    rotation: 25, svgOrigin: '58 4', ease: 'none',
    scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: true },
  });

  return () => triggers.forEach((t) => t.kill());
}
