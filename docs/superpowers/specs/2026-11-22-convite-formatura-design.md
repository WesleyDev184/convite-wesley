# Convite de formatura — Wesley, Ciência da Computação

Data do design: 2026-11-22

## Intenção

Convite digital de formatura do Wesley (Bacharel em Ciência da Computação), em uma página web, enviado por link (principalmente WhatsApp). Serve para dois fins: convidar com estilo e coletar confirmações de presença por um formulário Tally embutido.

Sensação desejada (palavras do Wesley): **elegante com toque de tecnologia, nada muito nerd, com elementos de rock** (ele gosta de rock e frequenta shows). Direção visual escolhida no mockup: **"Vinil / setlist"** — o convite é um disco: vinil girando com o rótulo do curso, programação em formato de lista de faixas, equalizador animado.

## Público

Família (inclusive pessoas mais velhas, pouco familiarizadas com tecnologia) e amigos/colegas de faculdade. A maioria abre no celular, vindo do WhatsApp, muitas vezes em aparelho modesto.

## Objetivos

- Abertura memorável: vinil entra girando, nome e curso aparecem.
- Transições animadas entre seções, como "troca de faixa".
- Informação essencial (data, hora, local, prazo de confirmação) legível de imediato, sem depender de animação.
- Confirmação de presença via Tally embutido, sem barra de rolagem interna.
- Visual escuro, elegante, coeso; elementos gráficos em SVG próprio.

## Não-objetivos

- Backend próprio, banco de dados, painel de convidados (o Tally guarda as respostas).
- Links personalizados por convidado (possível depois via parâmetros de URL; fora do escopo agora).
- Multi-idioma.
- Música tocando (ver "Áudio" — fica fora da v1).

## Anti-objetivos (fracasso mesmo funcionando)

- Parecer "site de nerd": tela de terminal, código verde, matriz, glitch pesado.
- Animação que trava ou demora em celular fraco, ou que esconde data/local atrás de interação.
- Tia/avó não conseguir achar onde confirmar presença.
- Página pesada (vídeo de fundo, muitas fontes, imagens grandes).

## Restrições

- Mobile-first (viewport de referência 360–430px de largura); desktop deve ficar bonito, mas é secundário.
- Respeitar `prefers-reduced-motion`: sem giros/parallax, apenas fades curtos; todo conteúdo visível.
- Hospedagem estática gratuita (Vercel, Netlify ou GitHub Pages — escolha do builder).
- Textos em português do Brasil.
- Pré-visualização do link no WhatsApp: meta tags Open Graph com título, descrição e imagem de capa (1200×630).

## Abordagens consideradas

| Caminho | Prós | Contras |
|---|---|---|
| **A — Vite + HTML/CSS/JS puro + GSAP (ScrollTrigger) + Lenis** (escolhido) | Leve, rápido em celular fraco, SVG inline fácil de animar, padrão dos convites animados pesquisados, hospedagem grátis | Sem componentes (irrelevante para uma página) |
| B — Astro + GSAP | Componentização, conteúdo separado | Estrutura demais para uma página |
| C — React/Next + Framer Motion | Ecossistema grande | 3–4x mais JS, pior em celular fraco, animação de SVG mais trabalhosa |

Descartados: Lottie/After Effects (exige assets de animação inexistentes), Framer/Webflow (pago, fora do controle).

**Escolha:** caminho A. O Wesley delegou a escolha técnica ("use libs e o que for necessário"); a decisão foi minha e ele aprovou seguir.

## Direção visual (decidida no mockup)

- Fundo quase preto (`#08080a`) com brilho radial vinho sutil (`#1a0d10`).
- Cores: marfim `#f3ead7` (texto principal), dourado `#d6b46a` (detalhes nobres, rótulo do vinil), vermelho rock `#c9464f` (acento: equalizador, "LADO A/B").
- Tipografia: **Cormorant Garamond** (serifada elegante, títulos em itálico), **Bebas Neue** (condensada estilo pôster de show, rótulos), **JetBrains Mono** (detalhes técnicos: setlist, horários, contagem). Corpo de texto longo: Cormorant ou Inter (escolha do builder pela legibilidade).
- Tecnologia apenas em detalhes: fonte mono, setlist com pontilhado, números. Nada de terminal.

