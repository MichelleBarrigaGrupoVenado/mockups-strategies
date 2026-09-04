import { getProductOptions } from '@/features/strategies/data/product-hierarchy'
import type { FinancialBreakdownRow, StatisticalModelResult } from '@/features/results/types'

export interface SimulationInput {
  costosBs: number
  ventasBs: number
  durationMonths: number
  salesIncreasePercent: number
  confidenceLevel: number
}

export const DEFAULT_SIMULATION_INPUT: SimulationInput = {
  costosBs: 25000,
  ventasBs: 68000,
  durationMonths: 6,
  salesIncreasePercent: 18,
  confidenceLevel: 95,
}

/** Familias representativas (datos canónicos de `product-hierarchy.ts`) usadas como categorías del desglose "por producto". */
const PRODUCT_LABELS = getProductOptions('familia')
  .slice(0, 5)
  .map((option) => option.label)

/** Participación decreciente de cada producto sobre el total, tipo Pareto (suman 1). */
const PRODUCT_WEIGHTS = [0.32, 0.24, 0.18, 0.14, 0.12]

/** Ventas de una estrategia comercial suelen arrancar más bajas y crecer con la adopción del equipo. */
function salesRampWeights(months: number): number[] {
  if (months <= 1) return [1]
  const raw = Array.from({ length: months }, (_, i) => 0.7 + (0.6 * i) / (months - 1))
  const total = raw.reduce((sum, weight) => sum + weight, 0)
  return raw.map((weight) => weight / total)
}

/** Nombres de mes en español, empezando el mes siguiente al actual (mismo criterio que la fecha de inicio del wizard de estrategias). */
function monthLabels(months: number): string[] {
  const formatter = new Intl.DateTimeFormat('es-BO', { month: 'short' })
  const start = new Date()
  start.setDate(1)
  start.setMonth(start.getMonth() + 1)

  return Array.from({ length: months }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth() + i, 1)
    const label = formatter.format(date).replace('.', '')
    return label.charAt(0).toUpperCase() + label.slice(1)
  })
}

function toBreakdownRows(labels: string[], shares: number[], totalVentasBs: number, totalCostosBs: number): FinancialBreakdownRow[] {
  return labels.map((label, index) => {
    const ventasBs = Math.round(totalVentasBs * shares[index])
    const costoBs = Math.round(totalCostosBs * shares[index])
    const gananciaBs = ventasBs - costoBs
    const gananciaPercent = ventasBs > 0 ? Math.round((gananciaBs / ventasBs) * 100) : 0
    return { label, ventasBs, costoBs, gananciaBs, gananciaPercent }
  })
}

/** Ganancia neta = Ventas − Costos, y ROI = Ganancia neta / Costos. Nunca se piden por separado: se derivan siempre de Costos y Ventas para que los cuatro números sean siempre consistentes entre sí. */
export function calculateGananciaYRoi(costosBs: number, ventasBs: number) {
  const gananciaNetaBs = ventasBs - costosBs
  const roi = costosBs > 0 ? (gananciaNetaBs / costosBs) * 100 : 0
  return { gananciaNetaBs, roi }
}

/** Proyecta el "Modelo Estadístico" (mismo shape que usa la pantalla de Resultados) a partir de los parámetros de la simulación. */
export function simulateStatisticalModel(input: SimulationInput): StatisticalModelResult {
  const { costosBs, ventasBs, durationMonths, salesIncreasePercent, confidenceLevel } = input
  const { gananciaNetaBs } = calculateGananciaYRoi(costosBs, ventasBs)

  const byMonth = toBreakdownRows(monthLabels(durationMonths), salesRampWeights(durationMonths), ventasBs, costosBs)
  const byProduct = toBreakdownRows(PRODUCT_LABELS, PRODUCT_WEIGHTS, ventasBs, costosBs)

  const margin = Math.round(Math.abs(gananciaNetaBs) * 0.15)

  return {
    attributableBenefitBs: Math.round(gananciaNetaBs),
    benefitIncreasePercent: Math.round(salesIncreasePercent),
    confidenceIntervalBs: [Math.round(gananciaNetaBs - margin), Math.round(gananciaNetaBs + margin)],
    confidenceLevel,
    salesIncreasePercent: Math.round(salesIncreasePercent),
    byMonth,
    byProduct,
    summary: { revenueBs: ventasBs, costBs: costosBs, attributableBenefitBs: Math.round(gananciaNetaBs) },
  }
}
