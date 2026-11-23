import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { intro } from './intro.js';
import { sections, reducedSections } from './sections.js';
import { player } from './player.js';
import { equalizer } from './equalizer.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initMotion({ reduceMotion }) {
  const root = document.documentElement;
  root.classList.add('motion');
  root.classList.toggle('motion-reduced', reduceMotion);

  const cleanups = [];
  const ctx = gsap.context(() => {});
  try {
    ctx.add(() => {
      if (reduceMotion) {
        reducedSections();
        gsap.set('#mini-player', { autoAlpha: 0 });
        return;
      }
      cleanups.push(intro());
      cleanups.push(sections());
      cleanups.push(player());
      cleanups.push(equalizer());
    });
  } catch (err) {
    // Animation must never hide content: undo everything and leave the page static.
    cleanups.forEach((fn) => fn?.());
    ctx.revert();
    root.classList.remove('motion', 'motion-reduced');
    console.error(err);
    return { lenis: null, destroy() {} };
  }

  let lenis = null;
  let raf;
  if (!reduceMotion) {
    lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
  }

  // Tally iframe grows after load: recalc trigger positions when the page height changes.
  let resizeObserver;
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
    resizeObserver.observe(document.querySelector('main'));
  }

  return {
    lenis,
    destroy() {
      resizeObserver?.disconnect();
      cleanups.forEach((fn) => fn?.());
      ctx.revert();
      if (lenis) {
        gsap.ticker.remove(raf);
        lenis.destroy();
      }
      root.classList.remove('motion', 'motion-reduced');
    },
  };
}
