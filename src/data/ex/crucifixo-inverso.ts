import type { Exercise } from '../../types.ts';

/** Ficha A · Costas e bíceps (faz par com a rosca direta no banco inclinado). */
const ex: Exercise = {
  id: 'crucifixo-inverso',
  name: 'Crucifixo inverso com halteres',
  aka: ['Crucifixo inverso halter', 'Crucifixo invertido com halteres', 'Crucifixo inverso no banco inclinado'],
  kind: 'forca',
  group: 'ombros',
  muscles: {
    primary: ['deltoide posterior'],
    secondary: ['trapézio médio', 'romboides', 'manguito rotador'],
  },
  equipment: ['halteres', 'banco inclinado'],
  how: [
    'Deite de bruços no banco inclinado baixo, peito apoiado, pés no chão e um halter em cada mão.',
    'Deixe os braços penderem para o chão, palmas se olhando e cotovelos levemente dobrados.',
    'Abra os braços para os lados até a linha dos ombros, sem tirar o peito do banco.',
    'Segure um instante no alto e desça devagar, sem deixar os halteres despencarem.',
  ],
  cues: [
    'Sinta a parte de trás dos ombros; se o pescoço tensionar, a carga está alta.',
    'Olhe para o chão, com o queixo fora do banco e o pescoço comprido.',
    'Cotovelos travados na mesma dobra: o movimento acontece só no ombro.',
  ],
  mistakes: [
    'Tirar o peito do banco para dar impulso aos halteres',
    'Dobrar os cotovelos na subida e transformar o movimento em remada',
    'Encolher os ombros em direção às orelhas no alto',
  ],
  breath: 'Solte o ar ao abrir os braços e puxe o ar ao descer.',
  easier: 'Faça um braço de cada vez, com halteres mais leves e a outra mão segurando o banco.',
  harder: 'Segure 2 segundos com os braços abertos na linha dos ombros.',
  swap: ['elevacao-y-banco', 'remada-maquina'],
  yt: 'crucifixo inverso com halteres banco inclinado execução',
};

export default ex;
