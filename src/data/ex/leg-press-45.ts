import type { Exercise } from '../../types.ts';

/** Ficha A · Pernas. Soma volume para a coxa sem cansar a lombar. */
const ex: Exercise = {
  id: 'leg-press-45',
  name: 'Leg press 45°',
  aka: ['Leg press inclinado', 'Leg 45', 'Leg press'],
  kind: 'forca',
  group: 'pernas',
  muscles: {
    primary: ['quadríceps', 'glúteo máximo'],
    secondary: ['adutores', 'posteriores de coxa'],
  },
  equipment: ['máquina'],
  how: [
    'Deite no aparelho com as costas e o quadril colados no encosto e segure os pegadores laterais.',
    'Apoie os pés inteiros no meio da plataforma, na largura dos ombros, pontas um pouco para fora.',
    'Destrave e desça devagar até os joelhos chegarem perto do peito, sem o quadril descolar do encosto.',
    'Empurre a plataforma até as pernas quase estenderem, sem travar os joelhos.',
    'Ao terminar a série, trave o aparelho antes de tirar os pés.',
  ],
  cues: [
    'Joelhos seguem a direção da ponta dos pés durante toda a descida.',
    'Lombar e glúteos grudados no encosto: a descida acaba onde eles começariam a sair.',
    'Empurre com o pé inteiro, fazendo mais força nos calcanhares.',
  ],
  mistakes: [
    'Descer até o quadril descolar do encosto e a lombar arredondar',
    'Travar os joelhos com tranco no fim da subida',
    'Deixar os joelhos fecharem para dentro ao empurrar',
  ],
  breath: 'Puxe o ar na descida e solte ao empurrar a plataforma.',
  easier: 'Tire carga e desça só até os joelhos formarem 90°.',
  harder: 'Desça em 3 s e pare 1 s embaixo, sem quicar, antes de empurrar.',
  swap: ['agachamento-hack', 'agachamento-halter-frente'],
  yt: 'leg press 45 execução correta',
};

export default ex;
