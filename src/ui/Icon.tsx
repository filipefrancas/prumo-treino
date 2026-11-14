/* Ícones do kit: SVG inline no traço do Prumo (24 × 24, sem preenchimento, pontas e junções redondas, cor do texto).
   O desenho de cada um é uma string de elementos SVG; todas são fixas e escritas aqui, nunca vêm de dados. */

const PATHS = {
  hoje: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M16 3v4M8 3v4M3 10h18"/><circle cx="12" cy="15.5" r="1.5" fill="currentColor" stroke="none"/>',
  corrida: '<circle cx="14" cy="4" r="2"/><path d="M7 21l3-6 3 2v4M6 11l4-3 4 2 2 3h3M10 8l-1 4"/>',
  musculacao: '<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>',
  mobilidade: '<circle cx="12" cy="4.5" r="2"/><path d="M4 8.5c3 1.6 5.2 2.2 8 2.2s5-.6 8-2.2M12 10.7v5.3M12 16l-4 5M12 16l4 5"/>',
  progresso: '<path d="M4 4v16h16"/><path d="M7.5 15.5l3.5-4.5 3 2.5L19 7.5"/>',
  ajustes:
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  play: '<path d="M7.5 4.8v14.4a.6.6 0 0 0 .92.5l11.1-7.2a.6.6 0 0 0 0-1L8.42 4.3a.6.6 0 0 0-.92.5z"/>',
  pause: '<rect x="6" y="4.5" width="4" height="15" rx="1.2"/><rect x="14" y="4.5" width="4" height="15" rx="1.2"/>',
  pular: '<path d="M5.5 5.3v13.4a.6.6 0 0 0 .93.5l9.3-6.7a.6.6 0 0 0 0-1L6.43 4.8a.6.6 0 0 0-.93.5z"/><path d="M19 5v14"/>',
  voltar: '<path d="M15 6l-6 6 6 6"/>',
  avancar: '<path d="M9 6l6 6-6 6"/>',
  fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  menos: '<path d="M5 12h14"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cronometro: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5v-4M9.5 2.5h5M12 2.5V6M18.3 7.2l1.5-1.5"/>',
  coracao: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  balanca: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 9a4 4 0 0 1 6 0l-2 3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.01"/>',
  'link-externo': '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  trocar: '<path d="M7 4 3.5 7.5 7 11M3.5 7.5H20M17 13l3.5 3.5L17 20M20.5 16.5H4"/>',
  nota: '<path d="M5 4h14a1 1 0 0 1 1 1v9l-6 6H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 20v-5a1 1 0 0 1 1-1h5M8 9h8M8 13h3"/>',
  calendario: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  baixar: '<path d="M12 4v11M7 10.5l5 5 5-5M4 20h16"/>',
  enviar: '<path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  lixeira: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  som: '<path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/>',
  voz: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4V16A1.5 1.5 0 0 1 4 14.5z"/><path d="M8.5 8.5h7M8.5 11.5h4.5"/>',
  vibrar: '<rect x="8" y="4" width="8" height="16" rx="2"/><path d="M4.5 9v6M2 10.5v3M19.5 9v6M22 10.5v3"/>',
  tela: '<rect x="7" y="7" width="10" height="14.5" rx="2.2"/><path d="M10.5 18.2h3M12 2v2.2M6.3 3.6l1.3 1.7M17.7 3.6l-1.3 1.7"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  lua: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  fogo: '<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-1.5.5-2.5 1.5-3.5 0 2 1 3 2.5 3 0-3 1-6.5 1-9.5z"/>',
  trofeu: '<path d="M8 4h8v6a4 4 0 0 1-8 0z"/><path d="M8 6H5v1.5a3 3 0 0 0 3 3M16 6h3v1.5a3 3 0 0 1-3 3M12 14v3.5M8.5 20.5h7M9.5 20.5c0-1.7 1-3 2.5-3s2.5 1.3 2.5 3"/>',
  repetir: '<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>',
  editar: '<path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14.5 7.5l3 3"/>',
  buscar: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  descanso: '<path d="M3 18.5V6.5M3 14.5h18v4M21 14.5v-2a3 3 0 0 0-3-3h-6.5v5"/><circle cx="7.3" cy="11" r="1.7"/>',
  alvo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  /* extras usados pelo próprio kit e úteis nas telas */
  alerta: '<path d="M12 9v4M12 17h.01M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  ok: '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l3 3 5-6"/>',
  copiar: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  estrela: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  subir: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  abrir: '<path d="M6 9l6 6 6-6"/>',
} as const;

export type IconName = keyof typeof PATHS;

/** Todos os nomes de ícone, na ordem em que foram declarados (para galerias e testes). */
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export interface IconProps {
  name: IconName;
  /** Lado em px (padrão 20). */
  size?: number;
  class?: string;
}

/** Ícone decorativo (aria-hidden). O rótulo acessível fica em quem o contém (botão, link). */
export function Icon({ name, size = 20, class: cls }: IconProps) {
  return (
    <svg
      class={cls ? `ui-icon ${cls}` : 'ui-icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={name === 'check' ? 2.25 : 1.75}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
    />
  );
}
