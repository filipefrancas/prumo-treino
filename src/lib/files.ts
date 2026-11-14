/**
 * Arquivos e área de transferência: salvar (compartilhar no iPhone ou baixar), escolher um arquivo e copiar texto.
 * Nenhuma função rejeita: sem suporte ou com falha, devolvem o resultado mais próximo do que aconteceu.
 */

const temDoc = (): boolean => typeof document !== 'undefined' && typeof document.createElement === 'function';

function baixar(nome: string, conteudo: string, mime: string): boolean {
  if (!temDoc() || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return false;
  try {
    const url = URL.createObjectURL(new Blob([conteudo], { type: mime }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nome;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 1500);
    return true;
  } catch {
    return false;
  }
}

/**
 * Salva um arquivo de texto. No iPhone abre a folha de compartilhar (para "Salvar em Arquivos"), quando o
 * navegador aceita compartilhar arquivos; senão, baixa por um link. Chame dentro de um toque do usuário.
 * Devolve 'cancelado' se o usuário fechou a folha de compartilhar ou se não foi possível salvar.
 */
export async function salvarArquivo(
  nome: string,
  conteudo: string,
  mime = 'application/json',
): Promise<'compartilhado' | 'baixado' | 'cancelado'> {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && typeof File !== 'undefined') {
      const arquivo = new File([conteudo], nome, { type: mime });
      const dados: ShareData = { files: [arquivo] };
      if (navigator.canShare(dados)) {
        try {
          await navigator.share(dados);
          return 'compartilhado';
        } catch (e) {
          if (e instanceof Error && e.name === 'AbortError') return 'cancelado';
          // Outro erro (sem permissão, fora de um toque): tenta o download.
        }
      }
    }
  } catch {
    /* segue para o download */
  }
  return baixar(nome, conteudo, mime) ? 'baixado' : 'cancelado';
}

let seletorPendente: HTMLInputElement | null = null;

/**
 * Abre o seletor de arquivos e devolve o texto do arquivo escolhido; null se o usuário cancelou ou se a leitura
 * falhou. Chame dentro de um toque do usuário. (Em navegadores antigos, sem o evento "cancel", a promessa de uma
 * escolha cancelada fica sem resposta; a chamada seguinte funciona normalmente.)
 */
export function escolherArquivo(accept = 'application/json,.json'): Promise<string | null> {
  return new Promise((resolve) => {
    if (!temDoc()) {
      resolve(null);
      return;
    }
    try {
      seletorPendente?.remove();
      const input = document.createElement('input');
      seletorPendente = input;
      input.type = 'file';
      input.accept = accept;
      input.style.position = 'fixed';
      input.style.left = '-9999px';
      input.style.opacity = '0';
      input.setAttribute('aria-hidden', 'true');
      input.tabIndex = -1;
      let resolvido = false;
      const terminar = (texto: string | null): void => {
        if (resolvido) return;
        resolvido = true;
        input.remove();
        if (seletorPendente === input) seletorPendente = null;
        resolve(texto);
      };
      input.addEventListener('change', () => {
        const arquivo = input.files?.[0];
        if (!arquivo) {
          terminar(null);
          return;
        }
        arquivo.text().then(terminar, () => terminar(null));
      });
      input.addEventListener('cancel', () => terminar(null));
      // O iPhone só abre o seletor se o campo estiver no documento.
      document.body.appendChild(input);
      input.click();
    } catch {
      resolve(null);
    }
  });
}

function copiarPorSelecao(texto: string): boolean {
  if (!temDoc()) return false;
  try {
    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '0';
    area.style.left = '-9999px';
    area.style.fontSize = '16px'; // evita o zoom do Safari ao focar
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, texto.length);
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Copia o texto para a área de transferência; se a API moderna falhar, tenta por seleção de texto. */
export async function copiar(texto: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    /* tenta a reserva */
  }
  return copiarPorSelecao(texto);
}
