import type {
  EmployeeIncentiveRow,
  IncentivePeriodRow,
  IncentivesResult,
  PriceRuleIncentive,
} from '@/features/results/types'

/** Mes de una regla de precio tal como se autora: sólo aplicadas y pendientes; lo otorgado se deriva. */
interface RawPriceRuleMonth {
  label: string
  used: number
  pending: number
  usedBs: number
  pendingBs: number
}

interface RawPriceRule {
  id: string
  name: string
  description: string
  clients: number
  byMonth: RawPriceRuleMonth[]
}

/** Mes de puntos tal como se autora: emitidos y canjeados; lo pendiente y los Bs se derivan. */
interface RawPointsMonth {
  label: string
  granted: number
  used: number
}

interface RawIncentives {
  bsPerPoint: number
  points: RawPointsMonth[]
  redemption: { averageRedemptionDays: number; onTimeRedemptionPercent: number; policyNote: string }
  priceRules: RawPriceRule[]
  employees: EmployeeIncentiveRow[]
}

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0)
const round1 = (value: number) => Math.round(value * 10) / 10
const round2 = (value: number) => Math.round(value * 100) / 100

/**
 * Deriva todos los agregados de la pestaña de incentivos a partir de las filas base, de modo que
 * los totales de las tarjetas, los gráficos, las reglas y la tabla de empleados no puedan
 * desincronizarse entre sí al editar el mock.
 */
function buildIncentives(raw: RawIncentives): IncentivesResult {
  const byMonth: IncentivePeriodRow[] = raw.points.map((month) => {
    const pending = month.granted - month.used
    return {
      label: month.label,
      granted: month.granted,
      used: month.used,
      pending,
      grantedBs: round2(month.granted * raw.bsPerPoint),
      usedBs: round2(month.used * raw.bsPerPoint),
      pendingBs: round2(pending * raw.bsPerPoint),
    }
  })

  const pointsGranted = sum(byMonth.map((m) => m.granted))
  const pointsUsed = sum(byMonth.map((m) => m.used))
  const pointsPending = pointsGranted - pointsUsed

  const rulesWithTotals = raw.priceRules.map((rule) => {
    const months: IncentivePeriodRow[] = rule.byMonth.map((month) => ({
      label: month.label,
      granted: month.used + month.pending,
      used: month.used,
      pending: month.pending,
      grantedBs: round2(month.usedBs + month.pendingBs),
      usedBs: month.usedBs,
      pendingBs: month.pendingBs,
    }))
    return {
      rule,
      months,
      applications: sum(months.map((m) => m.used)),
      benefitBs: round2(sum(months.map((m) => m.usedBs))),
    }
  })

  const priceRulesBenefitBs = round2(sum(rulesWithTotals.map((r) => r.benefitBs)))
  const priceRulesApplications = sum(rulesWithTotals.map((r) => r.applications))
  const priceRulesClients = sum(raw.priceRules.map((rule) => rule.clients))

  const priceRules: PriceRuleIncentive[] = rulesWithTotals.map(({ rule, months, applications, benefitBs }) => ({
    id: rule.id,
    name: rule.name,
    description: rule.description,
    clients: rule.clients,
    applications,
    benefitBs,
    sharePercent: priceRulesBenefitBs === 0 ? 0 : round1((benefitBs / priceRulesBenefitBs) * 100),
    byMonth: months,
  }))

  const monthLabels = raw.priceRules[0]?.byMonth.map((month) => month.label) ?? []
  const priceRulesByMonth: IncentivePeriodRow[] = monthLabels.map((label) => {
    const rows = priceRules.flatMap((rule) => rule.byMonth.filter((month) => month.label === label))
    return {
      label,
      granted: sum(rows.map((r) => r.granted)),
      used: sum(rows.map((r) => r.used)),
      pending: sum(rows.map((r) => r.pending)),
      grantedBs: round2(sum(rows.map((r) => r.grantedBs))),
      usedBs: round2(sum(rows.map((r) => r.usedBs))),
      pendingBs: round2(sum(rows.map((r) => r.pendingBs))),
    }
  })

  const pointsGrantedBs = round2(pointsGranted * raw.bsPerPoint)
  const pointsUsedBs = round2(pointsUsed * raw.bsPerPoint)
  const pointsPendingBs = round2(pointsPending * raw.bsPerPoint)

  return {
    bsPerPoint: raw.bsPerPoint,
    pointsGranted,
    pointsUsed,
    pointsPending,
    pointsGrantedBs,
    pointsUsedBs,
    pointsPendingBs,
    utilizationPercent: pointsGranted === 0 ? 0 : round1((pointsUsed / pointsGranted) * 100),
    priceRulesBenefitBs,
    priceRulesApplications,
    priceRulesClients,
    priceRulesAverageBenefitBs: priceRulesClients === 0 ? 0 : round2(priceRulesBenefitBs / priceRulesClients),
    totalIncentivesBs: round2(pointsGrantedBs + priceRulesBenefitBs),
    redeemedIncentivesBs: round2(pointsUsedBs + priceRulesBenefitBs),
    byMonth,
    priceRulesByMonth,
    redemption: {
      averageRedemptionDays: raw.redemption.averageRedemptionDays,
      onTimeRedemptionPercent: raw.redemption.onTimeRedemptionPercent,
      remainingLiabilityBs: pointsPendingBs,
      policyNote: raw.redemption.policyNote,
    },
    priceRules,
    employees: raw.employees,
  }
}

