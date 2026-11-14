import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'rolo-quadriceps',
  name: 'Rolo no quadríceps',
  aka: ['Liberação miofascial do quadríceps', 'Rolo na frente da coxa', 'Foam roller no quadríceps'],
  kind: 'liberacao',
  group: 'pernas',
  muscles: {
    primary: ['quadríceps'],
  },
  equipment: ['rolo'],
  how: [
    'Deite de bruços, apoiado nos antebraços como em uma prancha, com o rolo sob a frente das coxas.',
    'Puxe e empurre o corpo com os antebraços, deslizando para a frente e para trás.',
    'Role devagar de logo abaixo do osso do quadril até logo acima dos joelhos.',
    'Onde doer mais, pare alguns segundos, respire e continue.',
  ],
  cues: [
    'Abdômen firme como na prancha: a lombar não afunda enquanto você rola.',
    'Coxas soltas e pesadas sobre o rolo; a força vem só dos braços.',
    'Incline o quadril um pouco para cada lado para pegar a coxa por dentro e por fora.',
  ],
  mistakes: [
    'Deixar a lombar afundar e a barriga cair em direção ao chão',
    'Passar o rolo em cima dos joelhos',
    'Rolar depressa, sem dar tempo de a coxa relaxar',
  ],
  breath: 'Respire lento e contínuo, sem prender o ar para aguentar a pressão.',
  easier: 'Apoie a ponta dos pés no chão para tirar parte do peso de cima das coxas.',
  harder: 'Role uma coxa por vez, com a outra perna aberta de lado, ou dobre o joelho no ponto tenso.',
  yt: 'liberação miofascial quadríceps rolo como fazer',
};

export default ex;
