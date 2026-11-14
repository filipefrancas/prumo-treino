import type { Exercise } from '../../types.ts';

/** Ficha B · Peito e costas. */
const ex: Exercise = {
  id: 'remada-baixa',
  name: 'Remada baixa na polia',
  aka: ['Remada sentada', 'Remada baixa com triângulo', 'Remada no cabo'],
  kind: 'forca',
  group: 'costas',
  muscles: {
    primary: ['grande dorsal', 'romboides'],
    secondary: ['trapézio médio', 'bíceps'],
  },
  equipment: ['polia', 'triângulo'],
  how: [
    'Sente de frente para a polia baixa, pés no apoio, joelhos um pouco dobrados, e segure o triângulo.',
    'Deixe o tronco reto e o peito aberto, com os braços estendidos.',
    'Puxe o triângulo até a barriga, levando os cotovelos para trás, rente ao corpo.',
    'Junte as escápulas um instante e volte devagar até os braços estenderem.',
  ],
  cues: [
    'Sinta o meio das costas apertar no fim da puxada.',
    'Tronco quase parado: um leve vai e vem, sem deitar para trás.',
    'Ombros para baixo, longe das orelhas.',
  ],
  mistakes: [
    'Jogar o tronco para trás para ajudar a puxar',
    'Arredondar as costas na volta',
    'Puxar só com os braços, sem juntar as escápulas',
  ],
  breath: 'Solte o ar ao puxar e puxe o ar na volta.',
  easier: 'Use menos carga e segure 1 segundo com o triângulo na barriga.',
  harder: 'Volte em 3 segundos, deixando as costas esticarem bem à frente.',
  swap: ['remada-maquina', 'remada-cavalinho'],
  yt: 'remada baixa na polia com triângulo execução correta',
};

export default ex;
