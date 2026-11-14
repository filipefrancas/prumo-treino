import type { Exercise } from '../../types.ts';

/** Educativo de corrida: uma perna faz o pendular anterior e a outra o anfersen; depois inverte. */
const ex: Exercise = {
  id: 'pendular-anfersen',
  name: 'Pendular anterior + anfersen',
  aka: ['Pendular com anfersen'],
  kind: 'educativo',
  group: 'posterior',
  muscles: {
    primary: ['posteriores de coxa'],
    secondary: ['glúteo máximo', 'flexores do quadril', 'panturrilha'],
  },
  equipment: ['peso do corpo'],
  sided: true,
  how: [
    'Fique em pé, tronco alto, cotovelos a 90°. O lado da vez é o da perna que sobe reta.',
    'Lance essa perna reta à frente, até uns 45°, e puxe de volta arranhando o chão sob o corpo.',
    'No passo seguinte, dobre a outra perna e leve o calcanhar até o glúteo.',
    'Siga alternando: de um lado, só perna reta à frente; do outro, só calcanhar no glúteo.',
    'Ao trocar de lado, inverta os papéis das pernas.',
  ],
  cues: [
    'Objetivo: coordenação; cada perna faz um gesto diferente sem quebrar o ritmo.',
    'Comece devagar, contando um, dois; acelere quando o padrão sair sem pensar.',
    'Tronco alto e parado; os braços seguem o balanço normal da corrida.',
  ],
  mistakes: [
    'Dobrar o joelho da perna que deveria subir reta',
    'Travar entre um passo e outro para pensar, quebrando o ritmo',
    'Deitar o tronco para trás quando a perna reta sobe',
  ],
  breath: 'Respire normalmente, no ritmo dos passos; a concentração não deve prender o ar.',
  easier: 'Faça caminhando: um passo com a perna reta à frente, um com o calcanhar no glúteo.',
  harder: 'Avance uns 20 m com um lado e volte com o outro, sem pausa na troca.',
  yt: 'educativo de corrida pendular com anfersen execução',
};

export default ex;
