import type { ISODate } from '../types.ts';

/**
 * Orientações do treinador que não cabem na ficha nem no plano de corrida: o roteiro de longo prazo da corrida
 * e os recados semanais da musculação.
 */

export interface Etapa {
  id: string;
  nome: string;
  /** Período previsto, em texto ("nov e dez de 2026"). */
  quando: string;
  inicio: ISODate;
  fim: ISODate;
  /** Meta do longo ao fim da etapa. */
  longo: string;
  resumo: string;
}

/** Roteiro da corrida: do retorno aos longos de 15 a 18 km (21 km quando estiver bem). */
export const ROTEIRO_CORRIDA: Etapa[] = [
  {
    id: 'retorno',
    nome: 'Retorno',
    quando: 'nov e dez de 2026',
    inicio: '2026-11-09',
    fim: '2026-12-27',
    longo: "50 minutos (cerca de 8 km)",
    resumo: 'Voltar a correr três vezes por semana, sem dor e com vontade. Ritmo guiado pela frequência cardíaca.',
  },
  {
    id: 'base',
    nome: 'Base',
    quando: 'jan e fev de 2027',
    inicio: '2026-12-28',
    fim: '2027-02-28',
    longo: '12 a 13 km',
    resumo: 'O longo sobe cerca de 1 km por semana, com uma semana de alívio a cada quatro. As corridas da semana chegam a 8 a 10 km.',
  },
  {
    id: 'longos',
    nome: 'Longos',
    quando: 'mar e abr de 2027',
    inicio: '2027-03-01',
    fim: '2027-04-25',
    longo: '15 km em março, 18 km em abril',
    resumo: 'A distância de que você gosta: longos de 15 a 18 km, com as corridas da semana entre 10 e 12 km.',
  },
  {
    id: 'meia',
    nome: '21 km',
    quando: 'quando estiver bem',
    inicio: '2027-04-26',
    fim: '2027-06-27',
    longo: '21 km',
    resumo: 'Sem data marcada: quando os 18 km saírem inteiros e com sobra, o longo vai a 21.',
  },
];

export const etapaAtual = (data: ISODate): Etapa | undefined => ROTEIRO_CORRIDA.find((e) => data >= e.inicio && data <= e.fim);

/**
 * Musculação: recados da semana para o programa "Maromba" (A · Pernas na segunda, B · Peito e costas na quinta,
 * C · Braços e ombros no sábado). A regra é sempre a mesma: a primeira série do primeiro exercício é leve; nas
 * outras sobram 1 a 2 repetições; quando todas as séries batem o topo da faixa, a carga sobe.
 */
export interface RecadoForca {
  /** Segunda-feira da semana. */
  semana: ISODate;
  titulo: string;
  texto: string;
  /** Repetições em reserva pedidas na semana. */
  rir: string;
  /** Métodos de intensidade (drop-set, rest-pause, cluster) liberados na semana. O programa atual não tem nenhum. */
  metodos: boolean;
}

export const RECADOS_FORCA: RecadoForca[] = [
  {
    semana: '2026-11-09',
    titulo: 'Ficha nova',
    texto: 'A ficha mudou: pernas na segunda, peito e costas na quinta, braços e ombros no sábado. As cargas do app são um ponto de partida. Ajuste na hora para sobrarem 2 repetições em cada série.',
    rir: '2',
    metodos: true,
  },
  {
    semana: '2026-11-16',
    titulo: 'Achar as cargas',
    texto: 'Primeira semana completa da ficha nova. Use as séries para achar a carga de cada exercício: a certa é a que deixa 1 a 2 repetições sobrando. Na segunda, a perna precisa sobrar para a corrida de quarta.',
    rir: '1 a 2',
    metodos: true,
  },
  {
    semana: '2026-11-23',
    titulo: 'Somar repetições',
    texto: 'Repita as cargas da semana passada e tente uma repetição a mais em cada série. Quando todas as séries chegarem ao topo da faixa, o app sugere subir a carga.',
    rir: '1 a 2',
    metodos: true,
  },
  {
    semana: '2026-11-30',
    titulo: 'Seguir a progressão',
    texto: 'Siga as sugestões de carga do app. Na sexta a corrida ganha o primeiro treino forte do bloco: a quinta continua normal, porque peito e costas não cansam a perna.',
    rir: '1 a 2',
    metodos: true,
  },
  {
    semana: '2026-12-07',
    titulo: 'Semana de alívio',
    texto: 'A corrida alivia e a musculação também: uma série a menos em cada exercício e mais folga em todas. É a semana em que o corpo absorve o que você treinou.',
    rir: '3',
    metodos: true,
  },
  {
    semana: '2026-12-14',
    titulo: 'Semana cheia',
    texto: 'Ficha completa. É a semana mais puxada da corrida: se a perna estiver pesada na segunda, tire uma série do agachamento no hack e uma do leg press.',
    rir: '1 a 2',
    metodos: true,
  },
  {
    semana: '2026-12-21',
    titulo: 'Fechar o ciclo',
    texto: 'Última semana do bloco de corrida. Capriche na execução e registre as cargas: é com elas que o próximo ciclo é montado, em janeiro.',
    rir: '1 a 2',
    metodos: true,
  },
];

export const recadoForca = (segunda: ISODate): RecadoForca | undefined => RECADOS_FORCA.find((r) => r.semana === segunda);

/** Princípios do treino, mostrados em Musculação › "Como este treino funciona". */
export const PRINCIPIOS_HIBRIDO: string[] = [
  'Corrida e musculação se alternam: quarta, sexta e domingo você corre; segunda, quinta e sábado você treina força; terça é dia de alongamento.',
  'Pernas na segunda, o mais longe possível do longo de domingo e com dois dias até a corrida de quarta. Quinta é peito e costas. Sábado é braços e ombros.',
  'A primeira série do primeiro exercício é leve, para aquecer. Nas outras, pare com 1 a 2 repetições sobrando.',
  'Quando todas as séries chegarem ao topo da faixa de repetições, suba a carga. O app avisa.',
  'Na dúvida entre uma repetição a mais e uma execução limpa, fique com a execução limpa.',
  'Semana ruim de sono ou de trabalho: mantenha os treinos e corte uma série de cada exercício. Faltar custa mais do que treinar leve.',
];
