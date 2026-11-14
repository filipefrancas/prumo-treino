import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'rolo-adutores',
  name: 'Rolo nos adutores',
  aka: ['Liberação miofascial dos adutores', 'Rolo na parte interna da coxa'],
  kind: 'liberacao',
  group: 'quadril',
  muscles: {
    primary: ['adutores'],
  },
  equipment: ['rolo'],
  sided: true,
  how: [
    'Deite de bruços, apoiado nos antebraços, e abra uma perna para o lado com o joelho dobrado.',
    'Apoie a parte interna dessa coxa no rolo e deixe a outra perna estendida no chão.',
    'Mova o corpo devagar, levando o rolo de logo acima do joelho até perto da virilha.',
    'Volte pelo mesmo caminho e pare alguns segundos onde estiver mais tenso.',
  ],
  cues: [
    'Deixe a coxa pesar no rolo, com o joelho e o pé soltos.',
    'Perto da virilha é mais sensível: chegue devagar e tire peso com os antebraços.',
    'Abdômen levemente firme para a lombar não afundar enquanto você rola.',
  ],
  mistakes: [
    'Apoiar a parte de dentro do joelho no rolo',
    'Afundar a lombar e pendurar o peso nos ombros',
    'Rolar só o meio da coxa e pular a parte mais alta, perto da virilha',
  ],
  breath: 'Respire devagar pelo nariz e solte o ar comprido ao chegar perto da virilha.',
  easier: 'Jogue mais peso nos antebraços e na perna estendida, deixando a coxa só encostada no rolo.',
  harder: 'Com o rolo parado no ponto tenso, dobre e estenda o joelho devagar algumas vezes.',
  yt: 'liberação miofascial adutores rolo parte interna da coxa',
};

export default ex;
