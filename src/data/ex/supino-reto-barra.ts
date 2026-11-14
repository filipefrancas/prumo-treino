import type { Exercise } from '../../types.ts';

/** Ficha B · Peito e costas. Abre o treino junto com a puxada. */
const ex: Exercise = {
  id: 'supino-reto-barra',
  name: 'Supino reto com barra',
  aka: ['Supino reto', 'Supino com barra', 'Bench press'],
  kind: 'forca',
  group: 'peito',
  muscles: {
    primary: ['peitoral maior'],
    secondary: ['tríceps', 'deltoide anterior'],
  },
  equipment: ['barra', 'banco'],
  how: [
    'Deite no banco com os olhos embaixo da barra e os pés firmes no chão.',
    'Segure a barra um pouco mais aberto que os ombros, junte as escápulas e estufe o peito.',
    'Tire a barra do suporte e desça devagar até tocar de leve o meio do peito.',
    'Empurre a barra para cima até estender os braços, sem tirar o quadril do banco.',
    'Ao terminar, leve a barra até encostar no suporte antes de soltar.',
  ],
  cues: [
    'Ombros para trás e para baixo, colados no banco, durante toda a série.',
    'Cotovelos a uns 45° do tronco, não abertos em cruz.',
    'Pés empurrando o chão deixam o corpo firme no banco.',
  ],
  mistakes: [
    'Quicar a barra no peito para ganhar impulso',
    'Tirar o quadril do banco ao empurrar',
    'Abrir os cotovelos na linha dos ombros, forçando a articulação',
  ],
  breath: 'Puxe o ar na descida e solte ao empurrar a barra.',
  easier: 'Faça com halteres ou na máquina até pegar confiança com a barra.',
  harder: 'Pare 1 segundo com a barra no peito antes de empurrar.',
  swap: ['supino-reto-maquina', 'supino-inclinado-halteres'],
  yt: 'supino reto com barra execução correta',
};

export default ex;
