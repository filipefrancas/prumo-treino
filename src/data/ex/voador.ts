import type { Exercise } from '../../types.ts';

/** Ficha B · Peito e costas. Fecha o peito sem gastar o tríceps. */
const ex: Exercise = {
  id: 'voador',
  name: 'Voador (peck deck)',
  aka: ['Peck deck', 'Crucifixo na máquina', 'Fly na máquina'],
  kind: 'forca',
  group: 'peito',
  muscles: {
    primary: ['peitoral maior'],
    secondary: ['deltoide anterior'],
  },
  equipment: ['máquina'],
  how: [
    'Ajuste o banco para os pegadores ficarem na altura do peito e sente com as costas no encosto.',
    'Segure os pegadores com os cotovelos levemente dobrados, braços abertos na linha dos ombros.',
    'Feche os braços à frente do peito até as mãos quase se tocarem.',
    'Aperte o peito um instante e abra devagar até sentir o peito alongar.',
  ],
  cues: [
    'Sinta o meio do peito, não a frente dos ombros.',
    'Peito aberto e ombros para trás, encostados no banco.',
    'Os cotovelos ficam no mesmo ângulo do começo ao fim.',
  ],
  mistakes: [
    'Desencostar as costas e jogar os ombros para a frente',
    'Abrir demais os braços e forçar o ombro',
    'Dobrar os cotovelos e transformar o movimento em supino',
  ],
  breath: 'Solte o ar ao fechar e puxe o ar ao abrir.',
  easier: 'Use menos carga e reduza um pouco a abertura.',
  harder: 'Segure 2 segundos com os braços fechados.',
  swap: ['crossover', 'crucifixo-inclinado'],
  yt: 'voador peck deck execução correta',
};

export default ex;
