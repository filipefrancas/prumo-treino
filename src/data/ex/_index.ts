import type { Exercise } from '../../types.ts';

/**
 * Índice da biblioteca de exercícios: cada arquivo desta pasta (exceto este) exporta por padrão um Exercise
 * cujo id é o nome do arquivo (ver docs/CATALOGO.md). O glob é resolvido no build: tudo funciona offline.
 */
const modules = import.meta.glob<{ default: Exercise }>(['./*.ts', '!./_index.ts'], { eager: true });

const byId = new Map<string, Exercise>();
for (const mod of Object.values(modules)) {
  if (mod.default?.id) byId.set(mod.default.id, mod.default);
}

export const exById = (id: string): Exercise | undefined => byId.get(id);
export const allExercises = (): Exercise[] => [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

/** Nome para exibir mesmo quando o exercício ainda não tem texto na biblioteca. */
export const exName = (id: string): string =>
  byId.get(id)?.name ?? id.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
