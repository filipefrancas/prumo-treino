/* Corrida: folha de registro (criar ou editar uma corrida, ligada ou não a um treino do plano). */
import { useEffect, useState } from 'preact/hooks';
import { apagarCorrida, salvarCorrida, tipoDaFamilia } from '../../lib/corrida.ts';
import { hoje } from '../../lib/dates.ts';
import { fmtPace, pace } from '../../lib/format.ts';
import type { ISODate, RunLog, RunTipo, RunWorkout } from '../../types.ts';
import { Button, Chips, DateInput, Field, NumberInput, Scale, Sheet, TextArea, toast } from '../../ui/index.ts';
import { SENSACAO_ROTULO } from './comum.tsx';

export interface RegistroProps {
  open: boolean;
  onClose: () => void;
  /** Treino do plano a que o registro pertence (sem ele, é uma corrida avulsa). */
  treino?: RunWorkout;
  /** Registro existente: a folha abre em modo de edição. */
  log?: RunLog;
  /** Duração inicial em minutos (corrida guiada). */
  minInicial?: number;
  /** Local inicial (a corrida guiada é pensada para a esteira). */
  localInicial?: 'rua' | 'esteira';
  /** Chamado depois de salvar, com o id do registro. */
  onSaved?: (id: string) => void;
}

interface Form {
  data: ISODate;
  tipo: RunTipo;
  min: number | undefined;
  km: number | undefined;
  fc: number | undefined;
  pse: number | undefined;
  sensacao: number | undefined;
  local: 'rua' | 'esteira' | undefined;
  obs: string;
}

const TIPOS: { v: RunTipo; l: string }[] = [
  { v: 'Rodagem', l: 'Rodagem' },
  { v: 'Longão', l: 'Longo' },
  { v: 'Intervalado', l: 'Intervalado' },
  { v: 'Tempo run', l: 'Ritmo' },
  { v: 'Regenerativo', l: 'Regenerativo' },
  { v: 'Prova', l: 'Prova' },
];

const LOCAIS: { v: 'rua' | 'esteira'; l: string }[] = [
  { v: 'rua', l: 'Rua' },
  { v: 'esteira', l: 'Esteira' },
];

function inicial(p: RegistroProps): Form {
  const { log, treino } = p;
  const dia = hoje();
  return {
    data: log?.data ?? (treino && treino.date <= dia ? treino.date : dia),
    tipo: log?.tipo ?? (treino ? tipoDaFamilia(treino.family) : 'Rodagem'),
    min: log?.min ?? p.minInicial ?? (treino && !log ? treino.minutes : undefined),
    km: log?.km,
    fc: log?.fc,
    pse: log?.pse,
    sensacao: log?.sensacao,
    local: log?.local ?? p.localInicial,
    obs: log?.obs ?? '',
  };
}

