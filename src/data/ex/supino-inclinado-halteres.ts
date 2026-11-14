import type { Exercise } from '../../types.ts';

/** Ficha B · Peito e costas. */
const ex: Exercise = {
  id: 'supino-inclinado-halteres',
  name: 'Supino inclinado com halteres',
  aka: ['Supino inclinado', 'Supino 45 com halteres'],
  kind: 'forca',
  group: 'peito',
  muscles: {
    primary: ['peitoral maior (parte de cima)'],
    secondary: ['deltoide anterior', 'tríceps'],
  },
  equipment: ['halteres', 'banco inclinado'],
  how: [
    'Ajuste o banco entre 30° e 45° e sente com um halter apoiado em cada coxa.',
    'Deite levando os halteres até a altura do peito, com os cotovelos abaixo das mãos.',
    'Empurre os halteres para cima até quase estender os braços, aproximando um do outro.',
    'Desça devagar até os halteres chegarem ao lado do peito, sentindo ele esticar.',
  ],
  cues: [
    'Sinta a parte de cima do peito, perto da clavícula.',
    'Ombros para trás, colados no banco, e peito estufado.',
    'Punhos firmes, em cima dos cotovelos, do começo ao fim.',
  ],
  mistakes: [
    'Inclinar demais o banco e passar o trabalho para os ombros',
    'Bater um halter no outro no alto do movimento',
    'Descer pouco e perder o alongamento do peito',
  ],
  breath: 'Puxe o ar na descida e solte ao empurrar os halteres.',
  easier: 'Baixe a inclinação do banco para 30° e use halteres mais leves.',
  harder: 'Desça em 3 segundos e pare 1 segundo embaixo.',
  swap: ['supino-inclinado-maquina', 'supino-reto-barra'],
  yt: 'supino inclinado com halteres execução correta',
};

export default ex;
