import type { Exercise } from '../../types.ts';

/** Ficha C · Peito, ombro e braço. O treinador também chama a máquina de "abdômen bi articular". */
const ex: Exercise = {
  id: 'abdominal-maquina',
  name: 'Abdominal na máquina',
  aka: ['Abdominal Máquina', 'Abdômen bi articular', 'Abdominal sentado na máquina', 'Crunch na máquina'],
  kind: 'core',
  group: 'core',
  muscles: {
    primary: ['reto abdominal'],
    secondary: ['oblíquos', 'flexores do quadril'],
  },
  equipment: ['máquina'],
  how: [
    'Sente com a lombar no encosto, prenda os pés sob os rolos e segure os pegadores ao lado da cabeça.',
    'Enrole o tronco para a frente, levando as costelas em direção ao quadril.',
    'Aproxime o peito dos joelhos e aperte o abdômen por um instante.',
    'Desenrole devagar até o tronco ficar ereto, sem soltar a carga de uma vez.',
  ],
  cues: [
    'Pense em encurtar a distância entre as costelas e o quadril, enrolando a coluna.',
    'Sinta o abdômen fazer a força: braços e pernas só seguram, não puxam.',
    'Queixo levemente recolhido, olhando para os joelhos no fim do movimento.',
  ],
  mistakes: [
    'Puxar os pegadores com os braços em vez de enrolar o tronco',
    'Dobrar o quadril com as costas retas, sem enrolar a coluna',
    'Voltar de uma vez e bater a carga entre as repetições',
  ],
  breath: 'Solte todo o ar ao enrolar o tronco e puxe o ar ao desenrolar.',
  easier: 'Use menos carga e enrole só até a metade, segurando 1 segundo com o abdômen contraído.',
  harder: 'Segure 2 segundos com o tronco enrolado e desenrole em 3 segundos, sem encostar a carga.',
  swap: ['inseto-morto', 'prancha'],
  yt: 'abdominal na máquina sentado execução',
};

export default ex;
