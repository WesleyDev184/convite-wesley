# Convite de Formatura (Vinil/Setlist) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Página única, escura e animada, que convida para a formatura do Wesley no tema "disco de vinil/setlist" e coleta confirmações via Tally embutido.

**Architecture:** Site estático Vite, JS puro. `index.html` tem toda a marcação com ganchos `data-field`/`data-requires`; `src/render.js` preenche a partir de `src/content.js` (única fonte de texto/dados) e oculta seções sem dado. Módulos pequenos e testáveis (contagem, .ics, Tally, checagem de conteúdo); animação isolada em `src/motion/`, ativada só por JS (sem JS o conteúdo fica visível).

**Tech Stack:** Vite 8, GSAP 3.15 (ScrollTrigger, SplitText — gratuitos no pacote npm), Lenis 1.3, Fontsource (Cormorant Garamond, Bebas Neue, JetBrains Mono), Vitest 5 + jsdom. Node 24.

**Spec:** `docs/superpowers/specs/2026-11-22-convite-formatura-design.md` (ler junto; mockup de referência em `.superpowers/brainstorm/424511-1795391234/content/direcao-visual.html`, opção C).

## Global Constraints

- Textos em pt-BR, exatamente como no `content.js` desta tarefa 1 (copiados do spec).
- Mobile-first: referência 360–430px; sem rolagem horizontal até 320px.
- Paleta: fundo `#08080a`, brilho vinho `#1a0d10`, marfim `#f3ead7`, dourado `#d6b46a`, vermelho `#c9464f`.
- Fontes: Cormorant Garamond (títulos, itálico), Bebas Neue (rótulos), JetBrains Mono (detalhes). Só subset `latin`, woff2 via Fontsource.
- Orçamento: HTML+CSS+JS+fontes da primeira carga ≤ 300 KB gzip (exclui `og.png` e o iframe do Tally).
- Conteúdo nunca depende de animação: estados ocultos iniciais só existem sob a classe `.motion` no `<html>`, adicionada por JS.
- `prefers-reduced-motion: reduce` → sem giro, parallax nem Lenis; só fades ≤ 0,3s.
- Fuso do evento: `America/Sao_Paulo`. Evento: 2027-01-16 19:00 (-03:00) até 2027-01-17 00:00 (-03:00) (fim é decisão minha para o .ics).
- Nada de estética "terminal/hacker": sem tela de console, verde-matriz, glitch.
- Sem áudio, sem backend.
- Commits: o diretório não é repositório git. Passos "Commit" só valem se o Wesley autorizar `git init`; caso contrário, pular.

## Review Focus

1. Convidado com celular em outro fuso (parente fora do país) → "É hoje!"/contagem calculados no horário de Brasília. Teste na Task 3.
2. Script do Tally bloqueado ou lento (bloqueador, rede ruim) → link "Abrir formulário" visível. Teste na Task 4.
3. JS falha ou animação não roda → todo o texto visível. Teste de CSS na Task 5.
4. Tela de 320px ou fonte do sistema aumentada (público mais velho) → sem rolagem horizontal, vinil fixo não cobre texto/form. Verificação na Task 2 e Task 5.
5. `prefers-reduced-motion` ativo → nenhum Lenis/giro criado. Teste na Task 5.

---

### Task 1: Scaffold, conteúdo e renderização

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `.gitignore`
- Create: `src/content.js`, `src/render.js`, `src/main.js`, `src/styles/main.css` (só reset + variáveis + fontes nesta task)
- Create: `scripts/check-content.js`
- Test: `tests/render.test.js`, `tests/check-content.test.js`

