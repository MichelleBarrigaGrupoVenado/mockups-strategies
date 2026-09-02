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
}
