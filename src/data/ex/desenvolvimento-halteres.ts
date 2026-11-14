import type { Exercise } from '../../types.ts';

/** Ficha C · Braços e ombros. Abre o treino, enquanto o ombro está descansado. */
const ex: Exercise = {
  id: 'desenvolvimento-halteres',
  name: 'Desenvolvimento com halteres',
  aka: ['Desenvolvimento de ombros', 'Desenvolvimento sentado', 'Shoulder press'],
  kind: 'forca',
  group: 'ombros',
  muscles: {
    primary: ['deltoide anterior', 'deltoide lateral'],
    secondary: ['tríceps', 'trapézio superior'],
  },
  equipment: ['halteres', 'banco'],
  how: [
    'Sente no banco com o encosto quase na vertical, costas apoiadas e pés firmes no chão.',
    'Leve os halteres até a altura das orelhas, palmas para a frente e cotovelos abaixo das mãos.',
    'Empurre os halteres para cima até quase estender os braços, sem bater um no outro.',
    'Desça devagar até os halteres voltarem à altura das orelhas.',
  ],
  cues: [
    'Cotovelos um pouco à frente do corpo, não abertos para trás.',
    'Abdômen firme e costelas para baixo, sem arquear a lombar.',
    'Punhos retos, em cima dos cotovelos.',
  ],
  mistakes: [
    'Arquear a lombar e descolar as costas do encosto',
    'Descer só até a metade para aguentar mais carga',
    'Encolher os ombros em direção às orelhas no alto',
  ],
  breath: 'Solte o ar ao empurrar para cima e puxe o ar na descida.',
  easier: 'Faça na máquina de desenvolvimento ou com as palmas viradas uma para a outra.',
  harder: 'Desça em 3 segundos e não descanse com os halteres embaixo.',
  swap: ['desenvolvimento-maquina', 'elevacao-lateral'],
  yt: 'desenvolvimento com halteres sentado execução correta',
};

export default ex;
