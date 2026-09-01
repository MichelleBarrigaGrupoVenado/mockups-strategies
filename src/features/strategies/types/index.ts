export const StrategyObjective = {
  IncreaseTicket: 'increase_ticket',
  IncreasePortfolio: 'increase_portfolio',
  RecoverCustomers: 'recover_customers',
  NewCustomers: 'new_customers',
  Other: 'other',
} as const
export type StrategyObjective = (typeof StrategyObjective)[keyof typeof StrategyObjective]

export const StrategyStatus = {
  Active: 'active',
  Evaluating: 'evaluating',
  Paused: 'paused',
  Draft: 'draft',
} as const
export type StrategyStatus = (typeof StrategyStatus)[keyof typeof StrategyStatus]

export const ActionType = {
  OfferProduct: 'offer_product',
  RecommendProducts: 'recommend_products',
  VisitClient: 'visit_client',
  SellProducts: 'sell_products',
  OfferPoints: 'offer_points',
  Other: 'other',
} as const
export type ActionType = (typeof ActionType)[keyof typeof ActionType]

export const ConditionOperator = {
  GreaterThan: 'gt',
  LessThan: 'lt',
  Equals: 'eq',
} as const
export type ConditionOperator = (typeof ConditionOperator)[keyof typeof ConditionOperator]

export const ConditionJoin = {
  And: 'AND',
  Or: 'OR',
} as const
export type ConditionJoin = (typeof ConditionJoin)[keyof typeof ConditionJoin]

export interface TargetingCondition {
  id: string
  field: string
  operator: ConditionOperator
  value: string
  join?: ConditionJoin
}

export interface TargetClient {
  id: string
  name: string
  ticketPromedio: number
  ultimaCompra: string
  ultimaVisita?: string
  metaMin?: number
  metaMax?: number
}

export interface PointsRule {
  id: string
  amountBs: number
  points: number
}

export interface ComplianceRule {
  id: string
  percent: number
  points: number
}

export interface StrategyWizardData {
  objective: StrategyObjective | null
  name: string
  description: string
  productLevel: string
  productLevelValue: string
  productLevelA?: string
  productLevelValueA?: string
  productLevelB?: string
  productLevelValueB?: string
  city: string
  channel: string
  conditions: TargetingCondition[]
  kpiPrincipal: string
  metaMinPercent: number
  metaMaxPercent: number
  actionType: ActionType | null
  actionDetail: string
  clientIncentiveEnabled: boolean
  pointsRules: PointsRule[]
  pointsExpire: boolean
  employeeIncentiveEnabled: boolean
  complianceRules: ComplianceRule[]
}

export interface StrategySummary {
  id: string
  name: string
  status: StrategyStatus
  objectiveLabel: string
  segmentLabel: string
  projectedImpactPercent: number
  roiEstimate?: number
  progressPercent?: number
}

export interface StrategyDetail {
  id: string
  name: string
  status: StrategyStatus
  dateRangeLabel: string
  objectiveDescription: string
  metrics: {
    clientesObjetivo: number
    contactados: number
    reactivados: number
    tasaRecompra: number
    ventasAtribuibles: number
    ganancia: number
    roi: number
    venadoMoneyGenerado: number
  }
  impactChart: { label: string; value: number }[]
  impactDeltaPercent: number
  impactNote: string
}
