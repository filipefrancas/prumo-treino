import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'rolo-lombar',
  name: 'Rolo na lombar',
  aka: ['Liberação miofascial da lombar', 'Foam roller na lombar'],
  kind: 'liberacao',
  group: 'costas',
  muscles: {
    primary: ['eretores da espinha'],
    secondary: ['quadrado lombar'],
  },
  equipment: ['rolo'],
  how: [
    'Sente no chão com os joelhos dobrados e deite devagar, com o rolo atravessado sob a lombar.',
    'Cruze os braços no peito, trave o abdômen e tire o quadril do chão.',
    'Empurre o chão com os pés e role curto, um palmo, entre as últimas costelas e o alto da bacia.',
    'Volte devagar ao ponto de partida, sem deixar a lombar arquear sobre o rolo.',
  ],
  cues: [
    'Abdômen firme do começo ao fim: a lombar não fica pendurada, arqueada sobre o rolo.',
    'Incline o corpo de leve para um lado e depois para o outro: role o músculo, não a coluna.',
    'Aqui a pressão é leve; com dor aguda ou que desce para a perna, saia do rolo.',
  ],
  mistakes: [
    'Soltar o abdômen e deixar a lombar arquear sobre o rolo',
    'Rolar com amplitude grande, subindo nas costelas ou descendo até o cóccix',
    'Ficar parado muito tempo com o peso todo em cima da coluna',
  ],
  breath: 'Respire devagar sem soltar o abdômen, puxando o ar pelo nariz e soltando pela boca.',
  easier: 'Faça em pé, com o rolo entre a lombar e a parede, dobrando e estendendo os joelhos.',
  yt: 'liberação miofascial lombar rolo como fazer com segurança',
};

export default ex;
