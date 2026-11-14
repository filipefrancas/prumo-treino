# Como criar uma animação de exercício

Cada exercício, alongamento ou educativo do app tem uma animação própria feita com um boneco articulado ("rig").
Uma animação é um arquivo `src/data/anim/<id>.ts` que exporta por padrão um `RigDef` (tipos em `src/rig/types.ts`).
O `id` do `RigDef` é igual ao nome do arquivo (kebab-case, sem acentos).

O motor (`src/rig/*`) NÃO deve ser alterado para acomodar uma animação. Se faltar um recurso, registre no seu relatório.

## Ciclo de trabalho (obrigatório)

1. Escreva o arquivo.
2. Rode `npm run fig -- <id>` na raiz do projeto. Isso valida a animação e gera `.out/fig/<id>.png`,
   uma folha com as keys (K0, K1, …) e os quadros intermediários. Use `--frames 3` para ver mais intermediários.
3. ABRA o PNG com a ferramenta Read e olhe de verdade. Pergunte: uma pessoa que treina reconheceria o exercício
   sem ler o nome? Há membro atravessando o corpo, o chão ou um aparelho? O pé desliza? A mão solta a barra?
4. Corrija e repita até ficar certo. Normalmente são de 3 a 6 voltas.
5. Confira também o tema claro: `npm run fig -- --light <id>` (gera `<id>-claro.png`).

A validação imprime avisos: alvo de IK fora de alcance, articulação abaixo do chão ou fora do palco, mistura de IK e FK.
Erros precisam ser zerados. Avisos precisam ser zerados ou justificados no relatório.

## Palco, medidas e ângulos

- Palco de 240 × 180. x cresce para a direita, y cresce para BAIXO. O enquadramento é automático: o app recorta
  em 4:3 ao redor do que foi desenhado, então posicione com liberdade, de preferência perto do centro (x ≈ 120).
- Chão em y = 160 (campo `ground`; use `null` para esconder).
- Ângulos em graus na tela: 0 = direita, 90 = baixo, 180 = esquerda, -90 = cima.
- Ossos: tronco 31 · pescoço até o centro da cabeça 12,5 · cabeça raio 7,2 · braço 16,5 · antebraço 15,5 ·
  coxa 24,5 · canela 23,5 · pé 9,6 (1,8 atrás do tornozelo, 7,8 à frente).
- Espessuras: tronco de lado 13,5 · coxa 9 · canela 7,2 · braço 6,2 · antebraço 5,4 · pé 5,4.

Alturas de contato com o chão (y = 160):

| Situação | Valor |
| --- | --- |
| Pé apoiado (tornozelo) | y = 157 |
| Em pé, pernas retas (quadril) | y ≈ 109 (use 110 a 111 para joelhos "soltos") |
| Deitado de costas ou de bruços (quadril e ombros) | y ≈ 153 |
| Sentado no chão (quadril) | y ≈ 153 |
| Joelho apoiado no chão | y ≈ 156 |
| Mão espalmada no chão (punho) | y ≈ 157 |
| Antebraço apoiado no chão (cotovelo e punho) | y ≈ 157 |
| Na ponta dos pés (tornozelo) | y ≈ 150, com `footAngle` ≈ 96 |

## Pose

```ts
base: {
  hip: [116, 110.5],   // centro do quadril
  torso: -84,          // direção quadril → ombros. -90 = em pé; 0 = deitado, cabeça à direita; 180 = cabeça à esquerda
  head: -84,           // direção ombros → cabeça (padrão: igual ao tronco)
  footN: [124, 157],   // tornozelo da perna próxima (IK)
  footF: [119, 157],   // tornozelo da perna distante (IK)
  ...
}
```

`N` = membro próximo da câmera (tom claro, desenhado por cima). `F` = membro distante (tom apagado, por trás).
Na vista de frente (`view: 'front'`), `N` é o lado direito da tela e `F` o esquerdo, com o mesmo tom.

`facing` (padrão 1): com o tronco em pé (-90), o peito aponta para a direita. A frente do corpo é sempre o lado
`torso + 90°` (para `facing: 1`). Exemplos:

| Posição | torso | facing | Peito aponta para |
| --- | --- | --- | --- |
| Em pé olhando para a direita | -90 | 1 | direita |
| Em pé olhando para a esquerda | -90 | -1 | esquerda |
| Deitado de costas, cabeça à esquerda | 180 | 1 | cima |
| Deitado de costas, cabeça à direita | 0 | -1 | cima |
| De bruços / prancha, cabeça à direita | 0 (ou -7) | 1 | baixo |
| De bruços, cabeça à esquerda | 180 | -1 | baixo |
| Sentado no chão olhando para a direita | -90 | 1 | direita |

