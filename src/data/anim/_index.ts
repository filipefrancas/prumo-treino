import type { RigDef } from '../../rig/types.ts';

/**
 * Índice das animações: cada arquivo desta pasta (exceto este) exporta por padrão um RigDef cujo id é o nome do arquivo.
 * O Vite resolve o glob em tempo de build, então todas as animações entram no pacote e funcionam offline.
 */
const modules = import.meta.glob<{ default: RigDef }>(['./*.ts', '!./_index.ts'], { eager: true });

const byId = new Map<string, RigDef>();
for (const mod of Object.values(modules)) {
  if (mod.default?.id) byId.set(mod.default.id, mod.default);
}

export const animById = (id: string): RigDef | undefined => byId.get(id);
export const hasAnim = (id: string): boolean => byId.has(id);
export const allAnimIds = (): string[] => [...byId.keys()].sort();
