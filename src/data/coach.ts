import type { ISODate } from '../types.ts';

/**
 * Orientações do treinador que não cabem na ficha nem no plano de corrida: o roteiro de longo prazo da corrida
 * e os ajustes da musculação para o bloco de retorno.
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
 * Musculação no bloco de retorno: a ficha "Atleta Híbrido" continua a mesma, com estes ajustes do treinador.
 * As cargas da ficha são de agosto de 2025; na primeira vez de cada exercício no app, a sugestão é uma fração delas.
 */
export const FATOR_RETORNO = 0.75;

export interface RecadoForca {
  /** Segunda-feira da semana. */
  semana: ISODate;
  titulo: string;
  texto: string;
  /** Repetições em reserva pedidas na semana. */
  rir: string;
  /** Métodos de intensidade (drop-set, rest-pause, cluster) liberados na semana. */
  metodos: boolean;
}

export const RECADOS_FORCA: RecadoForca[] = [
  {
    semana: '2026-11-09',
    titulo: 'Readaptação',
    texto: 'Volte devagar: use cerca de 75% das cargas da ficha, que são de agosto de 2025, e pare cada série com 2 a 3 repetições de folga. Sem drop-set e sem rest-pause: faça as séries normais.',
    rir: '2 a 3',
    metodos: false,
  },
  {
    semana: '2026-11-16',
    titulo: 'Readaptação',
    texto: 'Mesma regra da semana passada: 75% das cargas da ficha, 2 a 3 repetições de folga, sem drop-set e sem rest-pause. Na segunda, a perna precisa sobrar para a corrida de quarta.',
    rir: '2 a 3',
    metodos: false,
  },
  {
    semana: '2026-11-23',
    titulo: 'Subir a carga',
    texto: 'Se as duas primeiras semanas foram bem, siga as sugestões de carga do app e pare com 2 repetições de folga. Ainda sem drop-set nem rest-pause.',
    rir: '2',
    metodos: false,
  },
  {
    semana: '2026-11-30',
    titulo: 'Ficha completa',
    texto: 'Volta a ficha como o Fabiano escreveu: repetições em reserva da ficha e os métodos (cluster, rest-pause, drop-set e os pares). Nos inferiores, mantenha 2 de folga no leg press e no recuo.',
    rir: 'o da ficha',
    metodos: true,
  },
  {
    semana: '2026-12-07',
    titulo: 'Semana de alívio',
    texto: 'A corrida alivia e a musculação também: uma série a menos em cada exercício principal e nada de falha. É a semana em que o corpo absorve o que você treinou.',
    rir: '3',
    metodos: false,
  },
  {
    semana: '2026-12-14',
    titulo: 'Ficha completa',
    texto: 'Ficha completa, com os métodos. É a semana mais puxada da corrida: se a perna estiver pesada na segunda, tire o drop-set da extensora.',
    rir: 'o da ficha',
    metodos: true,
  },
  {
    semana: '2026-12-21',
    titulo: 'Fechar o ciclo',
    texto: 'Última semana desta ficha. Capriche na execução e anote as cargas: é com elas que eu monto o próximo ciclo, em janeiro.',
    rir: 'o da ficha',
    metodos: true,
  },
];

export const recadoForca = (segunda: ISODate): RecadoForca | undefined => RECADOS_FORCA.find((r) => r.semana === segunda);

/** Princípios do treino híbrido, mostrados em Musculação › "Como este treino funciona". */
export const PRINCIPIOS_HIBRIDO: string[] = [
  'Corrida e musculação se alternam: quarta, sexta e domingo você corre; segunda, quinta e sábado você treina força; terça é livre.',
  'Inferiores na segunda, o mais longe possível do longo de domingo e com dois dias até a corrida de quarta.',
  'Na dúvida entre uma repetição a mais e uma execução limpa, fique com a execução limpa.',
  'Progrida uma coisa por vez: primeiro as repetições até o topo da faixa, depois a carga.',
  'Semana ruim de sono ou de trabalho: mantenha os treinos e corte uma série de cada exercício. Faltar custa mais do que treinar leve.',
];
