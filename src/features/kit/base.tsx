/* Galeria da base do kit: uma tela com todos os componentes de src/ui em todos os estados e variantes.
   kit-base.html abre a galeria; kit-sheet.html (ou ?sheet=1) já abre com a folha; ?toast=1 dispara um aviso. */
import { useEffect, useState } from 'preact/hooks';
import { Button, IconButton } from '../../ui/Button.tsx';
import { Card, Section } from '../../ui/Card.tsx';
import { Chips } from '../../ui/Chips.tsx';
import { Empty } from '../../ui/Empty.tsx';
import { DateInput, Field, NumberInput, TextArea, TextInput } from '../../ui/Field.tsx';
import { Icon, ICON_NAMES } from '../../ui/Icon.tsx';
import { Pill, Tag } from '../../ui/Pill.tsx';
import { List, Row } from '../../ui/Row.tsx';
import { Scale } from '../../ui/Scale.tsx';
import { Screen } from '../../ui/Screen.tsx';
import { Segmented } from '../../ui/Segmented.tsx';
import { Sheet } from '../../ui/Sheet.tsx';
import { Stepper } from '../../ui/Stepper.tsx';
import { TabBar, type TabItem } from '../../ui/TabBar.tsx';
import { toast, ToastHost } from '../../ui/Toast.tsx';
import { Toggle } from '../../ui/Toggle.tsx';

const ABAS: TabItem[] = [
  { id: 'hoje', label: 'Hoje', icon: 'hoje', href: '/hoje' },
  { id: 'corrida', label: 'Corrida', icon: 'corrida', href: '/corrida' },
  { id: 'musculacao', label: 'Musculação', icon: 'musculacao', href: '/musculacao' },
  { id: 'mobilidade', label: 'Mobilidade', icon: 'mobilidade', href: '/mobilidade' },
  { id: 'progresso', label: 'Progresso', icon: 'progresso', href: '/progresso' },
];

type Parte = 'plano' | 'historico' | 'zonas';
type Periodo = '4s' | '3m' | '12m' | 'tudo';
type Local = 'rua' | 'esteira';
type Equip = 'halter' | 'barra' | 'maquina' | 'polia' | 'elastico' | 'corpo';

const abrirComFolha = (): boolean =>
  typeof document !== 'undefined' &&
  (document.getElementById('app')?.dataset.sheet === '1' || new URLSearchParams(location.search).get('sheet') === '1');

