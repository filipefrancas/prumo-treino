# Catálogo de exercícios

Fonte única dos ids. Cada id abaixo tem arquivos com o MESMO nome:

- `src/data/ex/<id>.ts`: os textos (`Exercise`, ver `src/types.ts`), obrigatório;
- `src/assets/fotos/<id>.jpg`: a foto do exercício (paisagem 4:3), que é o que o app mostra quando existe;
- `src/data/anim/<id>.ts`: a animação (`RigDef`), ver `docs/ANIMACOES.md`. É OPCIONAL: os exercícios novos
  (seção 5) não têm animação e usam só a foto.

Colunas: **id** · **nome no app** · **tipo** (`kind`) · **grupo** (`group`) · **vista** sugerida para a animação ·
**movimento** (o que a animação precisa mostrar: K0 → K1).

Regras gerais para as animações: exercício unilateral ou com lado mostra o lado direito do corpo como membro
próximo (`N`); aparelhos são desenhados só com o essencial (assento, encosto, apoio, alavanca ou cabo).

## 1. Musculação: exercícios da ficha antiga (seguem na biblioteca)

### Lote M1 · Costas e bíceps (ficha A)

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `remada-cavalinho` | Remada cavalinho (pegada neutra) | forca | costas | lado | Em pé, joelhos semiflexionados, tronco inclinado à frente a uns 45°, coluna reta. Segura o puxador de uma barra presa ao chão por uma ponta (landmine), que sobe em diagonal do chão até as mãos, com anilha perto das mãos. K0: braços estendidos para baixo. K1: cotovelos sobem rente ao corpo e as mãos chegam ao abdômen. O tronco não balança. |
| `pulldown-unilateral` | Pulldown unilateral na máquina | forca | costas | lado | Sentado na máquina articulada de puxada, coxas presas sob o rolo, tronco ereto. Um braço só. K0: braço estendido para cima e levemente à frente, segurando o pegador da alavanca. K1: cotovelo desce até a lateral do tronco, mão na altura do ombro. O outro braço descansa na coxa. |
| `puxada-supinada` | Puxada supinada na polia | forca | costas | lado | Sentado na puxada alta, coxas sob o rolo, cabo descendo da polia no alto até a barra. K0: braços estendidos acima da cabeça segurando a barra. K1: barra desce até a parte alta do peito, cotovelos apontam para baixo e para trás, peito aberto, leve inclinação do tronco para trás. |
| `remada-maquina` | Remada na máquina (pegada pronada) | forca | costas | lado | Sentado, peito apoiado em um apoio vertical à frente, pés no chão. K0: braços estendidos à frente segurando os pegadores. K1: cotovelos vão para trás, na altura das costelas, mãos chegam perto do tronco. O peito não desencosta do apoio. |
| `crucifixo-inverso` | Crucifixo inverso com halteres | forca | ombros | lado | Deitado de bruços em um banco inclinado baixo (uns 30°), peito no banco, pés no chão atrás. K0: braços pendentes para o chão com um halter em cada mão. K1: braços abrem para os lados até a linha dos ombros (de lado, as mãos sobem até a altura das costas, com os braços encurtados pela perspectiva). Destaque: parte de trás do ombro e alto das costas. |
| `rosca-banco-inclinado` | Rosca no banco inclinado com halteres | forca | biceps | lado | Sentado em um banco inclinado a uns 60°, costas e cabeça apoiadas, braços pendentes para trás da linha do tronco, um halter em cada mão. K0: braços estendidos para baixo. K1: antebraços sobem até os halteres chegarem perto dos ombros. O cotovelo fica parado, apontando para o chão. |
| `rosca-scott-unilateral` | Rosca Scott unilateral com halter | forca | biceps | lado | Sentado no banco Scott, a parte de trás do braço apoiada no encosto inclinado à frente do corpo. Um braço só. K0: braço quase estendido sobre o apoio, halter embaixo. K1: antebraço sobe até o halter chegar perto do ombro. O braço não descola do apoio. |
| `elevacao-y-banco` | Elevação em Y no banco inclinado | forca | ombros | lado | Deitado de bruços em um banco inclinado a 30–45°, peito no banco. K0: braços pendentes para o chão com halteres leves. K1: braços sobem à frente e para cima, formando um Y com o tronco (de lado, os braços ficam alinhados com o tronco, acima da cabeça), com pausa de 2 s no alto. |

