import type { StrategyStatus } from '@/features/strategies/types'

export interface ResultStrategySummary {
  id: string
  name: string
  status: StrategyStatus
  objectiveLabel: string
  segmentLabel: string
  projectedImpactPercent: number
  roiEstimate?: number
  progressPercent?: number
}

export interface AttributionRow {
  metric: string
  before: string
  after: string
  variationPercent: number
}

export interface AttributionFunnelStep {
  label: string
  value: string
  description: string
}

export interface BeforeAfterResult {
  beneficioNetoBs: number
  beneficioNetoNote: string
  roi: number
  rows: AttributionRow[]
  funnel: AttributionFunnelStep[]
}

export interface ABTestGroup {
  key: 'A' | 'B'
  label: string
  tag: string
  clients: number
  liftPercent: number
}

export interface ABTestComparisonRow {
  kpi: string
  control: string
  treatment: string
  incrementalPercent: number
}

export interface ABTestResult {
  liftPercent: number
  incrementalBenefitBs: number
  confidenceLevel: number
  isSignificant: boolean
  comparisonRows: ABTestComparisonRow[]
  groups: ABTestGroup[]
}

export const StatisticalModelView = {
  ByMonth: 'by_month',
  ByProduct: 'by_product',
} as const
export type StatisticalModelView = (typeof StatisticalModelView)[keyof typeof StatisticalModelView]

/** Fila genérica de la tabla financiera: `label` es el mes o el producto según la vista activa. */
export interface FinancialBreakdownRow {
  label: string
  ventasBs: number
  costoBs: number
  gananciaBs: number
  gananciaPercent: number
}

export interface StatisticalModelResult {
  attributableBenefitBs: number
  benefitIncreasePercent: number
  confidenceIntervalBs: [number, number]
  confidenceLevel: number
  salesIncreasePercent: number
  byMonth: FinancialBreakdownRow[]
  byProduct: FinancialBreakdownRow[]
  summary: { revenueBs: number; costBs: number; attributableBenefitBs: number }
}

export interface ResultStrategyDetail {
  id: string
  name: string
  status: StrategyStatus
  objectiveLabel: string
  segmentLabel: string
  dateRangeLabel: string
  beforeAfter: BeforeAfterResult
  abTest: ABTestResult
  statisticalModel: StatisticalModelResult
  incentives: IncentivesResult
}

export const IncentiveUnit = {
  Primary: 'primary',
  Bs: 'bs',
} as const
export type IncentiveUnit = (typeof IncentiveUnit)[keyof typeof IncentiveUnit]

export const IncentiveSeries = {
  Granted: 'granted',
  Used: 'used',
  Pending: 'pending',
} as const
export type IncentiveSeries = (typeof IncentiveSeries)[keyof typeof IncentiveSeries]

export const EmployeeIncentiveSort = {
  TotalValue: 'total_value',
  Points: 'points',
  Utilization: 'utilization',
} as const
export type EmployeeIncentiveSort = (typeof EmployeeIncentiveSort)[keyof typeof EmployeeIncentiveSort]

/**
 * Fila mensual de un gráfico de incentivos. `granted`/`used`/`pending` van en la unidad primaria
 * de la serie (puntos para Venado Money, aplicaciones para reglas de precio) y los campos `*Bs`
 * son el equivalente monetario de esa misma fila.
 */
export interface IncentivePeriodRow {
  label: string
  granted: number
  used: number
  pending: number
  grantedBs: number
  usedBs: number
  pendingBs: number
}

export interface PriceRuleIncentive {
  id: string
  name: string
  description: string
  /** Clientes distintos que recibieron la regla. */
  clients: number
  /** Aplicaciones efectivas de la regla (suma de `used` en `byMonth`). */
  applications: number
  /** Beneficio entregado en Bs (suma de `usedBs` en `byMonth`). */
  benefitBs: number
  /** Participación de `benefitBs` sobre el beneficio total de todas las reglas. */
  sharePercent: number
  byMonth: IncentivePeriodRow[]
}

export interface EmployeeIncentiveRow {
  id: string
  name: string
  role: string
  pointsEarned: number
  pointsRedeemed: number
  priceRulesBs: number
}

export interface RedemptionBehavior {
  averageRedemptionDays: number
  onTimeRedemptionPercent: number
  /** Bs equivalentes a los puntos emitidos que siguen sin canjearse. */
  remainingLiabilityBs: number
  policyNote: string
}

export interface IncentivesResult {
  /** Regla de conversión del programa: cuántos Bs vale un punto. */
  bsPerPoint: number
  pointsGranted: number
  pointsUsed: number
  pointsPending: number
  pointsGrantedBs: number
  pointsUsedBs: number
  pointsPendingBs: number
  utilizationPercent: number
  priceRulesBenefitBs: number
  priceRulesApplications: number
  priceRulesClients: number
  priceRulesAverageBenefitBs: number
  totalIncentivesBs: number
  redeemedIncentivesBs: number
  byMonth: IncentivePeriodRow[]
  priceRulesByMonth: IncentivePeriodRow[]
  redemption: RedemptionBehavior
  priceRules: PriceRuleIncentive[]
  employees: EmployeeIncentiveRow[]
}
