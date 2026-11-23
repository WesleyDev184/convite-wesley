# Convite de formatura — Wesley · The Graduation Tour

Convite digital (uma página) no tema disco de vinil/setlist, com confirmação de presença pelo Tally.

## Editar textos e dados

Tudo fica em **`src/content.js`**: nome, mensagem, data, programação (setlist), local, link do Tally, créditos e textos da prévia do WhatsApp.

- Campo vazio (`''`) esconde a seção correspondente (ex.: sem `venue.address`, o endereço não aparece).
- Antes de publicar, rode `npm run check`: ele lista campos obrigatórios vazios.
- Os títulos das seções ("A trilha sonora", "Setlist", "O palco"…) ficam em `index.html`.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # testes automáticos
npm run build    # gera dist/
npm run preview  # serve o dist/ em http://localhost:4173
```

## Easter eggs

- **Troca aleatória:** a cada 12–25s, a contagem, a data ou o curso mudam por 4s (segundos, binário, cafés, Unix time, dica do código). Os textos ficam em `src/easter/glitch.js` e `content.easter`.
- **Código Konami** (↑ ↑ ↓ ↓ ← → ← → B A): no teclado ou, no celular, tocando 3x no equalizador da Faixa 04 para abrir o controle. Quem acerta ganha o link do **brinde misterioso** no WhatsApp.
- **Dicas:** a troca aleatória às vezes mostra o código; P.S. no encerramento; mensagem no console do navegador.
- **Número do WhatsApp:** vem da variável `VITE_WHATSAPP_NUMBER` (DDI + DDD + número, só dígitos). Localmente fica em `.env.local` (fora do git; modelo em `.env.example`). **Na Vercel:** Project → Settings → Environment Variables → `VITE_WHATSAPP_NUMBER`, e faça um novo deploy. Sem a variável, o prêmio mostra "Mostre esta tela para o Wesley na festa".
- Atenção: num site estático o número entra no JS publicado (some do repositório, mas quem inspecionar o JS do site acha). Para esconder de verdade, seria preciso uma função serverless que redireciona para o WhatsApp.

## Publicar (Vercel)

1. Suba o repositório para o GitHub e importe em https://vercel.com/new (framework: **Vite**, output: `dist`). Ou rode `npx vercel` nesta pasta.
2. Se o endereço final não for `https://convite-wesley.vercel.app`, troque `siteUrl` em `src/content.js` e publique de novo. A imagem da prévia do WhatsApp usa esse endereço.
3. Teste a prévia colando o link em https://www.opengraph.xyz ou numa conversa do WhatsApp.

## Tally

- O form usa tema escuro no Tally + `transparentBackground=1`; a página só desenha uma moldura (`.tally:has(iframe)` em `src/styles/main.css`). Se voltar o form para tema claro, o texto fica ilegível sobre o fundo preto.
- Cor de destaque do form (botão): em Customize, use `#c9464f` (vermelho) ou `#d6b46a` (dourado) para combinar com o convite.
- O botão de envio aparece como **"Submit"**. Para traduzir, abra o form no editor do Tally, clique no botão e escreva, por exemplo, "Confirmar presença".
- Para encerrar as confirmações em 26/12/2026: no Tally, **Settings → Close form → Close on a date**.
- Se o script do Tally falhar (bloqueador, rede ruim), a página mostra o botão "Abrir formulário" no lugar.

## Imagem da prévia (`public/og.png`)

A imagem é gerada a partir de `scripts/og.html`. Para regenerar, abra esse arquivo no navegador numa janela de 1200×630 e capture a tela, salvando por cima de `public/og.png`.

## Estrutura

- `index.html`: marcação e SVGs (vinil, braço, equalizador, ícones).
- `vite.config.js`: injeta os textos de `content.js` e as meta tags no HTML durante o build. A página funciona mesmo sem JS.
- `src/countdown.js` (horário de Brasília) e `src/ics.js` (botão "Adicionar à agenda").
- `src/tally.js`: carrega o form só quando o convidado se aproxima do Lado B.
- `src/motion/`: animações (GSAP + Lenis). Com "reduzir movimento" ativado no celular, ficam só fades.
