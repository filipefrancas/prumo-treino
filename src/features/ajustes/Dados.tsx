/* Ajustes › Dados: backup, restauração, histórico, troca de dados com o Prumo e "apagar tudo". */
import { useEffect, useState } from 'preact/hooks';
import { contaComoFeito } from '../../lib/academia.ts';
import { exportBackup, importBackup, importHistory, marcarBackupFeito, resetAll } from '../../lib/backup.ts';
import { fmtRelativa, hoje, toISO } from '../../lib/dates.ts';
import { copiar, escolherArquivo, salvarArquivo } from '../../lib/files.ts';
import { plural } from '../../lib/format.ts';
import { apagarFotos, contarFotos, importarPacote, useMidiaVersao } from '../../lib/midia.ts';
import { fromPrumoBackup, toPrumoBackup } from '../../lib/prumo.ts';
import { getState, replaceState, useStore } from '../../lib/store.ts';
import { Button, Card, Field, Icon, List, Row, Section, Sheet, TextArea, TextInput, toast } from '../../ui/index.ts';

type Folha = 'restaurar' | 'prumo-copiar' | 'prumo-importar' | 'apagar' | null;

const PALAVRA = 'APAGAR';

export function Dados() {
  const state = useStore((s) => s);
  const [folha, setFolha] = useState<Folha>(null);
  const [erro, setErro] = useState<string | undefined>(undefined);
  const [colado, setColado] = useState('');
  const [confirma, setConfirma] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const versaoFotos = useMidiaVersao();
  const [fotos, setFotos] = useState(0);
  useEffect(() => {
    let vivo = true;
    void contarFotos().then((n) => {
      if (vivo) setFotos(n);
    });
    return () => {
      vivo = false;
    };
  }, [versaoFotos]);

  const dia = hoje();
  const corridas = state.runs.length;
  const treinos = state.lifts.filter(contaComoFeito).length;
  const pesos = state.weights.length;
  const mob = state.mob.length;
  const vazio = corridas + treinos + pesos + mob === 0;
  const corridasComKm = state.runs.filter((r) => r.km !== undefined && r.km > 0).length;

  const abrir = (f: Folha): void => {
    setErro(undefined);
    setColado('');
    setConfirma('');
    setFolha(f);
  };
  const fechar = (): void => setFolha(null);

  const fazerBackup = async (): Promise<void> => {
    const resultado = await salvarArquivo(`prumo-treino-backup-${dia}.json`, exportBackup());
    if (resultado === 'cancelado') return;
    marcarBackupFeito();
    toast(resultado === 'baixado' ? 'Backup baixado para o aparelho.' : 'Backup salvo.', { tone: 'ok' });
  };

  const restaurar = async (): Promise<void> => {
    const texto = await escolherArquivo();
    if (texto === null) return;
    const antes = getState();
    const r = importBackup(texto);
    if (!r.ok) {
      setErro(r.error ?? 'Não foi possível restaurar este arquivo.');
      return;
    }
    fechar();
    toast('Backup restaurado.', { tone: 'ok', action: { label: 'Desfazer', onClick: () => replaceState(antes) } });
  };

  const importarHistorico = async (): Promise<void> => {
    const texto = await escolherArquivo();
    if (texto === null) return;
    const r = importHistory(texto);
    if (!r.ok) {
      toast(r.error ?? 'Não foi possível importar este arquivo.', { tone: 'erro', ms: 6000 });
      return;
    }
    const partes: string[] = [];
    if (r.added > 0) partes.push(plural(r.added, 'corrida nova', 'corridas novas'));
    if ((r.pesos ?? 0) > 0) partes.push(plural(r.pesos ?? 0, 'peso novo', 'pesos novos'));
    toast(partes.length > 0 ? `Histórico importado: ${partes.join(' e ')}.` : 'Nada novo: esse histórico já estava no app.', {
      tone: partes.length > 0 ? 'ok' : 'info',
      ms: 4000,
    });
  };

  const importarFotos = async (): Promise<void> => {
    const texto = await escolherArquivo();
    if (texto === null) return;
    const r = await importarPacote(texto);
    if (!r.ok) {
      toast(r.error ?? 'Não foi possível importar este arquivo.', { tone: 'erro', ms: 6000 });
      return;
    }
    toast(`${plural(r.added, 'foto importada', 'fotos importadas')}.`, { tone: 'ok', ms: 4000 });
  };

  const removerFotos = async (): Promise<void> => {
    const antes = await contarFotos();
    await apagarFotos();
    if ((await contarFotos()) > 0) {
      toast('Não foi possível apagar as fotos.', { tone: 'erro', ms: 6000 });
      return;
    }
    toast(`${plural(antes, 'foto apagada', 'fotos apagadas')}. Os exercícios voltam a mostrar a animação.`, { tone: 'ok', ms: 4000 });
  };

  const copiarParaPrumo = async (): Promise<void> => {
    const ok = await copiar(toPrumoBackup(getState()));
    if (!ok) {
      setErro('Não deu para copiar. Tente de novo.');
      return;
    }
    fechar();
    toast('Copiado. Agora cole no Prumo.', { tone: 'ok', ms: 4000 });
  };

  const importarDoPrumo = (texto: string): void => {
    const antes = getState();
    const r = fromPrumoBackup(texto, antes);
    if (!r.ok || !r.state) {
      setErro(r.error ?? 'Não foi possível ler este backup do Prumo.');
      return;
    }
    fechar();
    if (r.added === 0) {
      toast('Nada novo: esses registros já estavam no app.', { tone: 'info', ms: 4000 });
      return;
    }
    replaceState(r.state);
    toast(`${plural(r.added, 'registro importado', 'registros importados')} do Prumo.`, {
      tone: 'ok',
      action: { label: 'Desfazer', onClick: () => replaceState(antes) },
    });
  };

  const arquivoDoPrumo = async (): Promise<void> => {
    const texto = await escolherArquivo('application/json,.json,text/plain,.txt');
    if (texto !== null) importarDoPrumo(texto);
  };

  const apagarTudo = async (): Promise<void> => {
    setOcupado(true);
    await resetAll();
    setOcupado(false);
    fechar();
    toast('Tudo apagado. O app voltou ao começo.', { tone: 'ok', ms: 4000 });
  };

  const ultimoBackup = state.ultimoBackup !== undefined ? fmtRelativa(toISO(new Date(state.ultimoBackup)), dia) : undefined;
  const podeApagar = confirma.trim().toUpperCase() === PALAVRA;

  return (
    <Section title="Dados">
      <Card>
        <p class="aj-resumo">
          {vazio ? (
            'Ainda não há registros neste aparelho.'
          ) : (
            <>
              Neste aparelho: <b>{plural(corridas, 'corrida', 'corridas')}</b>, <b>{plural(treinos, 'treino', 'treinos')} de musculação</b>,{' '}
              <b>{plural(mob, 'sessão', 'sessões')} de mobilidade</b> e <b>{plural(pesos, 'peso', 'pesos')}</b>.
            </>
          )}
        </p>
        <p class="ui-note aj-backup-nota">
          {ultimoBackup ? (
            <>
              Último backup: <b>{ultimoBackup}</b>.
            </>
          ) : (
            'Os dados ficam só aqui. Faça um backup de vez em quando e guarde em Arquivos.'
          )}
        </p>
        <div class="aj-acao">
          <Button icon="baixar" block onClick={() => void fazerBackup()}>
            Fazer backup
          </Button>
        </div>
        <List>
          <Row
            leading={<Icon name="enviar" />}
            title="Restaurar backup"
            sub="Troca tudo pelo conteúdo de um arquivo."
            chevron
            onClick={() => abrir('restaurar')}
          />
          <Row
            leading={<Icon name="corrida" />}
            title="Importar histórico"
            sub="Corridas antigas, em arquivo do treinador."
            chevron
            onClick={() => void importarHistorico()}
          />
          <Row
            leading={<Icon name="copiar" />}
            title="Copiar treinos para o Prumo"
            sub="Corridas, musculação e peso, para colar lá."
            chevron
            onClick={() => abrir('prumo-copiar')}
          />
          <Row
            leading={<Icon name="trocar" />}
            title="Importar backup do Prumo"
            sub="Traz corridas, treinos e pesos sem duplicar."
            chevron
            onClick={() => abrir('prumo-importar')}
          />
          <Row
            leading={<Icon name="enviar" />}
            title="Importar fotos dos exercícios"
            sub={fotos > 0 ? `${plural(fotos, 'foto', 'fotos')} neste aparelho. Ficam só aqui.` : 'Pacote de fotos do treinador. Ficam só neste aparelho.'}
            chevron
            onClick={() => void importarFotos()}
          />
          {fotos > 0 ? (
            <Row
              leading={<Icon name="lixeira" />}
              title="Apagar fotos"
              sub={`Remove ${fotos === 1 ? 'a foto' : `as ${fotos} fotos`}; os exercícios voltam à animação.`}
              onClick={() => void removerFotos()}
            />
          ) : null}
        </List>
      </Card>

      <Card flat class="aj-perigo">
        <div class="aj-perigo-txt">
          <b>Apagar tudo</b>
          <span>Remove os registros e os ajustes deste aparelho.</span>
        </div>
        <Button variant="danger" size="sm" icon="lixeira" onClick={() => abrir('apagar')}>
          Apagar
        </Button>
      </Card>

      <Sheet
        open={folha === 'restaurar'}
        onClose={fechar}
        title="Restaurar backup?"
        footer={
          <>
            <Button onClick={fechar}>Cancelar</Button>
            <Button variant="primary" icon="enviar" onClick={() => void restaurar()}>
              Escolher arquivo
            </Button>
          </>
        }
      >
        <p class="ui-muted aj-folha-txt">
          Restaurar troca <b>tudo</b> o que está no app (registros e ajustes) pelo conteúdo do arquivo. Escolha um arquivo
          "prumo-treino-backup" salvo por este app.
        </p>
        {erro ? (
          <p class="ui-err aj-erro" role="alert">
            {erro}
          </p>
        ) : null}
      </Sheet>

      <Sheet
        open={folha === 'prumo-copiar'}
        onClose={fechar}
        title="Copiar treinos para o Prumo"
        footer={
          <>
            <Button onClick={fechar}>Fechar</Button>
            <Button variant="primary" icon="copiar" onClick={() => void copiarParaPrumo()}>
              Copiar
            </Button>
          </>
        }
      >
        <p class="ui-muted aj-folha-txt">
          Vão <b>{plural(corridasComKm, 'corrida', 'corridas')} com distância</b>, <b>{plural(treinos, 'treino', 'treinos')} de musculação</b> e{' '}
          <b>{plural(pesos, 'peso', 'pesos')}</b>. O Prumo ignora o que já tem, então pode repetir sem medo.
        </p>
        <ol class="aj-passos">
          <li>Toque em Copiar.</li>
          <li>
            Abra o Prumo e vá em <b>Ajustes › Seus dados › Restaurar</b>.
          </li>
          <li>Cole o texto e confirme.</li>
        </ol>
        {erro ? (
          <p class="ui-err aj-erro" role="alert">
            {erro}
          </p>
        ) : null}
      </Sheet>

      <Sheet
        open={folha === 'prumo-importar'}
        onClose={fechar}
        title="Importar backup do Prumo"
        footer={
          <>
            <Button icon="enviar" onClick={() => void arquivoDoPrumo()}>
              Escolher arquivo
            </Button>
            <Button variant="primary" icon="check" disabled={colado.trim() === ''} onClick={() => importarDoPrumo(colado)}>
              Importar
            </Button>
          </>
        }
      >
        <div class="ui-form">
          <p class="ui-muted aj-folha-txt">
            No Prumo, faça o backup em <b>Ajustes › Seus dados</b>. Depois cole o texto aqui ou escolha o arquivo. Entram corridas,
            treinos de musculação e pesos; o que já existe não duplica.
          </p>
          <Field label="Backup do Prumo" error={erro}>
            <TextArea
              rows={4}
              value={colado}
              onChange={(v) => {
                setColado(v);
                setErro(undefined);
              }}
              placeholder='{ "app": "prumo", … }'
            />
          </Field>
        </div>
      </Sheet>

      <Sheet
        open={folha === 'apagar'}
        onClose={fechar}
        title="Apagar tudo?"
        footer={
          <>
            <Button onClick={fechar}>Cancelar</Button>
            <Button variant="danger" icon="lixeira" disabled={!podeApagar || ocupado} onClick={() => void apagarTudo()}>
              Apagar tudo
            </Button>
          </>
        }
      >
        <div class="ui-form">
          <p class="ui-muted aj-folha-txt">
            {vazio ? (
              'Os ajustes voltam ao padrão.'
            ) : (
              <>
                Saem deste aparelho <b>{plural(corridas, 'corrida', 'corridas')}</b>, <b>{plural(treinos, 'treino', 'treinos')} de musculação</b>,{' '}
                <b>{plural(mob, 'sessão', 'sessões')} de mobilidade</b>, <b>{plural(pesos, 'peso', 'pesos')}</b> e os ajustes.
              </>
            )}{' '}
            Não dá para desfazer.
          </p>
          {vazio ? null : (
            <button type="button" class="ui-link aj-link" onClick={() => void fazerBackup()}>
              fazer um backup antes
            </button>
          )}
          <Field label={`Para confirmar, digite ${PALAVRA}`}>
            <TextInput value={confirma} onChange={setConfirma} maxLength={12} placeholder={PALAVRA} autocomplete="off" />
          </Field>
        </div>
      </Sheet>
    </Section>
  );
}
