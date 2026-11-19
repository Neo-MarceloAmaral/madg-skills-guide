# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Público aberto: qualquer pessoa que usa (ou está começando a usar) skills de design e frontend no Claude. Inclui o próprio autor, colegas e pessoas que recebem o link como referência. Não se assume familiaridade com Claude Code, terminal ou com a origem de cada skill.

Situações de uso, todas confirmadas:
- **Achar o comando certo:** a pessoa sabe o que quer fazer (“animar um modal”, “revisar acessibilidade”) mas não lembra qual skill ou comando resolve.
- **Copiar o pedido pronto:** pegar um exemplo de pedido e colar direto no chat do Claude.
- **Descobrir possibilidades:** explorar o que os pacotes conseguem fazer.
- **Ensinar outras pessoas:** usar o guia para explicar as skills a quem está começando.

## Product Purpose

Página de consulta que explica, em português, como usar cada skill instalada no Claude: o que faz, quais comandos existem e como pedir. Sucesso é a pessoa sair da página com um pedido pronto para colar no chat, sem precisar ler a documentação original de cada repositório.

## Positioning

Reúne num só lugar pacotes de origens diferentes (Impeccable, Transitions.dev, Web Design Guidelines da Vercel, Designer Skills Pack), traduzidos e normalizados para o uso no app do Claude (claude.ai), onde comandos são texto comum e não atalhos de `/` do Claude Code. Cada item traz um exemplo de pedido em português pronto para copiar.

## Operating Context

- Lida dentro do app do Claude (web, desktop e celular) como artifact publicado, e por quem recebe o link compartilhado.
- Usada lado a lado com uma conversa no Claude: a pessoa consulta, copia o exemplo e cola no chat.
- No app do Claude, skills ativam sozinhas pela descrição da tarefa; comandos são escritos como texto na mensagem.
- Alguns comandos (Impeccable `live` e `generate`) só funcionam por completo no Claude Code com servidor local; o guia sinaliza isso.

## Capabilities and Constraints

- Página estática: `index.html` + `data.js` (conteúdo separado da apresentação), publicada como artifact. Sem backend, sem requisições externas além de fontes.
- Busca global em todos os pacotes, filtro por tipo (comando / skill), navegação por pacote via hash (`#impeccable`, `#ui-design`…), botão de copiar exemplo.
- **Todo texto em português (pt-BR)**; nomes de comandos e skills ficam no original.
- **Precisa crescer:** novos pacotes instalados depois devem entrar só adicionando dados em `data.js`, sem reescrever a interface.
- **Precisa funcionar no celular** (app do Claude no telefone).
- Conteúdo atual: 15 skills instaladas (Impeccable, 3 da Transitions.dev, Web Design Guidelines, Taste Skill, 9 coleções do Designer Skills Pack), apresentadas em 13 pacotes, com 67 comandos, 111 sub-skills e 13 formas de pedir, conferidos contra os arquivos originais.
- Nome do produto: **Skills Guide** (decidido em 2026-11-19; substitui “Guia das Minhas Skills”). O nome fica em inglês; o conteúdo segue em português.

## Brand Commitments

Nenhuma marca própria definida. Os nomes e créditos dos pacotes de terceiros são fatos a preservar, não identidade visual a imitar.

## Evidence on Hand

- Repositórios de origem e licenças: `pbakaus/impeccable` (Apache 2.0), `Jakubantalik/transitions.dev` (licença própria: uso livre, sem redistribuir a coleção como biblioteca concorrente), `vercel-labs/agent-skills` + `vercel-labs/web-interface-guidelines` (MIT), `Owl-Listener/designer-skills` (MC Dean, MIT), `Leonxlnx/taste-skill` (MIT; versão do app reempacotada com imagens recomprimidas).
- Descrições oficiais de cada comando e skill (SKILL.md e command-metadata dos pacotes).
- Não há depoimentos, métricas de uso ou números de adoção: não inventar.

## Product Principles

1. **Do problema ao pedido pronto.** Cada item termina num exemplo copiável; explicação só o suficiente para escolher.
2. **Fiel à fonte, honesto sobre limites.** Descrições batem com a skill real; limitações (servidor local, licença, rede) aparecem onde importam.
3. **Português primeiro, nomes originais intactos.** Traduz o uso, nunca o identificador do comando.
4. **Cresce sem redesenho.** Um novo pacote é dado, não página nova.
5. **Público e iniciante por padrão.** Nada pressupõe que o leitor conheça terminal, Claude Code ou o histórico desta configuração.

## Accessibility & Inclusion

- Meta: WCAG 2.2 AA — navegação completa por teclado, foco visível, contraste AA nos dois temas, rótulos acessíveis para busca, filtros e botões de copiar, respeito a `prefers-reduced-motion`.
- Uso em telas pequenas (app do Claude no celular) é requisito, não melhoria.
