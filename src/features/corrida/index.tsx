/* Corrida: plano, histórico e zonas; detalhe do treino; corrida guiada. A casca (src/app.tsx) importa só daqui. */
import './corrida.css';

export { CorridaScreen } from './plano.tsx';
export { RunDetailScreen } from './detalhe.tsx';
export { RunPlayerScreen } from './guiada.tsx';

/** Telas de rota com parâmetro recebem o trecho `:id` da rota. */
export interface ComId {
  id: string;
}
