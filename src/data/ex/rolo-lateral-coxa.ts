import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'rolo-lateral-coxa',
  name: 'Rolo na lateral da coxa',
  aka: ['Rolo na banda iliotibial', 'Liberação miofascial do trato iliotibial', 'Rolo no vasto lateral'],
  kind: 'liberacao',
  group: 'pernas',
  muscles: {
    primary: ['vasto lateral'],
    secondary: ['tensor da fáscia lata'],
  },
  equipment: ['rolo'],
  sided: true,
  how: [
    'Deite de lado, apoiado no antebraço de baixo, com o rolo sob a lateral da coxa de baixo.',
    'Cruze a perna de cima à frente e apoie o pé no chão para aliviar o peso.',
    'Empurre com o pé e o antebraço e role devagar de logo abaixo do quadril até acima do joelho.',
    'No trecho mais sensível, pare alguns segundos, respire e só depois continue.',
  ],
  cues: [
    'É a região mais sensível do rolo: tire peso com o pé da frente até ficar suportável.',
    'Gire o corpo um pouco para a frente para pegar o músculo, não só a faixa dura da lateral.',
    'Corpo alinhado da cabeça ao pé, sem deixar o ombro de apoio subir para a orelha.',
  ],
  mistakes: [
    'Rolar em cima do osso lateral do joelho ou do quadril',
    'Largar todo o peso na coxa e contrair o corpo inteiro de dor',
    'Passar correndo pela região para acabar logo',
  ],
  breath: 'Respire fundo e solte o ar devagar; se precisar prender o ar, a pressão está alta demais.',
  easier: 'Jogue mais peso no pé da frente e apoie também a mão de cima no chão.',
  harder: 'Junte as pernas, uma sobre a outra, para deixar todo o peso na coxa de baixo.',
  yt: 'liberação miofascial lateral da coxa banda iliotibial rolo',
};

export default ex;
