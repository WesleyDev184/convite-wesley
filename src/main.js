import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-700.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/bebas-neue/latin-400.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-600.css';
import './styles/main.css';
import { content } from './content.js';
// Content is prerendered into index.html by the Vite plugin (vite.config.js).
import { startCountdown, getCountdown } from './countdown.js';
import { startGlitch, countdownVariants } from './easter/glitch.js';
import { setupEasterEggs } from './easter/reward.js';

startCountdown(document.querySelector('#countdown'), content.event);
import { mountTally } from './tally.js';

const tallyContainer = document.querySelector('#tally-container');
const tallyObserver = new IntersectionObserver((entries) => {
  if (!entries.some((e) => e.isIntersecting)) return;
  tallyObserver.disconnect();
  mountTally(tallyContainer, { embedUrl: content.rsvp.tallyEmbedUrl, formUrl: content.rsvp.tallyFormUrl });
}, { rootMargin: '800px' });
tallyObserver.observe(document.querySelector('#lado-b'));
import { initMotion } from './motion/index.js';

const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
let motion = initMotion({ reduceMotion: reducedQuery.matches });
reducedQuery.addEventListener('change', (e) => {
  motion.destroy();
  motion = initMotion({ reduceMotion: e.matches });
});

// Easter eggs
startGlitch([
  { el: document.querySelector('#countdown'), variants: () => countdownVariants(getCountdown(new Date(), content.event)) },
  { el: document.querySelector('.hero-date'), variants: () => [`${Date.parse(content.event.start) / 1000} (Unix time)`] },
  { el: document.querySelector('.hero-course'), variants: () => [content.easter.familyCourse] },
]);
// Number comes from VITE_WHATSAPP_NUMBER (.env.local / Vercel env), kept out of the repo.
setupEasterEggs({ number: import.meta.env.VITE_WHATSAPP_NUMBER, message: content.easter.whatsappMessage });
console.log(
  '%cOi, dev! 👋%c\nSe você abriu o console, já sabe o caminho: ↑ ↑ ↓ ↓ ← → ← → B A\n(no celular: toque 3x no equalizador da Faixa 04)',
  'font: 600 16px monospace; color: #d6b46a',
  'font: 13px monospace; color: #f3ead7',
);