**Interfaces:**
- Produces:
  - `export const content` em `src/content.js` (schema abaixo).
  - `renderPage(content, root = document) -> void` em `src/render.js`: para cada `[data-field="a.b"]` define `textContent` com o valor do caminho; para `[data-href="a.b"]` define `href`; remove (`hidden = true`) todo elemento `[data-requires="a.b"]` cujo valor seja vazio/ausente; renderiza `content.setlist` em `[data-list="setlist"]` como `<li>` com `.track-num` (`01`, `02`…), `.track-title`, `.track-time` (omitido se sem `time`).
  - `getPath(obj, path: string) -> any` em `src/render.js`.
  - `findEmptyFields(content, required: string[]) -> string[]` em `scripts/check-content.js`, mais CLI: `npm run check` imprime os caminhos vazios e sai com código 1 se houver algum.
  - Seções no `index.html` com ids: `#abertura`, `#faixa-01`, `#faixa-02`, `#faixa-03`, `#faixa-04`, `#lado-b`, `#encerramento`. Container do form: `#tally-container`. Contagem: `#countdown`. Botão agenda: `#add-calendar`.

- [ ] **Step 1: Scaffold.** `npm init -y`; `npm i gsap@^3.15.1 lenis@^1.3.27 @fontsource/cormorant-garamond @fontsource/bebas-neue @fontsource/jetbrains-mono`; `npm i -D vite@^8 vitest@^5 jsdom`. Scripts: `dev: vite`, `build: vite build`, `preview: vite preview`, `test: vitest run`, `check: node scripts/check-content.js`. `"type": "module"`. Vitest `environment: 'jsdom'` em `vite.config.js`. `.gitignore`: `node_modules`, `dist`, `.superpowers/`.

- [ ] **Step 2: Criar `src/content.js` com este conteúdo exato:**

```js
export const content = {
  siteUrl: 'https://convite-wesley.vercel.app', // trocar se o domínio mudar
  name: 'Wesley',
  course: 'Bacharel em Ciência da Computação',
  tagline: { title: 'The Graduation Tour', subtitle: 'o último show da turnê' },
  message:
    'Foram anos de noites em claro, provas, código que não compilava e café que não acabava. Cada pessoa que esteve ao meu lado tocou uma parte dessa música. Agora a última faixa chegou, e eu quero você na plateia.',
  event: {
    title: 'Formatura do Wesley — Ciência da Computação',
    start: '2027-01-16T19:00:00-03:00',
    end: '2027-01-17T00:00:00-03:00',
    timeZone: 'America/Sao_Paulo',
    dateLabel: '16 · JAN · 2027',
    timeLabel: '19h',
  },
  setlist: [
    { title: 'Confraternização', time: '19h' },
    { title: 'Churrasco' },
    { title: 'Bar' },
    { title: 'Música' },
  ],
  venue: {
    name: 'Loja Maçônica Acácia do Araguaia',
    address: '',
    mapsUrl: 'https://maps.app.goo.gl/Uh7gPGWeX3BZjBfYA',
  },
  rsvp: {
    title: 'Garanta seu lugar no show',
    deadlineLabel: 'Confirme até 26/12/2026',
    tallyEmbedUrl:
      'https://tally.so/embed/Qo7JpG?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
    tallyFormUrl: 'https://tally.so/r/Qo7JpG',
  },
  credits:
    'Produzido por anos de estudo. Mixado com a ajuda de vocês. Obrigado por fazerem parte da trilha sonora.',
  og: {
    title: 'Wesley · The Graduation Tour',
    description: 'Você está convidado para a formatura em Ciência da Computação — 16/01/2027, 19h.',
    image: '/og.png',
  },
};

export const REQUIRED_FIELDS = [
  'name', 'course', 'message', 'event.start', 'event.dateLabel', 'event.timeLabel',
  'venue.name', 'venue.mapsUrl', 'rsvp.tallyEmbedUrl', 'rsvp.tallyFormUrl', 'siteUrl',
];
```

