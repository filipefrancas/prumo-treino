import type { Exercise } from '../../types.ts';

/** Ficha A · Costas e bíceps (preparação, com pausa de 2 s no alto). */
const ex: Exercise = {
  id: 'elevacao-y-banco',
  name: 'Elevação em Y no banco inclinado',
  aka: ['Elevação Y no banco 30-45 graus', 'Elevação em Y com halteres', 'Y no banco inclinado', 'Y raise'],
  kind: 'forca',
  group: 'ombros',
  muscles: {
    primary: ['trapézio inferior', 'deltoide posterior'],
    secondary: ['trapézio médio', 'manguito rotador', 'romboides'],
  },
  equipment: ['halteres', 'banco inclinado'],
  how: [
    'Deite de bruços no banco inclinado (30 a 45°), peito apoiado, com halteres leves.',
    'Deixe os braços penderem para o chão, com os polegares apontando para a frente.',
    'Suba os braços estendidos à frente e um pouco abertos, formando um Y com o tronco.',
    'Segure 2 segundos no alto, com os braços na linha do tronco, e desça devagar.',
  ],
  cues: [
    'Sinta o trabalho entre as escápulas e logo abaixo delas, não no pescoço.',
    'Polegares para cima e ombros longe das orelhas durante toda a subida.',
    'Olhe para o chão, com a testa fora do banco e o pescoço comprido.',
  ],
  mistakes: [
    'Usar carga alta e perder a pausa de 2 segundos no alto',
    'Terminar a subida encolhendo os ombros, com o pescoço tenso',
    'Tirar o peito do banco e arquear a lombar para ganhar altura',
  ],
  breath: 'Solte o ar ao subir os braços, respire curto durante a pausa e puxe o ar ao descer.',
  easier: 'Faça sem halteres, só com o peso dos braços, mantendo a pausa de 2 segundos.',
  harder: 'Aumente a pausa no alto para 4 segundos antes de pensar em subir a carga.',
  swap: ['crucifixo-inverso'],
  yt: 'elevação em Y no banco inclinado com halteres execução',
};

export default ex;
