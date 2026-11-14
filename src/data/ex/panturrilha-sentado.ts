import type { Exercise } from '../../types.ts';

/** Ficha A · Pernas. Com o joelho dobrado, o trabalho vai para o sóleo, a parte funda da panturrilha. */
const ex: Exercise = {
  id: 'panturrilha-sentado',
  name: 'Panturrilha sentado',
  aka: ['Gêmeos sentado', 'Panturrilha sentado na máquina', 'Banco sóleo'],
  kind: 'forca',
  group: 'panturrilha',
  muscles: {
    primary: ['sóleo'],
    secondary: ['gastrocnêmio'],
  },
  equipment: ['máquina'],
  how: [
    'Sente na máquina com a ponta dos pés na borda do apoio e as almofadas sobre as coxas, perto dos joelhos.',
    'Suba um pouco os calcanhares e solte a trava.',
    'Desça os calcanhares devagar até sentir a panturrilha alongar.',
    'Suba o mais alto que conseguir, segure um instante e repita.',
  ],
  cues: [
    'Sinta a parte de baixo da panturrilha, perto do tendão.',
    'Movimento completo: bem embaixo e bem em cima.',
    'Sem pressa: 1 segundo parado embaixo tira o impulso.',
  ],
  mistakes: [
    'Quicar embaixo para aproveitar o impulso',
    'Fazer repetições curtas e rápidas',
    'Empurrar com as mãos para ajudar a subir',
  ],
  breath: 'Solte o ar ao subir e puxe o ar ao descer.',
  easier: 'Use menos carga e segure o alongamento embaixo.',
  harder: 'Segure 2 segundos no alto em cada repetição.',
  swap: ['panturrilha-em-pe-maquina', 'panturrilha-leg-press'],
  yt: 'panturrilha sentado máquina execução correta',
};

export default ex;
