import type { Exercise } from '../../types.ts';

/** Ficha A · Pernas. A parte de trás da coxa é o que mais protege quem corre. */
const ex: Exercise = {
  id: 'mesa-flexora',
  name: 'Mesa flexora',
  aka: ['Flexora deitada', 'Mesa flexora deitada', 'Flexão de joelhos deitado'],
  kind: 'forca',
  group: 'posterior',
  muscles: {
    primary: ['posteriores de coxa'],
    secondary: ['panturrilha', 'glúteo máximo'],
  },
  equipment: ['máquina'],
  how: [
    'Deite de bruços com os joelhos logo depois da borda do banco e o rolo acima dos calcanhares.',
    'Segure os pegadores e mantenha o quadril encostado no banco.',
    'Dobre os joelhos e traga o rolo em direção aos glúteos, até onde conseguir.',
    'Segure um instante e volte devagar até as pernas quase estenderem.',
  ],
  cues: [
    'Sinta a parte de trás das coxas, não a lombar.',
    'Quadril pressionado contra o banco durante toda a repetição.',
    'Pontas dos pés puxadas para a canela ajudam a sentir mais o posterior.',
  ],
  mistakes: [
    'Levantar o quadril do banco para ajudar a subir a carga',
    'Voltar de uma vez, sem controlar a descida',
    'Fazer só metade do movimento por excesso de carga',
  ],
  breath: 'Solte o ar ao dobrar os joelhos e puxe o ar na volta.',
  easier: 'Use menos carga e faça a volta contando 2 segundos.',
  harder: 'Volte em 4 segundos em todas as repetições.',
  swap: ['stiff-halteres', 'flexao-nordica'],
  yt: 'mesa flexora execução correta',
};

export default ex;
