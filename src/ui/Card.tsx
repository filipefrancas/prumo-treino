import type { ComponentChildren } from 'preact';
import { cx, toHref } from './Button.tsx';

export type Area = 'corrida' | 'musc' | 'mob' | 'peso';

export interface CardProps {
  /** Área do card: põe o quadradinho de 8 px da cor da área antes do título. */
  area?: Area;
  title?: string;
  /** Rótulo mono em caixa alta acima do título. */
  eyebrow?: string;
  /** Conteúdo à direita do cabeçalho: uma pill, um texto curto ou um botão pequeno. */
  action?: ComponentChildren;
  /** Com href ou onClick o card inteiro é clicável (botões e links dentro dele continuam funcionando). */
  href?: string;
  onClick?: (e: MouseEvent) => void;
  /** Sem sombra, em --surface-2: blocos internos e barras de filtro. */
  flat?: boolean;
  class?: string;
  children?: ComponentChildren;
}

export function Card({ area, title, eyebrow, action, href, onClick, flat = false, class: cls, children }: CardProps) {
  const clickable = href !== undefined || onClick !== undefined;
  const hitLabel = title ?? eyebrow ?? 'Abrir';
  const hasHead = Boolean(title || eyebrow) || (action != null && action !== false);
  const dot = area ? <i class="ui-dot" /> : null;
  return (
    <div class={cx('ui-card', area && `ui-area-${area}`, flat && 'is-flat', clickable && 'is-click', cls)}>
      {/* o alvo cobre o card por baixo do conteúdo; assim um botão dentro do card não fica aninhado em outro botão */}
      {clickable ? (
        href !== undefined ? (
          <a class="ui-card-hit" href={toHref(href)} aria-label={hitLabel} onClick={onClick} />
        ) : (
          <button type="button" class="ui-card-hit" aria-label={hitLabel} onClick={onClick} />
        )
      ) : null}
      {hasHead ? (
        <div class="ui-card-head">
          <div class="ui-card-titles">
            {eyebrow ? (
              <div class="ui-eyebrow ui-card-eyebrow">
                {title ? null : dot}
                {eyebrow}
              </div>
            ) : null}
            {title ? (
              <h3 class="ui-card-title">
                {dot}
                <span>{title}</span>
              </h3>
            ) : null}
          </div>
          {action != null && action !== false ? <div class="ui-card-action">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export interface SectionProps {
  title: string;
  /** Ação à direita do rótulo (um link "ver tudo", um botão pequeno, um segmento). */
  action?: ComponentChildren;
  children?: ComponentChildren;
}

/** Seção da tela: rótulo mono com a linha fina até a margem e os cards empilhados a 12 px. */
export function Section({ title, action, children }: SectionProps) {
  return (
    <section class="ui-section">
      <div class="ui-section-head">
        <h2 class="ui-eyebrow">{title}</h2>
        <i class="ui-section-line" />
        {action != null && action !== false ? <div class="ui-section-action">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
