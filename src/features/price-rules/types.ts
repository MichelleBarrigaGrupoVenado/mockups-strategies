// Modelo de datos portado de https://github.com/leotorricovenado/pricerules-mockups
// (src/features/price-rules/types.ts) — motor de reglas de precio real de Grupo Venado. Se omiten
// los campos que ese repo usa para su propio flujo de aprobación/listado (id, status, approvalStatus,
// createdBy/createdAt/updatedAt, bonusProduct deprecado, optionalProducts a nivel de regla) porque acá
// una regla vive embebida en el wizard de estrategias, no en un CRUD propio con backend.

export type OutcomeMode = 'SCALE' | 'FREQUENCY' | 'SINGLE' | 'ACCUMULATED'
export type RuleType = 'GENERAL' | 'RESTRICTED' | 'RESTRICTED_QUANTITY'
export type TargetEnum = 'SALE_ORDER' | 'PRODUCT'
export type OutcomeType = 'DISCOUNT_PERCENTAGE' | 'DISCOUNT_AMOUNT' | 'FIXED_PRICE' | 'PRODUCT' | 'PRODUCT_SURCHARGE'
export type ScaleType = 'QUANTITY' | 'AMOUNT'
export type ExclusiveOutcome = 'NONE' | 'OUTCOME_TYPE' // Acumulable / No Acumulable
export type PaymentCondition = 'TODOS' | 'CASH' | 'CREDIT' | 'CREDIT_ON_DELIVERY'
export type Company = 'VEMASSA' | 'IVSA' | 'FACRULESA'

export type CriteriaElementType = 'UNIVERSAL' | 'PROPIETARIO' | 'CLIENTE' | 'CANAL_VENTA' | 'SUBCANAL' | 'RUTA' | 'VENDEDOR'

export type SpecificElementType = 'UNIVERSAL' | 'DIVISION' | 'MARCA' | 'CATEGORIA' | 'FAMILIA' | 'SUB_FAMILIA' | 'PRODUCTO'

export interface CriteriaRow {
  id: string
  type: CriteriaElementType
  code: string
  name: string
  // Solo para type === "RUTA": al elegir Ruta, un segundo dropdown obliga a fijar también su Canal
  // de Venta (una ruta por sí sola es ambigua entre canales).
  saleChannelId?: number
  saleChannelCode?: string
  saleChannelName?: string
}

export interface SpecificRow {
  id: string
  type: SpecificElementType
  code: string
  name: string
  unit?: string
  // Solo cuando ruleType === "RESTRICTED_QUANTITY" y type === "PRODUCTO" — cuántas unidades de ESTE
  // producto puntual exige la regla, no solo su presencia en el pedido.
  requiredQty?: number
}

export interface ScaleRow {
  id: string
  from: number
  to: number | null // null = "Este valor no tiene límite"
  value?: number // sin valor numérico para Bonificación/Recargo — el resultado son productos, no un monto
  outcomeType?: OutcomeType // el Tipo de Resultado vigente al momento de adicionar la escala
}

export interface OptionalProductRow {
  id: string
  code: string
  name: string
  unit: string
  qty: number
}

// Fila de "Bonificación de Productos" / "Recargo por producto": a diferencia de un producto de
// Criterios Específicos, acá la unidad SÍ se elige (dentro de la cadena de empaque del producto).
// `optionalProducts` son las equivalencias intercambiables de ESTE producto puntual — solo tiene
// sentido para Bonificación (un Recargo no tiene "regalo" que sustituir).
export interface OutcomeProductRow {
  id: string
  code: string
  name: string
  unit: string
  qty: number
  optionalProducts?: OptionalProductRow[]
}

export interface AccumulationScopeRef {
  code: string
  name: string
}

export type AccumulationScope = 'TOTAL' | 'MARCA' | 'FAMILIA' | 'CATEGORIA' | 'PRODUCTO'

/** Todo lo que el formulario de creación/edición de una regla de precios llega a completar. */
export interface PriceRuleDraft {
  company: Company
  name: string
  description: string
  fromDate: string // ISO yyyy-mm-dd
  thruDate: string // ISO yyyy-mm-dd — obligatorio, la vigencia no puede quedar sin límite
  outcomeMode: OutcomeMode
  applyOnlyOnce: boolean
  exclusiveOutcome: ExclusiveOutcome

  // Panel "Criterios Generales"
  distributorIds: number[]
  warehouseIds: number[]
  paymentCondition: PaymentCondition

  // Panel "Criterios de la Regla" (el "quién")
  criteriaRows: CriteriaRow[]

  // Panel "Criterios Específicos" (el "sobre qué producto")
  ruleType: RuleType
  specificRows: SpecificRow[]

  // Panel "Configuración del Resultado Esperado"
  target: TargetEnum
  outcomeType: OutcomeType
  value?: number // Tradicional/Frecuencia/Acumulado con resultado numérico (%, monto o precio fijo)
  scaleType?: ScaleType // Tipo de Validación — cuando outcomeMode es SCALE o FREQUENCY
  scales?: ScaleRow[] // solo si outcomeMode === SCALE
  frequency?: number // solo si outcomeMode === FREQUENCY

  // Solo si outcomeMode === "ACCUMULATED". El "quién" sigue siendo Criterios de la Regla como
  // cualquier otro modo — esto define sobre qué se suma el histórico y cuánto hay que superar. La
  // sumatoria siempre agrupa por Dueño (no configurable a otra granularidad).
  accumulationScope?: AccumulationScope
  accumulationScopeRef?: AccumulationScopeRef // qué marca/familia/categoría/producto — vacío si scope es TOTAL
  accumulationFromDate?: string // ISO yyyy-mm-dd
  accumulationToDate?: string // ISO yyyy-mm-dd
  accumulationThreshold?: number // monto en Bs que el Dueño debe superar para que la regla se active

  outcomeProducts?: OutcomeProductRow[] // Bonificación de Productos / Recargo por producto (múltiples filas)
}

export function emptyPriceRuleDraft(): PriceRuleDraft {
  return {
    company: 'VEMASSA',
    name: '',
    description: '',
    fromDate: '',
    thruDate: '',
    outcomeMode: 'SINGLE',
    applyOnlyOnce: false,
    exclusiveOutcome: 'NONE',
    distributorIds: [],
    warehouseIds: [],
    paymentCondition: 'TODOS',
    criteriaRows: [],
    ruleType: 'RESTRICTED',
    specificRows: [],
    target: 'PRODUCT',
    // Consistente con outcomeMode: "SINGLE" por defecto — Tradicional solo admite Bonificación de
    // Productos y Recargo por producto.
    outcomeType: 'PRODUCT',
    value: undefined,
    scaleType: 'QUANTITY',
    scales: [],
    frequency: undefined,
    outcomeProducts: [],
  }
}
