# Kit de interface (`src/ui`)

Componentes compartilhados do Prumo Treino, na identidade do Prumo: estrutura, ação, retorno, números e gráficos,
o boneco animado e os ícones. Classes com o prefixo `ui-`; só tokens de `src/styles/tokens.css`, nenhuma cor literal.

## Índice

- [Como usar](#como-usar)
- [Estrutura](#estrutura): `Screen`, `TabBar`, `Card`, `Section`, `List`, `Row`, `Empty`
- [Ação](#ação): `Button`, `IconButton`, `Segmented`, `Chips`, `Toggle`, `Scale`, `Stepper`, `Field`, `TextInput`,
  `NumberInput`, `TextArea`, `DateInput`
- [Retorno](#retorno): `Pill`, `Tag`, `Sheet`, `toast`, `ToastHost`
- [Números e gráficos](#números-e-gráficos): `Stat`, `StatRow`, `Ring`, `Meter`, `ProgressBar`, `WeekStrip`, `Bars`,
  `LineChart`, `Legend`, `Spark`, `Heat`, `IntensityChart`, `TimerRing`
- [Boneco animado](#boneco-animado-figuretsx): `Figure`
- [Foto do exercício](#foto-do-exercício-exmediatsx): `ExMedia`
- [Ícones](#ícones-icontsx): `Icon`
- [Classes utilitárias](#classes-utilitárias)
- [Receitas](#receitas): tela padrão, tela cheia de tocar, folha de confirmação, estado vazio

## Como usar

- Importe do barril, com extensão: `import { Screen, Card, Button, toast } from '../../ui/index.ts'`. Também vale
  importar de cada arquivo (`'../../ui/Button.tsx'`). O barril não exporta `fmtNum` nem `parseNum`: para números,
  use `lib/format.ts`.
- Os estilos entram uma vez, em `src/main.tsx`, nesta ordem: `fonts.css`, `tokens.css`, `base.css`, `ui.css`,
  `viz.css`, `figure.css`. As telas não importam estilos do kit; cada feature importa só o próprio CSS.
- `TabBar` e `ToastHost` são montados pela casca (`src/app.tsx`). As telas não montam nenhum dos dois.
- Telas de rota com parâmetro recebem da casca a prop `id` (o trecho `:id` da rota).
- `href` aceita a rota do app (`'/corrida'`, que vira `#/corrida`) ou um endereço completo (`'#/x'`, `'https://…'`).
- Texto em caixa normal: a caixa alta de rótulos, etiquetas e títulos de card é do CSS.
- Todo controle tem 44 px ou mais de alvo de toque (os pequenos estendem a área com `::after`).
- Estado por atributo: `aria-pressed` (chips, segmentos, escala, botão de ícone), `aria-checked` (interruptor),
  `aria-current="page"` (aba ativa).
- Galeria com tudo, nos dois temas, dentro do app: rota `#/kit` (só para desenvolvimento). As páginas avulsas
  `kit-base.html`, `kit-sheet.html` (já com a folha aberta) e `kit-viz.html` mostram cada parte separada.

```
npm run shots -- --full kit               → .out/shots/kit-escuro.png e kit-claro.png
npm run shots -- kit-sheet.html           → a folha aberta
```

## Estrutura

### `Screen` (`Screen.tsx`)

`Screen({ title, eyebrow?, back?, actions?, footer?, tabs?, flush?, children })`

| Prop | Tipo | O que faz |
| --- | --- | --- |
| `title` | `string` | Título em display (28 px). |
| `eyebrow` | `string` | Rótulo mono acima do título (`Sáb 14 nov`). |
| `back` | `boolean \| string` | `true`: volta no histórico (sem histórico, vai para `#/hoje`). Texto: vai para essa rota. |
| `actions` | nós | Botões de ícone à direita do título. |
| `footer` | nós | Rodapé fixo com as ações principais, acima da barra de abas. Os filhos dividem a largura. |
| `tabs` | `boolean` (padrão `true`) | Reserva o espaço da barra de abas. Use `false` nas telas de tocar. |
| `flush` | `boolean` | Conteúdo sem o respiro lateral de 16 px. |

A tela rola com a página (não há área de rolagem interna); o conteúdo já ganha no fim o espaço da barra de abas, da
área segura e do rodapé (a altura do rodapé é medida e vai para `--ui-foot-h`). Os filhos diretos ficam a 28 px um
do outro: use `Section` para agrupar.

```tsx
<Screen eyebrow="Qua 18 nov" title="Rodagem leve" back="/corrida"
  actions={<IconButton icon="editar" label="Editar" onClick={editar} />}
  footer={<Button variant="primary" icon="check" onClick={registrar}>Registrar treino</Button>}>
  <Section title="Passos">…</Section>
</Screen>
```

### `TabBar` (`TabBar.tsx`)

`TabBar({ items: { id, label, icon, href }[], active })`: barra inferior fixa, fundo com desfoque, item ativo em
âmbar. Altura `var(--tabs-h)` mais a área segura. Sem o "+" central do Prumo.

```tsx
<TabBar active="hoje" items={[{ id: 'hoje', label: 'Hoje', icon: 'hoje', href: '/hoje' }, …]} />
```

### `Card` e `Section` (`Card.tsx`)

`Card({ area?, title?, eyebrow?, action?, href?, onClick?, flat?, class?, children })`

- `area`: `'corrida' | 'musc' | 'mob' | 'peso'`. Põe o quadradinho de 8 px da cor da área antes do título (sem título,
  antes do rótulo). Sem `area`, o card é transversal e não leva quadradinho.
- `action`: conteúdo à direita do cabeçalho (pill, texto curto, botão pequeno, `Segmented size="sm"`).
- `href` ou `onClick`: o card inteiro vira alvo de toque. Botões e links dentro dele continuam funcionando
  (o alvo fica por baixo do conteúdo; nada de botão dentro de botão).
- `flat`: sem sombra, em `--surface-2`, para blocos internos.

`Section({ title, action?, children })`: rótulo mono com a linha fina até a margem, ação opcional à direita e os
filhos empilhados a 12 px.

```tsx
<Section title="Hoje" action={<a class="ui-link" href="#/corrida">ver plano</a>}>
  <Card area="corrida" eyebrow="Quarta" title="Rodagem leve" action={<Pill tone="accent">no relógio</Pill>} href="/corrida/treino/c-1">
    <p class="ui-muted">45 min em FC 130 a 152 bpm.</p>
  </Card>
</Section>
```

### `List` e `Row` (`Row.tsx`)

`Row({ title, sub?, leading?, right?, href?, onClick?, tone?, chevron? })`

- A linha inteira é o alvo (52 px ou mais): com `href` é um link, com `onClick` um botão, sem os dois um bloco.
- `right`: valor em display 18 px (use `<small>` para a unidade) ou uma `Pill`. Não ponha botões em linha clicável.
- `tone`: `'good' | 'warn' | 'crit' | 'accent'` pintam o valor da direita; `'muted'` apaga a linha (item pulado).
- `chevron`: seta à direita; por padrão aparece nas linhas com `href`.

```tsx
<List>
  <Row leading={<Icon name="corrida" />} title="Rodagem leve" sub="qua 11 nov · 45 min · PSE 4" right="7,4 km" href="/corrida/treino/x" />
  <Row title="Peso" sub="ontem" right={<>82,5<small>kg</small></>} onClick={editar} />
</List>
```

### `Empty` (`Empty.tsx`)

`Empty({ icon?, title, text?, action? })`: caixa tracejada com o que falta, uma frase de como começar e no máximo
um botão pequeno.

```tsx
<Empty icon="corrida" title="Nenhuma corrida registrada" text="Registre a corrida de hoje ou importe o histórico em Ajustes."
  action={<Button size="sm" icon="mais" onClick={nova}>Adicionar corrida</Button>} />
```

## Ação

### `Button` e `IconButton` (`Button.tsx`)

`Button({ variant?, size?, block?, icon?, href?, disabled?, type?, onClick?, children, 'aria-label'?, class? })`

- `variant`: `'primary'` (âmbar; um só por tela), `'soft'` (padrão), `'ghost'` (terciário, sem caixa),
  `'danger'` (destrutivo).
- `size`: `'sm'` (36 px à vista, 44 px de alvo), `'md'` (44 px), `'lg'` (54 px, para "Começar treino").
- `block`: largura toda. `icon`: ícone à esquerda. `href`: vira link (endereço `http` abre fora do app).

`IconButton({ icon, label, onClick?, href?, size?, pressed?, disabled?, class? })`: botão só de ícone; `label` é o
rótulo acessível. `pressed` transforma em liga/desliga (`aria-pressed`, ativo em âmbar).

```tsx
<Button variant="primary" size="lg" block icon="play" onClick={comecar}>Começar treino</Button>
<Button variant="danger" icon="lixeira" onClick={apagar}>Apagar</Button>
<IconButton icon="som" label="Som" pressed={som} onClick={() => setSom(!som)} />
```

Também exporta `toHref(rota)` e `cx(...classes)`.

### `Segmented` (`Segmented.tsx`)

`Segmented<T extends string>({ options: { v: T; l: string }[], value, onChange, label, size? })`: escolha única,
sempre com valor. Ocupa a largura toda; `size="sm"` é o seletor compacto (período de um gráfico). `label` é só para
leitores de tela.

```tsx
<Segmented label="Parte" value={parte} onChange={setParte}
  options={[{ v: 'plano', l: 'Plano' }, { v: 'historico', l: 'Histórico' }, { v: 'zonas', l: 'Zonas' }]} />
```

### `Chips` (`Chips.tsx`)

`Chips<T extends string>({ options: { v: T; l: string }[], value, onChange, multi?, label? })`

- Sem `multi`: `value: T | undefined`, `onChange(v: T)`. Tocar no chip ativo não desmarca.
- Com `multi`: `value: T[]`, `onChange(v: T[])`.

```tsx
<Chips label="Onde foi" value={local} onChange={setLocal} options={[{ v: 'rua', l: 'Rua' }, { v: 'esteira', l: 'Esteira' }]} />
<Chips multi label="Equipamento" value={equip} onChange={setEquip} options={opcoes} />
```

### `Toggle` (`Toggle.tsx`)

`Toggle({ checked, onChange, label, hint?, disabled?, bare? })`: interruptor em linha inteira (`role="switch"`).
`bare` tira a caixa, para empilhar dentro de um card (as linhas ganham um fio entre elas).

```tsx
<Toggle label="Som" hint="Bipes no fim do descanso." checked={som} onChange={setSom} />
```

### `Scale` (`Scale.tsx`)

`Scale({ min, max, value, onChange, label, left?, right? })`: nota de 1 a 5 ou de 1 a 10 em botões de 48 px.
Até 6 valores em uma linha; acima disso, em duas. `left` e `right` são os rótulos das pontas. `value` pode ser
`undefined` (nada marcado).

```tsx
<Scale label="Esforço (PSE)" min={1} max={10} value={pse} onChange={setPse} left="muito leve" right="máximo" />
```

### `Stepper` (`Stepper.tsx`)

`Stepper({ value, onChange, step, min?, max?, unit?, label, big?, format?, hideLabel? })`

- Botões − e +; toque longo repete (começa depois de 0,4 s). O valor não sai de `min..max`.
- Tocar no valor abre a digitação (teclado decimal, aceita vírgula, fonte de 22 px ou mais). Enter ou sair do campo
  confirma; Esc cancela.
- `big`: versão da tela de treino. Quando o espaço é estreito (dois lado a lado), o valor fica em cima dos botões.
- `format`: como mostrar o valor (padrão: vírgula decimal, sem zeros à direita).
- O stepper ocupa a largura de onde está: ponha em um bloco, uma coluna de grade ou um item flexível com largura.

```tsx
<div class="ui-grid ui-g-2">
  <Stepper big label="Carga" unit="kg" step={2.5} min={0} value={carga} onChange={setCarga} />
  <Stepper big label="Repetições" step={1} min={0} value={reps} onChange={setReps} />
</div>
```

Também exporta `fmtNum(v, casas?)` e `parseNum(texto)` (os mesmos contratos de `lib/format.ts`).

### `Field`, `TextInput`, `NumberInput`, `TextArea`, `DateInput` (`Field.tsx`)

`Field({ label, hint?, error?, group?, children })`: rótulo, controle, erro e dica. Os campos do kit dentro dele
já saem ligados ao rótulo (`id`, `aria-describedby`, `aria-invalid`). Use `group` quando o conteúdo é um grupo de
botões (`Chips`, `Segmented`), não um campo de texto.

- `TextInput({ value, onChange, type?, inputMode?, placeholder?, maxLength?, disabled?, … })`: `type` é `'text'` ou `'search'`.
- `NumberInput({ value, onChange, int?, unit?, min?, max?, placeholder?, … })`: valor `number | undefined`; aceita
  vírgula; `unit` aparece dentro do campo; `min` e `max` valem ao sair do campo.
- `TextArea({ value, onChange, rows?, … })`.
- `DateInput({ value, onChange, min?, max? })`: `input type="date"`, valor `'AAAA-MM-DD'`.

Todos têm 48 px de altura e fonte de 16 px (o iPhone não dá zoom).

```tsx
<div class="ui-form">
  <Field label="Distância" error={erro}>
    <NumberInput unit="km" value={km} onChange={setKm} />
  </Field>
  <Field label="Observação" hint="Opcional.">
    <TextArea value={nota} onChange={setNota} />
  </Field>
</div>
```

## Retorno

### `Pill` e `Tag` (`Pill.tsx`)

`Pill({ tone?, icon?, children })`: selo de estado, em minúsculas. `tone`: `'good' | 'warn' | 'crit' | 'muted'`
(padrão) `| 'accent' | 'corrida' | 'musc' | 'mob' | 'peso'`. `good` leva o check e `crit` o alerta (a cor nunca vai
sozinha); `icon` troca o ícone e `icon={false}` tira.

`Tag({ children })`: etiqueta mono em caixa alta.

```tsx
<Pill tone="good">feito</Pill> <Pill tone="accent" icon="trofeu">recorde</Pill> <Tag>aquecimento</Tag>
```

### `Sheet` (`Sheet.tsx`)

`Sheet({ open, onClose, title, children, footer? })`: folha de baixo, num portal em `document.body`.

- `role="dialog"`, `aria-modal`, título ligado por `aria-labelledby`.
- Aberta: o resto da página fica inerte e sem rolagem; o foco fica preso na folha e volta para quem abriu ao fechar.
- `onClose` é chamado por Esc, toque no fundo, arrastar o topo mais de 80 px para baixo e pelo botão de fechar.
  Quem fecha de verdade é o dono do estado (`open`).
- Sobe com o teclado virtual (`visualViewport` → `--kb`) e leva o campo focado para o meio.
- `footer`: ações fixas no fim da folha; os filhos dividem a largura.
- Confirmações do app são folhas (nada de `confirm()`).

```tsx
<Sheet open={aberta} onClose={() => setAberta(false)} title="Registrar corrida"
  footer={<><Button onClick={() => setAberta(false)}>Cancelar</Button><Button variant="primary" onClick={salvar}>Salvar</Button></>}>
  <Field label="Duração"><NumberInput int unit="min" value={min} onChange={setMin} /></Field>
</Sheet>
```

### `toast` e `ToastHost` (`Toast.tsx`)

`toast(msg, opts?: { tone?: 'ok' | 'erro' | 'info'; action?: { label, onClick }; ms? })`: um aviso por vez, com as
cores invertidas, 2,2 s (5 s quando tem ação). `ok`, `erro` e `info` ganham uma faixa verde, vermelha ou âmbar.
`ToastHost()` é montado uma vez na casca do app (`aria-live="polite"`). Fica acima da barra de abas; com uma folha
aberta, sobe para o topo. `dismissToast()` fecha o aviso atual.

Nas telas sem barra de abas, ajuste a distância do rodapé com `--ui-toast-offset` (padrão `var(--tabs-h)`).

```tsx
toast('Salvo');
toast('Não salvou. Tente de novo.', { tone: 'erro' });
toast('Treino apagado', { action: { label: 'Desfazer', onClick: desfazer } });
```

## Números e gráficos

KPIs, anéis, medidores, faixa da semana e gráficos em SVG, sem bibliotecas externas. CSS em `src/styles/viz.css`.

### Convenções

- **Tom** (`tone`): `'corrida' | 'musc' | 'mob' | 'peso' | 'accent' | 'good' | 'warn' | 'crit' | 'muted'`
  (tipo `Tone`, em `ui/viz-util.ts`). O padrão é `accent`. Marcadores de treino aceitam só as áreas
  (`AreaTone`: `corrida`, `musc`, `mob`).
- **Largura real**: `Bars`, `LineChart` e `IntensityChart` medem o contêiner (ResizeObserver) e desenham o SVG nessa
  largura, como no Prumo. O texto dos eixos tem sempre 11 px; nada é esticado. Eles ocupam 100% da largura do pai.
- **Números**: quem chama entrega os textos já formatados (`lib/format.ts`). Os eixos usam vírgula decimal.
- **Fundo**: pontos e plaquinhas dos gráficos usam a cor do cartão (`--surface`). Sobre outro fundo, defina
  `--ui-chart-bg` no contêiner.
- **Acessibilidade**: cada gráfico é `role="img"` com um resumo em `aria-label` (automático, ou o que você passar).
  A cor nunca é o único sinal: use legenda e escreva os valores no texto ao redor.
- **Movimento**: transições curtas, desligadas com `prefers-reduced-motion`.
- Todos aceitam `class` para um ajuste de layout pontual.

### Stat e StatRow

```ts
Stat({ label, value?, unit?, sub?, tone?, delta? })
StatRow({ children })   // grade de 2 a 4 colunas, conforme a quantidade de filhos
```

- `value`: texto formatado ou número. `null`, `undefined` ou vazio mostram "—" (e escondem a unidade).
- `tone` de área (`corrida`, `musc`, `mob`, `peso`) põe o quadradinho colorido no rótulo; `tone` de estado
  (`good`, `warn`, `crit`, `accent`) colore o número.
- `delta`: `{ text, dir?: 'up' | 'down' | 'flat', tone?: 'good' | 'warn' | 'crit' | 'muted' }`. A cor é decisão da
  tela (peso caindo pode ser bom).
- `sub`: linha de apoio; `<b>` dentro dela fica em `--fg`.

```tsx
<StatRow>
  <Stat label="Corrida" tone="corrida" value="50" unit="min" sub="2 treinos" />
  <Stat label="Volume" tone="musc" value="9.840" unit="kg" delta={{ text: '+6%', dir: 'up', tone: 'good' }} />
  <Stat label="Recordes" value={null} />
</StatRow>
```

Com 4 colunas em 360 px cabem rótulos de uma palavra e valores de até 4 caracteres.

### Ring

```ts
Ring({ value, size?, stroke?, tone?, label?, sub?, children?, ariaLabel? })
```

`value` de 0 a 1. `size` em px (padrão 124); `stroke` proporcional ao tamanho, se omitido. `label` é o número
grande do centro e `sub` a legenda mono; `children` substitui os dois. Abaixo de 70 px use só `label`.

```tsx
<Ring value={4 / 6} label="4/6" sub="treinos" ariaLabel="4 de 6 treinos feitos na semana" />
```

### Meter e ProgressBar

```ts
Meter({ value, max, tone?, label?, right? })
ProgressBar({ value, tone?, mark?, label? })   // value de 0 a 1
```

`Meter` = nome à esquerda, texto à direita (`right`) e a barra. `ProgressBar` é só a barra de 6 px; `mark` (0 a 1)
desenha o fio de "ritmo esperado" e `label` é a descrição para leitor de tela.

```tsx
<Meter label="Minutos de corrida" value={85} max={120} tone="corrida" right={<>85 <span>de 120 min</span></>} />
<ProgressBar value={0.5} mark={4 / 7} label="Semana 4 de 7 do bloco de retorno" />
```

### WeekStrip

```ts
WeekStrip({
  days: { date: string; letter: string; num: number;
          marks: { tone: 'corrida' | 'musc' | 'mob'; done: boolean }[];
          today: boolean; selected: boolean }[],
  onSelect(date)
})
```

Sete botões (segunda a domingo): letra mono, número e os marcadores (cheio = feito, contorno = planejado).
"Hoje" tem contorno âmbar de 1,5 px e número âmbar; o selecionado ganha fundo. Cada dia tem 68 px de altura (alvo de
toque) e um `aria-label` como "Dia 14, hoje: musculação planejada".

```tsx
<WeekStrip days={dias} onSelect={setDia} />
```

### Bars

```ts
Bars({ data: { label: string; value: number; value2?: number; highlight?: boolean }[],
       unit?, tone?, tone2?, target?, height?, format?, ariaLabel? })
```

- Barras verticais com topo arredondado, eixo Y de 3 marcas redondas e grade discreta. Altura padrão 160 px.
- Se algum item tiver `value2`, o gráfico vira **planejado × feito**: `value` é a barra larga e clara (planejado) e
  `value2` a barra interna sólida (feito), em `tone2` (padrão: o mesmo tom).
- `highlight` destaca a barra (semana atual): as outras ficam a 55% e o rótulo dela vai para `--fg`.
- `target` desenha a linha tracejada com "meta ‹valor› ‹unit›".
- Os rótulos do eixo X se espaçam sozinhos quando não cabem (contando a partir do último).
- Sem dados, mostra o estado vazio "Sem dados ainda".

```tsx
<Bars data={porSemana.map((s) => ({ label: fmtDiaMes(s.semana), value: s.min }))} unit="min" tone="corrida" target={120} />
<Legend items={[{ label: 'Planejado', tone: 'corrida', kind: 'soft' }, { label: 'Feito', tone: 'corrida', kind: 'box' }]} />
<Bars data={[{ label: '9/11', value: 60, value2: 60 }, { label: '16/11', value: 80, value2: 45, highlight: true }]} unit="min" tone="corrida" />
```

### LineChart e Legend

```ts
LineChart({ series: { points: { x: string; y: number }[]; tone?; dashed?; area?; label? }[],
            target?, height?, yFormat?, xFormat?, ariaLabel? })
Legend({ items: { label: string; tone?; kind?: 'line' | 'dash' | 'box' | 'soft' }[] })
```

- Eixo X de tempo quando todos os `x` são datas `AAAA-MM-DD` (rótulos "14 nov"); senão, por posição, na ordem em que
  os rótulos aparecem. `xFormat` troca o texto dos rótulos.
- Série normal: linha de 1,75 px com pontos (até 24) e o último ponto maior, com halo. `dashed`: tracejada e sem
  pontos (média, tendência). `area`: preenche sob a linha.
- `target`: linha tracejada com "meta ‹valor›", na cor da primeira série não tracejada.
- Com 2 ou mais séries com `label`, a legenda aparece sozinha acima do gráfico. `Legend` também pode ser usada à
  parte (por exemplo, com `Bars`).
- Com menos de 2 pontos, mostra o estado vazio "Poucos pontos ainda". Altura padrão 170 px.

```tsx
<LineChart
  series={[
    { points: pesos.map((p) => ({ x: p.data, y: p.kg })), tone: 'peso', area: true, label: 'Peso' },
    { points: pesos.map((p) => ({ x: p.data, y: p.media })), tone: 'muted', dashed: true, label: 'Média' },
  ]}
  target={80}
/>
```

### Spark

```ts
Spark({ values: number[], tone?, width?, height? })   // padrão 120 × 30
```

Linha de 1,5 px com o último ponto marcado. É decorativa (`aria-hidden`): o valor fica no texto ao lado. Com menos
de 2 valores não desenha nada.

```tsx
<Spark values={[84.6, 84.1, 83.6, 82.9, 82.1]} tone="peso" />
```

### Heat

```ts
Heat({ weeks: { date: string; corrida: boolean; musc: boolean; mob: boolean }[][], todayISO, legend? })
```

Mapa de consistência: colunas = semanas (da mais antiga para a atual), linhas = segunda a domingo. Cada dia leva
até 3 pontos nas cores das áreas; hoje tem contorno âmbar e os dias futuros ficam apagados. O nome do mês aparece
quando muda. Recebe direto o resultado de `mapaDeTreinos(state, 12)`. `legend={false}` esconde a legenda.

```tsx
<Heat weeks={mapaDeTreinos(state, 12)} todayISO={hoje()} />
```

### IntensityChart

```ts
IntensityChart({ blocks: RunBlock[], height?, compact?, cursorSec?, label? })
```

Perfil de um treino de corrida. Uma barra por passo (repetições expandidas), largura proporcional ao tempo, altura
pelo `level` (1 → 30%, 5 → 100%), cor `--lv-N`, topo arredondado e 1 px de separação.

- Normal: 120 px de barras + eixo de tempo (0, meio e fim, em minutos).
- `compact`: 36 px, sem eixo, para cartões e listas.
- `cursorSec`: segundos corridos; apaga o que já passou e desenha a linha de progresso (corrida guiada).
- `label`: texto do `aria-label` (padrão: "Perfil do treino: 25 min em 13 passos, intensidade máxima 5 de 5").

```tsx
<IntensityChart blocks={treino.blocks} />
<IntensityChart blocks={treino.blocks} compact />
<IntensityChart blocks={treino.blocks} height={84} cursorSec={decorrido} />
```

### TimerRing

```ts
TimerRing({ total, left, size?, tone?, children })
```

Anel grande de contagem regressiva: cheio no início, vazio em zero. `total` e `left` em segundos (`left` pode ser
fracionado; atualize pelo relógio, a cada 250 ms). `size` é o diâmetro máximo (padrão 240): o anel encolhe se o
contêiner for menor. O centro vem em `children`. O anel é decorativo: quem anuncia o tempo é o conteúdo do centro.

```tsx
<TimerRing total={90} left={restam} tone="accent">
  <span>Descanso</span>
  <b class="num">{fmtDur(restam)}</b>
</TimerRing>
```

### Apoio (`ui/viz-util.ts`)

`Tone`, `AreaTone`, `toneColor(tone)`, `useWidth()` (largura medida do contêiner), `niceTicks()`, `fmtNum()`,
`barPath()`, `rotuloData()`. Uso interno dos gráficos; as telas normalmente não precisam.

## Boneco animado (`Figure.tsx`)

`Figure({ id?, def?, play?, paused?, tone?, label?, class? })`: o boneco articulado de um exercício, em proporção
4:3, na largura do contêiner.

- `id`: id da animação em `src/data/anim` (o mesmo do exercício). `def`: um `RigDef` direto, quando não vem do índice.
- `play`: `'visible'` (padrão: anima enquanto estiver na tela), `'always'` ou `'never'` (pose de capa parada, para
  listas e miniaturas). Com "reduzir movimento" ligado no sistema, fica parada.
- `paused`: pausa sem desmontar (treino pausado).
- `tone`: `'musc'` (padrão), `'corrida'` ou `'mob'`: a cor do destaque muscular.
- `label`: texto alternativo; sem ele a figura é decorativa.

As cores e as variantes vêm de `src/styles/figure.css`:

O componente é `src/ui/Figure.tsx`; `figure.css` só dá as cores e as variantes.

| Classe | Efeito |
| --- | --- |
| `.ui-fig` | bloco 4:3, raio `--r`, fundo `var(--fig-bg, var(--surface-2))` |
| `.ui-fig--musc` / `--corrida` / `--mob` | cor do destaque muscular (`--fig-hl`); vem da prop `tone` |
| `.ui-fig--thumb` | miniatura quadrada de 64 px, raio `--r-sm` (listas; use com `play="never"`) |
| `.ui-fig--plain` | sem fundo, direto sobre o cartão |
| `.ui-fig--empty` | sem animação cadastrada: silhueta apagada em moldura tracejada (automático) |

`--fig-bg` troca o fundo do bloco e, junto, a cor dos recortes (`.f-cut`) que separam partes sobrepostas. Em
`--plain` os recortes assumem `--surface`; sobre outro fundo, informe `--fig-bg`.

```tsx
<Figure id="agachamento-livre" tone="musc" label="Agachamento livre" />
<Figure id="prancha" tone="mob" play="never" class="ui-fig--thumb" />
```

Como criar uma animação: `docs/ANIMACOES.md`.

## Foto do exercício (`ExMedia.tsx`)

`ExMedia({ id?, def?, play?, paused?, tone?, label?, class? })`: a imagem principal de um exercício. Tem as MESMAS
props de `Figure` e é o que as telas usam para mostrar um exercício por id.

- Com foto no aparelho para o `id` (`lib/midia.ts`): mostra a foto no mesmo bloco de `Figure` (`.ui-fig`: 4:3, raio
  `--r`, e as variantes como `.ui-fig--thumb` continuam valendo), com `object-fit: cover`.
- Com foto, `play` diferente de `'never'` e bloco com 150 px de largura ou mais: aparece no canto um botão pequeno "ver animação" / "ver foto" que troca
  a foto pelo boneco e de volta (some se o exercício não tem animação). Nesse bloco grande, uma foto em pé (as da
  ficha do treinador são 9:16) aparece inteira, sobre uma cópia desfocada dela mesma, em vez de cortada.
- Sem foto (ou se a imagem não abrir): renderiza `Figure` com as mesmas props, exatamente como antes.
- `label` vira o texto alternativo da foto (um prefixo "Animação: " é trocado por "Foto: ").

As fotos NÃO fazem parte do app (o repositório é público): chegam por um pacote que o usuário importa em
Ajustes › Dados e ficam só no aparelho. Ao importar ou apagar, todo `ExMedia` montado se atualiza sozinho.
Estilos em `src/styles/media.css` (`.ui-media`, `.ui-media-img`, `.ui-media-alt`), importado no `main.tsx` logo
depois de `figure.css`.

```tsx
<ExMedia id="leg-press-45" tone="musc" label="Leg press 45" />
<ExMedia id="prancha" tone="mob" play="never" class="ui-fig--thumb" />
```

Use `Figure` direto só quando a intenção é mostrar o boneco (kit de demonstração, `def` avulso).

## Ícones (`Icon.tsx`)

`Icon({ name, size?, class? })`: SVG inline 24 × 24, traço 1,75, pontas redondas, cor do texto (`currentColor`),
sempre decorativo (`aria-hidden`). `size` em px (padrão 20). Tipo `IconName`; lista em `ICON_NAMES`.

`hoje`, `corrida`, `musculacao`, `mobilidade`, `progresso`, `ajustes`, `play`, `pause`, `pular`, `voltar`, `avancar`,
`fechar`, `check`, `mais`, `menos`, `relogio`, `cronometro`, `coracao`, `balanca`, `info`, `link-externo`, `trocar`,
`nota`, `calendario`, `baixar`, `enviar`, `lixeira`, `som`, `voz`, `vibrar`, `tela`, `sol`, `lua`, `fogo`, `trofeu`,
`repetir`, `editar`, `buscar`, `descanso`, `alvo`, e mais `alerta`, `ok`, `copiar`, `estrela`, `subir`, `abrir`.

## Classes utilitárias

De `base.css`:

| Classe | Uso |
| --- | --- |
| `.num` | Algarismos tabulares (colunas de números, cronômetros). |
| `.sr-only` | Só para leitores de tela. |

Variáveis de área segura (use no lugar de `env()`): `--safe-top`, `--safe-right`, `--safe-bottom`, `--safe-left`.

De `ui.css`:

| Classe | Uso |
| --- | --- |
| `.ui-eyebrow` | Rótulo mono em caixa alta, 10,5 px, espaçado. |
| `.ui-tag` | Etiqueta mono em caixa alta (o que `Tag` usa). |
| `.ui-note` | Nota de 12 px em `--muted`; `<b>` dentro dela volta à cor do texto. |
| `.ui-muted` | Texto secundário. |
| `.ui-display` | Voz do display (Barlow Condensed 600); defina o tamanho. |
| `.ui-val`, `.ui-val.is-sm` | Número em destaque (38 ou 28 px) com `<small>` para a unidade. Junte `.num`. |
| `.ui-link` | Link-botão discreto e sublinhado ("ver tudo", "editar", "desfazer"). |
| `.ui-stack`, `.ui-stack.is-sm` | Pilha vertical com 12 ou 6 px. |
| `.ui-inline` | Linha que quebra, com 8 px (botões lado a lado, pills). |
| `.ui-split` | Dois lados opostos na mesma linha. |
| `.ui-grow` | Ocupa o espaço que sobra em uma linha. |
| `.ui-grid`, `.ui-g-2`, `.ui-g-3` | Grade de 12 px com 2 ou 3 colunas iguais. |
| `.ui-form` | Pilha de campos com 14 px. |
| `.ui-mt`, `.ui-mt-sm` | Margem de cima de 14 ou 8 px. |
| `.ui-dot` | Quadradinho de 8 px na cor de `--ui-area`. |
| `.ui-area-corrida`, `-musc`, `-mob`, `-peso` | Definem `--ui-area` para quem estiver dentro. |
| `.ui-banner`, `.ui-banner.is-accent` | Aviso dentro do fluxo: ícone, texto (`.ui-grow`) e um botão pequeno. |
| `.ui-toast` (+ `.is-ok`, `.is-erro`, `.is-info`) | O desenho do aviso, para quem precisar dele parado. |

Tokens acrescentados para o kit (em `tokens.css`): `--veil` (véu atrás da folha) e `--shadow-sm` (pastilha ativa do
segmento).

## Receitas

### Tela padrão: `Screen` + `Card` + `Button`

A tela rola com a página; a barra de abas é da casca e o `Screen` já reserva o espaço dela. A ação principal vai
no rodapé fixo (um só botão primário por tela).

```tsx
import { Button, Card, Pill, Screen, Section } from '../../ui/index.ts';
import './corrida.css';

export function RunDetailScreen({ id }: { id: string }) {
  return (
    <Screen eyebrow="Qua 18 nov" title="Rodagem leve" back="/corrida"
      footer={<Button variant="primary" icon="check" onClick={registrar}>Registrar treino</Button>}>
      <Section title="Treino">
        <Card area="corrida" title="45 min" action={<Pill tone="accent">no relógio</Pill>}>
          <p class="ui-muted">FC 130 a 152 bpm, conversando sem esforço.</p>
        </Card>
      </Section>
    </Screen>
  );
}
```

### Tela cheia de tocar, sem barra de abas

As rotas `/musculacao/sessao`, `/corrida/guiada/:id` e `/mobilidade/tocar/:id` já ficam sem a barra de abas (quem
esconde é a casca). Na tela, use `tabs={false}` para o `Screen` não reservar esse espaço, mantenha a tela ligada e
desça os avisos para perto do rodapé com `--ui-toast-offset`. Timers sempre pelo relógio (`useAgora`).

```tsx
import { useAgora, useTelaLigada } from '../../lib/feedback.ts';
import { fmtDur } from '../../lib/format.ts';
import { Button, Screen, TimerRing } from '../../ui/index.ts';

export function RoutinePlayerScreen({ id }: { id: string }) {
  useTelaLigada(true);
  const agora = useAgora();
  const restam = Math.max(0, (fim - agora) / 1000);
  return (
    <div class="mo-tocar">
      <Screen title="Alongamento pós-corrida" back={`/mobilidade/rotina/${id}`} tabs={false}
        footer={<><Button icon="pause" onClick={pausar}>Pausar</Button><Button icon="pular" onClick={pular}>Pular</Button></>}>
        <TimerRing total={60} left={restam} tone="mob">
          <b class="num">{fmtDur(Math.ceil(restam))}</b>
        </TimerRing>
      </Screen>
    </div>
  );
}
```

O aviso (`toast`) é desenhado fora da tela, em `document.body`: para ele descer nas telas sem barra de abas,
defina `--ui-toast-offset` no `:root` enquanto a tela estiver montada (por exemplo, com uma classe no
`document.documentElement` posta e tirada em um `useEffect`). Para travar a rolagem elástica do corpo, a feature
dá altura fixa ao próprio contêiner (`.mo-tocar { height: 100dvh; overflow: hidden }`) e deixa rolar só o que precisar.

### Folha de confirmação

Nada de `confirm()`: a pergunta é o título da folha, a consequência vai no corpo e as duas respostas no rodapé
(cancelar à esquerda, a ação à direita; `danger` quando apaga).

```tsx
const [apagar, setApagar] = useState(false);

<Button variant="danger" icon="lixeira" onClick={() => setApagar(true)}>Apagar treino</Button>
<Sheet open={apagar} onClose={() => setApagar(false)} title="Apagar este treino?"
  footer={<>
    <Button onClick={() => setApagar(false)}>Cancelar</Button>
    <Button variant="danger" icon="lixeira" onClick={confirmarApagar}>Apagar</Button>
  </>}>
  <p class="ui-muted">As séries e os recordes deste treino saem do histórico.</p>
</Sheet>

function confirmarApagar() {
  remover();
  setApagar(false);
  toast('Treino apagado', { action: { label: 'Desfazer', onClick: desfazer } });
}
```

### Estado vazio

Toda lista e todo gráfico têm um estado vazio desenhado: o que falta, uma frase de como começar e no máximo um
botão pequeno. `Bars` e `LineChart` já mostram o próprio estado vazio quando não há dados.

```tsx
{runs.length === 0 ? (
  <Empty icon="corrida" title="Nenhuma corrida registrada"
    text="Registre a corrida de hoje ou importe o histórico em Ajustes."
    action={<Button size="sm" icon="mais" onClick={nova}>Adicionar corrida</Button>} />
) : (
  <List>{runs.map((r) => <Row key={r.id} title={fmtData(r.data)} sub={fmtMin(r.min)} right={<>{num(r.km)}<small>km</small></>} />)}</List>
)}
```
