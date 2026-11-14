# Prumo Treino: especificação

App pessoal de treino do Filipe: corrida, musculação e mobilidade. É um PWA: instala na tela inicial do iPhone
e funciona sem internet. É irmão do "Prumo" (painel pessoal do Filipe, uma página que só abre com internet) e
usa a mesma identidade visual, as mesmas fichas de musculação e os mesmos formatos de registro.

## 1. Para quem e para quê

- Usuário único: Filipe. Já correu meias maratonas, parou por um tempo e está voltando a
  correr por lazer: corrida na quarta, sexta e domingo; musculação na segunda, quinta e sábado; terça livre.
- Celular: iPhone (Safari, app instalado pela opção "Adicionar à Tela de Início").
- Relógio: Garmin Venu 2 Plus. Os treinos de corrida já estão agendados no Garmin Connect; na rua ele corre
  guiado pelo relógio. O app mostra o plano, explica cada treino, registra como foi e guia o que acontece
  fora da corrida: musculação na academia (Planet Sports), alongamento, educativos.
- Quem monta e ajusta os treinos é o "treinador" (Claude), fora do app. O app facilita essa conversa com um
  resumo pronto para copiar.

Princípios, em ordem de prioridade:

1. Abrir e ver na hora o treino de hoje, com um toque para começar.
2. Tudo funciona sem internet. Nenhuma tela depende de rede. Nenhum recurso externo em tempo de execução.
3. Uso com uma mão, na academia: alvos de toque de 44 px ou mais, ações principais na metade de baixo da tela.
4. Os dados ficam só no aparelho (IndexedDB), com backup e restauração por arquivo.
5. Português do Brasil, frases diretas, tom de treinador próximo. Nada de jargão de software.
6. Cada exercício tem uma animação própria (boneco articulado). O app publicado não leva fotos nem vídeos de
   terceiros; o usuário pode importar no aparelho um pacote particular de fotos, que então viram a imagem principal
   do exercício, com o boneco de reserva (`ExMedia`, `lib/midia.ts`).

## 2. Arquitetura

- Vite 8 + TypeScript 7 (strict) + Preact 11 (hooks). PWA com `vite-plugin-pwa` (Workbox, tudo em precache).
- Sem backend. Sem dependências de runtime além do Preact. Fontes empacotadas (`@fontsource`).
- `base: './'` e rotas por hash (`#/hoje`), para funcionar em qualquer subpasta.

```
src/
  main.tsx            ponto de entrada: carrega o estado, registra o service worker, monta <App/>
  app.tsx             casca: barra de abas, roteamento, toasts
  types.ts            tipos de domínio (contrato; não mude sem necessidade)
  styles/             tokens.css, base.css, ui.css, viz.css, figure.css, media.css, fonts.css
  ui/                 kit de interface (componentes compartilhados)
  lib/                store, router, datas, formatação, feedback (som, voz, vibração, tela ligada), academia, corrida, progresso, prumo, midia (fotos)
  rig/                motor do boneco animado
  data/               perfil, plano de corrida (runs.ts), fichas (fichas.ts), rotinas, exercícios (ex/) e animações (anim/)
  features/           hoje, corrida, musculacao, mobilidade, progresso, ajustes
tools/                render-figures.ts (PNG das animações), screenshots.ts (capturas do app), gen-icons.ts, gen-fotos.ts (pacote particular de fotos, fora do repositório)
tests/unit/           testes de lógica (vitest)
docs/                 SPEC.md, CATALOGO.md, ANIMACOES.md, UI.md
```

Regras de código:

- TypeScript estrito, sem `any` e sem `@ts-ignore`. Imports relativos SEMPRE com extensão (`./x.ts`, `./y.tsx`).
- Componentes de função com hooks de `preact/hooks`. JSX do Preact (`class`, não `className`).
- CSS só com tokens (`var(--…)`); nenhuma cor literal fora de `styles/tokens.css`. Cada feature tem seu CSS
  (`features/<nome>/<nome>.css`, importado pelo `index.tsx` da feature) com classes prefixadas:
  `hj-` (hoje), `co-` (corrida), `mu-` (musculação), `mo-` (mobilidade), `pr-` (progresso), `aj-` (ajustes).
  O kit usa o prefixo `ui-`.
