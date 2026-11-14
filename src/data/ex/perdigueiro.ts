import type { Exercise } from '../../types.ts';

/**
 * Core do corredor: estabilidade do tronco com braço e perna opostos.
 * Na rotina é feito um lado de cada vez; o lado indicado é o da perna que vai para trás (como na animação).
 */
const ex: Exercise = {
  id: 'perdigueiro',
  name: 'Perdigueiro',
  aka: ['Bird dog', 'Cão perdigueiro', 'Superman em quatro apoios'],
  kind: 'core',
  group: 'core',
  muscles: {
    primary: ['eretores da espinha', 'glúteo máximo'],
    secondary: ['oblíquos', 'transverso do abdômen', 'deltoide'],
  },
  equipment: ['colchonete'],
  sided: true,
  how: [
    'Fique em quatro apoios, mãos embaixo dos ombros, joelhos embaixo do quadril e costas retas.',
    'Estenda uma perna para trás (ela define o lado) e o braço oposto à frente, devagar e juntos.',
    'Pare com braço, tronco e perna na horizontal, empurrando o calcanhar para trás, e segure 2 segundos.',
    'Volte a mão e o joelho ao chão com controle; faça todas as repetições e só então troque de lado.',
  ],
  cues: [
    'Imagine um copo cheio de água na lombar: o quadril não gira nem balança.',
    'Sinta o glúteo da perna estendida e a lombar trabalhando, com o abdômen firme.',
    'Olhe para o chão, um pouco à frente das mãos, com a nuca na linha das costas.',
  ],
  mistakes: [
    'Subir a perna acima da linha do quadril e afundar a lombar',
    'Girar o quadril e abrir a perna para o lado ao estender',
    'Fazer no embalo, sem a pausa com braço e perna estendidos',
  ],
  breath: 'Solte o ar ao estender braço e perna e puxe o ar ao voltar aos quatro apoios.',
  easier: 'Estenda só a perna, com as duas mãos no chão; quando ficar firme, inclua o braço.',
  harder: 'Na volta, aproxime cotovelo e joelho embaixo do tronco, sem tocar o chão, e estenda de novo.',
  swap: ['inseto-morto', 'prancha', 'ponte-de-gluteo'],
  yt: 'perdigueiro bird dog exercício execução correta',
};

export default ex;
