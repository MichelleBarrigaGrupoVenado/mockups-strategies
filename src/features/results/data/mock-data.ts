import { StrategyStatus } from '@/features/strategies/types'
import type { FinancialBreakdownRow, ResultStrategyDetail, ResultStrategySummary } from '@/features/results/types'

export const mockResultSummaries: ResultStrategySummary[] = [
  {
    id: 'campana-reactivacion-zona-norte',
    name: 'Campaña Reactivación Zona Norte',
    status: StrategyStatus.Active,
    objectiveLabel: 'Incrementar recompra',
    segmentLabel: 'Clientes > 60 días sin compra',
    projectedImpactPercent: 15.8,
    roiEstimate: 4.2,
  },
  {
    id: 'incremento-de-portafolio',
    name: 'Incremento de portafolio',
    status: StrategyStatus.Active,
    objectiveLabel: 'Aumentar productos por cliente',
    segmentLabel: 'Clientes < 5 categorías',
    projectedImpactPercent: 11.2,
    progressPercent: 75,
  },
]

const zonaNorteByMonth: FinancialBreakdownRow[] = [
  { label: 'Enero', ventasBs: 5235.0, costoBs: 2510.0, gananciaBs: 2725.0, gananciaPercent: 52.1 },
  { label: 'Febrero', ventasBs: 6752.0, costoBs: 3250.0, gananciaBs: 3002.0, gananciaPercent: 48.0 },
  { label: 'Marzo', ventasBs: 8580.0, costoBs: 1250.0, gananciaBs: 7330.0, gananciaPercent: 85.4 },
  { label: 'Abril', ventasBs: 6750.0, costoBs: 1251.0, gananciaBs: 4999.0, gananciaPercent: 80.0 },
  { label: 'Mayo', ventasBs: 4250.0, costoBs: 2152.0, gananciaBs: 2098.0, gananciaPercent: 49.4 },
  { label: 'Junio', ventasBs: 9625.0, costoBs: 6250.0, gananciaBs: 3375.0, gananciaPercent: 35.1 },
  { label: 'Julio', ventasBs: 8543.0, costoBs: 7552.0, gananciaBs: 991.0, gananciaPercent: 11.6 },
  { label: 'Agosto', ventasBs: 9272.0, costoBs: 4251.0, gananciaBs: 5021.0, gananciaPercent: 54.2 },
  { label: 'Septiembre', ventasBs: 8546.0, costoBs: 2512.0, gananciaBs: 6034.0, gananciaPercent: 70.6 },
  { label: 'Octubre', ventasBs: 6854.0, costoBs: 2214.0, gananciaBs: 4640.0, gananciaPercent: 67.7 },
  { label: 'Noviembre', ventasBs: 5202.0, costoBs: 2420.0, gananciaBs: 2782.0, gananciaPercent: 53.5 },
  { label: 'Diciembre', ventasBs: 4240.0, costoBs: 1741.0, gananciaBs: 2499.0, gananciaPercent: 58.9 },
]

const zonaNorteByProduct: FinancialBreakdownRow[] = [
  { label: 'Ketchup 500g', ventasBs: 18420.0, costoBs: 7850.0, gananciaBs: 10570.0, gananciaPercent: 57.4 },
  { label: 'Mayonesa 400g', ventasBs: 15230.0, costoBs: 6980.0, gananciaBs: 8250.0, gananciaPercent: 54.2 },
  { label: 'Aceite Vegetal 1L', ventasBs: 21870.0, costoBs: 13120.0, gananciaBs: 8750.0, gananciaPercent: 40.0 },
  { label: 'Cereal de Maíz 400g', ventasBs: 9640.0, costoBs: 4210.0, gananciaBs: 5430.0, gananciaPercent: 56.3 },
  { label: 'Detergente en Polvo 1kg', ventasBs: 12980.0, costoBs: 7340.0, gananciaBs: 5640.0, gananciaPercent: 43.5 },
  { label: 'Refresco en Polvo 15g', ventasBs: 6890.0, costoBs: 2650.0, gananciaBs: 4240.0, gananciaPercent: 61.5 },
]

const portafolioByMonth: FinancialBreakdownRow[] = zonaNorteByMonth.map((row) => ({
  ...row,
  ventasBs: Math.round(row.ventasBs * 0.62),
  costoBs: Math.round(row.costoBs * 0.68),
  gananciaBs: Math.round(row.ventasBs * 0.62 - row.costoBs * 0.68),
  gananciaPercent: Math.round(((row.ventasBs * 0.62 - row.costoBs * 0.68) / (row.ventasBs * 0.62)) * 1000) / 10,
}))

const portafolioByProduct: FinancialBreakdownRow[] = zonaNorteByProduct.map((row) => ({
  ...row,
  ventasBs: Math.round(row.ventasBs * 0.55),
  costoBs: Math.round(row.costoBs * 0.6),
  gananciaBs: Math.round(row.ventasBs * 0.55 - row.costoBs * 0.6),
  gananciaPercent: Math.round(((row.ventasBs * 0.55 - row.costoBs * 0.6) / (row.ventasBs * 0.55)) * 1000) / 10,
}))

