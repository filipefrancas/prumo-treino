# Contratos de `src/lib`

Assinaturas que os módulos de `src/lib` exportam. Quem implementa segue estas assinaturas à risca (pode exportar
auxiliares a mais, com comentário de documentação). Quem consome importa daqui e não reimplementa.
Tipos de domínio: `src/types.ts`. Tudo em TypeScript estrito, funções puras sempre que possível.

## `lib/dates.ts`

```ts
export const DIAS_CURTOS: readonly string[];   // ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
export const DIAS_LETRA: readonly string[];    // ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
export const DIAS_LONGOS: readonly string[];   // ['domingo', 'segunda', …]
export const MESES_CURTOS: readonly string[];  // ['jan', 'fev', …]
export function toISO(d: Date): ISODate;                    // data LOCAL (nunca toISOString)
export function fromISO(s: ISODate): Date;                  // meia-noite local
export function hoje(): ISODate;
export function addDias(s: ISODate, n: number): ISODate;
export function diffDias(a: ISODate, b: ISODate): number;   // b − a, em dias inteiros
export function diaSemana(s: ISODate): Weekday;             // 0 = domingo
export function inicioSemana(s: ISODate): ISODate;          // a segunda-feira da semana de s
export function semanaDe(s: ISODate): ISODate[];            // 7 datas, de segunda a domingo
export function agoraHM(d?: Date): string;                  // "HH:MM"
export function fmtData(s: ISODate, estilo?: 'curta' | 'media' | 'longa'): string;
// curta (padrão): "qua 18 nov" · media: "18 de novembro" · longa: "quarta, 18 de novembro"
export function fmtDiaMes(s: ISODate): string;              // "18/11"
export function fmtRelativa(s: ISODate, ref?: ISODate): string; // "hoje", "ontem", "há 3 dias", "amanhã", "qua 18 nov"
export function saudacao(d?: Date): string;                 // "Bom dia" (até 11h59), "Boa tarde" (até 17h59), "Boa noite"
export function idade(nascimento: ISODate, em?: ISODate): number;
```

## `lib/format.ts`

```ts
export function num(v: number, casas?: number): string;     // vírgula decimal, sem zeros à direita: 82.5 → "82,5"
export function kg(v: number): string;                       // "82,5 kg"
export function fmtDur(seg: number): string;                 // "0:45", "12:05", "1:02:03"
export function fmtMin(min: number): string;                 // "45 min", "1 h 05"
export function pace(km: number | undefined, min: number | undefined): number | undefined; // min por km
export function fmtPace(minPorKm: number | undefined): string;  // "6:05/km" ou "—"
export function fmtAlvo(t: Target): string;                  // "FC 130 a 152 bpm" · "PSE 7 a 8" · "PSE 7" · "Livre"
export function plural(n: number, um: string, varios: string): string; // plural(2, 'treino', 'treinos') → "2 treinos"
export function parseNum(texto: string): number | undefined; // aceita vírgula: "82,5" → 82.5
```

## `lib/store.ts`

```ts
export const SCHEMA_VERSION: number;
export function initialState(): AppState;                    // ver SPEC §4
export function loadState(): Promise<void>;                  // chamar antes do primeiro render
export function getState(): AppState;
export function update(fn: (draft: AppState) => void): void; // cópia (structuredClone) → fn → salva → avisa
export function replaceState(next: AppState): void;          // troca tudo (restauração de backup)
export function subscribe(fn: () => void): () => void;
export function useStore<T>(selector: (s: AppState) => T): T;
export function uid(): string;
export function flush(): Promise<void>;                      // grava agora (testes e antes de fechar)
```

Persistência: IndexedDB (banco `prumo-treino`, object store `kv`, chave `state`) com espelho em
`localStorage['prumo-treino:state']`. Lê do IndexedDB; se falhar ou estiver vazio, do espelho. Migrações por `v`.
Modo de teste: se `localStorage['prumo-treino:seed'] === '1'`, o estado é lido SÓ de
`localStorage['prumo-treino:state']` (mesclado sobre `initialState()`), sem tocar no IndexedDB. É assim que a
ferramenta de capturas (`npm run shots -- --seed arquivo.json`) injeta um estado de exemplo.

