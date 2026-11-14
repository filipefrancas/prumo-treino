import type { Exercise } from '../../types.ts';

/** Preparação das fichas A · Costas e bíceps e C · Peito, ombro e braço (posição sustentada, 30 a 45 s). */
const ex: Exercise = {
  id: 'alongamento-peitoral-espaldar',
  name: 'Alongamento de peitoral no espaldar',
  aka: ['Alongamento peitoral espaldar bilateral', 'Alongamento de peitoral bilateral'],
  kind: 'alongamento',
  group: 'peito',
  muscles: {
    primary: ['peitoral maior'],
    secondary: ['deltoide anterior', 'peitoral menor'],
  },
  equipment: ['espaldar'],
  how: [
    'De costas para o espaldar, abra os braços e segure uma barra na altura dos ombros, cotovelos a 90°.',
    'Avance um passo e leve o corpo à frente, sem soltar as mãos, deixando os braços ficarem para trás.',
    'Pare quando sentir o peito esticar, sem dor na frente dos ombros, e fique ali respirando.',
    'Para sair, traga o corpo de volta para perto do espaldar antes de soltar as mãos.',
  ],
  cues: [
    'Sinta esticar o peito, perto das axilas; a frente dos ombros não deve doer.',
    'Costelas para baixo e abdômen firme, para a lombar não arquear.',
    'Ombros longe das orelhas e olhar reto à frente.',
  ],
  mistakes: [
    'Arquear a lombar e empinar as costelas em vez de abrir o peito',
    'Projetar a cabeça para a frente',
    'Avançar com tranco ou forçar até doer o ombro',
  ],
  breath: 'Respire devagar pelo nariz e, a cada saída de ar, deixe o peito abrir um pouco mais.',
  easier: 'Segure as barras um pouco abaixo dos ombros e avance menos.',
  harder: 'Segure uma barra mais alta, com os cotovelos acima da linha dos ombros.',
  yt: 'alongamento de peitoral no espaldar bilateral',
};

export default ex;
