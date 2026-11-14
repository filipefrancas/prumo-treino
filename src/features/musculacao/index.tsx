/* Musculação (SPEC 8.3 e 8.7). A casca (src/app.tsx) importa só deste arquivo: os nomes exportados e a prop `id`
   das telas de rota com parâmetro são o contrato.
   - telas.tsx: a aba, o detalhe da ficha e o histórico · sessao.tsx: o treino em andamento
   - biblioteca.tsx: lista e detalhe de exercício · comum.tsx: formatos e peças comuns · descanso.ts: relógio do descanso */
import './musculacao.css';

export { ExerciseScreen, LibraryScreen } from './biblioteca.tsx';
export { SessaoScreen } from './sessao.tsx';
export { FichaScreen, LiftsScreen, MusculacaoScreen } from './telas.tsx';

/** Telas de rota com parâmetro recebem o trecho `:id` da rota. */
export interface ComId {
  id: string;
}