Referência viva: mockup C em `.superpowers/brainstorm/424511-1795391234/content/direcao-visual.html`.

## Estrutura da página

```
[Abertura]       vinil entra girando, agulha (braço do toca-discos) desce;
                 "LADO A · 2026", nome WESLEY no rótulo, frase de abertura
[Faixa 01]       mensagem (texto 2A)
[Faixa 02]       programação em formato setlist (data, hora, evento)
[Faixa 03]       local + botão "Abrir no Maps"
[Faixa 04]       contagem regressiva estilo display de aparelho de som
[Lado B]         confirmação de presença — chamada + prazo + iframe Tally
[Encerramento]   créditos estilo encarte de disco (texto 4A)
```

Navegação: rolagem vertical normal (com Lenis para suavizar). Nada de "clique para avançar" obrigatório.

## Motion

- **Abertura:** vinil desliza/gira para o centro, agulha desce até o disco, rótulo e nome aparecem (letra a letra ou fade). Duração total ≤ 2,5s; conteúdo legível mesmo se a animação não rodar.
- **Persistente:** após a abertura, um vinil pequeno fica fixo em um canto girando; a posição da agulha sobre ele acompanha o progresso da rolagem (barra de progresso temática).
- **Troca de faixa:** cada seção entra com animação via ScrollTrigger (fade + deslocamento, revelação do título "Faixa 0X"). Variações por seção ficam a critério do builder, mantendo coesão.
- **Equalizador:** barras animadas em loop leve; reagem a toque/clique (pico momentâneo).
- **Lado B:** transição marcada de "virar o disco" ao chegar na confirmação.
- `prefers-reduced-motion`: sem giro, sem parallax, sem Lenis; só fades.

## Elementos SVG (feitos pelo builder)

Vinil (sulcos, reflexo, rótulo), braço/agulha do toca-discos, equalizador, palheta de guitarra, ornamentos/divisores, ícones (calendário, relógio, pin de mapa). Inline no HTML para animar com GSAP.

Assets que **podem** ser pedidos ao Wesley (opcionais; a página deve funcionar sem eles): foto dele (capa/encarte), logo da faculdade.

## Conteúdo

Todo texto e dado do evento fica em um único arquivo `content.js` (objeto exportado), lido pela página. Editar conteúdo não exige mexer em HTML/CSS.

| Campo | Valor |
|---|---|
| Nome | Wesley |
| Curso | Bacharel em Ciência da Computação |
| Data / hora | 16/01/2027, 19h (confirmado pelo Wesley) |
| Prazo de confirmação | 26/12/2026 |
| Local | Loja Maçônica Acácia do Araguaia — Maps: `https://maps.app.goo.gl/Uh7gPGWeX3BZjBfYA` (sem endereço por extenso; a página mostra o nome + botão "Abrir no Maps") |
| Programação | Evento único: confraternização às 19h, com churrasco, bar e música. Setlist (decisão minha): `01 · Confraternização ..... 19h`, `02 · Churrasco`, `03 · Bar`, `04 · Música` — itens sem horário próprio; o setlist aceita N itens |
| Tally | `https://tally.so/embed/Qo7JpG?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1` |

Textos escolhidos:

- **Abertura (1A):** *The Graduation Tour* — o último show da turnê
- **Mensagem (2A):** "Foram anos de noites em claro, provas, código que não compilava e café que não acabava. Nada disso teria sido possível sem as pessoas que estiveram ao meu lado. Agora chegou a hora de celebrar, e eu quero você comigo."
- **Chamada da confirmação:** Confirme sua presença — abaixo: "Confirme até 26/12/2026"
- **Encerramento:** "Obrigado por fazer parte dessa conquista. Nos vemos lá!"
- **Revisão 2026-11-22 (Wesley):** música só no estilo visual; textos sem metáfora musical (exceto a abertura). Títulos: "Até aqui", "Cronograma", "Local".

