import type { Exercise } from '../../types.ts';

/**
 * Ficha A · Pernas. A parte de trás da coxa é o que mais protege quem corre.
 * Entrou no lugar da mesa flexora (nov/2026): sentado, nada apoia no peito.
 */
const ex: Exercise = {
  id: 'cadeira-flexora',
  name: 'Cadeira flexora',
  aka: ['Flexora sentada', 'Flexora sentado', 'Flexão de joelhos sentado'],
  kind: 'forca',
  group: 'posterior',
  muscles: {
    primary: ['posteriores de coxa'],
    secondary: ['panturrilha'],
  },
  equipment: ['máquina'],
  how: [
    'Sente com as costas no encosto e alinhe o joelho com o eixo da máquina.',
    'Apoie o rolo de baixo logo acima dos calcanhares e desça a trava de cima sobre as coxas, firme.',
    'Dobre os joelhos e leve o rolo para baixo e para trás, até onde conseguir.',
    'Segure um instante e volte devagar até as pernas quase estenderem.',
  ],
  cues: [
    'Sinta a parte de trás das coxas.',
    'Costas coladas no encosto o tempo todo: o tronco não balança.',
    'Pontas dos pés puxadas para a canela ajudam a sentir mais o posterior.',
  ],
  mistakes: [
    'Deixar a trava das coxas frouxa e o quadril sair do banco',
    'Voltar de uma vez, sem controlar a subida do rolo',
    'Joelho fora do eixo da máquina',
  ],
  breath: 'Solte o ar ao dobrar os joelhos e puxe o ar na volta.',
  easier: 'Use menos carga e faça a volta contando 2 segundos.',
  harder: 'Volte em 4 segundos em todas as repetições.',
  swap: ['stiff-halteres', 'mesa-flexora'],
  yt: 'cadeira flexora sentado execução correta',
};

export default ex;
