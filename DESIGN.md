---
name: Skills Guide
description: Quadro de concreto brutalista; cada skill é uma linha que se abre como gaveta.
colors:
  ground: "#d3d1cb"
  slab: "#e6e4df"
  ink: "#111110"
  ink-2: "#3b3a36"
  signal: "#1f1fff"
  on-signal: "#ffffff"
  field: "#ffffff"
  ground-dark: "#161615"
  slab-dark: "#22221f"
  ink-dark: "#ecebe6"
  ink-2-dark: "#b9b7af"
  signal-dark: "#3d3dff"
  field-dark: "#0b0b0a"
typography:
  display:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "clamp(2.25rem, 5.6vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 0.88
    letterSpacing: "-0.005em"
  masthead:
    fontFamily: "Big Shoulders, Arial Narrow, sans-serif"
    fontSize: "fit to content width"
    fontWeight: 700
    lineHeight: 0.8
  lede:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2.1vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.18
  body:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.04em"
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
rounded:
  none: "0px"
spacing:
  gutter: "clamp(1rem, 3.2vw, 2.75rem)"
  rule: "3px"
  hairline: "1px"
components:
  pack-row:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    padding: "1.1rem {spacing.gutter}"
  pack-row-open:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.on-signal}"
  drawer:
    backgroundColor: "{colors.slab}"
    textColor: "{colors.ink}"
  section-band:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  toggle-pressed:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.on-signal}"
    typography: "{typography.label}"
    height: "44px"
  example-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.none}"
---

## Overview

Brutalismo de concreto, pedido pelo autor. A página é um índice estrutural: réguas pretas grossas, chão cinza de concreto, letras de sinalização em caixa alta e um único azul para o que está aberto ou foi acionado. Não há imagens, sombras, cantos arredondados nem interfaces simuladas. O conteúdo é uma lista de skills em acordeão: cada linha abre uma gaveta com resumo, como chamar, avisos e os comandos com um pedido pronto para copiar.

## Colors

- **ground** é o concreto que ocupa a página; **slab** é a gaveta aberta, um tom acima.
- **ink** serve para texto e réguas; **ink-2** para texto secundário (8.6:1 sobre ground).
- **signal** é usado só em estado: linha aberta, filtro ativo, seleção de texto, foco e "Copiado". Nunca é decoração.
- As faixas de seção invertem ink e ground.
- No modo noite, a mesma lógica vale com os tokens `-dark`.

## Typography

- Big Shoulders Bold, em caixa alta, para o título, os nomes das skills e as faixas de seção.
- Work Sans para leitura.
- JetBrains Mono para comandos, pedidos de exemplo e rótulos de controle, que são código ou etiquetas e nunca texto corrido.
- O título "Skills Guide" é ajustado por script para ocupar toda a largura do conteúdo.
- As fontes são servidas da pasta `fonts/` (WOFF com subconjunto latino, SIL OFL).

## Layout

- Uma coluna de largura total com margem lateral `gutter`.
- Cada bloco é separado por uma régua de 3px; itens dentro de um grupo, por uma linha de 1px.
- Na gaveta aberta, a coluna lateral (resumo, como chamar, atenção, fonte) fica ao lado da lista de itens. Cada item tem nome, descrição e exemplo.
- Abaixo de 1100px, o exemplo vai para baixo da descrição; abaixo de 860px, tudo fica em uma coluna.

## Elevation & Depth

Não há profundidade. A hierarquia vem de régua, inversão de cor e tamanho.

## Shapes

Tudo é retângulo, sem cantos arredondados. Bordas de 3px em controles e blocos, e de 2px em etiquetas e no campo de exemplo. O ícone de abrir é um quadrado com uma cruz desenhada em retângulos; ao abrir, vira menos.

## Components

- **Linha de skill:** é um botão com `aria-expanded`. Ao abrir, fica azul e a gaveta aparece pela transição de `grid-template-rows` (0,55s, ease-out exponencial). Esse é o único momento de movimento da página.
- **Busca:** campo grande com borda grossa. Abre as skills que têm resultado, filtra itens e marca o termo em azul.
- **Filtros e tema:** grupos de botões com `aria-pressed`.
- **Exemplo:** código com o botão Copiar colado à direita.

## Do's and Don'ts

- Faça: novo pacote entra só por `data.js`.
- Faça: azul apenas para estado.
- Faça: réguas de 3px entre blocos.
- Não faça: sombras, arredondados, gradientes, imagens decorativas ou mockups de interface.
- Não faça: rótulo pequeno acima de título.
- Não faça: monospace em texto corrido.
