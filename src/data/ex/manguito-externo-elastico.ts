import type { Exercise } from '../../types.ts';

/** Preparação das fichas A · Costas e bíceps e C · Peito, ombro e braço (15 a 20 repetições, longe da falha). */
const ex: Exercise = {
  id: 'manguito-externo-elastico',
  name: 'Manguito externo com elástico',
  aka: [
    'Manguito externo bilateral + desenvolvimento com elástico',
    'Puxada alta com rotação externa e desenvolvimento',
    'Face pull com rotação externa',
  ],
  kind: 'aquecimento',
  group: 'ombros',
  muscles: {
    primary: ['manguito rotador', 'deltoide posterior'],
    secondary: ['trapézio médio', 'romboides', 'trapézio inferior'],
  },
  equipment: ['elástico', 'espaldar'],
  how: [
    'De frente para o espaldar, segure o elástico preso na altura do peito, de braços estendidos à frente.',
    'Puxe abrindo os cotovelos até a linha dos ombros, com as mãos chegando ao lado do rosto.',
    'Sem baixar os cotovelos, gire os antebraços para cima até as mãos ficarem acima deles.',
    'Estenda os braços acima da cabeça, mantendo o elástico esticado.',
    'Volte pelo mesmo caminho: dobre os braços, gire as mãos para a frente e estenda devagar.',
  ],
  cues: [
    'Cotovelos na altura dos ombros durante toda a puxada e o giro.',
    'Sinta a parte de trás dos ombros e o meio das costas, entre as escápulas.',
    'Elástico leve e longe da falha: aqui é para acordar o ombro, não para cansar.',
  ],
  mistakes: [
    'Deixar os cotovelos caírem abaixo dos ombros na hora do giro',
    'Arquear a lombar e abrir as costelas ao estender os braços para cima',
    'Encolher os ombros para as orelhas durante a puxada',
  ],
  breath: 'Solte o ar na puxada e ao estender os braços para cima e puxe o ar na volta.',
  easier: 'Faça só a puxada e o giro, sem estender os braços acima da cabeça.',
  harder: 'Dê um passo para trás para esticar mais o elástico e pare 1 s em cada posição.',
  yt: 'face pull com rotação externa e desenvolvimento com elástico',
};

export default ex;