- [ ] **Step 3: Escrever testes que falham** em `tests/render.test.js`:
  - `fills data-field text`: HTML `<h1 data-field="name"></h1>` → após `renderPage`, `textContent === 'Wesley'`.
  - `sets data-href`: `<a data-href="venue.mapsUrl">` → `href === 'https://maps.app.goo.gl/Uh7gPGWeX3BZjBfYA'`.
  - `hides element when required field empty`: `<p data-requires="venue.address"><span data-field="venue.address"></span></p>` → `hidden === true`.
  - `keeps element when field present`: `data-requires="venue.name"` → `hidden === false`.
  - `renders setlist`: 4 `<li>`; primeiro tem `.track-num` `'01'`, `.track-title` `'Confraternização'`, `.track-time` `'19h'`; segundo não tem `.track-time`.
  - `index.html has no placeholder text`: carregar `index.html` real (fs) em jsdom, rodar `renderPage(content)`, assert que `document.body.textContent` não contém `lorem`, `TODO`, `XX/XX` e que todo `[data-field]` visível tem texto não vazio.

  E `tests/check-content.test.js`:
  - `findEmptyFields(content, REQUIRED_FIELDS)` → `[]`.
  - com `{ ...content, venue: { ...content.venue, mapsUrl: '' } }` → `['venue.mapsUrl']`.
  - campo ausente (`name` deletado) conta como vazio.

- [ ] **Step 4:** `npm test` → FAIL (módulos inexistentes).

- [ ] **Step 5: Implementar** `render.js`, `check-content.js` e `index.html` (estrutura semântica das 7 seções, cada `<section>` com rótulo "FAIXA 0X"/"LADO B"; Faixa 03 tem `data-requires="venue.name"` e botão `<a data-href="venue.mapsUrl" target="_blank" rel="noopener">Abrir no Maps</a>`; `#lado-b` contém `[data-field="rsvp.title"]`, `[data-field="rsvp.deadlineLabel"]`, `#tally-container`). `main.js` importa CSS e fontes (`@fontsource/<família>/latin-<peso>.css`, pesos: Cormorant 500/700 + 500-italic, Bebas 400, JetBrains 400/600) e chama `renderPage(content)`.

- [ ] **Step 6:** `npm test` → PASS. `npm run check` → sai 0, sem saída de campos vazios.

- [ ] **Step 7: Commit** `feat: scaffold, content and render`.

---

### Task 2: Arte SVG e layout estático

**Files:**
- Create: `src/svg/vinyl.svg`, `src/svg/tonearm.svg`, `src/svg/equalizer.svg`, `src/svg/pick.svg`, `src/svg/divider.svg`, `src/svg/icons.svg` (calendário, relógio, pin — `<symbol>`s)
- Modify: `index.html` (incluir SVGs inline), `src/styles/main.css`
- Test: verificação visual (sem teste automatizado; é arte/CSS)

**Interfaces:**
- Produces (seletores que a Task 5 anima — manter exatos):
  - `#hero-vinyl` (svg do vinil grande), dentro dele `.vinyl-disc` (grupo que gira, `transform-origin: 50% 50%`), `.vinyl-label`.
  - `#hero-tonearm` (braço; pivô no topo direito, classe `.tonearm-arm` é o grupo que rotaciona).
  - `#mini-player` (vinil pequeno fixo ~44px, canto superior direito, `position: fixed`, `top/right: 12px`), dentro `.mini-disc` e `.mini-needle`.
  - `.eq` com `.eq-bar` (9 barras) — usado no hero e no `#faixa-04`.
  - `.section-label` (texto "FAIXA 0X"), `.section-title`, `.section-body` em cada seção.
  - `#lado-b .flip` (elemento para a transição "virar o disco").

- [ ] **Step 1: Desenhar SVGs** seguindo o mockup C: vinil com ≤ 6 círculos de sulco, reflexo em arco, rótulo dourado com `WESLEY` (Bebas) e `CIÊNCIA DA COMPUTAÇÃO` (mono); palheta de guitarra para o encerramento; divisor ornamental fino em dourado. Sem `<image>` raster.

- [ ] **Step 2: CSS estático completo** (mobile-first): fundo com radial vinho, tipografia do Global Constraints, setlist em mono com pontilhado entre título e hora (`.track-title` flex + `::after` com `border-bottom: dotted`), contagem como display de aparelho de som (dígitos mono em caixas), botões (Maps, agenda) com borda dourada e área de toque ≥ 44px. Nenhuma regra com `opacity: 0`/`visibility: hidden` fora de `.motion ...`.

