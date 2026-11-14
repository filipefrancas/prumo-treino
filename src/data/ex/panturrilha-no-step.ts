import type { Exercise } from '../../types.ts';

/**
 * Preparação da ficha B · Inferiores (posição sustentada, 30 a 45 s) e última posição das rotinas de alongamento.
 * A animação mostra os dois calcanhares descendo; nas rotinas o passo vem com lado, por isso a dica de como
 * alongar um lado de cada vez.
 */
const ex: Exercise = {
  id: 'panturrilha-no-step',
  name: 'Alongamento de panturrilha no degrau',
  aka: ['Panturrilha no Step', 'Alongamento de panturrilha no step'],
  kind: 'alongamento',
  group: 'panturrilha',
  muscles: {
    primary: ['panturrilha'],
    secondary: ['musculatura do pé'],
  },
  equipment: ['degrau'],
  how: [
    'Suba no degrau e apoie só a ponta dos pés na borda, com uma mão em uma barra ou na parede.',
    'Com os joelhos estendidos, deixe os calcanhares descerem devagar abaixo do nível do degrau.',
    'Pare onde a panturrilha estica sem doer e fique ali, respirando, sem balançar.',
    'Para sair, suba os calcanhares até a altura do degrau e desça um pé de cada vez.',
  ],
  cues: [
    'Sinta esticar do meio da panturrilha até o calcanhar.',
    'Para alongar um lado de cada vez, jogue o peso do corpo na perna desse lado.',
    'Corpo reto e pés apontando para a frente; a mão só ajuda no equilíbrio.',
  ],
  mistakes: [
    'Balançar para cima e para baixo em vez de sustentar a posição',
    'Dobrar os joelhos e perder o alongamento',
    'Virar os pés para fora ou sentar o quadril para trás',
  ],
  breath: 'Respire devagar e fundo e, ao soltar o ar, deixe os calcanhares descerem mais um pouco.',
  easier: 'No chão: um pé atrás com o calcanhar apoiado, mãos na parede, corpo inclinado à frente.',
  harder: 'Tire um pé do degrau e deixe o peso todo na perna que está alongando.',
  yt: 'alongamento de panturrilha no degrau',
};

export default ex;
