import type { Exercise } from '../../types.ts';

/**
 * Ficha B · Inferiores (bi-set com a flexão nórdica).
 * No PDF da ficha o nome está sem til ("Hiperextensao de Lombar"); em aka vai a grafia correta.
 * Apesar do nome, a subida termina com o corpo alinhado, sem passar da linha.
 */
const ex: Exercise = {
  id: 'hiperextensao-lombar',
  name: 'Hiperextensão de lombar',
  aka: ['Hiperextensão de Lombar', 'Extensão lombar no banco 45°', 'Extensão de tronco no banco romano'],
  kind: 'forca',
  group: 'posterior',
  muscles: {
    primary: ['eretores da espinha', 'glúteo máximo'],
    secondary: ['posteriores de coxa'],
  },
  equipment: ['banco de hiperextensão'],
  how: [
    'Ajuste o apoio das coxas logo abaixo da dobra do quadril, prenda os tornozelos e cruze as mãos no peito.',
    'Desça o tronco dobrando no quadril, com as costas retas, até ele pender para a frente.',
    'Suba apertando os glúteos até o corpo formar uma linha reta dos tornozelos à cabeça.',
    'Pare nessa linha, sem jogar o tronco para trás, e desça de novo com controle.',
  ],
  cues: [
    'A dobradiça é o quadril: as costas sobem e descem retas, sem enrolar.',
    'Sinta glúteos e parte de trás das coxas puxarem; a lombar só segura firme.',
    'Queixo recolhido e olhar para o chão: o pescoço segue a linha das costas.',
  ],
  mistakes: [
    'Passar da linha do corpo e arquear a lombar no alto',
    'Subir com tranco, aproveitando o embalo da descida',
    'Deixar o apoio alto demais, sobre o quadril, e dobrar a coluna no lugar dele',
  ],
  breath: 'Puxe o ar na descida e solte na subida.',
  easier: 'Desça só até a metade do caminho e suba devagar.',
  harder: 'Segure uma anilha junto ao peito ou pare 2 s com o corpo alinhado no alto.',
  swap: ['ponte-de-gluteo', 'perdigueiro'],
  yt: 'hiperextensão lombar banco 45 graus execução correta',
};

export default ex;
