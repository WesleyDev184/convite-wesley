import { defineConfig } from 'vite';
import { JSDOM } from 'jsdom';
import { content } from './src/content.js';
import { renderPage } from './src/render.js';

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Injects OG tags and prerenders content.js into index.html, so the page is readable before/without JS.
function convite() {
  return {
    name: 'convite-content',
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
        return dom.serialize();
      },
    },
  };
}

export default defineConfig({
  plugins: [convite()],
  test: { environment: 'jsdom' },
});
