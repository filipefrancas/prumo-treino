/**
 * Fichas de musculação: programa "Atleta Híbrido" do treinador Fabiano (A · Costas e bíceps, B · Inferiores,
 * C · Peito, ombro e braço), na mesma estrutura do catálogo do Prumo.
 *
 * ARQUIVO GERADO a partir do catálogo embutido do Prumo (chave "programas.hibrido"): não edite à mão as séries,
 * cargas e intervalos. Em relação ao catálogo, saem as fotos (img, imgArquivo) e entra `anim` (id da animação
 * deste app). Os ids ("h-A-07") são permanentes: são as chaves de `Lift.sets` nos treinos gravados.
 */
import type { Programa } from '../types.ts';

export const PROGRAMAS: Programa[] = [
  {
    id: 'hibrido',
    nome: 'Atleta Híbrido',
    objetivo: 'Condicionamento físico',
    fonte: 'Treinador Fabiano · ficha de ago/2025',
    fichas: [
      {
        id: 'A',
        nome: 'Costas e bíceps',
        exercicios: [
          {
            id: 'h-A-01', anim: 'alongamento-peitoral-espaldar', nome: 'Alongamento peitoral espaldar bilateral', grupo: 'peito', equipamento: 'espaldar', tipo: 'alongamento', combinado: 'c1',
            series: [
              { sets: 2, reps: '45 s', rir: null, iso: null, carga: 0, intervalo: 45 },
            ],
          },
          {
            id: 'h-A-02', anim: 'alongamento-dorsal-espaldar', nome: 'Alongamento Dorsal Espaldar I', grupo: 'costas', equipamento: 'espaldar', tipo: 'alongamento', combinado: 'c1',
            series: [
              { sets: 2, reps: '30-45 s', rir: null, iso: null, carga: 0, intervalo: 30 },
            ],
          },
          {
            id: 'h-A-03', anim: 'mobilidade-ombro-bastao', nome: 'Mobilidade de Ombro I', grupo: 'mobilidade', equipamento: 'peso do corpo', tipo: 'mobilidade', combinado: 'c2',
            series: [
              { sets: 2, reps: '10', rir: null, iso: null, carga: 0, intervalo: null },
            ],
          },
          {
            id: 'h-A-04', anim: 'alongamento-peitoral-fita', nome: 'Alongamento peitoral fita', grupo: 'peito', equipamento: 'fita', tipo: 'alongamento', combinado: 'c2',
            series: [
              { sets: 2, reps: '45 s', rir: null, iso: null, carga: 0, intervalo: 45 },
            ],
          },
          {
            id: 'h-A-05', anim: 'manguito-externo-elastico', nome: 'Manguito externo bilateral + desenvolvimento com elástico', grupo: 'ombro', equipamento: 'elástico', tipo: 'aquecimento', combinado: 'c3',
            series: [
              { sets: 2, reps: '15-20', rir: null, iso: null, carga: 0, intervalo: null },
            ],
          },
          {
            id: 'h-A-06', anim: 'elevacao-y-banco', nome: 'Elevação Y no banco 30-45 graus', grupo: 'ombro', equipamento: 'halteres', tipo: 'principal', combinado: 'c3',
            series: [
              { sets: 2, reps: '10-15', rir: null, iso: '2 s', carga: 5, intervalo: null },
            ],
          },
          {
            id: 'h-A-07', anim: 'remada-cavalinho', nome: 'Remada Cavalinho (Pegada Neutra)', grupo: 'costas', equipamento: 'máquina', tipo: 'principal',
            series: [
              { sets: 1, reps: '10-15', rir: '1-3', iso: '2 s', carga: 25, intervalo: 60, nota: 'aquecimento' },
              { sets: 3, reps: '8-12', rir: '1-3', iso: null, carga: 40, intervalo: 90 },
            ],
          },
          {
            id: 'h-A-08', anim: 'pulldown-unilateral', nome: 'Pulldown Máquina Unilateral', grupo: 'costas', equipamento: 'máquina', tipo: 'principal',
            series: [
              { sets: 3, reps: '4-4-4', rir: null, iso: null, carga: 35, intervalo: 90 },
            ],
            metodo: 'cluster-set',
            instrucoes: 'Pulldow Articulado Unilateral (3) (sem vídeo no app). Cluster-set: 4 repetições, troca de braço, até dar 12 repetições em cada braço. Carga alta e máxima amplitude.',
          },
          {
            id: 'h-A-09', anim: 'puxada-supinada', nome: 'Puxada supinada', grupo: 'costas', equipamento: 'polia', tipo: 'principal',
            series: [
              { sets: 4, reps: '8-12', rir: '1-3', iso: null, carga: 56.5, intervalo: 90 },
            ],
          },
          {
            id: 'h-A-10', anim: 'remada-maquina', nome: 'Remada Máquina (Pegada Pronada)', grupo: 'costas', equipamento: 'máquina', tipo: 'principal',
            series: [
              { sets: 3, reps: '8-12', rir: '1-3', iso: null, carga: 40, intervalo: 90 },
            ],
            metodo: 'rest-pause',
            instrucoes: 'Rest-pause: É um método de treinamento que durante a série teremos uma pausa, entorno de 10-30seg, sendo que ao retornar é necessário executar até a falha.',
          },
          {
            id: 'h-A-11', anim: 'crucifixo-inverso', nome: 'Crucifixo inverso halter', grupo: 'ombro', equipamento: 'halteres', tipo: 'principal', combinado: 'c4',
            series: [
              { sets: 4, reps: '15-20', rir: '1-3', iso: null, carga: 7, intervalo: null },
            ],
            metodo: 'super-set',
            instrucoes: 'Super-set 1',
          },
          {
            id: 'h-A-12', anim: 'rosca-banco-inclinado', nome: 'Rosca direta Banco Inclinado', grupo: 'bíceps', equipamento: 'halteres', tipo: 'principal', combinado: 'c4',
            series: [
              { sets: 4, reps: '8-12', rir: '1-3', iso: null, carga: 16, intervalo: 30 },
            ],
            metodo: 'super-set',
            instrucoes: 'Super-set 1',
          },
          {
            id: 'h-A-13', anim: 'rosca-scott-unilateral', nome: 'Rosca Scott Unilateral com Halteres', grupo: 'bíceps', equipamento: 'halteres', tipo: 'principal',
            series: [
              { sets: 4, reps: '8-12', rir: '1-3', iso: null, carga: 27.5, intervalo: 90 },
            ],
            metodo: 'rest-pause',
            instrucoes: 'Rest-pause: É um método de treinamento que durante a série teremos uma pausa, entorno de 10-30seg, sendo que ao retornar é necessário executar até a falha.',
          },
        ],
      },
      {
        id: 'B',
        nome: 'Inferiores',
        exercicios: [
          {
            id: 'h-B-01', anim: 'panturrilha-no-step', nome: 'Panturrilha no Step', grupo: 'panturrilha', equipamento: 'step', tipo: 'alongamento', combinado: 'c1',
            series: [
              { sets: 2, reps: '30-45 s', rir: null, iso: null, carga: 0, intervalo: 30 },
            ],
          },
          {
            id: 'h-B-02', anim: 'alongamento-adutor-step', nome: 'Alongamento de adutor espaldar com step', grupo: 'mobilidade', equipamento: 'espaldar', tipo: 'alongamento', combinado: 'c1',
            series: [
              { sets: 2, reps: '30-45 s', rir: null, iso: null, carga: 0, intervalo: 45 },
            ],
          },
          {
            id: 'h-B-03', anim: 'mobilidade-quadril-elastico', nome: 'Mobilidade de Quadril VI', grupo: 'mobilidade', equipamento: 'elástico', tipo: 'mobilidade',
            series: [
              { sets: 2, reps: '30-45 s', rir: null, iso: null, carga: 0, intervalo: 30 },
            ],
          },
          {
            id: 'h-B-04', anim: 'anterior-quadril-flexao-tronco', nome: 'Anterior Quadril com Flexão de Tronco', grupo: 'mobilidade', equipamento: 'peso do corpo', tipo: 'mobilidade',
            series: [
              { sets: 2, reps: '15', rir: null, iso: '2 s', carga: 0, intervalo: null, nota: 'frente e atrás' },
            ],
          },
          {
            id: 'h-B-05', anim: 'passada-lateral-elastico', nome: 'Passada lateral com elástico no pé', grupo: 'glúteo', equipamento: 'elástico', tipo: 'aquecimento', combinado: 'c2',
            series: [
              { sets: 2, reps: '20/20', rir: null, iso: null, carga: null, intervalo: null, nota: 'elástico azul' },
            ],
          },
          {
            id: 'h-B-06', anim: 'agachamento-halter-frente', nome: 'Agachamento com Halter na Frente', grupo: 'quadríceps', equipamento: 'halteres', tipo: 'principal', combinado: 'c2',
            series: [
              { sets: 2, reps: '15-20', rir: '3-5', iso: null, carga: 22, intervalo: null },
            ],
          },
          {
            id: 'h-B-07', anim: 'recuo-com-halteres', nome: 'Recuo com Halteres', grupo: 'quadríceps', equipamento: 'halteres', tipo: 'principal',
            series: [
              { sets: 3, reps: '10-15', rir: '1-3', iso: null, carga: 12, intervalo: 30 },
            ],
          },
          {
            id: 'h-B-08', anim: 'leg-press-45', nome: 'Leg Press 45 Pés Afastados', grupo: 'quadríceps', equipamento: 'máquina', tipo: 'principal',
            series: [
              { sets: 3, reps: '10-15', rir: '1-3', iso: null, carga: 200, intervalo: 90 },
            ],
          },
          {
            id: 'h-B-09', anim: 'cadeira-extensora-unilateral', nome: 'Cadeira Extensora Unilateral', grupo: 'quadríceps', equipamento: 'máquina', tipo: 'principal',
            series: [
              { sets: 2, reps: '10-15', rir: '0-1', iso: null, carga: 96, intervalo: 90, nota: '3 cargas em sequência, sem descanso', drops: [96, 52, 38] },
            ],
            metodo: 'drop-set',
          },
          {
            id: 'h-B-10', anim: 'flexao-nordica', nome: 'Flexão Nórdica', grupo: 'posterior', equipamento: 'banco nórdico', tipo: 'principal', combinado: 'c3',
            series: [
              { sets: 3, reps: '10-15', rir: '1-3', iso: null, carga: 35, intervalo: null },
            ],
            metodo: 'bi-set',
          },
          {
            id: 'h-B-11', anim: 'hiperextensao-lombar', nome: 'Hiperextensão de Lombar', grupo: 'posterior', equipamento: 'banco', tipo: 'principal', combinado: 'c3',
            series: [
              { sets: 3, reps: '10-15', rir: '1-3', iso: null, carga: 0, intervalo: 90 },
            ],
            metodo: 'bi-set',
          },
          {
            id: 'h-B-12', anim: 'panturrilha-leg-press', nome: 'Panturrilha no Leg Press Horizontal', grupo: 'panturrilha', equipamento: 'máquina', tipo: 'principal',
            series: [
              { sets: 3, reps: '10-15', rir: '0-1', iso: '2 s', carga: 145, intervalo: 30, nota: 'pico de alongamento' },
            ],
          },
          {
            id: 'h-B-13', anim: 'dorsiflexao-halter', nome: 'Dorsiflexão bilateral com halter', grupo: 'panturrilha', equipamento: 'halteres', tipo: 'principal',
            series: [
              { sets: 3, reps: '10-15', rir: '0-1', iso: '2 s', carga: 0, intervalo: 30, nota: 'pico de contração' },
            ],
          },
        ],
      },
      {
        id: 'C',
        nome: 'Peito, ombro e braço',
        exercicios: [
          {
            id: 'h-C-01', anim: 'alongamento-peitoral-espaldar', nome: 'Alongamento peitoral espaldar bilateral', grupo: 'peito', equipamento: 'espaldar', tipo: 'alongamento', combinado: 'c1',
            series: [
              { sets: 2, reps: '30-45 s', rir: null, iso: null, carga: 0, intervalo: 45 },
            ],
          },
          {
            id: 'h-C-02', anim: 'manguito-externo-elastico', nome: 'Manguito externo bilateral + desenvolvimento com elástico', grupo: 'ombro', equipamento: 'elástico', tipo: 'aquecimento', combinado: 'c1',
            series: [
              { sets: 2, reps: '15-20', rir: '3-5', iso: null, carga: 0, intervalo: null },
            ],
          },
          {
            id: 'h-C-03', anim: 'supino-reto-maquina', nome: 'Supino Reto Máquina', grupo: 'peito', equipamento: 'máquina', tipo: 'principal',
            series: [
              { sets: 1, reps: '10-15', rir: '10-15', iso: null, carga: 30, intervalo: 60, nota: 'aquecimento · 50%' },
              { sets: 1, reps: '8-12', rir: '10-15', iso: null, carga: 40, intervalo: 90, nota: 'aquecimento · 75%' },
              { sets: 3, reps: '8-12', rir: '1-3', iso: null, carga: 80, intervalo: 90 },
            ],
          },
          {
            id: 'h-C-04', anim: 'supino-inclinado-maquina', nome: 'Supino Máquina Inclinado (Pegada Pronada)', grupo: 'peito', equipamento: 'máquina', tipo: 'principal',
            series: [
              { sets: 3, reps: '4-4-4', rir: '1-3', iso: null, carga: 80, intervalo: 90 },
            ],
            metodo: 'cluster-set',
          },
          {
            id: 'h-C-05', anim: 'crucifixo-inclinado', nome: 'Crucifixo Inclinado com Halteres', grupo: 'peito', equipamento: 'halteres', tipo: 'principal',
            series: [
              { sets: 3, reps: '8-12', rir: '1-3', iso: '2 s', carga: 16, intervalo: 90, nota: 'pico de alongamento' },
            ],
          },
          {
            id: 'h-C-06', anim: 'elevacao-lateral', nome: 'Elevação Lateral com Halteres', grupo: 'ombro', equipamento: 'halteres', tipo: 'principal',
            series: [
              { sets: 2, reps: '10-15', rir: '1-3', iso: null, carga: 10, intervalo: 60 },
            ],
          },
          {
            id: 'h-C-07', anim: 'desenvolvimento-maquina', nome: 'Desenvolvimento Máquina (Pegada Neutra)', grupo: 'ombro', equipamento: 'máquina', tipo: 'principal',
            series: [
              { sets: 3, reps: '8-12', rir: '1-3', iso: null, carga: 53, intervalo: 90 },
            ],
          },
          {
            id: 'h-C-08', anim: 'triceps-frances-polia', nome: 'Tríceps Francês Unilateral na Polia', grupo: 'tríceps', equipamento: 'polia', tipo: 'principal',
            series: [
              { sets: 3, reps: '8-12', rir: '1-3', iso: null, carga: 30, intervalo: 30 },
            ],
          },
          {
            id: 'h-C-09', anim: 'triceps-paralela-maquina', nome: 'Tríceps Paralela Máquina (Pegada Neutra)', grupo: 'tríceps', equipamento: 'máquina', tipo: 'principal', combinado: 'c2',
            series: [
              { sets: 3, reps: '8-12', rir: '1-3', iso: null, carga: 85, intervalo: 60 },
            ],
            metodo: 'rest-pause',
            instrucoes: 'Combinar com abdômen bi articular, ao lado.',
          },
          {
            id: 'h-C-10', anim: 'abdominal-maquina', nome: 'Abdominal Máquina', grupo: 'core', equipamento: 'máquina', tipo: 'principal', combinado: 'c2',
            series: [
              { sets: 3, reps: '8-12', rir: '1-3', iso: null, carga: 20, intervalo: 90, nota: '3 cargas em sequência, sem descanso', drops: [20, 0, 0] },
            ],
            metodo: 'drop-set',
          },
        ],
      },
    ],
  },
];

