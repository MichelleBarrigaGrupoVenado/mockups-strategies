import { StrategyObjective, StrategyStatus, type StrategyDetail, type StrategySummary, type TargetClient } from '@/features/strategies/types'

export const mockTargetClients: TargetClient[] = [
  { id: 'c1', name: 'María López', ticketPromedio: 1250, ultimaCompra: '2026-08-15', metaMin: 1375, metaMax: 1500 },
  { id: 'c2', name: 'Carlos Mendoza', ticketPromedio: 980, ultimaCompra: '2026-08-12', ultimaVisita: '2026-08-12', metaMin: 1020, metaMax: 1100 },
  { id: 'c3', name: 'Ana Gutiérrez', ticketPromedio: 2100, ultimaCompra: '2026-08-10', ultimaVisita: '2026-08-10', metaMin: 2310, metaMax: 2400 },
  { id: 'c4', name: 'José Ramírez', ticketPromedio: 750, ultimaCompra: '2026-08-08', ultimaVisita: '2026-08-08', metaMin: 830, metaMax: 900 },
  { id: 'c5', name: 'Laura Fernández', ticketPromedio: 1500, ultimaCompra: '2026-08-05', ultimaVisita: '2026-08-05', metaMin: 1650, metaMax: 1700 },
]

export const mockStrategySummaries: StrategySummary[] = [
  {
    id: 'recuperacion-clientes-inactivos',
    name: 'Recuperación de clientes inactivos',
    status: StrategyStatus.Active,
    objectiveLabel: 'Incrementar recompra',
    segmentLabel: 'Clientes > 60 días sin compra',
    projectedImpactPercent: 15.8,
    roiEstimate: 4.2,
  },
  {
    id: 'incremento-portafolio',
    name: 'Incremento de portafolio',
    status: StrategyStatus.Active,
    objectiveLabel: 'Aumentar productos por cliente',
    segmentLabel: 'Clientes < 5 categorías',
    projectedImpactPercent: 11.2,
    progressPercent: 75,
  },
  {
    id: 'incremento-ticket',
    name: 'Incremento de ticket',
    status: StrategyStatus.Evaluating,
    objectiveLabel: 'Incrementar Bs/Kg',
    segmentLabel: 'Definiendo segmento...',
    projectedImpactPercent: 0,
  },
]

export const mockStrategyDetails: Record<string, StrategyDetail> = {
  'recuperacion-clientes-inactivos': {
    id: 'recuperacion-clientes-inactivos',
    name: 'Recuperación de clientes inactivos',
    status: StrategyStatus.Active,
    dateRangeLabel: '01 Ago - 31 Ago 2026',
    objectiveDescription:
      'Incrementar la recompra en clientes que no han realizado transacciones en los últimos 90 días mediante incentivos personalizados en Venado Money.',
    metrics: {
      clientesObjetivo: 1248,
      contactados: 892,
      reactivados: 326,
      tasaRecompra: 26.1,
      ventasAtribuibles: 184500,
      ganancia: 72300,
      roi: 4.2,
      venadoMoneyGenerado: 14460,
    },
    impactChart: [
      { label: 'Antes (Promedio 3m)', value: 100 },
      { label: 'Después (Mes actual)', value: 118 },
    ],
    impactDeltaPercent: 18,
    impactNote:
      'Los clientes reactivados muestran un incremento del 18% en su ticket promedio en comparación con su histórico antes de la inactividad.',
  },
}

export const objectiveLabels: Record<StrategyObjective, string> = {
  [StrategyObjective.IncreaseTicket]: 'Incrementar ticket',
  [StrategyObjective.IncreasePortfolio]: 'Incrementar portafolio',
  [StrategyObjective.RecoverCustomers]: 'Recuperar clientes',
  [StrategyObjective.NewCustomers]: 'Crear nuevos clientes',
  [StrategyObjective.Other]: 'Otro',
}