## `lib/backup.ts`

```ts
export function exportBackup(): string;      // { app: 'prumo-treino', versao: 1, exportadoEm, state }
export function importBackup(json: string): { ok: boolean; error?: string };
export function importHistory(json: string): { ok: boolean; added: number; error?: string };
export function resetAll(): Promise<void>;   // volta ao estado inicial e limpa o disco
```

## `lib/router.ts`

```ts
export interface Route { path: string; parts: string[]; query: Record<string, string> }
export function currentRoute(): Route;                       // '#/corrida/treino/x?a=1' → path '/corrida/treino/x'
export function useRoute(): Route;
export function go(path: string, opts?: { replace?: boolean }): void;   // go('/corrida')
export function back(fallback?: string): void;               // history.back(), ou vai para fallback se não houver histórico
export function href(path: string): string;                  // '#/corrida'
export function match(route: Route, pattern: string): Record<string, string> | null; // match(r, '/corrida/treino/:id')
```

Rota vazia ou desconhecida leva a `/hoje`.

## `lib/feedback.ts`

```ts
export function destravarAudio(): void;      // chamar dentro do toque em "Começar" (cria/retoma o AudioContext, audioSession 'playback')
export function bip(tipo?: 'curto' | 'duplo' | 'longo' | 'fim'): void;   // respeita settings.som
export function contagem(restam: number): void;   // bipe curto nos 3, 2, 1 finais (chame quando restam 3, 2 e 1)
export function falar(texto: string): void;   // respeita settings.voz; cancela a fala anterior
export function calar(): void;
export function vibrar(padrao?: number | number[]): void;    // respeita settings.vibrar; sem suporte, não faz nada
export function manterTelaLigada(ligar: boolean): Promise<void>;   // respeita settings.telaLigada; reaplica ao voltar ao app
export function useTelaLigada(ativa: boolean): void;         // hook: liga enquanto o componente estiver montado e ativa === true
export function useAgora(intervaloMs?: number): number;      // hook: Date.now() atualizado a cada intervalo (padrão 250 ms), pausado com a aba oculta
```

## `lib/files.ts`

```ts
export function salvarArquivo(nome: string, conteudo: string, mime?: string): Promise<'compartilhado' | 'baixado' | 'cancelado'>;
export function escolherArquivo(accept?: string): Promise<string | null>;   // abre o seletor e devolve o texto do arquivo
export function copiar(texto: string): Promise<boolean>;     // área de transferência, com reserva por seleção de texto
```

## `lib/midia.ts` (fotos dos exercícios, só no aparelho)

```ts
export function importarPacote(json: string): Promise<{ ok: boolean; added: number; error?: string }>;  // troca fotos de mesmo id; ignora itens inválidos
export function carregarMidia(): Promise<void>;              // lê a lista de ids com foto; o main.tsx chama antes de montar o app
export function temFoto(id: string | undefined): boolean;    // síncrono; vale depois de carregarMidia()
export function contarFotos(): Promise<number>;
export function apagarFotos(): Promise<void>;
export function useFoto(id: string | undefined): string | undefined;   // hook: object URL em cache, revogado quando ninguém usa
export function reterFoto(id: string): Promise<string | undefined>;    // o mesmo, fora de componentes; pede um soltarFoto(id) depois
export function soltarFoto(id: string, agora?: boolean): void;
export function assinarMidia(fn: () => void): () => void;    // sinal de mudança (importar, apagar)
export function versaoMidia(): number;
export function useMidiaVersao(): number;                    // hook: redesenha quando as fotos mudam
```

Persistência: IndexedDB próprio (banco `prumo-treino-midia`, object store `fotos`, chave = id do exercício no
catálogo, valor `{ mime, bytes: ArrayBuffer, credito? }`; o Blob é montado na leitura). Fica fora do `AppState`, do
backup e do "apagar tudo". Nenhuma função rejeita. Formato do pacote:

