/* Ajustes › App: versão, uso sem internet, armazenamento persistente e como instalar no iPhone. */
import { useEffect, useState } from 'preact/hooks';
import { version } from '../../../package.json';
import { usePwa } from '../../lib/pwa.ts';
import { Button, Card, Icon, List, Pill, Row, Section, toast } from '../../ui/index.ts';

type Persistencia = 'verificando' | 'sim' | 'nao' | 'sem-suporte';

/** O navegador prometeu não limpar os dados sozinho? (`navigator.storage.persisted`) */
function usePersistencia(): [Persistencia, () => Promise<void>] {
  const [estado, setEstado] = useState<Persistencia>('verificando');
  useEffect(() => {
    let vivo = true;
    const st = typeof navigator !== 'undefined' ? navigator.storage : undefined;
    if (!st || typeof st.persisted !== 'function') {
      setEstado('sem-suporte');
      return;
    }
    st.persisted().then(
      (ok) => {
        if (vivo) setEstado(ok ? 'sim' : 'nao');
      },
      () => {
        if (vivo) setEstado('sem-suporte');
      },
    );
    return () => {
      vivo = false;
    };
  }, []);
  const pedir = async (): Promise<void> => {
    try {
      const ok = await navigator.storage.persist();
      setEstado(ok ? 'sim' : 'nao');
      toast(ok ? 'Pronto: os dados ficam protegidos.' : 'O aparelho não liberou agora. Instale o app na Tela de Início e mantenha um backup.', {
        tone: ok ? 'ok' : 'info',
        ms: ok ? 2200 : 5000,
      });
    } catch {
      setEstado('sem-suporte');
    }
  };
  return [estado, pedir];
}

export function SobreApp() {
  const pwa = usePwa();
  const [persistencia, pedirPersistencia] = usePersistencia();

  return (
    <Section title="App">
      <Card>
        <List>
          <Row leading={<Icon name="info" />} title="Prumo Treino" sub="Corrida, musculação e mobilidade" right={<span class="aj-versao">v{version}</span>} />
          <Row leading={<Icon name="info" />} title="Fotos dos exercícios" sub="Free Exercise DB (domínio público)" />
          <Row
            leading={<Icon name="ok" />}
            title="Uso sem internet"
            sub={
              pwa.offlineReady
                ? 'Pronto para usar sem internet.'
                : 'Abra o app uma vez com internet para guardar tudo.'
            }
            right={pwa.offlineReady ? <Pill tone="good">pronto</Pill> : <Pill>pendente</Pill>}
          />
          <Row
            leading={<Icon name="baixar" />}
            title="Armazenamento"
            sub={
              persistencia === 'sim'
                ? 'Protegido: o aparelho não limpa seus dados sozinho.'
                : persistencia === 'nao'
                  ? 'O iPhone pode limpar dados de apps pouco usados.'
                  : persistencia === 'verificando'
                    ? 'Verificando…'
                    : 'Este navegador não informa. Mantenha um backup.'
            }
            right={persistencia === 'sim' ? <Pill tone="good">protegido</Pill> : persistencia === 'nao' ? <Pill tone="warn">sem garantia</Pill> : undefined}
          />
        </List>
        {persistencia === 'nao' ? (
          <div class="aj-acao is-fim">
            <Button size="sm" onClick={() => void pedirPersistencia()}>
              Pedir proteção dos dados
            </Button>
          </div>
        ) : null}
      </Card>

      <Card title="Como instalar no iPhone" action={pwa.standalone ? <Pill tone="good">instalado</Pill> : null}>
        {pwa.standalone ? (
          <p class="ui-muted aj-folha-txt">
            Você já está usando o app pela Tela de Início. Ele abre em tela cheia e funciona sem internet.
          </p>
        ) : (
          <>
            <ol class="aj-passos">
              <li>
                Abra este endereço no <b>Safari</b>.
              </li>
              <li>
                Toque em <b>Compartilhar</b> <Icon name="enviar" size={16} class="aj-passo-icone" />, na barra de baixo.
              </li>
              <li>
                Role a lista e escolha <b>Adicionar à Tela de Início</b>.
              </li>
              <li>
                Confirme em <b>Adicionar</b> e abra o app pelo ícone novo.
              </li>
            </ol>
            <p class="ui-note aj-instalar-nota">
              Não existe botão de instalar automático no iPhone. Instalado, o app abre em tela cheia, funciona sem internet e guarda os
              dados com mais segurança.
            </p>
          </>
        )}
      </Card>
    </Section>
  );
}
