import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-700.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/bebas-neue/latin-400.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-600.css';
import './styles/main.css';
import { content } from './content.js';
import { renderPage } from './render.js';

renderPage(content);
import { startCountdown } from './countdown.js';
import { buildIcs, downloadIcs } from './ics.js';

startCountdown(document.querySelector('#countdown'), content.event);
document.querySelector('#add-calendar').addEventListener('click', () => downloadIcs(buildIcs(content.event, content.venue)));
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
