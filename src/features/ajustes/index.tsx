/* Ajustes (SPEC 8.6): perfil, plano da semana, treino, aparência, dados e app. */
import { useState } from 'preact/hooks';
import { ZONES } from '../../data/profile.ts';
import { fichasAtivas } from '../../lib/academia.ts';
import { DIAS_LONGOS } from '../../lib/dates.ts';
import { update, useStore } from '../../lib/store.ts';
import type { DiaPlano, HrZone, PlanoTipo, Settings, ZoneId } from '../../types.ts';
import {
  Button,
  Card,
  Chips,
  Field,
  List,
  NumberInput,
  Row,
  Screen,
  Section,
  Segmented,
  Sheet,
  Stepper,
  TextInput,
  Toggle,
} from '../../ui/index.ts';
import { Dados } from './Dados.tsx';
import { SobreApp } from './SobreApp.tsx';
import './ajustes.css';

/** Grava uma mudança nos ajustes. */
function ajustar(fn: (s: Settings) => void): void {
  update((d) => fn(d.settings));
}

const maiuscula = (t: string): string => t.charAt(0).toUpperCase() + t.slice(1);

/* ------------------------------------------------------------------ */
/* Plano da semana                                                     */
/* ------------------------------------------------------------------ */

/** Segunda a domingo (chaves de settings.plano: 0 = domingo). */
const ORDEM_DIAS = [1, 2, 3, 4, 5, 6, 0] as const;

const TIPOS: { v: PlanoTipo; l: string }[] = [
  { v: 'musc', l: 'Musculação' },
  { v: 'corrida', l: 'Corrida' },
  { v: 'ambos', l: 'Os dois' },
  { v: 'descanso', l: 'Descanso' },
];

const ROTACAO = 'rotacao';

function resumoDoDia(d: DiaPlano): string {
  const ficha = d.ficha ? `ficha ${d.ficha}` : 'próxima ficha da rotação';
  if (d.tipo === 'musc') return `Musculação · ${ficha}`;
  if (d.tipo === 'ambos') return `Corrida e musculação · ${ficha}`;
  if (d.tipo === 'corrida') return 'Corrida';
  return 'Descanso';
}

