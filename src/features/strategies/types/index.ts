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
  /** Ticket promedio general del cliente, sin acotar por segmento de producto. */
  ticketPromedio: number
  /** Ticket promedio del cliente dentro del segmento de producto de la estrategia. */
  ticketPromedioSegmento: number
  /** Compras por mes. */
  frecuenciaCompra: number
  ultimaCompra: string
  ultimaVisita?: string
  metaMin?: number
  metaMax?: number
  lat: number
  lng: number
  city: string
  channel: string
  subchannel: string
  /** Meses transcurridos desde `ultimaCompra`, precalculado para filtrar por la condición "Última Compra". */
  mesesUltimaCompra: number
  activo: boolean
  comproMesActual: boolean
  visitadoMesActual: boolean
  deuda: boolean
  mora: boolean
}

export interface PointsRule {
  id: string
  amountBs: number
  points: number
}
export const ClientIncentiveType = {
  PurchaseAmount: 'purchase_amount',
  Product: 'product',
} as const

export type ClientIncentiveType =
  (typeof ClientIncentiveType)[keyof typeof ClientIncentiveType]

export const ProductUnitType = {
  Unit: 'unit',
  Package: 'package',
} as const

export type ProductUnitType =
  (typeof ProductUnitType)[keyof typeof ProductUnitType]

export interface ProductPointsRule {
  id: string
  productId: string
  productCode: string
  productName: string
  unitType: ProductUnitType
  quantity: number
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
  /** yyyy-mm-dd */
  startDate: string
  /** yyyy-mm-dd — por defecto 3 meses después de `startDate`. */
  endDate: string
  productLevel: string
  /** Uno o más nodos de `productLevel` seleccionados (ej. Ketchup y Mostaza dentro de "Familia"). */
  productLevelValues: string[]
  productLevelA: string
  productLevelValuesA: string[]
  productLevelB: string
  productLevelValuesB: string[]
  city: string
  channel: string
  subchannel: string
  conditions: TargetingCondition[]
  /** Ids de clientes elegidos a mano dibujando un polígono en el mapa. null = usar el filtro automático. */
  selectedClientIds: string[] | null
  /** Ids quitados manualmente de la tabla de resultados (acción "Quitar cliente"), sin importar el modo de selección. */
  excludedClientIds: string[]
  /** Ids agregados manualmente con el buscador (ej. un cliente que cumple las condiciones pero quedó fuera del polígono). */
  manuallyAddedClientIds: string[]
  kpiPrincipal: string
  metaMinPercent: number
  metaMaxPercent: number
  actionTypes: ActionType[]
  actionDetail: string
  clientIncentiveEnabled: boolean
  clientIncentiveType: ClientIncentiveType
  pointsRules: PointsRule[]
  productPointsRules: ProductPointsRule[]
  pointsExpire: boolean
  pointsExpirationDate?: string
  employeeIncentiveEnabled: boolean
  complianceRules: ComplianceRule[]
  priceRuleIncentiveEnabled: boolean
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
