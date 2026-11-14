import type { Exercise } from '../../types.ts';

/** Ficha A · Pernas. Abre o treino: é o exercício mais pesado da perna. */
const ex: Exercise = {
  id: 'agachamento-hack',
  name: 'Agachamento no hack',
  aka: ['Hack machine', 'Agachamento hack', 'Hack squat'],
  kind: 'forca',
  group: 'pernas',
  muscles: {
    primary: ['quadríceps', 'glúteo máximo'],
    secondary: ['adutores', 'posteriores de coxa'],
  },
  equipment: ['máquina'],
  how: [
    'Encoste as costas e a cabeça no apoio, com os ombros embaixo das almofadas.',
    'Apoie os pés inteiros no meio da plataforma, na largura dos ombros, pontas um pouco para fora.',
    'Estenda as pernas, solte as travas e desça devagar até as coxas passarem um pouco da linha dos joelhos.',
    'Empurre a plataforma com o pé inteiro até quase estender as pernas, sem travar os joelhos.',
    'Na última repetição, suba até o alto e gire as travas antes de sair.',
  ],
  cues: [
    'Sinta a frente das coxas fazer a força do começo ao fim.',
    'Joelhos seguem a direção da ponta dos pés durante toda a descida.',
    'Costas e quadril colados no apoio: a descida acaba onde eles começariam a sair.',
  ],
  mistakes: [
    'Descer pouco para conseguir colocar mais carga',
    'Tirar os calcanhares da plataforma no fundo do movimento',
    'Deixar os joelhos fecharem para dentro ao empurrar',
  ],
  breath: 'Puxe o ar na descida e solte ao empurrar a plataforma.',
  easier: 'Use menos carga e desça só até as coxas ficarem paralelas à plataforma.',
  harder: 'Desça em 3 segundos e pare 1 segundo embaixo antes de subir.',
  swap: ['leg-press-45', 'agachamento-halter-frente'],
  yt: 'agachamento hack machine execução correta',
};

export default ex;
