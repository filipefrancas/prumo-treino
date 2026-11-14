/**
 * Plano da semana: junta a corrida do plano, a musculação de `settings.plano` e o alongamento dos dias sem treino
 * (`PROFILE.stretchDays`) na agenda de cada dia e resume a semana. Funções puras sobre o estado.
 */
import { PROFILE } from '../data/profile.ts';
import { routineById } from '../data/routines.ts';
import type { AppState, Ficha, ISODate, Routine, RunWorkout } from '../types.ts';
import { contaComoFeito, fichaDoDia, fichaPorLetra, liftsFeitos } from './academia.ts';
import { type Situacao, corridasPorData, situacaoDoTreino, treinoDoDia } from './corrida.ts';
import { diaSemana, hoje, semanaDe } from './dates.ts';

export interface ItemDoDia {
  tipo: 'corrida' | 'musc' | 'mob';
  corrida?: RunWorkout;
  situacao?: Situacao;        // corrida
  ficha?: Ficha;              // musculação
  rotina?: Routine;           // alongamento (dia sem corrida nem musculação)
  feito: boolean;
}

/** "Por que assim" do dia de alongamento. */
export const PORQUE_ALONGAMENTO =
  'É o único dia sem corrida nem musculação. São as posições no chão, cerca de 24 minutos, com o timer do app. Solta a perna de segunda antes da corrida de quarta.';

/**
 * A rotina de alongamento do dia: só nos dias de `PROFILE.stretchDays` e só quando o dia não tem corrida nem
 * musculação. Em dia de musculação nunca há alongamento, mobilidade ou aquecimento sugerido.
 */
export function alongamentoDoDia(state: AppState, data: ISODate): Routine | undefined {
  if (!PROFILE.stretchDays.includes(diaSemana(data))) return undefined;
  if (treinoDoDia(data) || fichaDoDia(state.settings, state.lifts, data)) return undefined;
  return routineById(PROFILE.stretchRoutine);
}

/**
 * Agenda do dia com a situação da corrida calculada em relação a `ref` (em vez de hoje). Corrida primeiro,
 * musculação depois; em dia sem nenhuma das duas, o alongamento (se for dia dele). Em dia de musculação já feito,
 * a ficha é a que foi feita de fato.
 */
export function agendaDoDiaEm(state: AppState, data: ISODate, ref: ISODate): ItemDoDia[] {
  const itens: ItemDoDia[] = [];
  const corrida = treinoDoDia(data);
  if (corrida) {
    const situacao = situacaoDoTreino(state, corrida, ref);
    itens.push({ tipo: 'corrida', corrida, situacao, feito: situacao === 'feito' });
  }
  const planejada = fichaDoDia(state.settings, state.lifts, data);
  if (planejada) {
    const feitoNoDia = state.lifts.find((l) => l.data === data && contaComoFeito(l));
    const ficha = (feitoNoDia ? fichaPorLetra(state.settings, feitoNoDia.ficha) : undefined) ?? planejada;
    itens.push({ tipo: 'musc', ficha, feito: feitoNoDia !== undefined });
  }
  if (itens.length === 0) {
    const rotina = alongamentoDoDia(state, data);
    if (rotina) itens.push({ tipo: 'mob', rotina, feito: state.mob.some((m) => m.data === data && m.rotina === rotina.id) });
  }
  return itens;
}

/** O que está planejado para a data: corrida do plano, musculação do plano da semana ou alongamento. Vazio = descanso. */
export function agendaDoDia(state: AppState, data: ISODate): ItemDoDia[] {
  return agendaDoDiaEm(state, data, hoje());
}

/** A agenda de cada dia da semana de `ref`, de segunda a domingo. */
export function agendaDaSemana(state: AppState, ref: ISODate): { data: ISODate; itens: ItemDoDia[] }[] {
  return semanaDe(ref).map((data) => ({ data, itens: agendaDoDia(state, data) }));
}

/**
 * Semana de `ref` em números: `planejados` são as corridas e os treinos de musculação da agenda (o alongamento
 * entra em `mobMin`, não na conta de treinos); `corridas` são as corridas feitas na semana
 * (registros, mesmo fora do plano, e treinos marcados como feitos sem registro); `musc`, os treinos de
 * musculação concluídos; `feitos` = corridas + musc; `mobMin`, os minutos de mobilidade registrados.
 */
export function resumoDaSemana(state: AppState, ref: ISODate): { feitos: number; planejados: number; corridas: number; musc: number; mobMin: number } {
  const dias = semanaDe(ref);
  const noPeriodo = new Set(dias);
  let planejados = 0;
  for (const d of dias) planejados += agendaDoDia(state, d).filter((i) => i.tipo !== 'mob').length;
  const porData = corridasPorData(state);
  let corridas = 0;
  for (const d of dias) corridas += porData.get(d) ?? 0;
  const musc = liftsFeitos(state.lifts).filter((l) => noPeriodo.has(l.data)).length;
  let seg = 0;
  for (const m of state.mob) if (noPeriodo.has(m.data)) seg += m.seg;
  return { feitos: corridas + musc, planejados, corridas, musc, mobMin: Math.round(seg / 60) };
}