- [ ] **Step 3: Verificar** com `npm run dev` no navegador (skill `run`/claude-in-chrome) em 390×844 e 320×640: comparar com mockup C; rodar no console `document.documentElement.scrollWidth <= innerWidth` → `true` nas duas larguras; `#mini-player` não sobrepõe títulos. Aumentar fonte raiz para 125% (`document.documentElement.style.fontSize='125%'`) e repetir o check de overflow.

- [ ] **Step 4: Commit** `feat: svg art and static layout`.

---

### Task 3: Contagem regressiva e "Adicionar à agenda"

**Files:**
- Create: `src/countdown.js`, `src/ics.js`
- Modify: `src/main.js`
- Test: `tests/countdown.test.js`, `tests/ics.test.js`

**Interfaces:**
- Consumes: `content.event` (Task 1); `#countdown`, `#add-calendar` (Task 1).
- Produces:
  - `getCountdown(now: Date, event: {start, timeZone}) -> { state: 'before'|'today'|'after', days, hours, minutes }` (números só em `before`; nos outros, 0).
  - `startCountdown(el: HTMLElement, event, now = () => new Date()) -> () => void` (atualiza a cada 30s; retorna função de parar). Textos: `today` → "É hoje!", `after` → "Obrigado por fazer parte".
  - `buildIcs(event, venue) -> string`; `downloadIcs(icsText, filename = 'formatura-wesley.ics') -> void` (Blob `text/calendar;charset=utf-8` + `<a download>`).

- [ ] **Step 1: Testes que falham** `tests/countdown.test.js`:
  - `2026-11-22T12:00:00-03:00` → `{ state: 'before', days: 55, hours: 7, minutes: 0 }`.
  - `2027-01-16T08:00:00-03:00` → `state: 'today'` (mesmo dia em SP, antes das 19h).
  - `2027-01-16T23:30:00-03:00` → `'today'`.
  - `2027-01-17T00:30:00-03:00` → `'after'`.
  - **fuso:** `2027-01-16T02:00:00Z` (= 15/01 23h em SP) → `'before'`, mesmo com `process.env.TZ='Asia/Tokyo'` (o "dia" é decidido em `America/Sao_Paulo` via `Intl.DateTimeFormat('en-CA', { timeZone })`).

  `tests/ics.test.js`:
  - contém `DTSTART:20270116T220000Z` e `DTEND:20270117T030000Z`.
  - contém `SUMMARY:Formatura do Wesley — Ciência da Computação` e `LOCATION:Loja Maçônica Acácia do Araguaia`.
  - `DESCRIPTION` inclui o link do Maps; vírgulas/ponto-e-vírgula escapados (`\,` `\;`).
  - linhas separadas por `\r\n`; começa com `BEGIN:VCALENDAR`, termina com `END:VCALENDAR\r\n`; tem `UID` e `DTSTAMP`.

- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Implementar** os dois módulos; ligar em `main.js` (`startCountdown(document.querySelector('#countdown'), content.event)`; clique em `#add-calendar` → `downloadIcs(buildIcs(content.event, content.venue))`).
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: countdown and calendar export`.

---

### Task 4: Integração Tally

**Files:**
- Create: `src/tally.js`
- Modify: `src/main.js`, `src/styles/main.css`
- Test: `tests/tally.test.js`

**Interfaces:**
- Consumes: `content.rsvp` (Task 1); `#tally-container` (Task 1).
- Produces: `mountTally(container: HTMLElement, { embedUrl, formUrl }, loadScript = loadTallyScript) -> Promise<'embedded'|'fallback'>`; `loadTallyScript() -> Promise<void>` (injeta `https://tally.so/widgets/embed.js` uma vez; rejeita em `onerror` ou após 8s).

