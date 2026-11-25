import type { Exercise } from '../../types.ts';

/** Ficha A · Pernas. */
const ex: Exercise = {
  id: 'stiff-halteres',
  name: 'Stiff com halteres',
  aka: ['Stiff', 'Levantamento terra romeno com halteres', 'RDL com halteres'],
  kind: 'forca',
  group: 'posterior',
  muscles: {
    primary: ['posteriores de coxa', 'glúteo máximo'],
    secondary: ['lombar', 'antebraço'],
  },
  equipment: ['halteres'],
  how: [
    'Fique em pé, pés na largura do quadril, um halter em cada mão na frente das coxas.',
    'Solte um pouco os joelhos e empurre o quadril para trás, com as costas retas.',
    'Desça os halteres rente às pernas até sentir a parte de trás das coxas esticar bem.',
    'Suba empurrando o quadril para a frente e apertando os glúteos no alto.',
  ],
  cues: [
    'Pense em fechar uma porta com o quadril: ele vai para trás, não para baixo.',
    'Halteres raspando as pernas do começo ao fim.',
    'A descida acaba quando as costas começariam a arredondar.',
  ],
  mistakes: [
    'Arredondar as costas para chegar mais baixo',
    'Dobrar demais os joelhos e transformar o movimento em agachamento',
    'Deixar os halteres se afastarem do corpo',
  ],
  breath: 'Puxe o ar na descida e solte ao subir.',
  easier: 'Desça só até a altura dos joelhos, com halteres mais leves.',
  harder: 'Desça em 3 segundos e pare 1 segundo no ponto mais baixo.',
  swap: ['cadeira-flexora', 'hiperextensao-lombar'],
  yt: 'stiff com halteres execução correta',
};

export default ex;