- Uma feature não importa de outra feature. O que for compartilhado mora em `ui/` ou `lib/`.
- Acessibilidade: todo controle é `<button>` ou `<a>` de verdade, com rótulo; foco visível; contraste AA;
  respeitar `prefers-reduced-motion`.
- Datas: sempre strings locais `AAAA-MM-DD` criadas pelas funções de `lib/dates.ts`. Nunca `toISOString()` para data.
- Textos em português do Brasil com acentuação correta. Números com vírgula decimal (`82,5 kg`), datas como
  `qua 18 nov`, fatos separados por ` · `. Sem emoji na interface.
- Nada de `alert/confirm/prompt`: confirmações são folhas (`Sheet`) do kit.
- Campos de texto e número com fonte de 16 px ou mais (o Safari do iPhone dá zoom em campos menores).
- Antes de entregar: `npm run typecheck`, `npm test` e `npm run build` sem erros.

## 3. Rotas

| Rota | Tela | Export (arquivo `features/<f>/index.tsx`) |
| --- | --- | --- |
| `#/hoje` | Hoje | `hoje` → `HojeScreen` |
| `#/corrida` | Plano, histórico e zonas | `corrida` → `CorridaScreen` |
| `#/corrida/treino/:id` | Detalhe do treino de corrida | `corrida` → `RunDetailScreen` |
| `#/corrida/guiada/:id` | Corrida guiada pelo celular | `corrida` → `RunPlayerScreen` |
| `#/musculacao` | Ficha da vez, semana e fichas | `musculacao` → `MusculacaoScreen` |
| `#/musculacao/ficha/:id` | Detalhe de uma ficha (`id` = letra) | `musculacao` → `FichaScreen` |
| `#/musculacao/sessao` | Treino em andamento | `musculacao` → `SessaoScreen` |
| `#/musculacao/historico` | Treinos feitos | `musculacao` → `LiftsScreen` |
| `#/exercicios` | Biblioteca de exercícios | `musculacao` → `LibraryScreen` |
| `#/exercicio/:id` | Detalhe do exercício (`id` do catálogo) | `musculacao` → `ExerciseScreen` |
| `#/mobilidade` | Rotinas | `mobilidade` → `MobilidadeScreen` |
| `#/mobilidade/rotina/:id` | Detalhe da rotina | `mobilidade` → `RoutineScreen` |
| `#/mobilidade/tocar/:id` | Rotina guiada | `mobilidade` → `RoutinePlayerScreen` |
| `#/progresso` | Consistência, corrida, força, peso | `progresso` → `ProgressoScreen` |
| `#/ajustes` | Ajustes, dados e instalação | `ajustes` → `AjustesScreen` |

Abas inferiores: Hoje, Corrida, Musculação, Mobilidade, Progresso. Ajustes abre pelo ícone de engrenagem em Hoje.
As telas de tocar (`sessao`, `guiada`, `tocar`) escondem a barra de abas.

## 4. Estado (`lib/store.ts`)

Um único objeto `AppState` (ver `types.ts`) em memória, salvo no IndexedDB (banco `prumo-treino`, com espelho em
`localStorage` como reserva). API:

- `loadState(): Promise<void>`: lê do disco (ou cria o estado inicial) antes do primeiro render e pede
  armazenamento persistente (`navigator.storage.persist`).
- `getState(): AppState`
- `update(fn: (draft: AppState) => void): void`: aplica a mudança sobre uma cópia, salva (com debounce curto,
  e imediatamente em `visibilitychange`/`pagehide`) e avisa os assinantes.
