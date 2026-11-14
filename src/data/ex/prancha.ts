import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'prancha',
  name: 'Prancha',
  aka: ['Prancha ventral', 'Prancha abdominal', 'Prancha no antebraço'],
  kind: 'core',
  group: 'core',
  muscles: {
    primary: ['reto abdominal', 'transverso do abdômen'],
    secondary: ['oblíquos', 'glúteo máximo', 'quadríceps'],
  },
  equipment: ['colchonete'],
  how: [
    'Deite de bruços e apoie os antebraços no chão, com os cotovelos embaixo dos ombros.',
    'Apoie as pontas dos pés, contraia abdômen e glúteos e tire o quadril e os joelhos do chão.',
    'Alinhe calcanhares, quadril, ombros e cabeça em uma linha reta, olhando para o chão.',
    'Sustente a posição pelo tempo previsto, sem deixar o quadril subir nem descer.',
    'Para terminar, apoie os joelhos no chão com controle.',
  ],
  cues: [
    'Sinta o abdômen inteiro duro; se a lombar começar a pesar, pare e descanse.',
    'Aperte os glúteos e puxe os cotovelos em direção aos pés, sem sair do lugar.',
    'Empurre o chão com os antebraços e olhe para as mãos, com a nuca longa.',
  ],
  mistakes: [
    'Deixar o quadril cair e a lombar afundar',
    'Empinar o quadril para aliviar o abdômen',
    'Prender a respiração até o tempo acabar',
  ],
  breath: 'Não prenda o ar: puxe e solte curto, pelo nariz, mantendo o abdômen contraído.',
  easier: 'Apoie os joelhos no chão, mantendo uma linha reta dos joelhos à cabeça.',
  harder: 'Tire um pé do chão por alguns segundos e alterne, sem deixar o quadril girar.',
  swap: ['inseto-morto', 'abdominal-maquina', 'prancha-lateral'],
  yt: 'prancha abdominal antebraço execução correta',
};

export default ex;
