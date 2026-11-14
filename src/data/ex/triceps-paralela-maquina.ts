import type { Exercise } from '../../types.ts';

/** Ficha C · Peito, ombro e braço. Na ficha do treinador o nome aparece sem acento: "Triceps Paralela Máquina". */
const ex: Exercise = {
  id: 'triceps-paralela-maquina',
  name: 'Tríceps paralela na máquina',
  aka: ['Triceps Paralela Máquina (Pegada Neutra)', 'Paralela na máquina', 'Mergulho na máquina', 'Tríceps mergulho sentado'],
  kind: 'forca',
  group: 'triceps',
  muscles: {
    primary: ['tríceps'],
    secondary: ['peitoral maior', 'deltoide anterior'],
  },
  equipment: ['máquina'],
  how: [
    'Sente com o quadril no fundo do assento e segure os pegadores ao lado do corpo.',
    'Incline o tronco de leve à frente, com os cotovelos dobrados e apontando para trás.',
    'Empurre os pegadores para baixo até estender os braços ao lado do quadril.',
    'Volte devagar até as mãos subirem à altura das costelas, sem deixar os ombros subirem.',
  ],
  cues: [
    'Sinta o tríceps apertar com os braços estendidos e segure esse aperto um instante.',
    'Cotovelos apontando para trás, perto do corpo, sem abrir para os lados.',
    'Ombros baixos, peito aberto e olhar à frente.',
  ],
  mistakes: [
    'Deixar os ombros subirem até as orelhas na volta',
    'Abrir os cotovelos para os lados e empurrar com o peito',
    'Levantar o quadril do assento para jogar o peso do corpo sobre a carga',
  ],
  breath: 'Solte o ar ao empurrar para baixo e puxe o ar na volta.',
  easier: 'Pare a volta com os cotovelos a 90° e use uma carga menor.',
  harder: 'Segure 2 segundos com os braços estendidos e volte em 3 segundos.',
  swap: ['triceps-frances-polia'],
  yt: 'tríceps paralela na máquina execução',
};

export default ex;
