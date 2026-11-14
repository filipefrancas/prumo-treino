import type { Exercise } from '../../types.ts';

/** Preparação da ficha B · Inferiores (posição sustentada, 30 a 45 s em cada perna). */
const ex: Exercise = {
  id: 'mobilidade-quadril-elastico',
  name: 'Mobilidade de quadril com elástico',
  aka: ['Mobilidade de Quadril VI', 'Alongamento de posterior deitado com elástico'],
  kind: 'alongamento',
  group: 'posterior',
  muscles: {
    primary: ['posteriores de coxa'],
    secondary: ['panturrilha', 'glúteo máximo'],
  },
  equipment: ['elástico', 'colchonete'],
  sided: true,
  how: [
    'Deite de costas, passe o elástico pela sola de um pé e segure as pontas com as duas mãos.',
    'Com a outra perna estendida no chão, suba a perna do elástico reta até uns 60° do chão.',
    'Puxe o elástico e traga a perna para perto da vertical, até a parte de trás da coxa esticar.',
    'Sustente respirando, alivie devagar e troque de perna ao terminar o tempo.',
  ],
  cues: [
    'Sinta esticar no meio da parte de trás da coxa; atrás do joelho não deve arder.',
    'Quadril e lombar no chão; a perna de baixo fica estendida, com o calcanhar longe.',
    'Cabeça e ombros relaxados no colchonete: quem puxa são os braços.',
  ],
  mistakes: [
    'Tirar o quadril do chão ou dobrar a perna de baixo para subir mais',
    'Dobrar o joelho da perna que está alongando',
    'Puxar com tranco ou levantar a cabeça do chão',
  ],
  breath: 'Respire devagar pelo nariz e, ao soltar o ar, traga a perna um pouco mais para perto.',
  easier: 'Dobre o joelho da perna de baixo e apoie esse pé no chão.',
  harder: 'Puxe a ponta do pé na direção da canela para alongar também a panturrilha.',
  yt: 'alongamento de posterior de coxa deitado com elástico',
};

export default ex;
