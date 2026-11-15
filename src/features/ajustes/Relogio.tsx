/* Ajustes › Relógio: liga o Garmin pelo intervals.icu para as corridas entrarem sozinhas. */
import { useEffect, useReducer, useState } from 'preact/hooks';
import { fmtRelativa, hoje, toISO } from '../../lib/dates.ts';
import { plural } from '../../lib/format.ts';
import {
  assinarGarmin, buscando, desconectar, erroGarmin, FalhaGarmin, lerConfig, sincronizar, type ResultadoSync,
} from '../../lib/garmin.ts';
import { useStore } from '../../lib/store.ts';
import { Button, Card, Field, Icon, List, Row, Section, Sheet, TextInput, toast } from '../../ui/index.ts';

/** Texto do aviso depois de uma busca. */
export function textoDoResultado(r: ResultadoSync): string {
  const partes: string[] = [];
  if (r.novas > 0) partes.push(plural(r.novas, 'corrida nova do relógio', 'corridas novas do relógio'));
  if (r.completadas > 0) partes.push(`${plural(r.completadas, 'registro completado', 'registros completados')} com os dados do relógio`);
  if (r.caminhadas > 0) partes.push(plural(r.caminhadas, 'caminhada junto da corrida', 'caminhadas junto das corridas'));
  return partes.length > 0 ? `${partes.join(' e ')}.`.replace(/^./, (c) => c.toUpperCase()) : 'Tudo em dia: nenhuma corrida nova no relógio.';
}

export function Relogio() {
  const [, redesenhar] = useReducer((n: number) => n + 1, 0);
  useEffect(() => { const parar = assinarGarmin(() => redesenhar(0)); return () => { parar(); }; }, []);
  const doRelogio = useStore((s) => s.runs.filter((r) => r.garminId !== undefined).length);
  const [folha, setFolha] = useState(false);
  const [chave, setChave] = useState('');
  const [erro, setErro] = useState<string | undefined>(undefined);

  const config = lerConfig();
  const ocupado = buscando();
  const ultimo = erroGarmin();

  const conectar = async (): Promise<void> => {
    if (chave.trim().length < 10) {
      setErro('Cole a chave inteira (é um texto comprido).');
      return;
    }
    setErro(undefined);
    try {
      const r = await sincronizar({ chaveNova: chave });
      setFolha(false);
      setChave('');
      toast(`Relógio ligado. ${textoDoResultado(r)}`, { tone: 'ok', ms: 5000 });
    } catch (e) {
      setErro(e instanceof FalhaGarmin ? e.message : 'Não deu certo. Tente de novo.');
    }
  };

  const buscarAgora = async (): Promise<void> => {
    try {
      const r = await sincronizar();
      toast(textoDoResultado(r), { tone: r.novas + r.completadas + r.caminhadas > 0 ? 'ok' : 'info', ms: 4000 });
    } catch (e) {
      toast(e instanceof FalhaGarmin ? e.message : 'Não deu certo. Tente de novo.', { tone: 'erro', ms: 6000 });
    }
  };

  const quando = config?.ultima !== undefined ? fmtRelativa(toISO(new Date(config.ultima)), hoje()) : undefined;
  const hora = config?.ultima !== undefined
    ? new Date(config.ultima).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : undefined;

  return (
    <Section title="Relógio">
      <Card area="corrida">
        {config ? (
          <>
            <List>
              <Row
                leading={<Icon name="relogio" />}
                title="Garmin ligado"
                sub={
                  ocupado
                    ? 'Buscando corridas…'
                    : ultimo
                      ? ultimo
                      : quando
                        ? `Última busca: ${quando}, ${hora}. ${plural(doRelogio, 'corrida veio', 'corridas vieram')} do relógio.`
                        : 'Ainda não buscou.'
                }
                tone={ultimo && !ocupado ? 'warn' : 'default'}
              />
            </List>
            <div class="aj-acao is-fim aj-relogio-acoes">
              <Button icon="repetir" block disabled={ocupado} onClick={() => void buscarAgora()}>
                {ocupado ? 'Buscando…' : 'Buscar agora'}
              </Button>
              <button type="button" class="ui-link aj-link" onClick={() => {
                desconectar();
                toast('Relógio desligado neste aparelho. As corridas já trazidas ficam.', { tone: 'info', ms: 4000 });
              }}>
                desligar
              </button>
            </div>
            <p class="ui-note aj-nota">
              O app busca sozinho sempre que você abre, com internet. A corrida aparece alguns minutos depois de sincronizar o
              relógio com o celular.
            </p>
          </>
        ) : (
          <>
            <p class="aj-resumo">
              Ligue o <b>Garmin</b> para as corridas do relógio entrarem sozinhas no app, já marcando o treino do dia como feito.
              Usa o <b>intervals.icu</b>, que é grátis e tem ligação oficial com o Garmin.
            </p>
            <div class="aj-acao is-fim">
              <Button variant="primary" icon="relogio" block onClick={() => { setErro(undefined); setFolha(true); }}>
                Ligar o Garmin
              </Button>
            </div>
          </>
        )}
      </Card>

      <Sheet
        open={folha}
        onClose={() => setFolha(false)}
        title="Ligar o Garmin"
        footer={
          <>
            <Button onClick={() => setFolha(false)}>Cancelar</Button>
            <Button variant="primary" icon="check" disabled={ocupado || chave.trim() === ''} onClick={() => void conectar()}>
              {ocupado ? 'Testando…' : 'Ligar'}
            </Button>
          </>
        }
      >
        <div class="ui-form">
          <ol class="aj-passos">
            <li>
              Crie a conta grátis em{' '}
              <a href="https://intervals.icu" target="_blank" rel="noopener noreferrer">
                intervals.icu
              </a>{' '}
              (pode entrar com o Google).
            </li>
            <li>
              Lá, em <b>Settings › Connections</b>, toque em <b>Connect</b> no Garmin e autorize na tela da Garmin. Sua senha fica
              só com a Garmin.
            </li>
            <li>
              Ainda em <b>Settings</b>, no fim da página (<b>Developer Settings</b>), gere a <b>API Key</b> e copie.
            </li>
            <li>Cole a chave aqui embaixo e toque em Ligar.</li>
          </ol>
          <Field label="Chave de API do intervals.icu" hint="Fica só neste aparelho. Não vai para o backup." error={erro}>
            <TextInput value={chave} onChange={(v) => { setChave(v); setErro(undefined); }} maxLength={100} autocomplete="off" placeholder="cole aqui" />
          </Field>
          <p class="ui-note">A primeira busca traz as corridas do último ano. As que já estão no app não duplicam.</p>
        </div>
      </Sheet>
    </Section>
  );
}