function Marcas({ tipo }: { tipo: PlanoTipo }) {
  return (
    <span class="aj-marcas" aria-hidden="true">
      <i class={tipo === 'corrida' || tipo === 'ambos' ? 'is-corrida' : ''} />
      <i class={tipo === 'musc' || tipo === 'ambos' ? 'is-musc' : ''} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Tela                                                                */
/* ------------------------------------------------------------------ */

const TEMPOS: { v: string; l: string }[] = [
  { v: '30', l: '30 s' },
  { v: '45', l: '45 s' },
  { v: '60', l: '60 s' },
  { v: '0', l: 'Livre' },
];

const TEMAS: { v: Settings['tema']; l: string }[] = [
  { v: 'auto', l: 'Automático' },
  { v: 'escuro', l: 'Escuro' },
  { v: 'claro', l: 'Claro' },
];

const zonasIguais = (a: HrZone[], b: HrZone[]): boolean =>
  a.length === b.length && a.every((z, i) => z.id === b[i]?.id && z.min === b[i]?.min && z.max === b[i]?.max);

export function AjustesScreen() {
  const s = useStore((st) => st.settings);
  const [zonaAberta, setZonaAberta] = useState<ZoneId | null>(null);
  const [diaAberto, setDiaAberto] = useState<number | null>(null);

  const zona = zonaAberta ? s.zonas.find((z) => z.id === zonaAberta) : undefined;
  const dia: DiaPlano | undefined = diaAberto !== null ? (s.plano[diaAberto] ?? { tipo: 'descanso' }) : undefined;
  const fichas = fichasAtivas(s);
  const temMusc = dia?.tipo === 'musc' || dia?.tipo === 'ambos';
  const tempoAtual = String(s.alongamentoSeg);

  const mudarZona = (id: ZoneId, campo: 'min' | 'max', v: number): void =>
    ajustar((st) => {
      const z = st.zonas.find((x) => x.id === id);
      if (!z) return;
      z[campo] = Math.round(v);
      // a faixa nunca fica invertida
      if (campo === 'min' && z.max <= z.min) z.max = z.min + 1;
      if (campo === 'max' && z.min >= z.max) z.min = z.max - 1;
    });

  const mudarDia = (d: number, novo: DiaPlano): void =>
    ajustar((st) => {
      st.plano[d] = novo;
    });

  return (
    <Screen title="Ajustes" back="/hoje">
      <Section title="Perfil">
        <Card>
          <div class="ui-form">
            <Field label="Nome">
              <TextInput value={s.nome} maxLength={30} autocomplete="given-name" onChange={(v) => ajustar((st) => void (st.nome = v))} />
            </Field>
            <div class="ui-grid ui-g-2">
              <Field label="FC máxima">
                <NumberInput
                  int
                  unit="bpm"
                  min={120}
                  max={230}
                  value={s.fcMax}
                  onChange={(v) => {
                    if (v !== undefined && v >= 100 && v <= 240) ajustar((st) => void (st.fcMax = v));
                  }}
                />
              </Field>
              <Field label="Meta de peso">
                <NumberInput
                  unit="kg"
                  min={30}
                  max={250}
                  placeholder="Sem meta"
                  value={s.pesoMeta}
                  onChange={(v) =>
                    ajustar((st) => {
                      if (v === undefined || v <= 0) delete st.pesoMeta;
                      else st.pesoMeta = v;
                    })
                  }
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card
          area="corrida"
          title="Zonas de frequência"
          action={
            zonasIguais(s.zonas, ZONES) ? null : (
              <button type="button" class="ui-link" onClick={() => ajustar((st) => void (st.zonas = ZONES.map((z) => ({ ...z }))))}>
                voltar ao padrão
              </button>
            )
          }
        >
          <List>
            {s.zonas.map((z, i) => (
              <Row
                key={z.id}
                leading={<span class={`aj-zona-n aj-zona-${Math.min(i + 1, 4)}`}>{i + 1}</span>}
                title={z.label}
                sub={z.feel}
                right={
                  <>
                    {z.min}–{z.max}
                    <small>bpm</small>
                  </>
                }
                chevron
                onClick={() => setZonaAberta(z.id)}
              />
            ))}
          </List>
          <p class="ui-note aj-nota">Toque em uma zona para mudar a faixa. No relógio, os alvos são os dos treinos do Garmin Connect.</p>
        </Card>
      </Section>

      <Section title="Plano da semana">
        <Card>
          <List>
            {ORDEM_DIAS.map((d) => {
              const plano = s.plano[d] ?? { tipo: 'descanso' };
              return (
                <Row
                  key={d}
                  leading={<Marcas tipo={plano.tipo} />}
                  title={maiuscula(DIAS_LONGOS[d] ?? '')}
                  sub={resumoDoDia(plano)}
                  tone={plano.tipo === 'descanso' ? 'muted' : 'default'}
                  chevron
                  onClick={() => setDiaAberto(d)}
                />
              );
            })}
          </List>
          <p class="ui-note aj-nota">
            A musculação segue este plano. As corridas aparecem nas datas do plano do treinador, que é o mesmo do relógio.
          </p>
        </Card>
      </Section>

      <Section title="Treino">
        <Card>
          <div class="ui-form">
            <Stepper
              label="Descanso padrão entre séries"
              unit="s"
              step={15}
              min={15}
              max={300}
              value={s.descansoPadrao}
              onChange={(v) => ajustar((st) => void (st.descansoPadrao = v))}
            />
            <Field group label="Tempo por posição no alongamento" hint="Vale para o alongamento completo. Em Livre, você avança quando quiser.">
              <Segmented
                label="Tempo por posição no alongamento"
                options={TEMPOS.some((t) => t.v === tempoAtual) ? TEMPOS : [...TEMPOS.slice(0, 3), { v: tempoAtual, l: `${tempoAtual} s` }, ...TEMPOS.slice(3)]}
                value={tempoAtual}
                onChange={(v) => ajustar((st) => void (st.alongamentoSeg = Number(v)))}
              />
            </Field>
          </div>
        </Card>
        <Card class="aj-toggles">
          <Toggle bare label="Som" hint="Bipes no fim do descanso e nas trocas de passo." checked={s.som} onChange={(v) => ajustar((st) => void (st.som = v))} />
          <Toggle bare label="Voz" hint="Anuncia o próximo passo nas rotinas e na corrida guiada." checked={s.voz} onChange={(v) => ajustar((st) => void (st.voz = v))} />
          <Toggle
            bare
            label="Vibração"
            hint="O iPhone não vibra em apps da web: lá, valem o som e a tela."
            checked={s.vibrar}
            onChange={(v) => ajustar((st) => void (st.vibrar = v))}
          />
          <Toggle
            bare
            label="Manter a tela ligada"
            hint="Durante o treino de musculação, as rotinas e a corrida guiada."
            checked={s.telaLigada}
            onChange={(v) => ajustar((st) => void (st.telaLigada = v))}
          />
        </Card>
      </Section>

      <Section title="Aparência">
        <Card>
          <Segmented label="Tema" options={TEMAS} value={s.tema} onChange={(v) => ajustar((st) => void (st.tema = v))} />
          <p class="ui-note aj-nota">
            {s.tema === 'auto' ? 'Segue o modo claro ou escuro do aparelho.' : s.tema === 'escuro' ? 'Sempre escuro.' : 'Sempre claro.'}
          </p>
        </Card>
      </Section>

      <Dados />
      <SobreApp />

      <Sheet
        open={zona !== undefined}
        onClose={() => setZonaAberta(null)}
        title={zona ? `Zona ${zona.label.toLowerCase()}` : 'Zona'}
        footer={
          <Button variant="primary" icon="check" onClick={() => setZonaAberta(null)}>
            Pronto
          </Button>
        }
      >
        {zona ? (
          <div class="ui-form">
            <p class="ui-muted aj-folha-txt">{zona.feel}</p>
            <div class="ui-grid ui-g-2">
              <Stepper big label="De" unit="bpm" step={1} min={80} max={219} value={zona.min} onChange={(v) => mudarZona(zona.id, 'min', v)} />
              <Stepper big label="Até" unit="bpm" step={1} min={81} max={220} value={zona.max} onChange={(v) => mudarZona(zona.id, 'max', v)} />
            </div>
            <p class="ui-note">
              Sua FC máxima é <b>{s.fcMax} bpm</b>: esta faixa vai de {Math.round((zona.min / s.fcMax) * 100)}% a{' '}
              {Math.round((zona.max / s.fcMax) * 100)}% dela.
            </p>
          </div>
        ) : null}
      </Sheet>

      <Sheet
        open={dia !== undefined}
        onClose={() => setDiaAberto(null)}
        title={diaAberto !== null ? maiuscula(DIAS_LONGOS[diaAberto] ?? '') : 'Dia'}
        footer={
          <Button variant="primary" icon="check" onClick={() => setDiaAberto(null)}>
            Pronto
          </Button>
        }
      >
        {dia !== undefined && diaAberto !== null ? (
          <div class="ui-form">
            <Field group label="O que tem neste dia">
              <Chips
                label="O que tem neste dia"
                options={TIPOS}
                value={dia.tipo}
                onChange={(tipo) => mudarDia(diaAberto, tipo === 'musc' || tipo === 'ambos' ? (dia.ficha ? { tipo, ficha: dia.ficha } : { tipo }) : { tipo })}
              />
            </Field>
            {temMusc ? (
              <Field group label="Ficha" hint="Na rotação, o app escolhe a ficha que está há mais tempo sem fazer.">
                <Chips
                  label="Ficha"
                  options={[{ v: ROTACAO, l: 'Próxima da rotação' }, ...fichas.map((f) => ({ v: f.id, l: `${f.id} · ${f.nome}` }))]}
                  value={dia.ficha ?? ROTACAO}
                  onChange={(v) => mudarDia(diaAberto, v === ROTACAO ? { tipo: dia.tipo } : { tipo: dia.tipo, ficha: v })}
                />
              </Field>
            ) : (
              <p class="ui-note">
                {dia.tipo === 'corrida'
                  ? 'Dia de corrida: o treino vem do plano do treinador.'
                  : 'Dia livre. Se quiser se mexer, um alongamento leve cai bem.'}
              </p>
            )}
          </div>
        ) : null}
      </Sheet>
    </Screen>
  );
}
