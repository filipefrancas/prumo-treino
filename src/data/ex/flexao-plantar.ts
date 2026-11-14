import type { Exercise } from '../../types.ts';

/** Fortalecimento dos pés: panturrilha em uma perna só, com a mão na parede para equilibrar. */
const ex: Exercise = {
  id: 'flexao-plantar',
  name: 'Flexão plantar em pé',
  aka: ['Panturrilha unilateral em pé', 'Elevação de calcanhar em uma perna'],
  kind: 'pes',
  group: 'panturrilha',
  muscles: {
    primary: ['panturrilha'],
    secondary: ['musculatura do pé', 'tibial posterior', 'fibulares'],
  },
  equipment: ['peso do corpo'],
  sided: true,
  how: [
    'Fique em pé sobre uma perna, de frente para a parede, com uma mão apoiada e a outra perna dobrada atrás.',
    'Suba na ponta do pé o mais alto que conseguir, com o joelho de apoio estendido.',
    'Segure 1 segundo no alto, com o peso na base do dedão e o corpo reto.',
    'Desça devagar, em 2 a 3 segundos, até o calcanhar tocar o chão.',
  ],
  cues: [
    'Sinta a panturrilha apertar no alto e frear o corpo na descida.',
    'Peso entre o dedão e o segundo dedo: o tornozelo não tomba para fora.',
    'A mão na parede só dá equilíbrio; quem levanta o corpo é a panturrilha.',
  ],
  mistakes: [
    'Subir só até a metade, sem chegar ao ponto mais alto',
    'Jogar o peso para o dedinho e deixar o tornozelo tombar para fora',
    'Despencar na descida e quicar no calcanhar para pegar impulso',
  ],
  breath: 'Solte o ar ao subir na ponta do pé e puxe o ar na descida lenta.',
  easier: 'Suba com os dois pés e desça devagar com um só, ou faça tudo com os dois pés.',
  harder: 'Faça na borda de um degrau, descendo o calcanhar abaixo dele, ou segure um halter.',
  yt: 'panturrilha unilateral em pé elevação de calcanhar execução',
};

export default ex;