### Lote M2 · Peito, ombro e braço (ficha C)

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `supino-reto-maquina` | Supino reto na máquina | forca | peito | lado | Deitado de costas em um banco horizontal, joelhos flexionados com os pés apoiados no banco. Mãos nos pegadores na altura do peito. K0: pegadores perto do peito, cotovelos abaixo da linha do banco. K1: braços estendidos para cima. Desenhe a alavanca da máquina como uma linha presa às mãos. |
| `supino-inclinado-maquina` | Supino inclinado na máquina | forca | peito | lado | Sentado em uma máquina com o encosto inclinado para trás (uns 30° da vertical). K0: pegadores na altura da parte alta do peito, cotovelos para trás. K1: braços estendidos à frente e para cima, em diagonal. |
| `crucifixo-inclinado` | Crucifixo inclinado com halteres | forca | peito | lado | Deitado de costas em um banco inclinado a uns 30–45°, pés no chão. K0: braços abertos para os lados com cotovelos levemente flexionados, halteres na altura do peito (de lado, mãos na linha dos ombros e braços encurtados pela perspectiva), com pausa de 2 s no alongamento. K1: halteres se encontram acima do peito, braços quase estendidos apontando para cima. |
| `elevacao-lateral` | Elevação lateral com halteres | forca | ombros | frente | Em pé, de frente. K0: braços ao lado do corpo com um halter em cada mão. K1: braços sobem para os lados até a altura dos ombros, cotovelos levemente flexionados. Destaque nos dois ombros. |
| `desenvolvimento-maquina` | Desenvolvimento na máquina (pegada neutra) | forca | ombros | lado | Sentado, costas no encosto vertical. K0: mãos nos pegadores na altura dos ombros, cotovelos para baixo. K1: braços estendidos acima da cabeça. |
| `triceps-frances-polia` | Tríceps francês na polia | forca | triceps | lado | Em pé, de costas para a torre da polia, um pé à frente, tronco levemente inclinado à frente. Com a corda, nas duas mãos: cotovelos apontando para cima ao lado da cabeça, cabo vindo de trás (polia baixa). K0: antebraços dobrados para trás da cabeça, mãos atrás da nuca. K1: antebraços estendem para cima e para a frente até os braços ficarem retos. Os cotovelos não se mexem. |
| `triceps-paralela-maquina` | Tríceps paralela na máquina | forca | triceps | lado | Sentado na máquina de mergulho, tronco levemente inclinado à frente, pegadores ao lado do quadril. K0: cotovelos flexionados e altos, atrás do corpo, mãos na altura das costelas. K1: braços estendidos para baixo ao lado do corpo, empurrando os pegadores. |
| `abdominal-maquina` | Abdominal na máquina | core | core | lado | Sentado na máquina, pés presos sob os rolos, mãos nos pegadores ao lado da cabeça. K0: tronco ereto. K1: tronco enrola para a frente, aproximando o peito dos joelhos, com a lombar se afastando pouco do encosto. Destaque no abdômen. |

