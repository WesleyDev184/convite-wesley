import gsap from 'gsap';

// Troca de faixa: rótulo "abre", título e corpo sobem. Lado B vira o disco.
export function sections() {
  const restores = [];
  for (const sec of gsap.utils.toArray('.section:not(.hero)')) {
    const label = sec.querySelector('.section-label');
    const rest = sec.querySelectorAll('.divider, .section-title, .section-body, .pick');
    const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 80%' } });
    if (sec.id === 'lado-b') {
      const original = label.textContent;
      label.textContent = 'LADO A';
      tl.from(sec.querySelector('.flip'), { autoAlpha: 0, scale: 0.6, duration: 0.4 })
        .to(sec.querySelector('.flip'), { rotationY: 180, duration: 0.45, ease: 'power2.in' })
        .call(() => { label.textContent = original; })
        .to(sec.querySelector('.flip'), { rotationY: 360, duration: 0.45, ease: 'power2.out' });
      restores.push(() => { label.textContent = original; });
    }
    tl.from(label, { autoAlpha: 0, letterSpacing: '0.9em', duration: 0.6 }, sec.id === 'lado-b' ? '-=0.3' : 0)
      .from(rest, { autoAlpha: 0, y: 24, duration: 0.7, stagger: 0.12 }, '-=0.3');
  }
  return () => restores.forEach((fn) => fn());
}

export function reducedSections() {
  for (const sec of gsap.utils.toArray('.section:not(.hero)')) {
    gsap.from(sec, { autoAlpha: 0, duration: 0.3, scrollTrigger: { trigger: sec, start: 'top 85%' } });
  }
}