```json
{ "kind": "prumo-treino-fotos", "version": 1,
  "fotos": [{ "id": "<id do catálogo>", "mime": "image/jpeg", "data": "<base64>", "credito": "opcional" }] }
```

`mime` aceito: `image/jpeg`, `image/png`, `image/webp`. O pacote com as fotos da ficha do treinador é gerado por
`npx tsx tools/gen-fotos.ts`, que lê e grava FORA do repositório (`../prumo-treino-dados/fotos-prumo-treino.json`).
As fotos nunca entram em `src/` nem em `public/`: o repositório é público.

## `lib/academia.ts` (regras do Prumo, puras)

```ts
export const METODO_ROTULO: Record<Metodo, string>;          // 'rest-pause' → 'Rest-pause' …
export const METODO_TXT: Record<Metodo, string>;             // como executar, em uma frase
export function programaAtivo(s: Settings): Programa;
export function fichasAtivas(s: Settings): Ficha[];          // do programa ativo, com settings.fichas aplicado
export function fichaPorLetra(s: Settings, letra: string): Ficha | undefined;
export function acharExercicio(exId: string): { programa: Programa; ficha: Ficha; ex: FichaExercicio } | undefined;

export function contaComoFeito(l: Lift): boolean;            // emAndamento !== true && concluido !== false
export function liftsFeitos(lifts: Lift[]): Lift[];          // feitos, em ordem crescente de data
export function sessaoAberta(lifts: Lift[]): Lift | undefined;
export function proximaFicha(s: Settings, lifts: Lift[]): Ficha;      // a que está há mais tempo sem fazer (A → B → C)
export function fichaDoDia(s: Settings, lifts: Lift[], data: ISODate): Ficha | undefined; // conforme settings.plano; undefined se o dia não tem musculação

export interface SeriePlanejada {
  n: number;                 // número da série no exercício, a partir de 1 (chave em Lift.sets[exId])
  bloco: number;             // índice do bloco em ex.series
  reps: string;              // texto da ficha
  faixa: [number, number] | null;   // faixa de repetições quando numérica ("8-12" → [8, 12])
  segundos: number | null;   // série por tempo ("45 s" → 45; "30-45 s" → 45)
  carga: number | null;
  intervalo: number | null;
  aquecimento: boolean;      // bloco de aquecimento dentro de um exercício principal (nota começa com "aquecimento")
}
export function seriesPlanejadas(ex: FichaExercicio): SeriePlanejada[];
export function ehPrincipal(ex: FichaExercicio): boolean;    // tipo === 'principal'
export function totalSeriesDeTrabalho(ficha: Ficha): number;

export function e1rm(carga: number, reps: number): number;   // Epley: carga × (1 + reps / 30)
export function volumeDoLift(l: Lift): number;               // Σ reps × carga das séries feitas
export function seriesFeitas(l: Lift, exId?: string): number;
export function ultimaVez(lifts: Lift[], exId: string, antes?: Lift): { data: ISODate; sets: SerieFeita[] } | undefined;

export interface Sugestao {
  tipo: 'ficha' | 'sobe' | 'repete' | 'reps' | 'aquecimento';
  carga: number | null;
  reps: string;
  motivo: string;            // frase curta para a interface: "Bateu 12 em todas: suba para 42,5 kg"
  series: { n: number; carga: number | null; reps: number | null }[];   // valores para pré-preencher cada série
}
export function sugestao(s: Settings, lifts: Lift[], ex: FichaExercicio): Sugestao;   // progressão dupla por bloco
export function descansoDe(s: Settings, ex: FichaExercicio, n: number, par?: FichaExercicio): number;  // segundos
export function prsDoLift(anteriores: Lift[], l: Lift): Pr[];
export function historicoEx(lifts: Lift[], exId: string): { data: ISODate; e1rm: number; cargaMax: number; repsMax: number }[];

// Sessão guiada: devolvem um Lift novo (não alteram o argumento)
export function iniciarSessao(s: Settings, ficha: Ficha, agora?: Date): Lift;
export function marcarSerie(l: Lift, exId: string, n: number, v: { reps?: number; carga?: number }, agora?: Date): Lift;
export function desmarcarSerie(l: Lift, exId: string, n: number): Lift;
export function pularExercicio(l: Lift, exId: string, pular: boolean): Lift;
export function concluirSessao(anteriores: Lift[], l: Lift, v: { intensidade?: number; obs?: string }, agora?: Date): Lift;

export function resumoSemanaMusc(s: Settings, lifts: Lift[], ref: ISODate): { treinos: number; planejados: number; volume: number; series: number };
```