### Lote M3 · Inferiores (ficha B)

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `agachamento-halter-frente` | Agachamento com halter na frente | forca | pernas | lado | Em pé, segurando um halter junto ao peito com as duas mãos (cotovelos apontando para baixo). K0: em pé. K1: agachamento profundo, coxas paralelas ao chão ou um pouco abaixo, tronco o mais ereto possível, calcanhares no chão. |
| `recuo-com-halteres` | Recuo com halteres | forca | pernas | lado | Em pé, um halter em cada mão ao lado do corpo. K0: pés juntos. K1: a perna distante dá um passo para trás e o joelho de trás desce até quase tocar o chão; joelho da frente a 90° sobre o tornozelo; tronco ereto. Destaque na coxa e no glúteo da perna da frente (a próxima). |
| `leg-press-45` | Leg press 45° | forca | pernas | lado | Deitado no leg press inclinado: encosto a uns 45° no canto inferior, plataforma acima e à frente, pernas empurrando em diagonal para cima. K0: joelhos flexionados perto do peito, plataforma perto. K1: pernas quase estendidas, plataforma longe. Desenhe o encosto, o assento e a plataforma (retângulo preso aos pés, perpendicular às pernas). |
| `cadeira-extensora-unilateral` | Cadeira extensora unilateral | forca | pernas | lado | Sentado na cadeira extensora, costas no encosto, mãos nos apoios ao lado do assento. Uma perna só: rolo apoiado na frente do tornozelo. K0: joelho a 90°, canela para baixo. K1: perna estendida à frente, na horizontal. A outra perna fica parada, dobrada. |
| `flexao-nordica` | Flexão nórdica | forca | posterior | lado | Ajoelhado sobre um apoio, tornozelos presos atrás por um rolo, corpo reto dos joelhos à cabeça, braços cruzados no peito. K0: tronco na vertical. K1: corpo desce reto para a frente até uns 45°, dobrando só os joelhos, sem quebrar o quadril. Destaque na parte de trás das coxas. |
| `hiperextensao-lombar` | Hiperextensão de lombar | forca | posterior | lado | No banco de hiperextensão a 45°: coxas apoiadas no apoio inclinado, tornozelos presos embaixo, corpo em diagonal. K0: tronco pendendo para a frente e para baixo, dobrado no quadril. K1: tronco sobe até alinhar com as pernas (corpo reto em diagonal), mãos cruzadas no peito. Destaque na lombar e nos glúteos. |
| `panturrilha-leg-press` | Panturrilha no leg press horizontal | forca | panturrilha | lado | Sentado no leg press horizontal, pernas estendidas à frente, só a ponta dos pés na plataforma vertical. K0: calcanhares para a frente (pé flexionado, panturrilha alongada, pausa de 2 s). K1: ponta dos pés empurra a plataforma (pé em ponta). Só o tornozelo se mexe. Destaque na panturrilha. |
| `dorsiflexao-halter` | Dorsiflexão com halter | forca | panturrilha | lado | Sentado em um banco reto, pernas estendidas sobre o banco com os pés para fora da ponta, um halter preso entre os pés. K0: pés apontando para a frente (em ponta). K1: ponta dos pés puxa para cima, em direção às canelas, com pausa de 2 s. Só o tornozelo se mexe. Destaque na frente da canela. |
| `passada-lateral-elastico` | Passada lateral com elástico | aquecimento | gluteos | frente | Em pé, de frente, mãos na cintura, joelhos semiflexionados, um elástico curto em volta dos tornozelos. K0: pés na largura do quadril. K1: um pé dá um passo para o lado, esticando o elástico. K2: o outro pé acompanha. Destaque na lateral do quadril. |

### Lote M4 · Preparação das fichas (alongamento, mobilidade e ativação)

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `alongamento-peitoral-espaldar` | Alongamento de peitoral no espaldar | alongamento | peito | lado | Em pé, de costas para o espaldar (escada de barras na parede, desenhada como uma linha vertical com degraus), braços abertos para trás segurando as barras na altura dos ombros, cotovelos a 90°. K0: corpo perto da parede. K1: o corpo avança um passo à frente, o peito abre e os braços ficam para trás. Destaque no peito. |
| `alongamento-dorsal-espaldar` | Alongamento de dorsal no espaldar | alongamento | costas | lado | Pendurado pelas mãos na barra mais alta do espaldar, braços estendidos acima da cabeça, corpo solto, pés tocando de leve o chão ou um degrau. K0: pendurado. K1: quadril vai um pouco para trás, alongando as laterais das costas. Destaque no alto das costas. |
| `mobilidade-ombro-bastao` | Mobilidade de ombro com bastão | aquecimento | ombros | lado | Em pé, segurando um bastão na horizontal com as duas mãos atrás do corpo, braços estendidos. K0: bastão encostado no glúteo. K1: braços sobem para trás, afastando o bastão do corpo, sem inclinar o tronco. 10 repetições. Destaque nos ombros. |
| `alongamento-peitoral-fita` | Alongamento de peitoral com fita | alongamento | peito | frente | Em pé, de frente, braços abertos em cruz na altura dos ombros, segurando uma fita elástica que passa por trás das costas. K0: braços em cruz. K1: braços abrem um pouco mais para trás, peito para a frente. Destaque no peito. |
| `manguito-externo-elastico` | Manguito externo com elástico | aquecimento | ombros | lado | Em pé, de frente para o espaldar, segurando um elástico preso à frente na altura do peito. K0: braços estendidos à frente. K1: puxa o elástico com os cotovelos altos, na linha dos ombros, mãos ao lado do rosto. K2: gira os antebraços para cima (mãos acima dos cotovelos, braços em "candelabro"). K3: estende os braços acima da cabeça. Volta pelo mesmo caminho. Destaque no ombro. |
| `panturrilha-no-step` | Alongamento de panturrilha no degrau | alongamento | panturrilha | lado | Em pé com a ponta dos pés na borda de um degrau, calcanhares para fora, uma mão apoiada em uma barra ou parede à frente. K0: calcanhares na altura do degrau. K1: calcanhares descem abaixo do degrau, joelhos estendidos. Destaque na panturrilha. |
| `alongamento-adutor-step` | Alongamento de adutor sentado | alongamento | quadril | frente | Sentado em um degrau baixo, de frente, pernas bem abertas e estendidas para os lados, mãos apoiadas à frente no chão. K0: tronco ereto. K1: tronco inclina um pouco à frente entre as pernas. Destaque na parte interna das coxas. |
| `mobilidade-quadril-elastico` | Mobilidade de quadril com elástico | alongamento | posterior | lado | Deitado de costas no colchonete, cabeça à esquerda. Uma perna estendida no chão; a outra sobe estendida, com um elástico passando pela sola do pé e seguro pelas duas mãos (linha das mãos ao pé). K0: perna a uns 60° do chão. K1: perna chega perto da vertical, puxada pelo elástico. Destaque na parte de trás da coxa. |
| `anterior-quadril-flexao-tronco` | Mobilidade anterior de quadril | alongamento | quadril | lado | Meio-ajoelhado no colchonete: joelho de trás (perna distante) no chão, perna próxima à frente com o pé no chão e o joelho a 90°. K0: tronco ereto, quadril empurrado à frente (pausa de 2 s). K1: quadril volta e o tronco inclina à frente sobre a perna da frente, que estende um pouco. Destaque na frente do quadril da perna de trás. |

