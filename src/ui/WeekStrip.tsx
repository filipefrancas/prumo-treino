import type { AreaTone } from './viz-util.ts';

export interface WeekStripDay {
  /** Data "AAAA-MM-DD". */
  date: string;
  /** Inicial do dia da semana ("S", "T", "Q"…). */
  letter: string;
  /** Dia do mês. */
  num: number;
  /** Treinos do dia: cheio quando feito, só contorno quando planejado. */
  marks: { tone: AreaTone; done: boolean }[];
  today: boolean;
  selected: boolean;
}

export interface WeekStripProps {
  days: WeekStripDay[];
  onSelect: (date: string) => void;
  class?: string;
}

const AREA: Record<AreaTone, string> = { corrida: 'corrida', musc: 'musculação', mob: 'mobilidade' };

function descricao(d: WeekStripDay): string {
  const partes = d.marks.map((m) => `${AREA[m.tone]} ${m.done ? 'feita' : 'planejada'}`);
  return `Dia ${d.num}${d.today ? ', hoje' : ''}: ${partes.length ? partes.join(', ') : 'sem treino'}`;
}

/** Faixa da semana do Prumo: 7 dias com letra, número e os marcadores de treino. */
export function WeekStrip({ days, onSelect, class: cls }: WeekStripProps) {
  return (
    <div class={`ui-week${cls ? ` ${cls}` : ''}`} role="group" aria-label="Semana">
      {days.map((d) => (
        <button
          key={d.date}
          type="button"
          class={`ui-wd${d.today ? ' is-today' : ''}${d.selected ? ' is-selected' : ''}`}
          aria-pressed={d.selected}
          aria-current={d.today ? 'date' : undefined}
          aria-label={descricao(d)}
          onClick={() => onSelect(d.date)}
        >
          <span class="ui-wd-letter" aria-hidden="true">
            {d.letter}
          </span>
          <b class="ui-wd-num num" aria-hidden="true">
            {d.num}
          </b>
          <span class="ui-wd-marks" aria-hidden="true">
            {d.marks.map((m, i) => (
              <i key={i} class={`ui-mk ui-mk--${m.tone}${m.done ? ' is-done' : ''}`} />
            ))}
          </span>
        </button>
      ))}
    </div>
  );
}
