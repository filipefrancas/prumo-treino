import type { Exercise } from '../../types.ts';

/**
 * Preparação da ficha B · Inferiores (posição sustentada, 30 a 45 s).
 * Na ficha é feito de frente para o espaldar, com os pés na base dele: essa versão entra como variação.
 */
const ex: Exercise = {
  id: 'alongamento-adutor-step',
  name: 'Alongamento de adutor sentado',
  aka: ['Alongamento de adutor espaldar com step', 'Alongamento de adutores sentado no step'],
  kind: 'alongamento',
  group: 'quadril',
  muscles: {
    primary: ['adutores'],
    secondary: ['posteriores de coxa'],
  },
  equipment: ['degrau'],
  how: [
    'Sente na borda de um degrau baixo, com as pernas estendidas e bem abertas para os lados.',
    'Apoie as mãos no chão à frente e cresça a coluna, com a ponta dos pés apontando para cima.',
    'Incline o tronco um pouco à frente, dobrando no quadril, até sentir a parte interna das coxas.',
    'Fique ali respirando e volte devagar, empurrando o chão com as mãos.',
  ],
  cues: [
    'Sinta esticar a parte interna das coxas, da virilha até perto dos joelhos.',
    'O degrau ajuda a bacia a rodar para a frente: aproveite e mantenha a coluna comprida.',
    'Joelhos e ponta dos pés virados para o teto, sem cair para dentro.',
  ],
  mistakes: [
    'Curvar as costas para chegar mais longe com as mãos',
    'Deixar os joelhos dobrarem ou girarem para dentro',
    'Forçar com balanços em vez de ceder aos poucos',
  ],
  breath: 'Respire lento e, a cada saída de ar, incline o tronco um pouco mais, sem forçar.',
  easier: 'Abra menos as pernas e fique com o tronco ereto, de mãos no chão à frente.',
  harder: 'De frente para o espaldar, apoie os pés na base e puxe o tronco segurando uma barra.',
  yt: 'alongamento de adutores sentado pernas afastadas',
};

export default ex;