## `lib/prumo.ts` (formato de backup do Prumo, puro)

```ts
export function toPrumoBackup(state: AppState, agora?: Date): string;
export function fromPrumoBackup(json: string, state: AppState): { ok: boolean; state?: AppState; added: number; error?: string };
```

## `lib/corrida.ts`

```ts
export type Situacao = 'feito' | 'pulado' | 'hoje' | 'perdido' | 'futuro';
export function treinoDoDia(data: ISODate): RunWorkout | undefined;
export function semanaDoPlano(data: ISODate): RunWeek | undefined;
export function logDoTreino(state: AppState, treinoId: string): RunLog | undefined;
export function situacaoDoTreino(state: AppState, w: RunWorkout, ref?: ISODate): Situacao;
export function tipoDaFamilia(f: RunFamily): RunTipo;
export interface Passo extends RunStep { inicio: number; fim: number; rep?: [number, number] } // segundos acumulados; rep = [i, total]
export function passos(w: RunWorkout): Passo[];
export function salvarCorrida(log: Omit<RunLog, 'id'> & { id?: string }): string;   // grava no store (cria ou edita), marca o treino como feito; devolve o id
export function apagarCorrida(id: string): void;
export function marcarTreino(treinoId: string, marca: PlanMark | null): void;
export function porSemana(runs: RunLog[], semanas: number, ate?: ISODate): { semana: ISODate; min: number; km: number; n: number }[];
export function planejadoPorSemana(): { semana: ISODate; min: number; n: number }[];
export function totais(runs: RunLog[], desde?: ISODate): { n: number; km: number; min: number };
export function recordes(runs: RunLog[]): { maisLonga?: RunLog; melhor5k?: RunLog; melhor10k?: RunLog; melhor21k?: RunLog };
```

## `lib/plano.ts`

```ts
export interface ItemDoDia {
  tipo: 'corrida' | 'musc';
  corrida?: RunWorkout;
  situacao?: Situacao;        // corrida
  ficha?: Ficha;              // musculação
  feito: boolean;
}
export function agendaDoDia(state: AppState, data: ISODate): ItemDoDia[];   // vazio = descanso
export function agendaDaSemana(state: AppState, ref: ISODate): { data: ISODate; itens: ItemDoDia[] }[];  // segunda a domingo
export function resumoDaSemana(state: AppState, ref: ISODate): { feitos: number; planejados: number; corridas: number; musc: number; mobMin: number };
```

## `lib/progresso.ts`

```ts
export interface DiaTreino { data: ISODate; corrida: boolean; musc: boolean; mob: boolean }
export function mapaDeTreinos(state: AppState, semanas: number, ate?: ISODate): DiaTreino[][];   // [semana][dia], segunda a domingo
export function sequenciaDeSemanas(state: AppState, minimo?: number, ate?: ISODate): number;      // semanas seguidas com ≥ mínimo treinos (padrão 3)
export function pesoComMedia(weights: WeightLog[]): { data: ISODate; kg: number; media: number }[];
export function salvarPeso(data: ISODate, valorKg: number, obs?: string): void;
export function mobPorSemana(mob: MobilityLog[], semanas: number, ate?: ISODate): { semana: ISODate; min: number }[];
export function resumoParaTreinador(state: AppState, dias?: number, ate?: ISODate): string;
```