## 2. Alongamento completo (14 posições)

### Lote A1

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `joelhos-ao-peito` | Joelhos ao peito | alongamento | quadril | lado | Deitado de costas (cabeça à esquerda), abraça os dois joelhos e traz para o peito. K1 aproxima um pouco mais. Destaque na lombar e nos glúteos. |
| `joelho-ao-peito` | Um joelho ao peito | alongamento | quadril | lado | Deitado de costas, abraça um joelho (perna próxima) e puxa para o peito; a outra perna fica estendida no chão. Destaque no glúteo. |
| `figura-4-deitado` | Figura 4 deitado | alongamento | gluteos | lado | Deitado de costas, perna distante com o joelho dobrado e a coxa na vertical; o tornozelo da perna próxima cruza sobre esse joelho (o joelho próximo aponta para fora: desenhe a coxa encurtada pela perspectiva). As mãos seguram a coxa de baixo e puxam as duas pernas para o peito. Destaque no glúteo. |
| `torcao-deitado` | Torção deitado | alongamento | costas | lado | Deitado de costas, braços abertos em cruz (um aparece encurtado para cima da tela, o outro escondido). Um joelho dobrado cruza por cima do corpo e desce para o outro lado até perto do chão; ombros no chão. K0: joelho apontando para cima. K1: joelho cruzado, caído para a frente da tela. Destaque na lombar. |
| `quadriceps-deitado-de-lado` | Quadríceps deitado de lado | alongamento | pernas | lado | Deitado de lado (cabeça à esquerda, apoiada no braço de baixo estendido), perna de baixo estendida. A mão de cima segura o pé da perna de cima e puxa o calcanhar para o glúteo, joelho apontando para a direita. K1 puxa um pouco mais e leva o quadril à frente. Destaque na frente da coxa. |
| `afundo-ajoelhado` | Afundo ajoelhado | alongamento | quadril | lado | Um joelho no chão (perna distante atrás, sobre uma toalha) e o outro pé à frente com o joelho a 90°. Tronco ereto, mãos na cintura ou no joelho da frente. K0: quadril sobre o joelho de trás. K1: quadril avança e desce. Destaque na frente da coxa e do quadril da perna de trás. |
| `torcao-sentado` | Torção sentado | alongamento | gluteos | lado | Sentado no chão, perna distante estendida à frente. A perna próxima dobra e o pé cruza para o lado de fora do joelho estendido (joelho apontando para cima). O braço distante abraça o joelho dobrado e o tronco gira para trás, com a mão próxima apoiada no chão atrás do quadril. K1 gira um pouco mais. Destaque no glúteo e na lombar. |

