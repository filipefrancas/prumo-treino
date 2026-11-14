import { toHref } from './Button.tsx';
import { Icon, type IconName } from './Icon.tsx';

export interface TabItem {
  id: string;
  label: string;
  icon: IconName;
  /** Rota ('/hoje') ou endereço ('#/hoje'). */
  href: string;
}

export interface TabBarProps {
  items: TabItem[];
  /** id do item ativo (fica em âmbar e com aria-current="page"). */
  active: string;
}

/** Barra inferior fixa: fundo com desfoque, item ativo em âmbar, altura var(--tabs-h) mais a área segura. */
export function TabBar({ items, active }: TabBarProps) {
  return (
    <nav class="ui-tabs" aria-label="Seções">
      {items.map((it) => (
        <a key={it.id} class="ui-tab" href={toHref(it.href)} aria-current={it.id === active ? 'page' : undefined}>
          <Icon name={it.icon} size={22} />
          <span>{it.label}</span>
        </a>
      ))}
    </nav>
  );
}
