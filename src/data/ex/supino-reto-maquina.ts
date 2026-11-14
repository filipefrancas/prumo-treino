import type { Exercise } from '../../types.ts';

/** Ficha C · Peito, ombro e braço. Na ficha do treinador o nome aparece sem acento: "Supino Reto Maquina". */
const ex: Exercise = {
  id: 'supino-reto-maquina',
  name: 'Supino reto na máquina',
  aka: ['Supino Reto Maquina', 'Supino reto articulado', 'Supino horizontal na máquina'],
  kind: 'forca',
  group: 'peito',
  muscles: {
    primary: ['peitoral maior'],
    secondary: ['tríceps', 'deltoide anterior'],
  },
  equipment: ['máquina'],
  how: [
    'Deite no banco com os pegadores na linha do meio do peito, joelhos dobrados e pés no banco.',
    'Junte as escápulas, encoste os ombros no banco e segure os pegadores com os punhos retos.',
    'Empurre para cima até quase estender os braços, sem travar os cotovelos.',
    'Desça devagar até os pegadores chegarem perto do peito, cotovelos abaixo da linha do banco.',
  ],
  cues: [
    'Sinta o peito alongar embaixo e apertar em cima, como se juntasse os braços.',
    'Escápulas juntas e ombros colados no banco do começo ao fim.',
    'Cotovelos a uns 45° do tronco: nem colados nas costelas, nem abertos em cruz.',
  ],
  mistakes: [
    'Tirar os ombros do banco para empurrar o fim da subida',
    'Abrir os cotovelos em cruz, na linha dos ombros',
    'Descer só até a metade para conseguir usar mais carga',
  ],
  breath: 'Puxe o ar na descida e solte ao empurrar os pegadores para cima.',
  easier: 'Apoie os pés no chão para ganhar estabilidade e use uma carga menor.',
  harder: 'Pare 1 a 2 segundos com os pegadores perto do peito antes de empurrar.',
  swap: ['supino-inclinado-maquina', 'crucifixo-inclinado'],
  yt: 'supino reto na máquina articulada execução',
};

export default ex;