### Braços e pernas: IK ou FK

Cada membro usa UM dos dois modos, o mesmo em todas as keys do exercício.

- **IK (alvo)**: você diz onde a mão (`handN`/`handF`) ou o tornozelo (`footN`/`footF`) está, e o motor acha
  o cotovelo/joelho. Use em tudo que tem ponto de apoio fixo: pés no chão num agachamento, mãos na barra,
  mãos no chão numa flexão. O alvo interpolado em linha reta mantém o pé plantado enquanto o quadril se move.
  - `elbowN`/`elbowF`/`kneeN`/`kneeF` (pole) dizem para onde a articulação aponta:
    `'front'`/`'back'` (em relação ao corpo), `'up'`/`'down'`/`'left'`/`'right'` (em relação à tela),
    `'cam'` (dobra em direção à câmera: o membro sai reto e encurtado) ou um vetor `[dx, dy]`.
    Padrões: joelho `'front'`, cotovelo `'back'`; na vista de frente, joelho `'cam'` e cotovelo `'down'`.
  - Se o alvo está mais longe que o comprimento do membro, ele fica esticado e NÃO alcança (aviso na validação).
- **FK (ângulos)**: `armN: [braço, antebraço]`, `legN: [coxa, canela]`, com ângulos absolutos de tela.
  Use em movimentos de rotação livre: rosca (o cotovelo fica parado e o antebraço gira), elevação lateral,
  cadeira extensora, mesa flexora, chutes, pernas de quem está deitado.
- Sem nenhum dos dois, o membro fica pendurado ao longo do tronco.

A mão também pode ficar presa a uma articulação já resolvida, o que é ideal em alongamentos e para segurar barras
apoiadas no corpo: `handN: { at: 'kneeN', d: [2, 3] }` (segurando o joelho), `{ at: 'ankleF' }` (segurando o pé),
`{ at: 'shoulder', d: [-5, 0] }` (barra nas costas), `{ at: 'head', d: [0, 4] }` (mãos atrás da cabeça),
`{ at: 'hip', d: [4, -6] }` (mãos na cintura). Âncoras: `hip`, `hipN/F`, `shoulder`, `shoulderN/F`, `head`,
`kneeN/F`, `ankleN/F`, `toeN/F`, `heelN/F`.

Outros campos: `footAngleN`/`footAngleF` (direção do pé, do calcanhar para os dedos; o padrão é perpendicular à
canela, apontando para a frente do corpo), `torsoScale`, `armScaleN/F`, `legScaleN/F` (encurtamento por perspectiva,
entre 0,4 e 1).

## Keys e tempo

```ts
keys: [
  { pose: {}, dur: 1.3, hold: 0.4 },                              // K0: pose base
  { pose: { hip: [98, 137], torso: -56 }, dur: 1.6, hold: 0.3 },  // K1: só o que muda
],
```

O ciclo é K0 → K1 → … → K0. `dur` é o tempo para CHEGAR àquela key; `hold` é a pausa nela.
`ease`: `'inOut'` (padrão), `'in'`, `'out'`, `'linear'`.

- Exercício de força: 2 keys (início e fim do movimento). Descida controlada de 1,4 a 1,8 s, subida de 1,0 a 1,3 s,
  pausas de 0,2 a 0,4 s. Ciclo total entre 3 e 4,5 s.
- Isometria (prancha): 2 keys quase iguais com 1 unidade de diferença no quadril ("respiração"), 2 s cada.
- Alongamento: K0 = posição confortável, K1 = alongando um pouco mais. 2 a 2,5 s para entrar, `hold` de 1 a 2 s,
  volta suave. Ciclo de 5 a 8 s. O movimento é pequeno: é um alongamento, não uma repetição.
- Educativo de corrida ou exercício alternado: 3 ou 4 keys (um lado, neutro, outro lado), ciclo de 1,2 a 2,5 s.
- Use `thumb` para escolher a key que vira miniatura (padrão: K1).

## Acessórios (`props`)

Primitivas: `line` (`from`, `to`, `w`), `circle` (`c`, `r`, `ring` = espessura do aro), `rect` (`c` = centro, `w`, `h`,
`rot` em graus, `along: [p1, p2]` para alinhar com a direção entre dois pontos e acompanhar o movimento,
`r` = raio do canto). Cada ponto é `[x, y]` fixo no palco ou preso a uma articulação:
`{ at: 'handN', d: [0, -2] }`. `tone`: `'eq'` (aparelho, padrão), `'eq2'` (mais apagado: colchonete, estrutura),
`'soft'` (bem discreto), `'hl'` (destaque). `layer`: `'back'` (padrão, atrás do boneco) ou `'front'`.

