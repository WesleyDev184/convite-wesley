import { defineConfig } from 'vite';
import { JSDOM } from 'jsdom';
import { content } from './src/content.js';
import { renderPage } from './src/render.js';
import { buildIcs, googleCalendarLink } from './src/ics.js';

const ICS_FILE = 'formatura-wesley.ics';

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Injects OG tags and prerenders content.js into index.html, so the page is readable before/without JS.
function convite() {
  return {
    name: 'convite-content',
    // Static .ics: works in iOS Safari's calendar sheet, in-app browsers and without JS.
    configureServer(server) {
      server.middlewares.use(`/${ICS_FILE}`, (_req, res) => {
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.end(buildIcs(content.event, content.venue));
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: ICS_FILE, source: buildIcs(content.event, content.venue) });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const withMeta = html
          .replaceAll('%OG_TITLE%', escapeAttr(content.og.title))
          .replaceAll('%OG_DESCRIPTION%', escapeAttr(content.og.description))
          .replaceAll('%OG_IMAGE%', escapeAttr(new URL(content.og.image, content.siteUrl).href))
          .replaceAll('%SITE_URL%', escapeAttr(content.siteUrl));
        const dom = new JSDOM(withMeta);
        renderPage(content, dom.window.document);
        dom.window.document.querySelector('#add-calendar').href = googleCalendarLink(content.event, content.venue);
        return dom.serialize();
      },
    },
  };
}

export default defineConfig({
  plugins: [convite()],
  test: { environment: 'jsdom' },
});