- `useStore<T>(selector: (s: AppState) => T): T`: hook; o componente redesenha quando o valor selecionado muda.
- `uid(): string`: id novo (tempo em base 36 + aleatório), como no Prumo.

Estado inicial: `settings` com nome "Filipe" (nascimento, altura e meta de peso ficam vazios: o código é
público e não carrega dados pessoais; ele preenche em Ajustes), FC máxima 192, zonas de
`data/profile.ts`, tema automático, som, voz e tela ligada ativados, descanso padrão de 90 s, 60 s por posição,
programa `hibrido` e plano da semana: seg musculação (ficha B), ter descanso, qua corrida, qui musculação
(ficha C), sex corrida, sáb musculação (ficha A), dom corrida.

## 5. Integração com o Prumo (`lib/prumo.ts`)

O Prumo exporta e restaura um backup `{ app: "prumo", versao: 2, exportadoEm, settings, data }`, em que `data`
tem coleções (`weights`, `runs`, `lifts`, …) e a restauração ignora ids repetidos. O Prumo Treino usa os mesmos
documentos para `runs`, `lifts` e `weights`, então:

- `toPrumoBackup(state): string`: gera um backup no formato do Prumo só com `weights`, `runs` (as que têm km)
  e `lifts` concluídos, para colar em Prumo › Ajustes › Seus dados › Restaurar. `rpe` (1 a 5) sai de `pse` (1 a 10).
- `fromPrumoBackup(json): { ok, added, error? }`: importa `weights`, `runs` e `lifts` de um backup do Prumo.
- Backup próprio: `exportBackup(): string` (`{ app: "prumo-treino", versao: 1, exportadoEm, state }`),
  `importBackup(json)`, `resetAll()`.
- Histórico de corridas gerado fora do app: `{ "kind": "prumo-treino-historico", "version": 1, "runs": RunLog[],
  "weights"?: WeightLog[] }`, importado por `importHistory(json)` sem duplicar (mesma data e mesma duração).

## 6. iPhone

- Instalação: Safari › Compartilhar › Adicionar à Tela de Início. Não existe botão de instalar automático.
- Não existe vibração (`navigator.vibrate` não existe): tudo que vibra também precisa de som e de sinal visual.
- Som só depois de um toque: crie/retome o `AudioContext` no primeiro toque do usuário em um botão de começar.
  Use `navigator.audioSession.type = 'playback'` quando existir, para o bipe tocar com o iPhone no silencioso.
- Voz: `speechSynthesis` com voz `pt-BR`, iniciada por toque; falhar em silêncio se não houver voz.
- Tela ligada: `navigator.wakeLock` quando existir, com nova solicitação ao voltar para o app.
- Cronômetros param com a tela bloqueada: todo timer calcula o tempo por relógio (`Date.now()`), nunca por
  contagem de intervalos, e se corrige ao voltar.
- Layout: `100dvh`, áreas seguras (`env(safe-area-inset-*)`), sem rolagem elástica do corpo nas telas de tocar.
- Backup: `navigator.share({ files })` quando disponível (salvar em Arquivos); senão, link de download.

## 7. Kit de interface (`src/ui`)

Segue o design system do Prumo (tokens, tipografia, cards, botões, pills, anéis, folhas, toasts, gráficos).
Documentado em `docs/UI.md`. Componentes mínimos:

- Estrutura: `Screen` (cabeçalho com rótulo mono, título, voltar e ações; área de rolagem; áreas seguras),
  `TabBar`, `Card` (com quadradinho da cor da área), `Section`, `Row`/`List`, `Empty`.
- Ação: `Button` (primário, suave, fantasma, perigo; tamanhos sm, md, lg; em bloco), `IconButton`, `Segmented`,
  `Chips`, `Toggle`, `Scale` (1 a 5 e 1 a 10), `Stepper` (número com − e +, toque para digitar),
  `Field`/`TextInput`/`NumberInput`/`TextArea`.