### Lote A2 (e core)

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `pernas-afastadas` | Pernas afastadas | alongamento | quadril | frente | Sentado no chão, de frente, pernas bem abertas e estendidas. K0: tronco ereto, mãos no chão à frente. K1: tronco inclina à frente (use `torsoScale` menor) e as mãos avançam. Destaque na parte interna das coxas. |
| `uma-perna-estendida` | Uma perna estendida | alongamento | posterior | lado | Sentado no chão, perna próxima estendida à frente, a outra dobrada com a sola do pé na coxa. K0: tronco ereto. K1: tronco inclina sobre a perna estendida e as mãos alcançam o pé. Destaque na parte de trás da coxa. |
| `borboleta` | Borboleta | alongamento | quadril | frente | Sentado no chão, de frente, solas dos pés juntas à frente do quadril, mãos segurando os pés, joelhos abertos para os lados. K0: joelhos altos. K1: joelhos descem em direção ao chão; tronco ereto. Destaque na parte interna das coxas. |
| `pernas-juntas-a-frente` | Pernas juntas à frente | alongamento | posterior | lado | Sentado no chão, pernas estendidas e juntas à frente. K0: tronco ereto, mãos nos joelhos. K1: tronco inclina à frente, mãos alcançam os pés. Destaque na parte de trás das coxas. |
| `sentado-nos-calcanhares` | Sentado nos calcanhares | alongamento | pernas | lado | Ajoelhado, sentado sobre os calcanhares, peito dos pés no chão. K0: tronco ereto. K1: tronco inclina para trás com as mãos apoiadas no chão atrás do corpo. Destaque na frente das coxas. |
| `cachorro-olhando-para-baixo` | Cachorro olhando para baixo | alongamento | panturrilha | lado | Mãos e pés no chão, quadril no alto, corpo em V invertido, cabeça entre os braços. K0: calcanhares levantados. K1: calcanhares descem para o chão e o quadril sobe. Destaque na panturrilha e na parte de trás das coxas. |
| `prancha` | Prancha | core | core | lado | Prancha no antebraço: cotovelos sob os ombros, corpo reto dos calcanhares à cabeça. Isometria, com respiração mínima. Destaque no abdômen. |
| `prancha-lateral` | Prancha lateral | core | core | lado | De lado, apoiado no antebraço de baixo (cotovelo sob o ombro) e na lateral do pé; corpo reto em diagonal, de frente para a câmera; mão de cima na cintura. K0: quadril alinhado. K1: quadril 1 unidade mais alto (respiração). Destaque no abdômen. |

## 3. Core, pés e liberação

### Lote C1 · Core do corredor e pés

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `ponte-de-gluteo` | Ponte de glúteo | core | gluteos | lado | Deitado de costas (cabeça à esquerda), joelhos dobrados, pés no chão perto do glúteo, braços ao lado do corpo. K0: quadril no chão. K1: quadril sobe até alinhar joelhos, quadril e ombros. Destaque no glúteo. |
| `perdigueiro` | Perdigueiro | core | core | lado | Em quatro apoios (mãos sob os ombros, joelhos sob o quadril), costas retas. K0: quatro apoios. K1: o braço distante estende à frente e a perna próxima estende para trás, na horizontal. Destaque no abdômen e na lombar. |
| `inseto-morto` | Inseto morto | core | core | lado | Deitado de costas, braços estendidos para o teto, quadril e joelhos a 90° (canelas na horizontal, no ar). K0: posição inicial. K1: o braço próximo desce para trás da cabeça e a perna distante estende à frente, rente ao chão, sem a lombar sair do chão. Destaque no abdômen. |
| `puxar-toalha` | Puxar a toalha com o pé | pes | pes | lado | Sentado em uma cadeira ou banco, pés descalços no chão, uma toalha estendida no chão sob o pé próximo. K0: dedos esticados sobre a toalha. K1: dedos se fecham e puxam a toalha para trás (o pé "enruga": mostre o pé curvando e a toalha encurtando). Destaque no pé. |
| `inversao-do-pe` | Inversão do pé com elástico | pes | pes | frente | Sentado no chão, de frente, uma perna estendida à frente (encurtada pela perspectiva), elástico preso na ponta do pé e puxando para fora. K0: pé neutro. K1: a ponta do pé gira para dentro contra o elástico. Só o tornozelo se mexe. Destaque no pé e na canela. |
| `eversao-do-pe` | Eversão do pé com elástico | pes | pes | frente | Igual à inversão, com o elástico puxando para dentro. K1: a ponta do pé gira para fora. Destaque no pé e na canela. |
| `dorsiflexao-do-pe` | Dorsiflexão do pé com elástico | pes | pes | lado | Sentado no chão, perna próxima estendida à frente, elástico preso no peito do pé e puxando para a frente (preso em um ponto fixo à direita). K0: pé em ponta. K1: ponta do pé vem em direção à canela. Destaque na frente da canela. |
| `flexao-plantar` | Flexão plantar em pé | pes | panturrilha | lado | Em pé sobre uma perna (a próxima), a outra dobrada para trás, mão apoiada na parede à frente. K0: calcanhar no chão. K1: sobe na ponta do pé o mais alto possível. Destaque na panturrilha. |

