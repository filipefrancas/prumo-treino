import type { Exercise } from '../../types.ts';

/** Ficha B · Peito e costas. */
const ex: Exercise = {
  id: 'remada-curvada',
  name: 'Remada curvada com barra',
  aka: ['Remada curvada', 'Remada com barra', 'Barbell row'],
  kind: 'forca',
  group: 'costas',
  muscles: {
    primary: ['grande dorsal', 'romboides'],
    secondary: ['trapézio médio', 'bíceps', 'lombar'],
  },
  equipment: ['barra'],
  how: [
    'Segure a barra na largura dos ombros, palmas para baixo, e fique em pé com os joelhos soltos.',
    'Empurre o quadril para trás e incline o tronco até uns 45°, com as costas retas.',
    'Puxe a barra até o umbigo, com os cotovelos passando rente ao corpo.',
    'Aperte as costas um instante e desça devagar até estender os braços.',
  ],
  cues: [
    'O tronco fica parado: quem se mexe são os braços.',
    'Puxe com os cotovelos, como se as mãos fossem só ganchos.',
    'Abdômen firme e olhar para o chão à frente protegem a lombar.',
  ],
  mistakes: [
    'Levantar o tronco a cada repetição para dar impulso',
    'Arredondar as costas quando a barra desce',
    'Puxar a barra para o peito, abrindo demais os cotovelos',
  ],
  breath: 'Solte o ar ao puxar a barra e puxe o ar na descida.',
  easier: 'Troque pela remada na máquina com o peito apoiado.',
  harder: 'Segure 1 segundo com a barra no umbigo em cada repetição.',
  swap: ['remada-cavalinho', 'remada-maquina'],
  yt: 'remada curvada com barra execução correta',
};

export default ex;
