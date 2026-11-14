/* Entrada da galeria do kit (kit-base.html e kit-sheet.html). Não faz parte do app: serve para conferir os
   componentes de src/ui em todos os estados, nos dois temas. */
import { render } from 'preact';
import '../../styles/fonts.css';
import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/ui.css';
import { KitBase } from './base.tsx';

const host = document.getElementById('app');
if (host) render(<KitBase />, host);
