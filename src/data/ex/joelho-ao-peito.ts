import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'joelho-ao-peito',
  name: 'Um joelho ao peito',
  aka: ['Joelho ao peito unilateral', 'Joelho no peito'],
  kind: 'alongamento',
  group: 'quadril',
  muscles: {
    primary: ['glúteo máximo'],
    secondary: ['eretores da espinha', 'flexores do quadril'],
  },
  equipment: ['colchonete'],
  sided: true,
  how: [
    'Deite de costas no colchonete, com as duas pernas estendidas e a cabeça apoiada.',
    'Dobre um joelho, segure-o com as duas mãos e puxe em direção ao peito.',
    'Mantenha a outra perna estendida no chão, sem deixar esse joelho subir.',
    'Segure respirando devagar; solte, estenda a perna com calma e troque de lado.',
  ],
  cues: [
    'Sinta alongar o glúteo da perna dobrada; a frente do outro quadril também pode puxar.',
    'Empurre o calcanhar da perna estendida para longe, com os dedos apontando para o teto.',
    'Lombar e nuca relaxadas no chão, olhar no teto.',
  ],
  mistakes: [
    'Deixar a perna estendida dobrar e sair do chão',
    'Rolar o quadril para o lado ao puxar o joelho',
    'Tensionar ombros e pescoço para puxar com mais força',
  ],
  breath: 'Respire lento e fundo; ao soltar o ar, traga o joelho um pouco mais perto do peito.',
  easier: 'Dobre a outra perna e apoie o pé no chão para aliviar a lombar.',
  harder: 'Puxe o joelho em direção ao ombro oposto para pegar mais a lateral do glúteo.',
  yt: 'alongamento um joelho ao peito deitado glúteo',
};

export default ex;
