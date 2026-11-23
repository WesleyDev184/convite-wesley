import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Abertura: vinil entra girando, braço desce, nome surge letra a letra. Total ≤ 2,5s.
export function intro() {
  gsap.set('.vinyl-disc', { transformOrigin: '50% 50%' });
  const split = SplitText.create('.hero-name', { type: 'chars' });

  const spin = gsap.to('.vinyl-disc', { rotation: '+=360', duration: 8, ease: 'none', repeat: -1, paused: true });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.side-label', { opacity: 0, y: -12, duration: 0.5 }, 0)
    .from('#hero-vinyl', { xPercent: -130, duration: 1.0 }, 0)
    .from('.vinyl-disc', { rotation: -540, duration: 1.2, ease: 'power2.out' }, 0)
    .from('.tonearm-arm', { rotation: -24, svgOrigin: '92 22', duration: 0.6, ease: 'power2.inOut' }, 0.85)
    .from(split.chars, { opacity: 0, yPercent: 60, duration: 0.5, stagger: 0.05 }, 1.1)
    .from(['.hero-course', '.hero-title', '.hero-subtitle', '#abertura .eq', '.hero-date', '.scroll-hint'],
      { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 }, 1.45)
    .add(() => spin.play());

  const st = ScrollTrigger.create({
    trigger: '#abertura',
    onToggle: (self) => (self.isActive && tl.progress() === 1 ? spin.play() : spin.pause()),
  });

  return () => { st.kill(); split.revert(); };
}
