import { Card, type Area } from './Card.tsx';
import { Icon } from './Icon.tsx';

export interface PorQueProps {
  /** O raciocínio do treinador para o treino, em texto corrido. Sem texto, o cartão não aparece. */
  texto: string | undefined;
  area?: Area;
  class?: string;
}

/** Cartão "Por que assim": o raciocínio do treinador, sempre junto do treino (musculação, corrida e alongamento). */
export function PorQue({ texto, area, class: cls }: PorQueProps) {
  if (!texto) return null;
  return (
    <Card area={area} title="Por que assim" action={<Icon name="nota" />} class={`ui-porque ${cls ?? ''}`}>
      <p class="ui-porque-txt">{texto}</p>
    </Card>
  );
}
