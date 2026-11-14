import type { Exercise } from '../../types.ts';

/** Ficha B · Inferiores (bi-set com a hiperextensão de lombar). */
const ex: Exercise = {
  id: 'flexao-nordica',
  name: 'Flexão nórdica',
  aka: ['Flexão Nórdica', 'Nórdica', 'Flexão nórdica de joelhos', 'Nordic curl'],
  kind: 'forca',
  group: 'posterior',
  muscles: {
    primary: ['posteriores de coxa'],
    secondary: ['glúteo máximo', 'panturrilha', 'eretores da espinha'],
  },
  equipment: ['banco nórdico'],
  how: [
    'Ajoelhe no apoio, prenda os tornozelos no rolo e cruze os braços no peito, com o corpo reto.',
    'Incline o corpo para a frente bem devagar, dobrando só os joelhos.',
    'Desça até uns 45°, ou até onde conseguir frear sem dobrar o quadril.',
    'Volte puxando os calcanhares contra o rolo até o tronco ficar na vertical.',
  ],
  cues: [
    'Glúteos e abdômen contraídos: joelhos, quadril e ombros na mesma linha.',
    'A descida é a parte que mais conta: leve de 3 a 5 s para descer.',
    'Sinta a parte de trás das coxas segurar o corpo; se der cãibra, pare e solte a perna.',
  ],
  mistakes: [
    'Dobrar o quadril e descer com o glúteo para trás',
    'Despencar no fim da descida, sem frear',
    'Arquear a lombar para compensar a falta de força',
  ],
  breath: 'Puxe o ar no alto, desça com o abdômen firme e solte o ar ao voltar.',
  easier: 'Desça até onde der, apoie as mãos no chão e volte com um empurrão dos braços.',
  harder: 'Desça além dos 45°, até o peito quase tocar o chão, e volte sem ajuda das mãos.',
  swap: ['hiperextensao-lombar', 'ponte-de-gluteo'],
  yt: 'flexão nórdica posterior de coxa execução correta',
};

export default ex;
