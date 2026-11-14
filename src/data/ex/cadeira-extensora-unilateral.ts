import type { Exercise } from '../../types.ts';

/** Ficha B · Inferiores (em drop-set: três cargas em sequência, sem descanso). */
const ex: Exercise = {
  id: 'cadeira-extensora-unilateral',
  name: 'Cadeira extensora unilateral',
  aka: ['Cadeira Extensora Unilateral', 'Extensora unilateral', 'Extensão de joelho unilateral'],
  kind: 'forca',
  group: 'pernas',
  muscles: {
    primary: ['quadríceps'],
  },
  equipment: ['máquina'],
  sided: true,
  how: [
    'Sente com as costas no encosto, o joelho na linha do eixo da máquina e o rolo na frente do tornozelo.',
    'Segure nos apoios ao lado do assento e estenda uma perna até ela ficar reta, na horizontal.',
    'Aperte a coxa por um instante com a perna estendida.',
    'Desça devagar até o joelho voltar a 90°, sem deixar o peso bater.',
    'Termine as repetições de uma perna e troque; a outra fica parada, dobrada.',
  ],
  cues: [
    'Quadril e costas colados no banco: só o joelho se mexe.',
    'Sinta a frente da coxa apertar no alto e frear o peso na descida.',
    'Comece pela perna mais fraca e repita o mesmo número de repetições na outra.',
  ],
  mistakes: [
    'Chutar o peso com impulso e deixar a carga cair na volta',
    'Levantar o quadril do assento para completar a repetição',
    'Parar antes de estender a perna por inteiro',
  ],
  breath: 'Solte o ar ao estender a perna e puxe o ar na descida.',
  easier: 'Faça com as duas pernas juntas, com uma carga que dê para descer devagar.',
  harder: 'Suba com as duas pernas e desça com uma só, em 4 s.',
  swap: ['leg-press-45', 'recuo-com-halteres'],
  yt: 'cadeira extensora unilateral execução correta',
};

export default ex;
