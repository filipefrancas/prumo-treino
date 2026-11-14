import type { Exercise } from '../../types.ts';

/** Educativo de corrida: marcha com a perna reta, mão oposta em direção à ponta do pé. */
const ex: Exercise = {
  id: 'soldado',
  name: 'Soldado',
  aka: ['Soldadinho', 'Marcha do soldado', 'Chute frontal com perna reta'],
  kind: 'educativo',
  group: 'posterior',
  muscles: {
    primary: ['posteriores de coxa', 'flexores do quadril'],
    secondary: ['quadríceps', 'reto abdominal', 'panturrilha'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé, tronco alto, abdômen firme e braços soltos ao lado do corpo.',
    'Suba uma perna estendida à frente, com a ponta do pé puxada para a canela.',
    'Leve a mão oposta em direção à ponta do pé, com a perna perto da horizontal e o tronco alto.',
    'Desça a perna com controle e repita com a outra perna e a outra mão, no lugar ou a cada passo.',
  ],
  cues: [
    'Objetivo: soltar a parte de trás da coxa em movimento, sem perder a postura.',
    'Suba a perna só até onde ela chega reta; a altura vem com as repetições.',
    'Perna de apoio firme e olhar à frente: é o pé que vem até a mão.',
  ],
  mistakes: [
    'Curvar as costas e baixar o tronco para alcançar o pé',
    'Dobrar o joelho da perna que sobe para ela chegar mais alto',
    'Chutar com violência, sem controlar a subida nem a descida',
  ],
  breath: 'Solte o ar quando a perna sobe e puxe quando ela desce.',
  easier: 'Suba a perna mais baixo e leve a mão até o joelho ou a canela.',
  harder: 'Acrescente um saltito na perna de apoio a cada passo, com a perna de cima sempre reta.',
  yt: 'soldadinho marcha com perna estendida educativo de corrida execução',
};

export default ex;