- Retorno: `Pill`, `Tag`, `Sheet` (folha de baixo, com foco preso e fechar por arrastar ou toque fora),
  `toast()` + `ToastHost`.
- Números e gráficos: `Stat`, `Ring`, `Meter`, `ProgressBar`, `WeekStrip`, `Bars`, `LineChart`, `Spark`, `Heat`,
  `IntensityChart` (perfil de um treino de corrida a partir de `RunBlock[]`), `TimerRing`.
- `Figure` (boneco animado) e `Icon`.

Cores por área: corrida `--c-corrida`, musculação `--c-musc`, peso `--c-peso`, mobilidade `--c-mob` (token novo).

## 8. Telas

### 8.1 Hoje (`#/hoje`)

- Cabeçalho: data em rótulo mono (`SÁB 14 NOV`), saudação (`Bom dia, Filipe`) e engrenagem (Ajustes).
- Faixa da semana (segunda a domingo): letra do dia, número, pontos com a cor de cada treino planejado
  (corrida, musculação), preenchidos quando feitos. Hoje em destaque. Tocar em um dia mostra o plano daquele dia.
- Cartões do dia selecionado:
  - Corrida: título, minutos, propósito, mini gráfico de intensidade, situação (pendente, feito, pulado).
    Ações: "Ver treino" e "Registrar". Selo "No relógio".
  - Musculação: letra e nome da ficha, quantidade de exercícios, tempo estimado, miniaturas dos 3 primeiros
    exercícios principais. Ação: "Começar treino" (ou "Continuar treino · 12 min" se houver sessão em andamento).
  - Dia sem treino: "Descanso" com sugestão de alongamento.
  - Depois de uma corrida feita no dia: sugestão "Alongamento pós-corrida, 8 min".
  - Antes da corrida do dia: atalhos "Aquecimento, 5 min" e "Educativos".
- Recado da semana (texto do treinador da semana atual do plano de corrida).
- Semana em números: anel "3 de 6 treinos", corridas feitas, musculação feita, minutos de mobilidade.
- Atalhos: Registrar peso (folha), Alongar, Educativos.
- Depois do fim do plano: cartão "Bloco concluído" com botão "Copiar resumo para o treinador".

### 8.2 Corrida

`#/corrida` com três partes (controle segmentado): Plano, Histórico, Zonas.

- Plano: nome e objetivo do bloco, semana atual de N, barra de progresso. Gráfico de minutos planejados por
  semana, com o realizado por cima. Lista de semanas (a atual aberta): tema, recado e os treinos
  (dia, título, minutos, mini gráfico, situação).
- Histórico: período (4 semanas, 3 meses, 12 meses, tudo), totais (corridas, km, tempo), gráfico de minutos por
  semana, recordes (corrida mais longa, melhores 5 km, 10 km e 21 km do histórico), lista de registros e
  "Adicionar corrida". Sem histórico importado: convite para importar em Ajustes.
- Zonas: as 4 faixas de FC (bpm e sensação), FC máxima, escala de PSE de 1 a 10 e como usar no relógio.

`#/corrida/treino/:id`: título, data, família, minutos, selo "No relógio", gráfico grande de intensidade
(largura proporcional ao tempo, altura e cor pelo nível, repetições expandidas), lista de passos (repetições
agrupadas, "5×"), cada passo com duração, nome e alvo (`FC 130 a 152 bpm`, `PSE 7 a 8`, `livre`), orientação do
treinador, dicas. Ações: "Registrar treino" (folha: duração, km, FC média, PSE 1 a 10, como se sentiu 1 a 5,
rua ou esteira, nota), "Pular", "Corrida guiada". Com registro: mostra o resumo e permite editar.

`#/corrida/guiada/:id`: tela cheia para esteira ou para quem corre sem relógio. Passo atual grande (nome, alvo),
contagem regressiva, próximo passo, cursor andando sobre o gráfico, voz e bipes nas trocas, pausar, pular passo,
encerrar (abre o registro com a duração preenchida). Mantém a tela ligada. Aviso: na rua, use o relógio.