### Lote C2 · Liberação miofascial com rolo

O rolo é um círculo com aro no chão (centro em y ≈ 153, raio 7). O corpo rola para a frente e para trás sobre
ele: K0 e K1 deslocam o corpo de 10 a 14 unidades em x, com mãos ou pés de apoio fixos.

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `rolo-panturrilha` | Rolo na panturrilha | liberacao | panturrilha | lado | Sentado, mãos apoiadas no chão atrás do corpo, quadril fora do chão. A panturrilha da perna próxima apoia no rolo; a outra perna cruza por cima ou apoia o pé no chão. |
| `rolo-posterior` | Rolo no posterior da coxa | liberacao | posterior | lado | Mesma posição, com o rolo sob a parte de trás da coxa. |
| `rolo-gluteo` | Rolo no glúteo | liberacao | gluteos | lado | Sentado sobre o rolo, uma mão apoiada atrás, o tornozelo da perna próxima cruzado sobre o outro joelho, tronco levemente inclinado para o lado do glúteo trabalhado. |
| `rolo-gluteo-medio` | Rolo no glúteo médio | liberacao | gluteos | lado | Deitado de lado sobre o rolo, que fica sob a lateral do quadril; antebraço de baixo no chão; perna de cima cruzada à frente com o pé no chão. |
| `rolo-adutores` | Rolo nos adutores | liberacao | quadril | lado | De bruços, apoiado nos antebraços, uma perna aberta para o lado com o joelho dobrado e a parte interna da coxa sobre o rolo (de lado, a coxa aparece encurtada para cima da tela). |
| `rolo-quadriceps` | Rolo no quadríceps | liberacao | pernas | lado | De bruços, apoiado nos antebraços (posição de prancha baixa), o rolo sob a frente das coxas. |
| `rolo-lateral-coxa` | Rolo na lateral da coxa | liberacao | pernas | lado | De lado, apoiado no antebraço de baixo, o rolo sob a lateral da coxa de baixo; a perna de cima cruza à frente com o pé no chão para aliviar o peso. |
| `rolo-lombar` | Rolo na lombar | liberacao | costas | lado | Deitado de costas com o rolo sob a lombar, joelhos dobrados, pés no chão, mãos atrás da cabeça ou cruzadas no peito, quadril fora do chão. Amplitude curta. |
| `rolo-toracica` | Rolo na coluna torácica | liberacao | costas | lado | Deitado de costas com o rolo sob o meio das costas, joelhos dobrados, pés no chão, mãos atrás da cabeça, quadril fora do chão. Rola do meio das costas até perto dos ombros. |

## 4. Educativos de corrida e aquecimento

Os educativos são feitos parados no lugar (versão estática) ou avançando uns 20 m. A animação mostra a versão
no lugar, de lado, olhando para a direita, com 4 keys (um lado, troca, outro lado, troca) e ciclo rápido
(0,5 a 1,2 s). Os braços balançam em oposição às pernas, com os cotovelos a 90°. Tronco alto, levemente
inclinado à frente. Destaque em laranja (corrida) na musculatura principal.

### Lote E1

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `dribling` | Dribling | educativo | panturrilha | lado | Passos curtíssimos e rápidos, rolando o pé do calcanhar à ponta; os joelhos sobem muito pouco (o pé sai uns 8 cm do chão) e os tornozelos trabalham. Cadência alta. Destaque na panturrilha. |
| `skipping-medio` | Skipping médio | educativo | pernas | lado | Elevação alternada dos joelhos até a coxa ficar a uns 45° da vertical, apoio na ponta dos pés, cadência rápida. Destaque na frente da coxa e do quadril. |
| `skipping-alto` | Skipping alto | educativo | pernas | lado | Elevação alternada dos joelhos até a coxa ficar na horizontal (joelho na altura do quadril), tronco alto, apoio na ponta dos pés. Destaque na frente da coxa e do quadril. |
| `anfersen` | Anfersen | educativo | posterior | lado | Calcanhar no glúteo, alternando: a coxa fica quase na vertical e a canela dobra para trás até o calcanhar encostar no glúteo. Destaque na parte de trás da coxa. |
| `hop` | Hop | educativo | panturrilha | lado | Saltitos sobre uma perna com o outro joelho elevado a uns 45°: dois toques no chão com a mesma perna e troca. Salto baixo. Destaque na panturrilha. |
| `hop-alto` | Hop alto | educativo | pernas | lado | O mesmo do hop, com o joelho subindo até a altura do quadril e um salto mais alto, braço oposto subindo junto. Destaque na coxa e no glúteo. |