export const zonaNorteIncentives = buildIncentives({
  bsPerPoint: 0.1,
  points: [
    { label: 'Enero', granted: 28_000, used: 18_500 },
    { label: 'Febrero', granted: 30_000, used: 19_500 },
    { label: 'Marzo', granted: 38_000, used: 26_000 },
    { label: 'Abril', granted: 29_000, used: 18_500 },
  ],
  redemption: {
    averageRedemptionDays: 8.4,
    onTimeRedemptionPercent: 91.2,
    policyNote: 'Los puntos expiran a los 60 días calendario desde la fecha de emisión.',
  },
  priceRules: [
    {
      id: 'salsa-tomate-2x1',
      name: '2×1 Salsa Tomate Especial',
      description: 'Bonificación directa por paquete cerrado en Zona Norte',
      clients: 125,
      byMonth: [
        { label: 'Enero', used: 36, pending: 9, usedBs: 768, pendingBs: 192 },
        { label: 'Febrero', used: 38, pending: 10, usedBs: 811, pendingBs: 213 },
        { label: 'Marzo', used: 42, pending: 11, usedBs: 896, pendingBs: 235 },
        { label: 'Abril', used: 34, pending: 10, usedBs: 725, pendingBs: 213 },
      ],
    },
  ],
  employees: [
    { id: 'carlos-mendez', name: 'Carlos Méndez', role: 'Vendedor', pointsEarned: 30_000, pointsRedeemed: 21_000, priceRulesBs: 1480 },
    { id: 'mariana-rojas', name: 'Mariana Rojas', role: 'Vendedora', pointsEarned: 26_000, pointsRedeemed: 19_500, priceRulesBs: 1640 },
    { id: 'roberto-flores', name: 'Roberto Flores', role: 'Vendedor', pointsEarned: 22_500, pointsRedeemed: 12_400, priceRulesBs: 2180 },
    { id: 'patricia-vaca', name: 'Patricia Vaca', role: 'Supervisora', pointsEarned: 18_000, pointsRedeemed: 15_300, priceRulesBs: 900 },
    { id: 'luis-chavez', name: 'Luis Chávez', role: 'Vendedor', pointsEarned: 15_500, pointsRedeemed: 9300, priceRulesBs: 320 },
    { id: 'andrea-quiroga', name: 'Andrea Quiroga', role: 'Preventista', pointsEarned: 13_000, pointsRedeemed: 5000, priceRulesBs: 320 },
  ],
})

export const portafolioIncentives = buildIncentives({
  bsPerPoint: 0.1,
  points: [
    { label: 'Julio', granted: 22_000, used: 13_200 },
    { label: 'Agosto', granted: 26_000, used: 16_900 },
    { label: 'Septiembre', granted: 24_000, used: 15_400 },
  ],
  redemption: {
    averageRedemptionDays: 9.6,
    onTimeRedemptionPercent: 87.4,
    policyNote: 'Los puntos expiran a los 60 días calendario desde la fecha de emisión.',
  },
  priceRules: [
    {
      id: 'cereal-3x2',
      name: '3×2 Cereal de Maíz 400g',
      description: 'Bonificación por incorporar la categoría desayunos',
      clients: 68,
      byMonth: [
        { label: 'Julio', used: 22, pending: 6, usedBs: 704, pendingBs: 192 },
        { label: 'Agosto', used: 26, pending: 7, usedBs: 832, pendingBs: 224 },
        { label: 'Septiembre', used: 24, pending: 6, usedBs: 768, pendingBs: 192 },
      ],
    },
    {
      id: 'detergente-descuento-8',
      name: 'Descuento 8% Detergente en Polvo 1kg',
      description: 'Descuento por ampliar el mix de limpieza',
      clients: 41,
      byMonth: [
        { label: 'Julio', used: 12, pending: 4, usedBs: 396, pendingBs: 132 },
        { label: 'Agosto', used: 15, pending: 4, usedBs: 495, pendingBs: 132 },
        { label: 'Septiembre', used: 13, pending: 3, usedBs: 429, pendingBs: 99 },
      ],
    },
  ],
  employees: [
    { id: 'carlos-mendez', name: 'Carlos Méndez', role: 'Vendedor', pointsEarned: 20_000, pointsRedeemed: 11_300, priceRulesBs: 1180 },
    { id: 'mariana-rojas', name: 'Mariana Rojas', role: 'Vendedora', pointsEarned: 17_500, pointsRedeemed: 11_400, priceRulesBs: 980 },
    { id: 'roberto-flores', name: 'Roberto Flores', role: 'Vendedor', pointsEarned: 14_500, pointsRedeemed: 9100, priceRulesBs: 764 },
    { id: 'patricia-vaca', name: 'Patricia Vaca', role: 'Supervisora', pointsEarned: 11_000, pointsRedeemed: 8500, priceRulesBs: 460 },
    { id: 'luis-chavez', name: 'Luis Chávez', role: 'Vendedor', pointsEarned: 9000, pointsRedeemed: 5200, priceRulesBs: 240 },
  ],
})