/** Programa pelo id; `undefined` quando não existe. */
export const programaPorId = (id: string): Programa | undefined => PROGRAMAS.find((p) => p.id === id);

/**
 * Como executar o método em cada exercício que tem um texto próprio no catálogo do Prumo (campo `metodoTxt`, que
 * não faz parte de `FichaExercicio`): exId → frase. Para os demais vale o texto geral de `METODO_TXT` (lib/academia).
 */
export const METODO_TXT_EXERCICIO: Record<string, string> = {
  'h-A-08': 'Cluster-set: 4 repetições, troca de braço, mais 4, e assim até somar 12 em cada braço; carga alta e amplitude máxima.',
  'h-A-10': 'Rest-pause: faça as repetições, pause 10-30 s sem largar o aparelho e volte até a falha (Rest + Max).',
  'h-A-11': 'Super-set: uma série deste e, sem descanso, uma do exercício combinado; descanse só depois do par.',
  'h-A-12': 'Super-set: uma série deste e, sem descanso, uma do exercício combinado; descanse só depois do par.',
  'h-A-13': 'Rest-pause: faça as repetições, pause 10-30 s sem largar o aparelho e volte até a falha (Rest + Max).',
  'h-B-09': 'Drop-set: 10-15 repetições a 96 kg, baixe para 52 kg e continue sem descanso, depois 38 kg; isso é uma série.',
  'h-B-10': 'Bi-set: uma série deste e, sem descanso, uma do exercício combinado; descanse só depois do par.',
  'h-B-11': 'Bi-set: uma série deste e, sem descanso, uma do exercício combinado; descanse só depois do par.',
  'h-C-04': 'Cluster-set: 4 repetições, pausa de 10-15 s, mais 4, mais 4 (12 por série) com carga alta.',
  'h-C-09': 'Rest-pause: faça as repetições, pause 10-30 s sem largar o aparelho e volte até a falha (Rest + Max).',
  'h-C-10': 'Drop-set: 8-12 repetições com 20 kg, tire a carga e continue sem descanso até a falha, duas vezes; isso é uma série.',
};
