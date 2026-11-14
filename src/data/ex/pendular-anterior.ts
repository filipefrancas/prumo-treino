import type { Exercise } from '../../types.ts';

/** Educativo de corrida: tesoura com as pernas estendidas à frente, para treinar o apoio ativo. */
const ex: Exercise = {
  id: 'pendular-anterior',
  name: 'Pendular anterior',
  aka: ['Pendular', 'Tesoura', 'Corrida de pernas estendidas'],
  kind: 'educativo',
  group: 'posterior',
  muscles: {
    primary: ['posteriores de coxa'],
    secondary: ['glúteo máximo', 'flexores do quadril', 'panturrilha'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé, tronco reto e levemente para trás, pernas estendidas, cotovelos a 90°.',
    'Lance uma perna reta à frente, até uns 45°, com a ponta do pé puxada para a canela.',
    'Puxe a perna para baixo e para trás, arranhando o chão com a ponta do pé sob o corpo.',
    'Troque no ar: enquanto uma perna desce, a outra sobe reta, como uma tesoura.',
  ],
  cues: [
    'Objetivo: apoio ativo; o pé chega ao chão já puxando para trás, embaixo do quadril.',
    'Sinta a parte de trás da coxa trabalhar cada vez que a perna desce.',
    'Joelhos firmes e quase retos; contato curto, na ponta do pé.',
  ],
  mistakes: [
    'Dobrar os joelhos e transformar a tesoura em corrida comum',
    'Deitar o tronco para trás e subir a perna alto demais',
    'Frear com o calcanhar à frente do corpo em vez de puxar o chão para trás',
  ],
  breath: 'Respire solto e ritmado; não prenda o ar ao puxar a perna para baixo.',
  easier: 'Faça em marcha, sem saltar, subindo a perna mais baixo.',
  harder: 'Avance uns 20 m, puxando o chão com mais força a cada apoio.',
  yt: 'pendular anterior tesoura educativo de corrida execução',
};

export default ex;