### Lote E2

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `pendular-anterior` | Pendular anterior | educativo | posterior | lado | Corrida com as pernas estendidas à frente: a perna sobe reta até uns 45° à frente e volta "arranhando" o chão sob o corpo, alternando, como uma tesoura. Tronco reto, levemente para trás. Destaque na parte de trás da coxa. |
| `pendular-posterior` | Pendular posterior | educativo | gluteos | lado | O inverso: tronco inclinado à frente e as pernas estendidas sobem para trás, alternando. Destaque no glúteo. |
| `pendular-anfersen` | Pendular anterior + anfersen | educativo | posterior | lado | Combinação: uma perna (a próxima) faz o pendular anterior (reta à frente) e a outra faz o anfersen (calcanhar no glúteo). Depois inverte o lado. |
| `bambi-baixo` | Bambi baixo | educativo | pernas | lado | Saltos alternados para a frente e para cima, como um cervo: impulsão com uma perna, joelho da outra subindo a uns 45°, fase de voo curta, aterrissagem na ponta do pé. Mostre a fase de voo (os dois pés fora do chão) entre os apoios. Destaque na panturrilha e na coxa. |
| `andando-na-lua` | Andando na lua | educativo | pernas | lado | Passadas lentas e exageradas, quase em câmera lenta: joelho alto, perna de trás empurrando até estender, braços amplos, tempo de voo longo. Ciclo mais lento (2 a 2,4 s). Destaque no glúteo e na coxa. |
| `soldado` | Soldado | educativo | posterior | lado | Marcha com a perna reta: a perna sobe estendida à frente até perto da horizontal e a mão oposta vai em direção à ponta do pé; alterna os lados. Tronco alto. Destaque na parte de trás da coxa. |

### Lote E3 · Aquecimento antes da corrida

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `balanco-de-perna-frontal` | Balanço de perna para a frente e para trás | aquecimento | quadril | lado | Em pé sobre a perna distante, mão apoiada em uma parede ou barra à frente (linha vertical). A perna próxima balança solta: para a frente até uns 60° e para trás até uns 30°. Destaque na frente do quadril. |
| `balanco-de-perna-lateral` | Balanço de perna para os lados | aquecimento | quadril | frente | Em pé, de frente, mãos apoiadas em uma barra à frente (linha horizontal na altura da cintura). Uma perna balança para o lado até uns 45° e cruza à frente da perna de apoio. Destaque na lateral do quadril. |
| `rotacao-de-quadril` | Rotação de quadril | aquecimento | quadril | frente | Em pé, de frente, mãos na cintura. Um joelho sobe à frente até a altura do quadril e abre para o lado, descrevendo um círculo, e volta ao chão. 3 ou 4 keys. Destaque no quadril. |
| `agachamento-peso-do-corpo` | Agachamento livre | aquecimento | pernas | lado | Agachamento sem carga: braços estendidos à frente para equilibrar. K0: em pé. K1: coxas paralelas ao chão, calcanhares no chão, tronco inclinado à frente o mínimo necessário. |
| `polichinelo` | Polichinelo | aquecimento | corpo-todo | frente | De frente. K0: pés juntos, braços ao lado do corpo. K1: pés afastados e mãos juntas acima da cabeça. Ciclo rápido (0,9 a 1,1 s) com leve salto (o quadril sobe 2 a 3 unidades no meio do movimento). |
| `elevacao-de-panturrilha` | Elevação de panturrilha | aquecimento | panturrilha | lado | Em pé, pés paralelos, mãos na cintura. K0: pés inteiros no chão. K1: sobe na ponta dos dois pés. Destaque na panturrilha. |

### Trocas pedidas pelo Filipe

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `face-pull` | Face pull na polia | forca | ombros | lado | Em pé, de frente para a polia na altura do rosto, corda nas mãos. K0: braços estendidos à frente. K1: corda puxada até o rosto, cotovelos abertos na linha dos ombros. |

## 5. Musculação: programa Maromba (nov/2026)

Fichas A · Pernas, B · Peito e costas e C · Braços e ombros. Além dos ids abaixo, o programa usa `leg-press-45`,
`face-pull`, `elevacao-lateral`, `rosca-banco-inclinado`, `triceps-frances-polia` e `abdominal-maquina`, que já
estão nas seções acima. Estes exercícios não têm animação: a coluna **movimento** descreve o que a foto mostra.

