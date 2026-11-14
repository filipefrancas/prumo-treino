import type { Exercise } from '../../types.ts';

/** Core do corredor: o abdômen segura a lombar no chão enquanto braço e perna opostos se afastam. */
const ex: Exercise = {
  id: 'inseto-morto',
  name: 'Inseto morto',
  aka: ['Dead bug', 'Besouro morto'],
  kind: 'core',
  group: 'core',
  muscles: {
    primary: ['reto abdominal', 'transverso do abdômen'],
    secondary: ['oblíquos', 'flexores do quadril'],
  },
  equipment: ['colchonete'],
  how: [
    'Deite de costas, braços estendidos para o teto, quadril e joelhos a 90°, canelas paralelas ao chão.',
    'Cole a lombar no chão e desça um braço para trás da cabeça enquanto estende a perna oposta.',
    'Pare com braço e perna rentes ao chão, sem encostar e sem deixar a lombar descolar.',
    'Volte os dois ao ponto de partida e repita com o outro braço e a outra perna, alternando.',
  ],
  cues: [
    'A lombar fica colada no chão o tempo todo; se descolar, não desça tanto a perna.',
    'Sinta o abdômen duro, segurando as costelas para baixo, do começo ao fim.',
    'O braço e a perna que esperam ficam imóveis: braço para o teto, joelho a 90°.',
  ],
  mistakes: [
    'Arquear a lombar quando a perna se afasta do corpo',
    'Fazer rápido, deixando a perna cair em vez de controlar a descida',
    'Trazer para o peito o joelho que deveria ficar parado a 90°',
  ],
  breath: 'Solte o ar enquanto braço e perna se afastam e puxe o ar ao trazer os dois de volta.',
  easier: 'Mexa só as pernas, com os braços parados, e desça a perna dobrada até o calcanhar tocar o chão.',
  harder: 'Segure 3 segundos com braço e perna rentes ao chão antes de voltar, sem perder a lombar.',
  swap: ['prancha', 'perdigueiro', 'abdominal-maquina'],
  yt: 'dead bug inseto morto abdominal execução correta',
};

export default ex;
