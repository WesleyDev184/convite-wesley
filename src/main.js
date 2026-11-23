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
