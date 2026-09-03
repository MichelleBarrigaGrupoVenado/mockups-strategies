import { ConditionJoin, ConditionOperator, StrategyObjective, type TargetingCondition } from '@/features/strategies/types'

export const ConditionFieldKind = {
  /** >, <, =, contra un monto numérico ingresado libremente. */
  Numeric: 'numeric',
  /** >, <, =, contra un valor seleccionado (3/6/12 meses). */
  Months: 'months',
  /** Checkbox: sin operador, solo exige que la propiedad sea verdadera. */
  Boolean: 'boolean',
} as const
export type ConditionFieldKind = (typeof ConditionFieldKind)[keyof typeof ConditionFieldKind]

export interface ConditionFieldConfig {
  field: string
  kind: ConditionFieldKind
  /** Sufijo mostrado junto al input numérico (ej. "Bs"). Solo aplica a `Numeric`. */
  unit?: string
}

export const monthsOptions = [
  { value: '3', label: '3 meses' },
  { value: '6', label: '6 meses' },
  { value: '12', label: '12 meses' },
]

const defaultConditionFields: ConditionFieldConfig[] = [
  { field: 'Ventas históricas', kind: ConditionFieldKind.Numeric, unit: 'Bs' },
  { field: 'Cliente activo', kind: ConditionFieldKind.Boolean },
  { field: 'Frecuencia de compra', kind: ConditionFieldKind.Numeric },
  { field: 'Días sin comprar', kind: ConditionFieldKind.Numeric },
  { field: 'Categorías compradas', kind: ConditionFieldKind.Numeric },
]

const increaseTicketFields: ConditionFieldConfig[] = [
  { field: 'Ticket', kind: ConditionFieldKind.Numeric, unit: 'Bs' },
  { field: 'Última Compra', kind: ConditionFieldKind.Months },
  { field: 'Cliente Activo', kind: ConditionFieldKind.Boolean },
  { field: 'Compró en el mes actual', kind: ConditionFieldKind.Boolean },
  { field: 'Visitado en el mes actual', kind: ConditionFieldKind.Boolean },
]

const increasePortfolioFields: ConditionFieldConfig[] = [
  { field: 'Ticket promedio del Origen', kind: ConditionFieldKind.Numeric, unit: 'Bs' },
  { field: 'Última Compra del Origen', kind: ConditionFieldKind.Months },
  { field: 'Cliente Activo', kind: ConditionFieldKind.Boolean },
  { field: 'Compró en el mes actual', kind: ConditionFieldKind.Boolean },
  { field: 'Visitado en el mes actual', kind: ConditionFieldKind.Boolean },
]

const recoverCustomersFields: ConditionFieldConfig[] = [
  { field: 'Ticket', kind: ConditionFieldKind.Numeric, unit: 'Bs' },
  { field: 'Deuda', kind: ConditionFieldKind.Boolean },
  { field: 'Mora', kind: ConditionFieldKind.Boolean },
]

const conditionFieldsByObjective: Partial<Record<StrategyObjective, ConditionFieldConfig[]>> = {
  [StrategyObjective.IncreaseTicket]: increaseTicketFields,
  [StrategyObjective.IncreasePortfolio]: increasePortfolioFields,
  [StrategyObjective.RecoverCustomers]: recoverCustomersFields,
}

/** Campos de condición disponibles para el objetivo activo (o el set genérico si no aplica uno específico). */
export function getConditionFields(objective: StrategyObjective | null): ConditionFieldConfig[] {
  return (objective && conditionFieldsByObjective[objective]) || defaultConditionFields
}

function defaultValueForKind(kind: ConditionFieldKind): string {
  if (kind === ConditionFieldKind.Boolean) return 'false'
  if (kind === ConditionFieldKind.Months) return '3'
  return ''
}

/** Condición inicial coherente con el primer campo disponible para el objetivo dado. */
export function createDefaultCondition(objective: StrategyObjective | null): TargetingCondition {
  const [firstField] = getConditionFields(objective)

  return {
    id: crypto.randomUUID(),
    field: firstField.field,
    operator: ConditionOperator.GreaterThan,
    value: defaultValueForKind(firstField.kind),
    join: ConditionJoin.And,
  }
}