/** Folha "Registrar treino": duração, km, FC média, PSE, sensação, rua ou esteira e nota. */
export function RegistroSheet(props: RegistroProps) {
  const { open, onClose, treino, log, onSaved } = props;
  const [f, setF] = useState<Form>(() => inicial(props));
  const [erro, setErro] = useState('');

  // Cada abertura começa do registro atual (ou do treino), não do que ficou digitado na vez anterior.
  useEffect(() => {
    if (open) {
      setF(inicial(props));
      setErro('');
    }
  }, [open, log?.id, treino?.id, props.minInicial]);

  const set = <K extends keyof Form>(k: K, v: Form[K]): void => {
    setF((a) => ({ ...a, [k]: v }));
    if (erro) setErro('');
  };

  const ritmo = pace(f.km, f.min);

  function salvar(): void {
    if (!(f.min !== undefined && f.min > 0) && !(f.km !== undefined && f.km > 0)) {
      setErro('Informe a duração ou a distância.');
      return;
    }
    const registro: Omit<RunLog, 'id'> & { id?: string } = {
      ...(log ?? {}),
      data: f.data || hoje(),
      tipo: f.tipo,
      fonte: log?.fonte ?? (treino ? 'treino' : 'manual'),
    };
    const por = <K extends 'min' | 'km' | 'fc' | 'pse' | 'local' | 'obs'>(k: K, v: RunLog[K] | undefined): void => {
      if (v === undefined || v === '') delete registro[k];
      else registro[k] = v;
    };
    por('min', f.min !== undefined && f.min > 0 ? f.min : undefined);
    por('km', f.km !== undefined && f.km > 0 ? f.km : undefined);
    por('fc', f.fc !== undefined && f.fc > 0 ? f.fc : undefined);
    por('pse', f.pse);
    por('local', f.local);
    por('obs', f.obs.trim());
    if (f.pse === undefined) delete registro.rpe;
    if (f.sensacao === 1 || f.sensacao === 2 || f.sensacao === 3 || f.sensacao === 4 || f.sensacao === 5) registro.sensacao = f.sensacao;
    else delete registro.sensacao;
    if (treino) {
      registro.treinoId = treino.id;
      registro.titulo = treino.title;
    }
    const id = salvarCorrida(registro);
    onClose();
    toast(log ? 'Registro atualizado' : 'Corrida registrada', { tone: 'ok' });
    onSaved?.(id);
  }

  function apagar(): void {
    if (!log) return;
    const copia = { ...log };
    apagarCorrida(log.id);
    onClose();
    toast('Registro apagado', { action: { label: 'Desfazer', onClick: () => void salvarCorrida(copia) } });
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={log ? 'Editar registro' : treino ? 'Registrar treino' : 'Adicionar corrida'}
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" icon="check" onClick={salvar}>
            Salvar
          </Button>
        </>
      }
    >
      <div class="ui-form">
        {treino ? (
          <p class="ui-note">
            <b>{treino.title}</b> · planejado: {treino.minutes} min
          </p>
        ) : null}
        <Field label="Dia">
          <DateInput value={f.data} max={hoje()} onChange={(v) => set('data', v)} />
        </Field>
        {!treino ? (
          <Field label="Tipo" group>
            <Chips label="Tipo de corrida" value={f.tipo} onChange={(v) => set('tipo', v)} options={TIPOS} />
          </Field>
        ) : null}
        <div class="ui-grid ui-g-2">
          <Field label="Duração" error={erro || undefined}>
            <NumberInput unit="min" min={0} max={600} value={f.min} onChange={(v) => set('min', v)} />
          </Field>
          <Field label="Distância" hint={ritmo !== undefined ? `Ritmo ${fmtPace(ritmo)}` : 'Opcional.'}>
            <NumberInput unit="km" min={0} max={200} value={f.km} onChange={(v) => set('km', v)} />
          </Field>
        </div>
        <Field label="FC média" hint="Opcional. Está no resumo do relógio.">
          <NumberInput int unit="bpm" min={0} max={230} value={f.fc} onChange={(v) => set('fc', v)} />
        </Field>
        <Scale label="Esforço (PSE)" min={1} max={10} value={f.pse} onChange={(v) => set('pse', v)} left="muito leve" right="máximo" />
        <Scale
          label={f.sensacao ? `Como se sentiu · ${SENSACAO_ROTULO[f.sensacao] ?? ''}` : 'Como se sentiu'}
          min={1}
          max={5}
          value={f.sensacao}
          onChange={(v) => set('sensacao', v)}
          left="péssimo"
          right="ótimo"
        />
        <Field label="Onde foi" group>
          <Chips label="Onde foi" value={f.local} onChange={(v) => set('local', v)} options={LOCAIS} />
        </Field>
        <Field label="Nota" hint="O que o treinador precisa saber: dor, sono, calor, como rendeu.">
          <TextArea rows={3} value={f.obs} onChange={(v) => set('obs', v)} />
        </Field>
        {log ? (
          <Button variant="danger" icon="lixeira" block onClick={apagar}>
            Apagar registro
          </Button>
        ) : null}
      </div>
    </Sheet>
  );
}
