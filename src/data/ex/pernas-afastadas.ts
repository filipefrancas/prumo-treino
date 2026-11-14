import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'pernas-afastadas',
  name: 'Pernas afastadas',
  aka: ['Abertura de pernas sentado', 'Alongamento de adutores no chão'],
  kind: 'alongamento',
  group: 'quadril',
  muscles: {
    primary: ['adutores', 'posteriores de coxa'],
    secondary: ['eretores da espinha'],
  },
  equipment: ['colchonete'],
  how: [
    'Sente no chão com as pernas estendidas e bem afastadas, joelhos apontando para o teto.',
    'Apoie as mãos no chão à frente do quadril e cresça a coluna.',
    'Incline o tronco à frente a partir do quadril, caminhando com as mãos pelo chão.',
    'Pare quando a parte interna das coxas alongar e segure, respirando devagar.',
    'Para sair, volte caminhando com as mãos até o tronco ficar ereto.',
  ],
  cues: [
    'Sinta alongar a parte interna das coxas, da virilha até perto do joelho.',
    'Leve o umbigo à frente, não a testa ao chão: as costas descem compridas.',
    'Joelhos e pontas dos pés apontando para o teto do começo ao fim.',
  ],
  mistakes: [
    'Arredondar as costas e largar a cabeça para parecer que desceu mais',
    'Deixar os joelhos e os pés caírem para dentro',
    'Balançar o tronco para ganhar amplitude no tranco',
  ],
  breath: 'Respire devagar; ao soltar o ar, deixe o tronco descer mais um pouco e pare ali.',
  easier: 'Sente na beira de uma toalha dobrada e dobre de leve os joelhos para a coluna ficar reta.',
  harder: 'Desça até apoiar os antebraços no chão à frente, mantendo as costas compridas.',
  yt: 'alongamento adutores sentado pernas afastadas',
};

export default ex;
