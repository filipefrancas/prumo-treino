import type { Exercise } from '../../types.ts';

/** Ficha C · Peito, ombro e braço (com pausa de 2 s no alongamento). */
const ex: Exercise = {
  id: 'crucifixo-inclinado',
  name: 'Crucifixo inclinado com halteres',
  aka: ['Crucifixo Inclinado com Halteres', 'Crucifixo no banco inclinado', 'Fly inclinado com halteres'],
  kind: 'forca',
  group: 'peito',
  muscles: {
    primary: ['peitoral maior'],
    secondary: ['deltoide anterior', 'bíceps'],
  },
  equipment: ['halteres', 'banco inclinado'],
  how: [
    'Deite no banco inclinado (30 a 45°), pés no chão, halteres acima do peito e palmas se olhando.',
    'Dobre de leve os cotovelos e abra os braços para os lados, descendo devagar.',
    'Pare com os halteres na altura do peito e segure 2 segundos, sentindo o peito alongar.',
    'Feche os braços em arco, como em um abraço, até os halteres se encontrarem acima do peito.',
  ],
  cues: [
    'Sinta o peito abrir embaixo: a pausa no alongamento é o que mais conta aqui.',
    'Cotovelos com a mesma dobra leve do começo ao fim.',
    'Peito alto, escápulas juntas no banco e ombros longe das orelhas.',
  ],
  mistakes: [
    'Descer os halteres abaixo da linha do peito, forçando a frente do ombro',
    'Dobrar mais os cotovelos na subida e transformar o movimento em supino',
    'Pular a pausa embaixo e usar o embalo para fechar os braços',
  ],
  breath: 'Puxe o ar ao abrir os braços, respire curto na pausa e solte o ar ao fechar.',
  easier: 'Use menos carga e desça só até onde o ombro fica confortável, mantendo a pausa.',
  harder: 'No alto, pare com os halteres a um palmo um do outro e desça de novo, sem descansar.',
  swap: ['supino-inclinado-maquina', 'supino-reto-maquina'],
  yt: 'crucifixo inclinado com halteres execução',
};

export default ex;
