/**
 * Barril do kit de interface: tudo o que as telas usam de `src/ui` sai daqui.
 *   import { Screen, Card, Button, toast } from '../../ui/index.ts';
 * Guia completo em docs/UI.md.
 *
 * Ficam de fora, de propósito, `fmtNum` e `parseNum` (existem em Stepper.tsx e em viz-util.ts com padrões
 * diferentes): as telas formatam números com `lib/format.ts`.
 */

// Estrutura
export { Screen, type ScreenProps } from './Screen.tsx';
export { TabBar, type TabBarProps, type TabItem } from './TabBar.tsx';
export { Card, Section, type Area, type CardProps, type SectionProps } from './Card.tsx';
export { List, Row, type RowProps } from './Row.tsx';
export { PorQue, type PorQueProps } from './PorQue.tsx';
export { Empty, type EmptyProps } from './Empty.tsx';

// Ação
export { Button, IconButton, cx, toHref, type ButtonProps, type IconButtonProps } from './Button.tsx';
export { Segmented, type SegmentedProps } from './Segmented.tsx';
export { Chips, type ChipsProps } from './Chips.tsx';
export { Toggle, type ToggleProps } from './Toggle.tsx';
export { Scale, type ScaleProps } from './Scale.tsx';
export { Stepper, type StepperProps } from './Stepper.tsx';
export {
  DateInput,
  Field,
  NumberInput,
  TextArea,
  TextInput,
  type DateInputProps,
  type FieldProps,
  type NumberInputProps,
  type TextAreaProps,
  type TextInputProps,
} from './Field.tsx';

// Retorno
export { Pill, Tag, type PillProps, type PillTone } from './Pill.tsx';
export { Sheet, type SheetProps } from './Sheet.tsx';
export { ToastHost, dismissToast, toast, type ToastOptions } from './Toast.tsx';

// Números e gráficos
export { Stat, StatRow, type StatDelta, type StatProps } from './Stat.tsx';
export { Ring, type RingProps } from './Ring.tsx';
export { Meter, ProgressBar, type MeterProps, type ProgressBarProps } from './Meter.tsx';
export { WeekStrip, type WeekStripDay, type WeekStripProps } from './WeekStrip.tsx';
export { Bars, type BarDatum, type BarsProps } from './Bars.tsx';
export { Legend, LineChart, type LegendItem, type LineChartProps, type LinePoint, type LineSeries } from './LineChart.tsx';
export { Spark, type SparkProps } from './Spark.tsx';
export { Heat, type HeatDay, type HeatProps } from './Heat.tsx';
export { IntensityChart, type IntensityChartProps } from './IntensityChart.tsx';
export { TimerRing, type TimerRingProps } from './TimerRing.tsx';
export { toneColor, useWidth, type AreaTone, type Tone } from './viz-util.ts';

// Boneco, foto do exercício e ícones
export { Figure, type FigureProps, type FigureTone } from './Figure.tsx';
export { ExMedia, type ExMediaProps } from './ExMedia.tsx';
export { ICON_NAMES, Icon, type IconName, type IconProps } from './Icon.tsx';