Receitas:

- **Colchonete**: `{ k: 'rect', c: [112, 161.6], w: 130, h: 3, tone: 'eq2' }`.
- **Barra com anilha, de lado**: aro `{ k: 'circle', c: { at: 'handN' }, r: 10, ring: 2.6, layer: 'front' }` mais
  o miolo `{ k: 'circle', c: { at: 'handN' }, r: 2.2, layer: 'front' }`. Anilha pequena: r de 7 a 8.
- **Barra de frente**: linha passando pelas duas mãos, com um retângulo em cada ponta como anilha.
- **Halter de lado**: círculo cheio r ≈ 4,2 preso à mão. **De frente**: retângulo 10 × 4 preso à mão
  (`along: [{ at: 'elbowN' }, { at: 'handN' }], rot: 90` mantém o halter atravessado na mão).
- **Banco reto**: tampo `{ k: 'rect', c: [118, 126], w: 96, h: 6, r: 3 }` mais dois pés (linhas de y = 129 a 160).
  Deitado no banco, quadril e ombros ficam em y ≈ 116.
- **Banco inclinado / encosto**: retângulo com `rot` (por exemplo -55) atrás do tronco, mais o assento.
- **Polia / cabo**: linha fina (`w: 1.2`) de um ponto fixo `[x, y]` até `{ at: 'handN' }`, e a torre como retângulo `eq2`.
- **Máquina**: desenhe só o que explica o movimento: assento, encosto, apoio (rolo = círculo preso ao tornozelo
  ou ao joelho) e a linha do braço da máquina. Menos é mais.
- **Degrau / caixa**: `{ k: 'rect', c: [130, 153], w: 50, h: 14, r: 2, tone: 'eq2' }`; o pé apoia em y = topo - 3.
- **Rolo de liberação**: `{ k: 'circle', c: [x, 153], r: 7, ring: 2.2 }` debaixo da região trabalhada.
- **Parede**: linha vertical `eq2` com `w: 3`. **Toalha / faixa**: linha `eq` com `w: 2`.

## Destaque e setas

`focus` pinta de roxo (força), laranja (corrida) ou verde-azulado (mobilidade) a musculatura trabalhada ou alongada.
Valores: `upperArmN/F`, `forearmN/F`, `thighN/F`, `shinN/F`, `torso`, `chest`, `abs`, `upperBack`, `lowerBack`,
`glutes`, `shoulderN/F`, `hipN/F`, `neck`. Use de 1 a 3 regiões: o que mais trabalha, não tudo o que participa.
Panturrilha = `shinN`; posterior e quadríceps = `thighN`; bíceps e tríceps = `upperArmN`; dorsal = `upperBack`.

`arrows` (opcional) mostra a direção do esforço ou do alongamento: `{ from, to, bend }`, com pontos fixos ou presos
a articulações. No máximo 2 setas, curtas (12 a 22 unidades), sem cobrir o boneco.

`order` muda a ordem de desenho (fundo → frente). Padrão de lado: `legF, armF, torso, head, legN, armN`.
Padrão de frente: `legF, legN, torso, head, armF, armN`.

## Qualidade

- Escolha a vista em que o movimento principal acontece no plano da tela. De lado: agachamento, stiff, supino,
  remada, rosca, tríceps, prancha, panturrilha, quase todos os alongamentos. De frente: elevação lateral,
  desenvolvimento, puxada, abdução, afundo lateral, borboleta, alongamento de adutores.
- O membro distante deve aparecer: desloque os alvos de `F` de 3 a 6 unidades em x, ou varie um pouco os ângulos.
- Pés e mãos apoiados NÃO se mexem entre as keys (mesmo alvo em todas).
- Coluna neutra: a cabeça acompanha o tronco (diferença de até 15° entre `head` e `torso`), salvo quando o
  exercício pede outra coisa.
- Amplitude real: agachamento até a coxa paralela, rosca sem balançar o cotovelo, supino até a barra perto do peito.
- O boneco precisa caber inteiro no quadro em todas as keys, com folga para barras e aparelhos.
- Exercício unilateral ou alongamento com lado: anime o lado DIREITO do corpo como o membro próximo (`N`).
  O app avisa a troca de lado por texto.

## Exemplos prontos

Veja `agachamento-livre.ts` (IK com pés plantados e mãos presas ao ombro), `rosca-direta.ts` (FK no braço),
`prancha.ts` (isometria), `joelhos-ao-peito.ts` (deitado, mãos presas aos joelhos, seta) e
`elevacao-lateral.ts` (vista de frente) em `src/data/anim/`.