- [ ] **Step 1: Testes que falham:**
  - `embeds iframe`: com `loadScript` fake que resolve e define `window.Tally = { loadEmbeds: vi.fn() }` → container tem `iframe[data-tally-src="<embedUrl>"]` com `title="Confirmação de presença"`, `loading="lazy"`, `width="100%"`, `frameborder="0"`; `loadEmbeds` chamado 1x; retorno `'embedded'`.
  - `fallback on script failure`: `loadScript` rejeita → container contém `a[href="https://tally.so/r/Qo7JpG"]` com texto "Abrir formulário"; retorno `'fallback'`.
  - `link always present`: mesmo no caso `embedded`, existe link discreto "Problemas com o formulário? Abrir em nova aba" para `formUrl`.

- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Implementar.** Em `main.js`, montar só quando `#lado-b` se aproxima (`IntersectionObserver`, `rootMargin: '800px'`), para não atrasar a abertura.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Verificar no navegador** (390×844): o form aparece sem barra de rolagem interna; enviar não é necessário. **Conferir contraste**: se o texto do form ficar escuro sobre o fundo, registrar no README (Task 6) o passo "Tally → Design → tema escuro / cor de texto clara" e aplicar o fallback CSS: `#tally-container` com fundo `#f3ead7` e borda arredondada. Relatar ao Wesley qual caso ocorreu.
- [ ] **Step 6: Commit** `feat: tally rsvp embed with fallback`.

---

### Task 5: Motion

**Files:**
- Create: `src/motion/index.js`, `src/motion/intro.js`, `src/motion/sections.js`, `src/motion/player.js`, `src/motion/equalizer.js`
- Modify: `src/main.js`, `src/styles/main.css`
- Test: `tests/motion.test.js`, `tests/css-safety.test.js`

**Interfaces:**
- Consumes: seletores da Task 2.
- Produces: `initMotion({ reduceMotion: boolean }) -> { lenis: Lenis|null, destroy: () => void }` em `src/motion/index.js`. Adiciona classe `motion` ao `<html>` ao iniciar. `main.js` chama com `reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches` e usa `gsap.matchMedia()` para reagir a mudanças.

- [ ] **Step 1: Testes que falham:**
  - `tests/motion.test.js` (carregar `index.html` real no jsdom; stub de `window.matchMedia` e `IntersectionObserver`, que o jsdom não tem): `initMotion({ reduceMotion: true })` → `lenis === null` e nenhum elemento `.vinyl-disc` com animação de rotação ativa (`gsap.getTweensOf('.vinyl-disc').length === 0`); `initMotion({ reduceMotion: false })` → `lenis` instância de `Lenis`; `<html>` tem classe `motion` nos dois casos; `destroy()` remove a classe.
  - `tests/css-safety.test.js`: lê `src/styles/main.css`; para todo bloco cujo corpo tem `opacity:\s*0[;\s}]` ou `visibility:\s*hidden`, o seletor começa com `.motion` (ou é `[hidden]`).

- [ ] **Step 2:** `npm test` → FAIL.

- [ ] **Step 3: Implementar.** Regras (do spec; coreografia fina é do implementador):
  - Imports: `import gsap from 'gsap'`, `import ScrollTrigger from 'gsap/ScrollTrigger'`, `import { SplitText } from 'gsap/SplitText'` (conferir o caminho em `node_modules/gsap`), `import Lenis from 'lenis'`, `import 'lenis/dist/lenis.css'`.
  - Lenis ↔ ScrollTrigger: `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t * 1000))` (guardar a função para remover no `destroy`); `gsap.ticker.lagSmoothing(0)`.
  - **intro.js:** vinil desliza e gira para o centro, `.tonearm-arm` desce até o disco, rótulo + nome (SplitText por letra) aparecem; total ≤ 2,5s; depois `.vinyl-disc` gira em loop (`rotation: 360, repeat: -1, ease: 'none', duration: 8`).
  - **sections.js:** por seção, ScrollTrigger `start: 'top 80%'`: `.section-label` revela, `.section-title`/`.section-body` fade + `y: 24`. Em `#lado-b`: `.flip` faz `rotationY` 0→180→360 com `perspective` ("virar o disco") e o rótulo muda "LADO A" → "LADO B".
  - **player.js:** `#mini-player` aparece quando `#abertura` sai da tela; `.mini-disc` gira; `.mini-needle` rotaciona de 0° a 25° conforme progresso total da página (`scrub: true`); **some** (autoAlpha 0) enquanto `#lado-b` está na viewport e volta em `#encerramento`.
  - **equalizer.js:** `.eq-bar` loop `scaleY` 0.25↔1 com delays aleatórios; `pointerdown` em `.eq` → pico rápido em todas as barras.
  - `reduceMotion: true`: sem Lenis, sem giro/loop, sem SplitText; seções só `autoAlpha` 0→1 em 0,3s.