export const mockResultDetails: Record<string, ResultStrategyDetail> = {
  'campana-reactivacion-zona-norte': {
    id: 'campana-reactivacion-zona-norte',
    name: 'Campaña Reactivación Zona Norte',
    status: StrategyStatus.Active,
    objectiveLabel: 'Incrementar Ventas',
    segmentLabel: 'Clientes Inactivos (90+ días)',
    dateRangeLabel: '01 Oct - 31 Oct 2023',
    beforeAfter: {
      beneficioNetoBs: 180000,
      beneficioNetoNote: 'Tras costos de implementación',
      roi: 4.6,
      rows: [
        { metric: 'Ventas Totales', before: 'Bs 1.2M', after: 'Bs 1.45M', variationPercent: 20.8 },
        { metric: 'Ticket Promedio', before: 'Bs 150', after: 'Bs 165', variationPercent: 10.0 },
        { metric: 'Clientes Activos', before: '8,000', after: '8,787', variationPercent: 9.8 },
      ],
      funnel: [
        { label: 'Ventas Esperadas', value: 'Bs 1.050.000', description: 'Base de proyección (Control)' },
        { label: 'Ventas Observadas', value: 'Bs 1.280.000', description: 'Realidad post-intervención' },
        { label: 'Incremento Atribuible', value: 'Bs 230.000', description: 'Valor generado directo' },
      ],
    },
    abTest: {
      liftPercent: 25,
      incrementalBenefitBs: 45000,
      confidenceLevel: 95,
      isSignificant: true,
      comparisonRows: [
        { kpi: 'Ventas', control: 'Bs 180K', treatment: 'Bs 225K', incrementalPercent: 25 },
        { kpi: 'Ticket promedio', control: 'Bs 120', treatment: 'Bs 138', incrementalPercent: 15 },
        { kpi: 'Clientes activos', control: '1,000', treatment: '1,000', incrementalPercent: 0 },
      ],
      groups: [
        { key: 'A', label: 'Grupo A', tag: 'Recibe estrategia', clients: 624, liftPercent: 18.4 },
        { key: 'B', label: 'Grupo B', tag: 'Control', clients: 624, liftPercent: 7.1 },
      ],
    },
    statisticalModel: {
      attributableBenefitBs: 72500,
      benefitIncreasePercent: 18.7,
      confidenceIntervalBs: [61000, 84000],
      confidenceLevel: 95,
      salesIncreasePercent: 20,
      byMonth: zonaNorteByMonth,
      byProduct: zonaNorteByProduct,
      summary: { revenueBs: 182500, costBs: 110000, attributableBenefitBs: 72500 },
    },
  },
  'incremento-de-portafolio': {
    id: 'incremento-de-portafolio',
    name: 'Incremento de portafolio',
    status: StrategyStatus.Active,
    objectiveLabel: 'Aumentar productos por cliente',
    segmentLabel: 'Clientes < 5 categorías',
    dateRangeLabel: '01 Jul - 30 Sep 2023',
    beforeAfter: {
      beneficioNetoBs: 96000,
      beneficioNetoNote: 'Tras costos de implementación',
      roi: 3.1,
      rows: [
        { metric: 'Productos por Cliente', before: '3.2', after: '4.1', variationPercent: 28.1 },
        { metric: 'Ticket Promedio', before: 'Bs 128', after: 'Bs 149', variationPercent: 16.4 },
        { metric: 'Clientes Activos', before: '5,400', after: '5,690', variationPercent: 5.4 },
      ],
      funnel: [
        { label: 'Ventas Esperadas', value: 'Bs 690.000', description: 'Base de proyección (Control)' },
        { label: 'Ventas Observadas', value: 'Bs 812.000', description: 'Realidad post-intervención' },
        { label: 'Incremento Atribuible', value: 'Bs 122.000', description: 'Valor generado directo' },
      ],
    },
    abTest: {
      liftPercent: 16,
      incrementalBenefitBs: 24500,
      confidenceLevel: 92,
      isSignificant: true,
      comparisonRows: [
        { kpi: 'Ventas', control: 'Bs 210K', treatment: 'Bs 244K', incrementalPercent: 16 },
        { kpi: 'Ticket promedio', control: 'Bs 128', treatment: 'Bs 149', incrementalPercent: 16.4 },
        { kpi: 'Clientes activos', control: '820', treatment: '820', incrementalPercent: 0 },
      ],
      groups: [
        { key: 'A', label: 'Grupo A', tag: 'Recibe estrategia', clients: 410, liftPercent: 12.6 },
        { key: 'B', label: 'Grupo B', tag: 'Control', clients: 410, liftPercent: 4.8 },
      ],
    },
    statisticalModel: {
      attributableBenefitBs: 41200,
      benefitIncreasePercent: 12.3,
      confidenceIntervalBs: [34500, 48000],
      confidenceLevel: 92,
      salesIncreasePercent: 13.5,
      byMonth: portafolioByMonth,
      byProduct: portafolioByProduct,
      summary: { revenueBs: 118400, costBs: 77200, attributableBenefitBs: 41200 },
    },
  },
}
