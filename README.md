# MARK ASSISTÊNCIA — site oficial

Site da MARK ASSISTÊNCIA, assistência de celulares na Vila Yolanda, em Osasco (SP).
Projeto desenvolvido pela E.F Solutions.

- **Stack:** React 19 · TypeScript (strict) · Vite 8 · styled-components 6 · React Router 8
- **Renderização:** todas as rotas são pré-renderizadas em HTML estático no build e hidratadas no navegador
  (SEO, prévias de link no WhatsApp/Instagram e LCP rápido, sem servidor).
- **Bibliotecas:** Motion (animações), Lenis (rolagem suave da roda do mouse no desktop), lucide-react (ícones),
  React Hook Form + Zod (formulário). Nenhum script de terceiros é carregado.

## Como executar

Requer Node.js 22.22 ou superior (exigência do React Router 8; veja `.nvmrc`).

```bash
npm install
npm run dev        # servidor de desenvolvimento (renderização no cliente)
npm run build      # typecheck + build do cliente + build SSR + pré-renderização
npm run preview    # serve o build de produção com os cabeçalhos de segurança reais
npm test           # testes (Vitest)
npm run lint       # ESLint (TypeScript estrito + acessibilidade + hooks)
```

## Estrutura

```
assets/                  originais do cliente (nunca alterados)
config/                  cabeçalhos de segurança (fonte única) + teste de sincronia
public/                  ícones, manifest e imagem Open Graph (gerados)
scripts/
  process-media.mjs      pipeline de mídia (sharp + ffmpeg opcional)
  prerender.mjs          gera um HTML por rota, 404.html, sitemap.xml e robots.txt
src/
  app/                   providers compartilhados (cliente e pré-renderização)
  assets/media/          imagens/vídeo otimizados + manifest.json (gerados)
  components/
    common/              ações de contato, âncoras internas
    layout/              cabeçalho, menu, rodapé, layout raiz, erros
    motion/              primitivas de animação (Reveal, TextReveal, Magnetic, Parallax…)
    sections/            seções por página e seções compartilhadas
    ui/                  botões, tipografia, imagens responsivas, campos
  config/                fatos verificados do negócio, SEO por página, URL do site
  content/               TODO o texto do site (revisão de conformidade em um só lugar)
  data/                  serviços e avaliações (citações literais)
  hooks/ lib/ routes/ styles/ theme/
  entry-client.tsx       hidratação (ou renderização no cliente, quando necessário)
  entry-server.tsx       renderização de uma rota para HTML (usado no build)
```

## Onde editar o conteúdo

| O quê                                                   | Arquivo                  |
| ------------------------------------------------------- | ------------------------ |
| Telefone, endereço, horário, CNPJ, Instagram, destaques | `src/config/business.ts` |
| Títulos e descrições (SEO) de cada página               | `src/config/seo.ts`      |
| Textos das páginas, botões e mensagens do WhatsApp      | `src/content/*.ts`       |
| Serviços                                                | `src/data/services.ts`   |
| Preços (valores de referência e mensagens do WhatsApp)  | `src/data/pricing.ts`    |
| Produtos (nome, descrição, preço, foto)                 | `src/data/products.ts`   |
| Avaliações (capturas e citações literais)               | `src/data/feedback.ts`   |
| Política de privacidade e termos                        | `src/content/legal.ts`   |

Regra do projeto: só entra no site o que foi informado pelo cliente ou está visível nos materiais dele.
Os dias da semana de funcionamento, por exemplo, não foram informados — por isso não aparecem.

## Preços → Contato

A página `/precos` mostra os valores de referência informados pelo cliente (`src/data/pricing.ts`). Cada opção
leva a `/contato?servico=<id>` (`linha-motorola`, `linha-samsung`, `linha-xiaomi`, `iphone`), e a página de contato
mostra a opção escolhida e já preenche a mensagem do WhatsApp. A URL é a única fonte do estado: o link pode ser
compartilhado, sobrevive ao recarregar e some quando a query é removida. Qualquer outro valor de `servico` é
ignorado (lista fechada de ids; o texto da URL nunca é exibido). Como as páginas são pré-renderizadas sem query
string, a seleção aparece logo após a hidratação. Ao mudar um preço, revise também a descrição de `/precos` em
`src/config/seo.ts` (um teste confere os valores citados nela).

## Produtos

A página `/produtos` lista o catálogo de `src/data/products.ts` (nomes, descrições e preços exatamente como o
cliente enviou). As fotos ficam em `assets/produtos/` (cada arquivo tem o nome do produto) e são processadas por
`npm run media` em versões quadradas AVIF/WebP; o vínculo produto → foto é feito por id, nunca por posição. A foto
do carregador Motorola é recortada para remover o selo "ENVIO IMEDIATO" de um anúncio de terceiros.

Cada produto tem o próprio link de WhatsApp, com nome, valor e uma linha de contexto (`productWhatsappMessage`).
O detalhe abre em `/produtos?produto=<id>` (painel inferior no celular, janela no desktop): o link pode ser
compartilhado e o botão Voltar do navegador fecha o painel. Valores desconhecidos de `produto` são ignorados.

## Mídia

`npm run media` regenera todas as imagens a partir de `assets/`: AVIF + WebP responsivos, recortes de
direção de arte (remoção de faixas de texto e botões de carrossel capturados nas fotos), logotipo com fundo
transparente (sem redesenho), favicons, ícones e a imagem Open Graph.

O vídeo do topo é editado apenas nos cortes de cena do original (sem o rosto desfocado do início e sem a
legenda cortada do final), sem áudio, em WebM (VP9) e MP4 (H.264). Essa etapa precisa do ffmpeg
(`FFMPEG_PATH` ou `ffmpeg` no PATH); sem ele, os arquivos já gerados são mantidos.

## Variáveis de ambiente

| Variável        | Uso                                                                                                                                                                                                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_SITE_URL` | Domínio de produção (ex.: `https://www.seudominio.com.br`). Gera canonical, `og:url`, `og:image`, `sitemap.xml` e dados estruturados com URL. Na Vercel e na Netlify, se não for definida, é usada a URL de produção da plataforma. Sem nenhuma, essas tags são omitidas (nada é inventado). |

Não há segredos no projeto. Toda variável `VITE_*` é pública por definição.

## Publicação

- **Vercel:** `vercel.json` já define build, saída (`dist/client`), URLs limpas e cabeçalhos.
- **Netlify:** `netlify.toml` define build e saída; os cabeçalhos vêm de `dist/client/_headers`.
- **Cloudflare Pages:** comando `npm run build`, saída `dist/client`; usa o mesmo `_headers`.

Em todos, rotas inexistentes recebem `404.html` com status 404.

### Segurança

CSP sem scripts inline e sem `eval` (`script-src 'self'`), sem origens de terceiros, `frame-ancestors 'none'`,
HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy` e COOP. A fonte única é
`config/security-headers.ts`; um teste falha se `vercel.json` sair de sincronia. O `npm run preview` aplica a
mesma política, então violações aparecem localmente.

O formulário de contato não envia dados a nenhum servidor: ele valida, higieniza e abre a mensagem pronta
no WhatsApp ou no e-mail do visitante. Se um dia houver um endpoint próprio, reutilize `src/lib/contact/schema.ts`
no servidor, adicione proteção contra abuso (rate limit, honeypot/CAPTCHA), libere o domínio em `connect-src`
e atualize a política de privacidade.
