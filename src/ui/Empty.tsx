import type { ComponentChildren } from 'preact';
import { Icon, type IconName } from './Icon.tsx';

export interface EmptyProps {
  icon?: IconName;
  /** O que falta, no negativo simples: "Nenhuma corrida registrada". */
  title: string;
  /** O que aparece ali e como começar. */
  text?: ComponentChildren;
  /** No máximo um botão pequeno. */
  action?: ComponentChildren;
}

/** Estado vazio: caixa tracejada com título, uma frase e uma ação. */
export function Empty({ icon, title, text, action }: EmptyProps) {
  return (
    <div class="ui-empty">
      {icon ? <Icon name={icon} size={24} class="ui-empty-icon" /> : null}
      <b>{title}</b>
      {text != null && text !== false ? <p>{text}</p> : null}
      {action != null && action !== false ? <div class="ui-empty-act">{action}</div> : null}
    </div>
  );
}
