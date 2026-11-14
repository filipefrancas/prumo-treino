import type { Exercise } from '../../types.ts';

/** Ficha C · Peito, ombro e braço. */
const ex: Exercise = {
  id: 'desenvolvimento-maquina',
  name: 'Desenvolvimento na máquina (pegada neutra)',
  aka: [
    'Desenvolvimento Máquina (Pegada Neutra)',
    'Desenvolvimento de ombros na máquina',
    'Desenvolvimento articulado',
  ],
  kind: 'forca',
  group: 'ombros',
  muscles: {
    primary: ['deltoide anterior', 'deltoide lateral'],
    secondary: ['tríceps', 'trapézio superior'],
  },
  equipment: ['máquina'],
  how: [
    'Ajuste o assento para os pegadores ficarem na altura dos ombros e encoste as costas inteiras.',
    'Segure com as palmas se olhando, cotovelos apontando para baixo e pés firmes no chão.',
    'Empurre para cima até estender os braços acima da cabeça, sem travar os cotovelos.',
    'Desça devagar até as mãos voltarem à altura dos ombros.',
  ],
  cues: [
    'Sinta a frente e a lateral dos ombros empurrando, com o pescoço solto.',
    'Costelas para baixo e lombar perto do encosto: nada de arquear para empurrar.',
    'Olhe para a frente e mantenha os punhos em cima dos cotovelos.',
  ],
  mistakes: [
    'Arquear a lombar e descolar as costas do encosto na subida',
    'Descer só até a altura da testa para aguentar mais carga',
    'Projetar a cabeça para a frente a cada repetição',
  ],
  breath: 'Solte o ar ao empurrar para cima e puxe o ar na descida.',
  easier: 'Faça um braço de cada vez, com carga menor, segurando o assento com a mão livre.',
  harder: 'Pare 2 segundos embaixo, com as mãos na altura dos ombros, antes de cada subida.',
  swap: ['elevacao-lateral', 'supino-inclinado-maquina'],
  yt: 'desenvolvimento na máquina pegada neutra execução',
};

export default ex;
