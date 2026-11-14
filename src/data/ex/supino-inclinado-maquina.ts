import type { Exercise } from '../../types.ts';

/** Ficha C · Peito, ombro e braço. */
const ex: Exercise = {
  id: 'supino-inclinado-maquina',
  name: 'Supino inclinado na máquina',
  aka: [
    'Supino Máquina Inclinado (Pegada Pronada)',
    'Supino inclinado articulado',
    'Supino inclinado na máquina com pegada pronada',
  ],
  kind: 'forca',
  group: 'peito',
  muscles: {
    primary: ['peitoral maior', 'deltoide anterior'],
    secondary: ['tríceps'],
  },
  equipment: ['máquina'],
  how: [
    'Ajuste o assento para os pegadores ficarem na altura da parte alta do peito.',
    'Encoste as costas e a cabeça, firme os pés no chão e segure com as palmas para a frente.',
    'Empurre para a frente e para cima, em diagonal, até quase estender os braços.',
    'Volte devagar até as mãos chegarem perto do peito, com os cotovelos atrás do tronco.',
  ],
  cues: [
    'Sinta a parte de cima do peito, logo abaixo da clavícula.',
    'Peito alto e escápulas no encosto: os ombros não avançam junto com as mãos.',
    'Punhos retos, alinhados com os cotovelos, durante todo o caminho.',
  ],
  mistakes: [
    'Desencostar as costas e a cabeça para terminar a repetição',
    'Rolar os ombros para a frente quando os braços estendem',
    'Esticar os cotovelos com tranco no fim do movimento',
  ],
  breath: 'Puxe o ar na volta e solte ao empurrar os pegadores para a frente e para cima.',
  easier: 'Use a pegada neutra, se a máquina tiver, e uma carga menor.',
  harder: 'Volte em 3 segundos e pare 1 segundo com as mãos perto do peito antes de empurrar.',
  swap: ['supino-reto-maquina', 'crucifixo-inclinado'],
  yt: 'supino inclinado na máquina articulada execução',
};

export default ex;
