import { Fragment } from 'preact';
import { mesCurto, parteISO } from './viz-util.ts';

export interface HeatDay {
  /** Data "AAAA-MM-DD". */
  date: string;
  corrida: boolean;
  musc: boolean;
  mob: boolean;
}

export interface HeatProps {
  /** [semana][dia], de segunda a domingo, da mais antiga para a mais recente. */
  weeks: HeatDay[][];
  /** Hoje ("AAAA-MM-DD"): ganha o contorno âmbar; os dias depois dele ficam apagados. */
  todayISO: string;
  /** Mostra a legenda das três áreas (padrão: sim). */
  legend?: boolean;
  class?: string;
}

const LETRAS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'] as const;
const AREAS = [
  { k: 'corrida', nome: 'Corrida' },
  { k: 'musc', nome: 'Musculação' },
  { k: 'mob', nome: 'Mobilidade' },
] as const;

/** Mapa de consistência: colunas são semanas, linhas vão de segunda a domingo e cada dia leva até 3 pontos. */
export function Heat({ weeks, todayISO, legend = true, class: cls }: HeatProps) {
  const dias = weeks.flat().filter((d) => d.date <= todayISO);
  const ativos = dias.filter((d) => d.corrida || d.musc || d.mob).length;
  const resumo = `Mapa de consistência: ${ativos} ${ativos === 1 ? 'dia com treino' : 'dias com treino'} em ${weeks.length} ${weeks.length === 1 ? 'semana' : 'semanas'}`;
  // o nome do mês aparece na primeira coluna e sempre que a segunda-feira cai em outro mês
  const meses = weeks.map((w, i) => {
    const m = parteISO(w[0]?.date ?? '')?.m;
    const antes = i > 0 ? parteISO(weeks[i - 1]?.[0]?.date ?? '')?.m : undefined;
    return m !== undefined && m !== antes ? mesCurto(m) : '';
  });
  return (
    <div class={`ui-heat${cls ? ` ${cls}` : ''}`}>
      <div class="ui-heat-grid" style={{ '--cols': String(weeks.length) }} role="img" aria-label={resumo}>
        <span />
        {meses.map((m, i) => (
          <span key={i} class="ui-heat-month">
            {m}
          </span>
        ))}
        {LETRAS.map((letra, r) => (
          <Fragment key={r}>
            <span class="ui-heat-day">
              {letra}
            </span>
            {weeks.map((w, c) => {
              const d = w[r];
              if (!d) return <i key={`${c}-${r}`} class="ui-heat-cell is-void" />;
              const hoje = d.date === todayISO;
              const futuro = d.date > todayISO;
              return (
                <i key={d.date} class={`ui-heat-cell${hoje ? ' is-today' : ''}${futuro ? ' is-future' : ''}`}>
                  {d.corrida && <b class="ui-heat-dot ui-heat-dot--corrida" />}
                  {d.musc && <b class="ui-heat-dot ui-heat-dot--musc" />}
                  {d.mob && <b class="ui-heat-dot ui-heat-dot--mob" />}
                </i>
              );
            })}
          </Fragment>
        ))}
      </div>
      {legend && (
        <div class="ui-heat-legend" aria-hidden="true">
          {AREAS.map((a) => (
            <span key={a.k}>
              <b class={`ui-heat-dot ui-heat-dot--${a.k}`} />
              {a.nome}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