export function KitBase() {
  const [parte, setParte] = useState<Parte>('plano');
  const [periodo, setPeriodo] = useState<Periodo>('3m');
  const [local, setLocal] = useState<Local | undefined>('rua');
  const [equip, setEquip] = useState<Equip[]>(['halter', 'maquina']);
  const [som, setSom] = useState(true);
  const [voz, setVoz] = useState(false);
  const [tela, setTela] = useState(true);
  const [sentiu, setSentiu] = useState<number | undefined>(4);
  const [pse, setPse] = useState<number | undefined>(7);
  const [carga, setCarga] = useState(42.5);
  const [reps, setReps] = useState(10);
  const [descanso, setDescanso] = useState(90);
  const [nome, setNome] = useState('Filipe');
  const [busca, setBusca] = useState('');
  const [fc, setFc] = useState<number | undefined>(192);
  const [peso, setPeso] = useState<number | undefined>(82.5);
  const [km, setKm] = useState<number | undefined>(undefined);
  const [nota, setNota] = useState('');
  const [data, setData] = useState('2026-11-14');
  const [folha, setFolha] = useState(abrirComFolha);
  const [confirma, setConfirma] = useState(false);
  const [fKm, setFKm] = useState<number | undefined>(8.2);
  const [fMin, setFMin] = useState<number | undefined>(52);
  const [fPse, setFPse] = useState<number | undefined>(6);
  const [fNota, setFNota] = useState('Leve do começo ao fim.');

  useEffect(() => {
    if (new URLSearchParams(location.search).get('toast') === '1') toast('Corrida registrada · 8,2 km', { tone: 'ok', ms: 60000 });
  }, []);

  return (
    <>
      <Screen
        eyebrow="Sáb 14 nov · kit de interface"
        title="Base do kit"
        back
        actions={
          <>
            <IconButton icon="buscar" label="Buscar" onClick={() => toast('Busca')} />
            <IconButton icon="ajustes" label="Ajustes" href="/ajustes" />
          </>
        }
        footer={
          <>
            <Button variant="soft" icon="nota" onClick={() => setFolha(true)}>
              Registrar
            </Button>
            <Button variant="primary" icon="play" onClick={() => toast('Treino começado', { tone: 'ok' })}>
              Começar treino
            </Button>
          </>
        }
      >
        <Section title="Texto e rótulos">
          <Card>
            <div class="ui-stack">
              <div class="ui-eyebrow">Eyebrow · mono em caixa alta</div>
              <div class="ui-display" style={{ fontSize: '28px' }}>
                Título em display
              </div>
              <p>Corpo em Manrope, 14 px. Frases curtas e diretas, com fatos separados por ponto médio: 45 min · leve · na rua.</p>
              <p class="ui-note">
                Nota em 12 px, para o que é secundário. <b>Negrito</b> dentro dela volta à cor do texto.
              </p>
              <div class="ui-split">
                <span class="ui-val num">
                  82,5<small>kg</small>
                </span>
                <span class="ui-val is-sm num">
                  6:05<small>/km</small>
                </span>
                <span class="ui-val is-sm num">—</span>
              </div>
              <div class="ui-inline">
                <Tag>aquecimento</Tag>
                <Tag>principal</Tag>
                <button type="button" class="ui-link" onClick={() => toast('Aberto')}>
                  ver tudo
                </button>
              </div>
            </div>
          </Card>
        </Section>

        <Section title="Cards" action={<button type="button" class="ui-link">ver tudo</button>}>
          <Card area="corrida" eyebrow="Hoje · quarta" title="Rodagem leve" action={<Pill tone="accent">no relógio</Pill>}>
            <p class="ui-muted">45 min em FC 130 a 152 bpm. Solte o corpo e termine com vontade de correr mais.</p>
            <div class="ui-inline ui-mt">
              <Button variant="primary" size="sm" icon="check">
                Registrar
              </Button>
              <Button size="sm">Ver treino</Button>
            </div>
          </Card>
          <Card area="musc" title="Ficha B · Inferiores" action="7 exercícios" href="/musculacao/ficha/B">
            <p class="ui-muted">Card inteiro clicável. Última vez há 6 dias · cerca de 55 min.</p>
          </Card>
          <div class="ui-grid ui-g-2">
            <Card area="mob" title="Mobilidade" onClick={() => toast('Mobilidade')}>
              <span class="ui-val is-sm num">
                24<small>min</small>
              </span>
              <p class="ui-note ui-mt-sm">nesta semana</p>
            </Card>
            <Card area="peso" title="Peso" action={<IconButton icon="mais" label="Registrar peso" size="sm" onClick={() => toast('Registrar peso')} />}>
              <span class="ui-val is-sm num">
                82,5<small>kg</small>
              </span>
              <p class="ui-note ui-mt-sm">
                <b>−0,4</b> em 7 dias
              </p>
            </Card>
          </div>
          <Card flat eyebrow="Recado da semana">
            <p>Card plano, sem sombra, para blocos internos. Semana de volta: tudo leve, sem olhar ritmo.</p>
          </Card>
          <Card title="Sem área">
            <p class="ui-muted">Card transversal: sem quadradinho de cor.</p>
          </Card>
        </Section>

        <Section title="Listas">
          <Card title="Histórico">
            <List>
              <Row leading={<Icon name="corrida" />} title="Rodagem leve" sub="qua 11 nov · 45 min · PSE 4" right="7,4 km" href="/corrida/treino/x" />
              <Row leading={<Icon name="musculacao" />} title="Ficha A · Costas e bíceps" sub="sáb 7 nov · 52 min · 18 séries" right={<Pill tone="good">feito</Pill>} onClick={() => toast('Editar treino')} />
              <Row leading={<Icon name="balanca" />} title="Peso" sub="ontem, em jejum" right={<>82,5<small>kg</small></>} tone="accent" onClick={() => toast('Editar peso')} />
              <Row leading={<Icon name="corrida" />} title="Intervalado 6 × 400 m" sub="sex 6 nov · pulado" right={<Pill>pulado</Pill>} tone="muted" />
              <Row title="Linha simples, sem ícone" right="12" />
              <Row title="Um título comprido que precisa quebrar em duas linhas sem cortar nada" sub="Subtítulo também quebra · fato · outro fato · mais um fato para encher a linha" right="+2,5" tone="good" />
            </List>
          </Card>
        </Section>

        <Section title="Botões">
          <Card>
            <div class="ui-stack">
              <Button variant="primary" size="lg" block icon="play">
                Começar treino
              </Button>
              <div class="ui-inline">
                <Button variant="primary">Primário</Button>
                <Button>Suave</Button>
                <Button variant="ghost">Fantasma</Button>
                <Button variant="danger" icon="lixeira">
                  Apagar
                </Button>
              </div>
              <div class="ui-inline">
                <Button size="sm" variant="primary">
                  Pequeno
                </Button>
                <Button size="sm" icon="trocar">
                  Trocar
                </Button>
                <Button size="sm" variant="ghost">
                  Pular
                </Button>
                <Button size="sm" variant="danger">
                  Descartar
                </Button>
              </div>
              <div class="ui-inline">
                <Button variant="primary" disabled>
                  Desligado
                </Button>
                <Button disabled icon="baixar">
                  Desligado
                </Button>
                <Button href="https://www.youtube.com/results?search_query=agachamento" icon="link-externo">
                  Ver vídeo
                </Button>
              </div>
              <Button block icon="copiar">
                Copiar resumo para o treinador
              </Button>
              <div class="ui-inline">
                <IconButton icon="voltar" label="Voltar" size="sm" />
                <IconButton icon="pause" label="Pausar" />
                <IconButton icon="pular" label="Pular" size="lg" />
                <IconButton icon="som" label="Som" pressed={som} onClick={() => setSom(!som)} />
                <IconButton icon="voz" label="Voz" pressed={voz} onClick={() => setVoz(!voz)} />
                <IconButton icon="lixeira" label="Apagar" disabled />
              </div>
            </div>
          </Card>
        </Section>

        <Section title="Segmentos e chips">
          <Card title="Corrida" action={<Segmented size="sm" label="Período" value={periodo} onChange={setPeriodo} options={[{ v: '4s', l: '4 sem' }, { v: '3m', l: '3 m' }, { v: '12m', l: '12 m' }, { v: 'tudo', l: 'Tudo' }]} />}>
            <div class="ui-stack">
              <Segmented label="Parte" value={parte} onChange={setParte} options={[{ v: 'plano', l: 'Plano' }, { v: 'historico', l: 'Histórico' }, { v: 'zonas', l: 'Zonas' }]} />
              <Field label="Onde foi (escolha única)" group>
                <Chips label="Onde foi" value={local} onChange={setLocal} options={[{ v: 'rua', l: 'Rua' }, { v: 'esteira', l: 'Esteira' }]} />
              </Field>
              <Field label="Equipamento (várias)" group>
                <Chips
                  multi
                  label="Equipamento"
                  value={equip}
                  onChange={setEquip}
                  options={[
                    { v: 'halter', l: 'Halteres' },
                    { v: 'barra', l: 'Barra' },
                    { v: 'maquina', l: 'Máquina' },
                    { v: 'polia', l: 'Polia' },
                    { v: 'elastico', l: 'Elástico' },
                    { v: 'corpo', l: 'Peso do corpo' },
                  ]}
                />
              </Field>
            </div>
          </Card>
        </Section>

        <Section title="Interruptores">
          <div class="ui-stack is-sm">
            <Toggle label="Som" hint="Bipes no fim do descanso e nas trocas de passo." checked={som} onChange={setSom} />
            <Toggle label="Voz" checked={voz} onChange={setVoz} />
            <Toggle label="Vibração" hint="O iPhone não vibra pelo navegador." checked={false} onChange={() => undefined} disabled />
          </div>
          <Card title="Dentro de um card">
            <Toggle bare label="Manter a tela ligada" hint="Durante os treinos guiados." checked={tela} onChange={setTela} />
            <Toggle bare label="Som" checked={som} onChange={setSom} />
          </Card>
        </Section>

        <Section title="Escalas">
          <Card>
            <div class="ui-stack">
              <Scale label="Como se sentiu" min={1} max={5} value={sentiu} onChange={setSentiu} left="péssimo" right="ótimo" />
              <Scale label="Esforço (PSE)" min={1} max={10} value={pse} onChange={setPse} left="muito leve" right="máximo" />
            </div>
          </Card>
        </Section>

        <Section title="Steppers">
          <Card>
            <div class="ui-stack">
              <div class="ui-grid ui-g-2">
                <Stepper big label="Carga" unit="kg" step={2.5} min={0} max={400} value={carga} onChange={setCarga} />
                <Stepper big label="Repetições" step={1} min={0} max={99} value={reps} onChange={setReps} />
              </div>
              <Stepper label="Descanso padrão" unit="s" step={15} min={15} max={300} value={descanso} onChange={setDescanso} />
              <Stepper label="No mínimo (botão − desligado)" step={1} min={0} max={5} value={0} onChange={() => undefined} format={(v) => `${v} de 5`} />
            </div>
          </Card>
        </Section>

        <Section title="Campos">
          <Card>
            <div class="ui-form">
              <Field label="Nome">
                <TextInput value={nome} onChange={setNome} />
              </Field>
              <Field label="Buscar exercício" hint="Procure pelo nome ou pelo músculo.">
                <TextInput type="search" placeholder="Ex.: agachamento" value={busca} onChange={setBusca} />
              </Field>
              <div class="ui-grid ui-g-2">
                <Field label="FC máxima">
                  <NumberInput int unit="bpm" min={100} max={230} value={fc} onChange={setFc} />
                </Field>
                <Field label="Peso">
                  <NumberInput unit="kg" value={peso} onChange={setPeso} />
                </Field>
              </div>
              <Field label="Distância" error={km === undefined ? 'Informe a distância em km. Pode usar vírgula: 8,2.' : undefined}>
                <NumberInput unit="km" placeholder="0,0" value={km} onChange={setKm} />
              </Field>
              <Field label="Data">
                <DateInput value={data} onChange={setData} />
              </Field>
              <Field label="Observação" hint="Opcional. O treinador lê no resumo.">
                <TextArea placeholder="Como foi o treino?" value={nota} onChange={setNota} />
              </Field>
              <Field label="Campo desligado">
                <TextInput value="Não editável" onChange={() => undefined} disabled />
              </Field>
            </div>
          </Card>
        </Section>

        <Section title="Pills e etiquetas">
          <Card>
            <div class="ui-stack">
              <div class="ui-inline">
                <Pill tone="good">feito</Pill>
                <Pill tone="warn">parcial</Pill>
                <Pill tone="crit">perdido</Pill>
                <Pill>pendente</Pill>
                <Pill tone="accent">hoje</Pill>
              </div>
              <div class="ui-inline">
                <Pill tone="corrida">corrida</Pill>
                <Pill tone="musc">musculação</Pill>
                <Pill tone="mob">mobilidade</Pill>
                <Pill tone="peso">peso</Pill>
                <Pill tone="accent" icon="trofeu">
                  recorde
                </Pill>
                <Pill tone="musc" icon="repetir">
                  drop-set
                </Pill>
              </div>
              <div class="ui-inline">
                <Tag>pré</Tag>
                <Tag>mobilidade</Tag>
                <Tag>descanso 90 s</Tag>
              </div>
            </div>
          </Card>
        </Section>

        <Section title="Avisos">
          <div class="ui-banner">
            <Icon name="alerta" size={18} />
            <span class="ui-grow">Treino de quinta ficou aberto.</span>
            <Button size="sm">Concluir</Button>
          </div>
          <div class="ui-banner is-accent">
            <Icon name="info" size={18} />
            <span class="ui-grow">Nesta semana, faça séries normais: sem drop-set nem rest-pause.</span>
          </div>
        </Section>

        <Section title="Estados vazios">
          <Empty
            icon="corrida"
            title="Nenhuma corrida registrada"
            text="Registre a corrida de hoje ou importe o histórico em Ajustes."
            action={
              <Button size="sm" icon="mais">
                Adicionar corrida
              </Button>
            }
          />
          <Empty title="Sem recordes ainda" text="Eles aparecem depois do primeiro treino concluído." />
        </Section>

        <Section title="Folha e toasts">
          <Card>
            <div class="ui-stack">
              <div class="ui-inline">
                <Button icon="nota" onClick={() => setFolha(true)}>
                  Abrir folha
                </Button>
                <Button variant="danger" onClick={() => setConfirma(true)}>
                  Confirmação
                </Button>
              </div>
              <div class="ui-inline">
                <Button size="sm" onClick={() => toast('Salvo')}>
                  Toast simples
                </Button>
                <Button size="sm" onClick={() => toast('Corrida registrada · 8,2 km', { tone: 'ok' })}>
                  Ok
                </Button>
                <Button size="sm" onClick={() => toast('Não salvou. Tente de novo.', { tone: 'erro' })}>
                  Erro
                </Button>
                <Button size="sm" onClick={() => toast('Sem internet: o vídeo abre depois.', { tone: 'info' })}>
                  Info
                </Button>
                <Button size="sm" onClick={() => toast('Treino apagado', { action: { label: 'Desfazer', onClick: () => toast('Treino de volta', { tone: 'ok' }) } })}>
                  Com ação
                </Button>
              </div>
              <p class="ui-note">Como aparecem (aqui parados, para a conferência):</p>
              <div class="ui-stack is-sm" style={{ alignItems: 'center' }}>
                <div class="ui-toast">Salvo</div>
                <div class="ui-toast is-ok">Corrida registrada · 8,2 km</div>
                <div class="ui-toast is-erro">Não salvou. Tente de novo.</div>
                <div class="ui-toast is-info">Sem internet: o vídeo abre depois.</div>
                <div class="ui-toast">
                  <span>Treino apagado</span>
                  <button type="button" class="ui-toast-act">
                    Desfazer
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        <Section title="Ícones">
          <Card>
            <div class="ui-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px 6px' }}>
              {ICON_NAMES.map((n) => (
                <div key={n} class="ui-stack is-sm" style={{ alignItems: 'center', textAlign: 'center' }}>
                  <Icon name={n} size={24} />
                  <span class="ui-note" style={{ fontSize: 'var(--fs-2xs)', overflowWrap: 'anywhere' }}>
                    {n}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Section>
      </Screen>

      <TabBar items={ABAS} active="hoje" />

      <Sheet
        open={folha}
        onClose={() => setFolha(false)}
        title="Registrar corrida"
        footer={
          <>
            <Button onClick={() => setFolha(false)}>Cancelar</Button>
            <Button
              variant="primary"
              onClick={() => {
                setFolha(false);
                toast('Corrida registrada · 8,2 km', { tone: 'ok' });
              }}
            >
              Salvar
            </Button>
          </>
        }
      >
        <p class="ui-muted">Rodagem leve · qua 11 nov. Leva 10 segundos.</p>
        <div class="ui-grid ui-g-2">
          <Field label="Duração">
            <NumberInput int unit="min" value={fMin} onChange={setFMin} />
          </Field>
          <Field label="Distância">
            <NumberInput unit="km" value={fKm} onChange={setFKm} />
          </Field>
        </div>
        <Scale label="Esforço (PSE)" min={1} max={10} value={fPse} onChange={setFPse} left="muito leve" right="máximo" />
        <Field label="Onde foi" group>
          <Chips label="Onde foi" value={local} onChange={setLocal} options={[{ v: 'rua', l: 'Rua' }, { v: 'esteira', l: 'Esteira' }]} />
        </Field>
        <Field label="Observação">
          <TextArea value={fNota} onChange={setFNota} />
        </Field>
      </Sheet>

      <Sheet
        open={confirma}
        onClose={() => setConfirma(false)}
        title="Descartar o treino?"
        footer={
          <>
            <Button onClick={() => setConfirma(false)}>Continuar treino</Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirma(false);
                toast('Treino descartado');
              }}
            >
              Descartar
            </Button>
          </>
        }
      >
        <p class="ui-muted">As 12 séries marcadas até aqui serão apagadas. Isso não tem volta.</p>
      </Sheet>

      <ToastHost />
    </>
  );
}
