import type { Exercise } from '../../types.ts';

/** Ficha A · Pernas. Fecha o treino. */
const ex: Exercise = {
  id: 'panturrilha-em-pe-maquina',
  name: 'Panturrilha em pé na máquina',
  aka: ['Gêmeos em pé', 'Elevação de panturrilha na máquina', 'Panturrilha em pé'],
  kind: 'forca',
  group: 'panturrilha',
  muscles: {
    primary: ['panturrilha'],
    secondary: ['sóleo'],
  },
  equipment: ['máquina'],
  how: [
    'Entre na máquina com os ombros sob as almofadas e a ponta dos pés na borda do degrau.',
    'Estenda as pernas para tirar a carga do apoio, com os joelhos soltos, sem travar.',
    'Desça os calcanhares abaixo do degrau até sentir a panturrilha esticar.',
    'Suba na ponta dos pés o mais alto que conseguir e segure 1 segundo.',
  ],
  cues: [
    'Movimento completo: calcanhar bem baixo e ponta bem alta.',
    'Suba apoiado no dedão, sem deixar o pé rolar para fora.',
    'Só o tornozelo se mexe; joelhos e quadril ficam parados.',
  ],
  mistakes: [
    'Quicar embaixo e usar o impulso para subir',
    'Fazer repetições curtas e rápidas, sem descer o calcanhar',
    'Dobrar os joelhos para ajudar a empurrar a carga',
  ],
  breath: 'Solte o ar ao subir e puxe o ar ao descer os calcanhares.',
  easier: 'Faça no degrau só com o peso do corpo, apoiando a mão na parede.',
  harder: 'Pare 2 segundos com o calcanhar embaixo e 2 segundos no alto.',
  swap: ['panturrilha-leg-press', 'elevacao-de-panturrilha'],
  yt: 'panturrilha em pé na máquina execução correta',
};

export default ex;
