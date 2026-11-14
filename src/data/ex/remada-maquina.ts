import type { Exercise } from '../../types.ts';

/** Ficha A · Costas e bíceps. */
const ex: Exercise = {
  id: 'remada-maquina',
  name: 'Remada na máquina (pegada pronada)',
  aka: ['Remada Máquina (Pegada Pronada)', 'Remada articulada', 'Remada sentada na máquina'],
  kind: 'forca',
  group: 'costas',
  muscles: {
    primary: ['dorsal', 'trapézio médio'],
    secondary: ['romboides', 'deltoide posterior', 'bíceps'],
  },
  equipment: ['máquina'],
  how: [
    'Ajuste o assento para o apoio ficar no meio do peito e firme os pés no chão.',
    'Segure os pegadores com as palmas para baixo, braços estendidos e ombros soltos à frente.',
    'Puxe os cotovelos para trás, na altura das costelas, até as mãos chegarem perto do tronco.',
    'Aperte as escápulas por um instante e volte devagar, sem desencostar o peito do apoio.',
  ],
  cues: [
    'Sinta o meio das costas apertar, como se prendesse um lápis entre as escápulas.',
    'Peito colado no apoio do começo ao fim: é ele que impede o balanço.',
    'Mãos como ganchos e punhos retos; quem puxa são os cotovelos.',
  ],
  mistakes: [
    'Desencostar o peito do apoio e jogar o tronco para trás',
    'Subir os cotovelos até a altura dos ombros, com o pescoço encolhido',
    'Voltar só até a metade, sem deixar os braços estenderem',
  ],
  breath: 'Solte o ar ao levar os cotovelos para trás e puxe o ar na volta.',
  easier: 'Use a pegada neutra, com as palmas se olhando, e uma carga menor.',
  harder: 'Faça um braço de cada vez, sem girar o tronco no apoio.',
  swap: ['remada-cavalinho', 'puxada-supinada'],
  yt: 'remada máquina articulada pegada pronada execução',
};

export default ex;
