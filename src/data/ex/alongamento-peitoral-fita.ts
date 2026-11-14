import type { Exercise } from '../../types.ts';

/**
 * Preparação da ficha A · Costas e bíceps (posição sustentada, 45 s).
 * Na foto da ficha a fita parece presa ao espaldar, atrás do corpo: é ela que puxa os braços para trás.
 */
const ex: Exercise = {
  id: 'alongamento-peitoral-fita',
  name: 'Alongamento de peitoral com fita',
  aka: ['Alongamento peitoral fita', 'Alongamento de peitoral com elástico'],
  kind: 'alongamento',
  group: 'peito',
  muscles: {
    primary: ['peitoral maior'],
    secondary: ['deltoide anterior', 'bíceps'],
  },
  equipment: ['fita elástica', 'espaldar'],
  how: [
    'Passe a fita por uma barra do espaldar, na altura dos ombros, e fique de costas para ele.',
    'Segure uma ponta em cada mão e abra os braços em cruz, na altura dos ombros.',
    'Avance até a fita puxar os braços um pouco mais para trás e leve o peito à frente.',
    'Fique ali respirando; para sair, recue um passo antes de soltar a fita.',
  ],
  cues: [
    'Braços soltos: quem puxa é a fita, você só deixa o peito abrir.',
    'Sinta esticar o peito e a frente dos ombros; se as mãos formigarem, alivie.',
    'Costelas para baixo: o peito vai à frente sem a lombar arquear.',
  ],
  mistakes: [
    'Arquear a lombar para os braços parecerem ir mais para trás',
    'Deixar os braços caírem abaixo da linha dos ombros',
    'Avançar demais e deixar a fita dar tranco nos ombros',
  ],
  breath: 'Respire lento e fundo e, a cada saída de ar, deixe os braços cederem um pouco mais.',
  easier: 'Fique mais perto do espaldar, com a fita menos esticada.',
  harder: 'Dê meio passo à frente para a fita puxar mais, sem perder a postura.',
  yt: 'alongamento de peitoral com faixa elástica presa atrás',
};

export default ex;
