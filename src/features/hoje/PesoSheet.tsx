/* Hoje: folha "Registrar peso". Grava o peso do dia (um por data) com salvarPeso. */
import { useEffect, useState } from 'preact/hooks';
import { fmtRelativa, hoje } from '../../lib/dates.ts';
import { kg } from '../../lib/format.ts';
import { salvarPeso } from '../../lib/progresso.ts';
import { useStore } from '../../lib/store.ts';
import { Button, Field, Sheet, Stepper, TextInput, toast } from '../../ui/index.ts';

export interface PesoSheetProps {
  open: boolean;
  onClose: () => void;
}

const PESO_INICIAL = 80;

export function PesoSheet({ open, onClose }: PesoSheetProps) {
  const weights = useStore((s) => s.weights);
  const meta = useStore((s) => s.settings.pesoMeta);
  const dia = hoje();
  const deHoje = weights.find((w) => w.data === dia);
  const ultimo = weights.length > 0 ? weights[weights.length - 1] : undefined;

  const [valor, setValor] = useState(PESO_INICIAL);
  const [obs, setObs] = useState('');

  // Cada abertura começa do último valor conhecido (o de hoje, se já existir).
  useEffect(() => {
    if (!open) return;
    setValor(deHoje?.kg ?? ultimo?.kg ?? meta ?? PESO_INICIAL);
    setObs(deHoje?.obs ?? '');
  }, [open]);

  const salvar = (): void => {
    salvarPeso(dia, Math.round(valor * 10) / 10, obs);
    onClose();
    toast(`Peso de hoje: ${kg(Math.round(valor * 10) / 10)}`, { tone: 'ok' });
  };

  const anterior = deHoje ? undefined : ultimo;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={deHoje ? 'Corrigir o peso de hoje' : 'Registrar peso'}
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
        <Stepper big label="Peso de hoje" unit="kg" step={0.1} min={30} max={250} value={valor} onChange={setValor} />
        <p class="ui-note hj-peso-nota">
          {anterior ? (
            <>
              Último registro: <b>{kg(anterior.kg)}</b> · {fmtRelativa(anterior.data, dia)}. Toque no número para digitar.
            </>
          ) : deHoje ? (
            <>Você já registrou o peso hoje: salvar troca o valor.</>
          ) : (
            <>Toque no número para digitar. De preferência, pese-se de manhã, sempre no mesmo horário.</>
          )}
        </p>
        <Field label="Observação" hint="Opcional.">
          <TextInput value={obs} onChange={setObs} maxLength={80} placeholder="Depois do treino, em jejum…" />
        </Field>
      </div>
    </Sheet>
  );
}