### 8.3 Musculação

As fichas vêm de `data/fichas.ts` (programa "Atleta Híbrido" do treinador Fabiano: A · Costas e bíceps,
B · Inferiores, C · Peito, ombro e braço), na mesma estrutura do Prumo: cada exercício tem `tipo`
(`alongamento`, `mobilidade`, `aquecimento`, `principal`), blocos de `series` (com faixa de repetições, RIR,
isometria, carga da ficha e intervalo), `metodo` (rest-pause, cluster-set, super-set, bi-set, drop-set),
`instrucoes` do treinador e `combinado` (par feito alternado). As regras de cálculo ficam em `lib/academia.ts`
e seguem as do Prumo: série de trabalho, volume, e1RM (Epley), progressão dupla por bloco, recordes, rotação
das fichas e descanso.

`#/musculacao`: ficha de hoje ou próxima ficha (letra grande, nome, exercícios, última vez, "Começar treino"),
semana (treinos feitos e planejados, volume, séries), recordes recentes, as três fichas ("ver ficha") e atalhos
para Histórico e Exercícios.

`#/musculacao/ficha/:id`: bloco de preparação (alongamento, mobilidade, aquecimento) e treino principal. Cada
item com miniatura animável, alvo de cada bloco (`3 × 8-12 · RIR 1-3 · 40 kg · descanso 90 s`), método, pares
numa caixa tracejada, "Última vez" e sugestão. "Começar treino".

`#/musculacao/sessao`: o treino em andamento, tela cheia.

- Cabeçalho fixo: Sair · "Ficha B · Inferiores" · Concluir; cronômetro, exercícios e séries de trabalho feitas.
- Preparação: bloco recolhido com os itens de alongamento, mobilidade e aquecimento que não fazem par com um
  principal; um toque marca cada um; itens por tempo têm cronômetro. Não entram em séries nem em volume.
- Treino principal: um cartão por exercício, ou um cartão duplo para o par combinado (linhas intercaladas A1,
  B1, A2, B2 e o aviso de alternar e descansar só depois do par). No cartão: animação, nome, grupo e
  equipamento, pill do método (toque explica), alvo de cada bloco, "Última vez" ou "Primeira vez: carga da
  ficha", e a sugestão de subir a carga quando for o caso.
- Linha de série: número, o que fez na última vez, repetições, kg e concluir. Campos já preenchidos (o que
  digitou na série anterior, a sugestão ou a ficha). Concluir grava a série e dispara o descanso; tocar de
  novo desmarca. Rodapé do cartão: "+ série", "observação", "trocar exercício", "pular exercício", "como fazer".
- Descanso: barra fixa no rodapé com contagem regressiva, "Próximo: exercício · série n", "+30 s" e "Pular".
  O tempo é o intervalo do bloco; sem ele, o padrão; no par, só depois que os dois fizeram a série. No fim:
  bipe, vibração onde existir, e a barra vira "Bora" contando o tempo extra.
- Concluir: folha com duração, volume e séries, recordes da sessão, intensidade (1 a 5) e observação; depois,
  "Treino concluído" com a comparação de volume com a última vez da mesma ficha.
- Sair mantém a sessão em andamento ("Continuar treino" em Hoje e em Musculação). Sessão de outro dia que ficou
  aberta vira aviso com "concluir" ou "descartar".

`#/exercicio/:id`: animação (tocar e pausar), músculos, equipamento, execução, dicas, erros comuns, respiração,
variações, substitutos, "Ver vídeo no YouTube" (link de busca; abre fora do app e precisa de internet), e, para
exercícios de ficha, progressão: e1RM atual e melhor, gráfico por sessão e últimas vezes.

`#/exercicios`: busca e lista por tipo e grupo. `#/musculacao/historico`: treinos feitos, com séries, volume e
recordes; permite apagar um treino.