| id | nome no app | tipo | grupo | vista | movimento |
| --- | --- | --- | --- | --- | --- |
| `agachamento-hack` | Agachamento no hack | forca | pernas | foto | Homem na máquina hack, costas no apoio inclinado e ombros sob as almofadas, no fundo do agachamento, pés inteiros na plataforma. |
| `cadeira-extensora` | Cadeira extensora | forca | pernas | foto | Sentado na cadeira extensora, costas no encosto, as duas pernas estendidas à frente com o rolo na frente dos tornozelos. |
| `cadeira-flexora` | Cadeira flexora | forca | posterior | foto | Sentado na cadeira flexora, costas no encosto, trava sobre as coxas, joelhos dobrados levando o rolo para trás. |
| `mesa-flexora` | Mesa flexora | forca | posterior | foto | Deitado de bruços na mesa flexora, quadril no banco, joelhos dobrados com o rolo perto dos glúteos. |
| `stiff-halteres` | Stiff com halteres | forca | posterior | foto | Em pé, de lado, tronco inclinado à frente com as costas retas, quadril para trás, halteres na altura das canelas, rente às pernas. |
| `elevacao-pelvica` | Elevação pélvica com barra | forca | gluteos | foto | Costas apoiadas na lateral do banco, barra sobre o quadril, quadril elevado até o tronco ficar reto. |
| `cadeira-adutora` | Cadeira adutora | forca | pernas | foto | Sentado na cadeira adutora, pernas fechando as almofadas uma contra a outra. |
| `cadeira-abdutora` | Cadeira abdutora | forca | gluteos | foto | Sentado na cadeira abdutora, pernas abertas empurrando as almofadas para fora. |
| `panturrilha-sentado` | Panturrilha sentado | forca | panturrilha | foto | Sentado na máquina, almofadas sobre as coxas, calcanhares elevados na ponta dos pés. |
| `voador` | Voador (peck deck) | forca | peito | foto | Sentado no voador, costas no encosto, braços fechados à frente do peito. |
| `pullover-polia` | Pullover na polia | forca | costas | foto | Em pé de frente para a polia alta, braços estendidos descendo a barra em arco até as coxas. |
| `panturrilha-em-pe-maquina` | Panturrilha em pé na máquina | forca | panturrilha | foto | Em pé na máquina de panturrilha, ombros sob as almofadas, na ponta dos pés sobre a borda do degrau. |
| `supino-reto-barra` | Supino reto com barra | forca | peito | foto | Deitado no banco reto, pés no chão, barra perto do meio do peito, cotovelos a uns 45° do tronco. |
| `puxada-frente` | Puxada na frente com pegada aberta | forca | costas | foto | Sentado na puxada alta, coxas sob o rolo, pegada aberta, barra na parte alta do peito e cotovelos apontando para baixo. |
| `supino-inclinado-halteres` | Supino inclinado com halteres | forca | peito | foto | Deitado no banco inclinado a uns 30 a 45°, um halter em cada mão ao lado do peito, cotovelos abaixo das mãos. |
| `remada-curvada` | Remada curvada com barra | forca | costas | foto | Em pé, de lado, tronco inclinado a uns 45° com as costas retas, barra puxada até o umbigo, cotovelos rente ao corpo. |
| `crossover` | Crossover na polia | forca | peito | foto | Em pé entre as duas polias altas, um pé à frente, braços fechados à frente do corpo com as mãos juntas na altura do umbigo. |
| `remada-baixa` | Remada baixa na polia | forca | costas | foto | Sentado de frente para a polia baixa, pés no apoio, tronco reto, triângulo puxado até a barriga. |
| `desenvolvimento-halteres` | Desenvolvimento com halteres | forca | ombros | foto | Sentado no banco com encosto quase vertical, halteres na altura das orelhas, palmas para a frente. |
| `rosca-direta-barra` | Rosca direta com barra | forca | biceps | foto | Em pé, cotovelos colados ao tronco, barra na metade da subida, palmas para cima. |
| `triceps-testa` | Tríceps testa com barra W | forca | triceps | foto | Deitado no banco reto, cotovelos apontando para o teto, barra W descendo até perto da testa. |
| `rosca-martelo` | Rosca martelo com halteres | forca | biceps | foto | Em pé, um halter em cada mão com as palmas viradas uma para a outra, um braço dobrado com o halter perto do ombro. |
| `triceps-corda` | Tríceps na polia com corda | forca | triceps | foto | Em pé de frente para a polia alta, cotovelos colados ao tronco, braços estendidos para baixo com a corda aberta. |
