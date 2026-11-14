import type { Exercise } from '../../types.ts';

/** Ficha A · Costas e bíceps. */
const ex: Exercise = {
  id: 'puxada-supinada',
  name: 'Puxada supinada na polia',
  aka: ['Puxada supinada', 'Puxada alta com pegada supinada', 'Pulley frente com pegada supinada'],
  kind: 'forca',
  group: 'costas',
  muscles: {
    primary: ['dorsal'],
    secondary: ['bíceps', 'romboides', 'trapézio inferior'],
  },
  equipment: ['polia', 'barra reta'],
  how: [
    'Sente com as coxas firmes sob o rolo e segure a barra com as palmas viradas para você.',
    'Com as mãos na largura dos ombros, estenda os braços, abra o peito e incline de leve o tronco para trás.',
    'Puxe a barra até a parte alta do peito, com os cotovelos indo para baixo e para trás.',
    'Segure um instante com o peito alto e deixe a barra subir devagar até estender os braços.',
  ],
  cues: [
    'Leve o peito ao encontro da barra em vez de trazer a barra até você.',
    'Sinta as costas puxando os cotovelos para baixo; o bíceps ajuda, não comanda.',
    'Olhe para a frente, um pouco acima do horizonte, com os ombros longe das orelhas.',
  ],
  mistakes: [
    'Deitar o tronco para trás e usar o balanço para descer a barra',
    'Fechar os ombros para a frente quando a barra chega perto do peito',
    'Soltar a barra na subida, sem controlar a volta',
  ],
  breath: 'Solte o ar ao trazer a barra até o peito e puxe o ar enquanto ela sobe.',
  easier: 'Troque a barra pelo triângulo (pegada neutra), mais confortável para punhos e cotovelos.',
  harder: 'Suba a barra em 3 segundos em cada repetição, sem perder o peito aberto.',
  swap: ['pulldown-unilateral', 'remada-maquina'],
  yt: 'puxada alta pegada supinada polia execução',
};

export default ex;
