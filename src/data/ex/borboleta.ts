import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'borboleta',
  name: 'Borboleta',
  aka: ['Postura da borboleta', 'Alongamento de virilha'],
  kind: 'alongamento',
  group: 'quadril',
  muscles: {
    primary: ['adutores'],
  },
  equipment: ['colchonete'],
  how: [
    'Sente no chão, junte as solas dos pés à frente do quadril e deixe os joelhos abrirem.',
    'Segure os pés com as duas mãos e deixe o tronco ereto, com o peito aberto.',
    'Relaxe as coxas e deixe os joelhos descerem em direção ao chão, sem empurrar.',
    'Segure no ponto em que a parte interna das coxas alonga, respirando devagar.',
    'Para sair, junte os joelhos com a ajuda das mãos e estenda as pernas.',
  ],
  cues: [
    'Sinta abrir a virilha e a parte interna das coxas, dos dois lados por igual.',
    'Tronco ereto: imagine um fio puxando o topo da cabeça para o teto.',
    'Os joelhos descem porque a coxa relaxa, não porque você força.',
  ],
  mistakes: [
    'Empurrar os joelhos para baixo com os cotovelos ou as mãos',
    'Bater os joelhos para cima e para baixo, sem parar na posição',
    'Arredondar a lombar e afundar o peito',
  ],
  breath: 'Respire devagar; a cada expiração, deixe os joelhos pesarem um pouco mais.',
  easier: 'Afaste os pés do quadril e sente sobre uma toalha dobrada para manter as costas retas.',
  harder: 'Traga os calcanhares para mais perto do quadril e incline o tronco à frente, de costas retas.',
  yt: 'alongamento borboleta adutores virilha',
};

export default ex;