### 8.4 Mobilidade

`#/mobilidade`: rotinas (`data/routines.ts`) por tipo: alongamento, aquecimento, educativos de corrida, core,
pés, liberação miofascial. Cada cartão: nome, minutos, quando fazer, última vez.

`#/mobilidade/rotina/:id`: descrição, lista de passos com miniatura, seletor de tempo por posição
(30 s, 45 s, 60 s, livre) nas rotinas com `userTimed`, "Começar".

`#/mobilidade/tocar/:id`: tela cheia. Animação grande, nome e lado ("Direita"), uma frase de execução, anel de
contagem (ou repetições com botão "Feito"), transição de alguns segundos anunciando a próxima posição por voz,
voltar, pausar, pular, pontos de progresso, tela sempre ligada. Fim: resumo e registro.

### 8.5 Progresso (`#/progresso`)

- Consistência: mapa das últimas 12 semanas (pontos por tipo de treino por dia), sequência de semanas com
  3 ou mais treinos, anel da semana.
- Corrida: minutos por semana (12 semanas), km no mês, corrida mais longa do período.
- Força: treinos por semana, volume por semana, recordes por exercício.
- Peso: valor atual, gráfico com média móvel e linha da meta, "Registrar peso", lista.
- Mobilidade: minutos por semana.
- "Resumo para o treinador": gera um texto das últimas 2 semanas (corridas com PSE, sensação e notas;
  musculação; mobilidade; peso) e copia para a área de transferência.

### 8.6 Ajustes (`#/ajustes`)

- Perfil: nome, FC máxima, zonas (bpm editáveis), meta de peso.
- Plano da semana: por dia, tipo (musculação, corrida, os dois, descanso) e ficha fixa ou a próxima da rotação.
- Treino: descanso padrão, tempo por posição, som, voz, vibração, manter a tela ligada.
- Aparência: automático, escuro, claro.
- Dados: fazer backup (arquivo), restaurar backup, importar histórico, copiar treinos para o Prumo, importar
  backup do Prumo, apagar tudo (pede para digitar APAGAR).
- App: versão, situação offline ("Pronto para usar sem internet"), armazenamento persistente, como instalar
  no iPhone.

### 8.7 O treinador dentro do app (`data/coach.ts`)

- **Roteiro da corrida** (`ROTEIRO_CORRIDA`, `etapaAtual`): quatro etapas, do retorno aos longos de 15 a 18 km
  (21 km quando estiver bem). Aparece em Corrida › Plano como uma linha do tempo curta: etapa atual em
  destaque, período, meta do longo e resumo de cada etapa.
- **Recado da força** (`RECADOS_FORCA`, `recadoForca`): orientação da semana para a musculação (título, texto,
  repetições em reserva, se os métodos de intensidade estão liberados). Aparece em Musculação, acima da ficha
  de hoje, e no topo da sessão. Quando `metodos` é falso, as pills de método (drop-set, rest-pause, cluster)
  continuam visíveis, com o aviso "nesta semana, faça séries normais".
- **Cargas na volta** (`FATOR_RETORNO` = 0,75): na primeira vez de um exercício no app (sem histórico), o valor
  inicial da carga é a carga da ficha × 0,75, arredondada para 0,5 kg, com a legenda
  "Sugestão do treinador: 75% da ficha (as cargas são de ago/2025)". Com histórico, vale a progressão dupla.
- **Princípios** (`PRINCIPIOS_HIBRIDO`): lista curta em Musculação › "Como este treino funciona".

## 9. Qualidade

- Funciona de 360 × 640 a 430 × 932, retrato. Áreas seguras respeitadas.
- Tema escuro primeiro; claro completo.
- Nenhum pedido de rede em tempo de execução (exceto o link do YouTube, que abre fora).
- Estados vazios desenhados (sem histórico, sem peso, primeiro uso).
- Nada de texto cortado; números em colunas com `tabular-nums`.
