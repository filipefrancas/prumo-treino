import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'joelhos-ao-peito',
  name: 'Joelhos ao peito',
  aka: ['Abraço dos joelhos', 'Joelhos no peito', 'Alongamento de lombar deitado'],
  kind: 'alongamento',
  group: 'quadril',
  muscles: {
    primary: ['eretores da espinha', 'glúteo máximo'],
    secondary: ['quadrado lombar'],
  },
  equipment: ['colchonete'],
  how: [
    'Deite de costas no colchonete, com a cabeça apoiada e os joelhos dobrados.',
    'Traga os dois joelhos em direção ao peito e abrace-os, com uma mão em cada joelho.',
    'Puxe os joelhos para perto do peito até sentir a lombar e os glúteos alongarem.',
    'Segure respirando devagar; para sair, solte e apoie um pé de cada vez no chão.',
  ],
  cues: [
    'Sinta a lombar alongar e assentar no chão, com os glúteos soltos.',
    'Cabeça e ombros apoiados, queixo de leve para dentro, olhar no teto.',
    'Quem puxa são os braços; pescoço e ombros ficam soltos.',
  ],
  mistakes: [
    'Levantar a cabeça e os ombros para chegar mais perto dos joelhos',
    'Puxar aos trancos, balançando o corpo para a frente e para trás',
    'Prender o ar enquanto segura a posição',
  ],
  breath: 'Respire devagar pelo nariz e, a cada expiração, traga os joelhos um pouco mais para perto.',
  easier: 'Segure por trás das coxas, e não por cima dos joelhos, se a dobra do joelho incomodar.',
  harder: 'Afaste um pouco os joelhos e puxe-os em direção às axilas para ganhar amplitude no quadril.',
  yt: 'alongamento joelhos ao peito deitado lombar',
};

export default ex;
