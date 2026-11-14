import type { Exercise } from '../../types.ts';

/** Core do corredor: glúteo e parte de trás do corpo, no chão e sem carga. */
const ex: Exercise = {
  id: 'ponte-de-gluteo',
  name: 'Ponte de glúteo',
  aka: ['Elevação pélvica no solo', 'Ponte glútea', 'Glute bridge'],
  kind: 'core',
  group: 'gluteos',
  muscles: {
    primary: ['glúteo máximo'],
    secondary: ['posteriores de coxa', 'eretores da espinha'],
  },
  equipment: ['colchonete'],
  how: [
    'Deite de costas, joelhos dobrados, pés na largura do quadril e perto do glúteo, braços ao lado do corpo.',
    'Aperte o glúteo e empurre os calcanhares contra o chão para levantar o quadril.',
    'Suba até alinhar joelhos, quadril e ombros e segure 1 segundo, com o glúteo contraído.',
    'Desça devagar até o quadril tocar o chão de leve e já comece a próxima repetição.',
  ],
  cues: [
    'Sinta o glúteo fazer a força; se pegar mais atrás da coxa, aproxime os pés do quadril.',
    'Costelas baixas e abdômen firme: quem sobe é o quadril, não a lombar.',
    'Olhe para o teto e mantenha os joelhos na linha dos pés, sem abrir nem fechar.',
  ],
  mistakes: [
    'Subir além da linha reta e arquear a lombar no alto',
    'Tirar os calcanhares do chão e empurrar com a ponta dos pés',
    'Deixar os joelhos caírem para dentro ou abrirem para os lados',
  ],
  breath: 'Solte o ar ao subir o quadril e puxe o ar ao descer.',
  easier: 'Suba só até a metade da altura e descanse o quadril no chão entre as repetições.',
  harder: 'Faça com uma perna só: estenda a outra no ar e suba sem deixar o quadril cair para o lado.',
  swap: ['perdigueiro', 'hiperextensao-lombar'],
  yt: 'ponte de glúteo no solo elevação pélvica execução correta',
};

export default ex;