- [ ] **Step 4:** `npm test` → PASS.

- [ ] **Step 5: Verificar no navegador** em 390×844: abertura completa em ≤ 2,5s; ao rolar, mini-player aparece, agulha avança e some no Lado B; nada cobre texto do form. Gravar GIF (`abertura_convite.gif`). Em 320×640 repetir o check de overflow da Task 2. Desabilitar JS (ou bloquear `main.js`) → todo texto visível.

- [ ] **Step 6: Commit** `feat: motion — intro, track transitions, mini player, equalizer`.

---

### Task 6: Pré-visualização WhatsApp, build, README e deploy

**Files:**
- Modify: `vite.config.js` (plugin `transformIndexHtml`), `index.html` (`<head>`)
- Create: `public/og.svg` (fonte), `public/og.png` (1200×630), `public/favicon.svg` (vinil simplificado), `README.md`
- Test: `tests/meta.test.js`

**Interfaces:**
- Consumes: `content.og`, `content.siteUrl`.
- Produces: `index.html` buildado com `<title>`, `meta description`, `og:title`, `og:description`, `og:image` (URL **absoluta** `siteUrl + og.image`), `og:image:width=1200`, `og:image:height=630`, `og:type=website`, `og:locale=pt_BR`, `twitter:card=summary_large_image`, `theme-color=#08080a`, `lang="pt-BR"`.

- [ ] **Step 1: Teste que falha** `tests/meta.test.js`: rodar o build (`await build()` da API do Vite, `outDir` temporário) e ler o `index.html` gerado: `og:image` === `https://convite-wesley.vercel.app/og.png`; `og:title` === `Wesley · The Graduation Tour`; `<html lang="pt-BR">`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Implementar** o plugin (importa `content` e substitui marcadores `%OG_TITLE%`, `%OG_DESCRIPTION%`, `%OG_IMAGE%` no `<head>`). Criar `og.svg` com vinil + "Wesley · The Graduation Tour" + data, e rasterizar para `og.png` com a ferramenta disponível (`rsvg-convert` ou `npx sharp-cli`), PNG ≤ 300 KB.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Orçamento:** `npm run build` e então
  `find dist -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.woff2' \) -exec cat {} + | gzip -c | wc -c` → **< 300000**. (woff2 já é comprimido; valor é aproximação conservadora.)
- [ ] **Step 6: README.md** (pt-BR, para o Wesley): como editar textos em `src/content.js`; `npm run check` antes de publicar; `npm run dev`/`build`; deploy na Vercel (importar repo ou `npx vercel` — framework Vite, output `dist`); trocar `siteUrl` se mudar domínio; como fechar o form por data no Tally; nota de contraste do Tally (resultado da Task 4); testar a prévia do link colando no WhatsApp/`https://www.opengraph.xyz`.
- [ ] **Step 7: Verificação final:** `npm test` (tudo PASS), `npm run check` (0 vazios), `npm run preview` + navegador em 390×844 percorrendo a página inteira até o form.
- [ ] **Step 8: Commit** `feat: og meta, readme and deploy setup`.

Deploy em si (publicar URL) só com OK do Wesley.
