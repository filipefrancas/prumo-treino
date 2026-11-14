import type { HrZone, Profile } from '../types.ts';

/**
 * Zonas de frequência cardíaca usadas nos treinos (as mesmas que estão nos treinos do Garmin Connect).
 * Foram calibradas pelas corridas reais de 2025 e 2026: FC máxima de 192 e corridas leves em torno de 150 bpm.
 */
export const ZONES: HrZone[] = [
  { id: 'leve', label: 'Leve', min: 130, max: 152, feel: 'Dá para conversar em frases inteiras.' },
  { id: 'continuo', label: 'Contínuo', min: 140, max: 158, feel: 'Confortável e firme; fala frases curtas.' },
  { id: 'moderado', label: 'Moderado', min: 148, max: 160, feel: 'Respiração marcada; só palavras soltas.' },
  { id: 'forte', label: 'Forte', min: 155, max: 168, feel: 'Difícil, mas controlado; não é tiro máximo.' },
];

export const PROFILE: Profile = {
  name: 'Filipe',
  hrMax: 192,
  zones: ZONES,
  // quarta, sexta e domingo
  runDays: [3, 5, 0],
  // segunda, quinta e sábado
  gymDays: [1, 4, 6],
  watch: 'Garmin Venu 2 Plus',
};