## Integração Tally

- Usar o script oficial `https://tally.so/widgets/embed.js` com `iframe data-tally-src="<url>"` e chamar `Tally.loadEmbeds()` após carregar (padrão das docs: https://developers.tally.so/widgets/embeds).
- `dynamicHeight=1` já está na URL: o iframe se ajusta ao conteúdo, sem rolagem interna.
- `transparentBackground=1`: o formulário herda o fundo escuro da página. O tema de cores do formulário (texto claro) é configurado **no painel do Tally** pelo Wesley — o builder deve verificar contraste e, se o texto do form ficar escuro sobre fundo escuro, dar ao container um fundo claro/cartão ou orientar o Wesley a ajustar o tema no Tally.
- O widget repassa parâmetros da URL da página para campos ocultos do form (útil no futuro para links personalizados; nada a fazer agora).
- Carregamento preguiçoso: o iframe não deve atrasar a abertura.
- Fallback: se o script falhar, mostrar link "Abrir formulário" para `https://tally.so/r/Qo7JpG`.

## Áudio

Fora da v1. Se o Wesley quiser depois: botão ▶ opcional, nunca autoplay, arquivo fornecido por ele (atenção a direitos autorais).

## Decidido pelo Wesley

- Estilo: elegante + toque de tecnologia + rock, nada nerd.
- Direção visual C (vinil/setlist).
- Estrutura de seções e motion propostos (aprovou "está ótimo, pode seguir").
- Textos 1A, 2A, 3A, 4A.
- Data 16/01/2027 às 19h, confirmação até 26/12/2026; link do Tally.
- Local: Loja Maçônica Acácia do Araguaia (link do Maps); evento único: confraternização com churrasco, bar e música.

## Decidido por mim (corrigível)

- Caminho técnico A (Vite + JS puro + GSAP + Lenis).
- Programação em 4 faixas sem horário próprio além das 19h.
- Conteúdo centralizado em `content.js`.
- Paleta e fontes do mockup C.
- Áudio fora da v1.

## Regras definidas na revisão (decisão minha, corrigível)

- **Vinil fixo no canto:** pequeno (~44px), canto superior direito, sem cobrir texto; some (fade) durante o Lado B/formulário e volta no encerramento.
- **Contraste do Tally:** o builder abre o form real durante a construção e confere. Se o texto do form ficar escuro, o Wesley troca o tema para escuro no painel do Tally (instrução passo a passo no README). Fallback de código: container em cartão levemente mais claro.
- **Campos vazios no `content.js`:** seção/botão correspondente não aparece (ex.: sem local → Faixa 03 oculta). Nunca exibir texto de exemplo que pareça real. Script `npm run check` lista campos vazios antes do deploy.
- **Fuso:** America/Sao_Paulo (-03:00) para contagem e .ics.
- **Contagem após a data:** no dia mostra "É hoje!"; depois, "Obrigado por fazer parte" (sem números negativos).
- **Após o prazo (26/12/2026):** página não muda; o encerramento do form é configurado no próprio Tally (opção "Close form" por data), se o Wesley quiser.
- **Domínio:** subdomínio gratuito do host (ex.: `*.vercel.app`); `og:image` com URL absoluta vinda de uma única constante, trocável se houver domínio próprio.
- **Desempenho:** orçamento ~300 KB transferidos na primeira carga (fontes em subset/self-hosted, woff2); rotação do vinil via CSS/transform; Lenis não suaviza toque (comportamento padrão); sulcos do vinil em poucos círculos.

## Deixado ao builder

- Hospedagem (Vercel/Netlify/GitHub Pages) e configuração de deploy.
- Coreografia exata de cada animação, mantendo as regras de duração/legibilidade acima.
- Desenho final dos SVGs.
- Imagem Open Graph (gerar a partir do vinil/rótulo em SVG → PNG).
- Calendário: botão "Adicionar à agenda" (arquivo .ics) é bem-vindo se for barato.
