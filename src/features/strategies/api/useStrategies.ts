import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { channelOptions, cityOptions } from '@/features/strategies/data/criteria'
import { mockStrategyDetails, mockStrategySummaries, mockTargetClients, objectiveLabels } from '@/features/strategies/data/mock-data'
import {
  StrategyObjective,
  StrategyStatus,
  ConditionOperator,
  type StrategyDetail,
  type StrategySummary,
  type StrategyWizardData,
  type TargetClient,
  type TargetingCondition,
} from '@/features/strategies/types'
import { formatDate } from '@/shared/utils/format'

const strategiesKey = ['strategies'] as const
const strategyKey = (id: string) => ['strategies', id] as const

// Módulo-nivel "base de datos" mock: seedeada desde mock-data.ts y mutada por `useCreateStrategy` para
// que una estrategia recién creada aparezca en la lista y tenga detalle, siguiendo el mismo patrón de
// `itemsStore` en `venado-money/api/usePointsItems.ts`.
let strategiesStore: StrategySummary[] = [...mockStrategySummaries]
let strategyDetailsStore: Record<string, StrategyDetail> = { ...mockStrategyDetails }

async function fakeDelay<T>(value: T, ms = 300): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms))
  return value
}

export function useStrategies() {
  return useQuery({
    queryKey: strategiesKey,
    queryFn: () => fakeDelay(strategiesStore),
  })
}

export function useStrategy(id: string | undefined) {
  return useQuery({
    queryKey: strategyKey(id ?? ''),
    queryFn: () => fakeDelay(id ? strategyDetailsStore[id] : undefined),
    enabled: !!id,
  })
}

function compareNumeric(clientValue: number, operator: ConditionOperator, target: number): boolean {
  switch (operator) {
    case ConditionOperator.GreaterThan:
      return clientValue > target
    case ConditionOperator.LessThan:
      return clientValue < target
    case ConditionOperator.Equals:
      return clientValue === target
    default:
      return true
  }
}

/**
 * Traduce cada `TargetingCondition` (cuyo `field` varía según el objetivo elegido en el paso 1) a la
 * propiedad real del cliente mock contra la que se filtra. Los campos numéricos/de meses que no llegan a
 * completarse (valor vacío o no numérico) no filtran nada; los booleanos solo restringen cuando el
 * checkbox está marcado — desmarcado significa "no importa" en vez de "debe ser falso".
 */
function matchesCondition(client: TargetClient, condition: TargetingCondition): boolean {
  switch (condition.field) {
    case 'Ventas históricas': {
      const numeric = Number(condition.value.replace(/[.,]/g, ''))
      if (Number.isNaN(numeric)) return true
      return compareNumeric(client.ticketPromedio, condition.operator, numeric)
    }
    // "Ticket" (Incrementar ticket / Recuperar clientes) y "Ticket promedio del Origen" (Incrementar
    // portafolio) se evalúan contra el ticket del segmento/origen de la estrategia, no el ticket
    // general del cliente — dos clientes con el mismo gasto total pueden diferir mucho en cuánto le
    // compran justo al segmento que la estrategia está apuntando.
    case 'Ticket':
    case 'Ticket promedio del Origen': {
      const numeric = Number(condition.value.replace(/[.,]/g, ''))
      if (Number.isNaN(numeric)) return true
      return compareNumeric(client.ticketPromedioSegmento, condition.operator, numeric)
    }
    case 'Última Compra':
    case 'Última Compra del Origen': {
      const months = Number(condition.value)
      if (Number.isNaN(months)) return true
      return compareNumeric(client.mesesUltimaCompra, condition.operator, months)
    }
    case 'Cliente Activo':
    case 'Cliente activo':
      return condition.value !== 'true' || client.activo
    case 'Compró en el mes actual':
      return condition.value !== 'true' || client.comproMesActual
    case 'Visitado en el mes actual':
      return condition.value !== 'true' || client.visitadoMesActual
    case 'Deuda':
      return condition.value !== 'true' || client.deuda
    case 'Mora':
      return condition.value !== 'true' || client.mora
    default:
      return true
  }
}

export interface TargetClientFilters {
  city?: string
  channel?: string
  subchannel?: string
  conditions?: TargetingCondition[]
  /** Cuando viene seteado (selección manual por polígono en el mapa), ignora el resto de filtros. */
  selectedClientIds?: string[] | null
}

export function filterTargetClients(filters: TargetClientFilters): TargetClient[] {
  if (filters.selectedClientIds) {
    const idSet = new Set(filters.selectedClientIds)
    return mockTargetClients.filter((client) => idSet.has(client.id))
  }

  return mockTargetClients.filter((client) => {
    if (filters.city && client.city !== filters.city) return false
    if (filters.channel && client.channel !== filters.channel) return false
    if (filters.subchannel && client.subchannel !== filters.subchannel) return false
    if (filters.conditions && !filters.conditions.every((condition) => matchesCondition(client, condition))) return false
    return true
  })
}

/** El segmento se recalcula al vuelo mientras se editan ciudad/canal/subcanal y las condiciones del paso "¿A quién?". */
export function useTargetClients(filters: TargetClientFilters) {
  const queryKey = [
    'strategies',
    'target-clients',
    filters.city ?? '',
    filters.channel ?? '',
    filters.subchannel ?? '',
    filters.conditions?.map((c) => `${c.field}:${c.operator}:${c.value}`).join('|') ?? '',
    filters.selectedClientIds?.join(',') ?? null,
  ] as const

  return useQuery<TargetClient[]>({
    queryKey,
    queryFn: () => fakeDelay(filterTargetClients(filters), 200),
  })
}

/** Mismo cálculo de "clientes mostrados" que `useDisplayedTargetClients` (candidatos +/- exclusiones/agregados a mano), pero como función pura para poder correrlo al crear la estrategia, fuera de un componente. */
function resolveTargetClients(data: StrategyWizardData): TargetClient[] {
  const baseFilters = { city: data.city, channel: data.channel, subchannel: data.subchannel, conditions: data.conditions }
  const candidatePool = filterTargetClients(baseFilters)
  const autoOrPolygonClients = filterTargetClients({ ...baseFilters, selectedClientIds: data.selectedClientIds })

  const excluded = new Set(data.excludedClientIds)
  const list = autoOrPolygonClients.filter((client) => !excluded.has(client.id))

  const presentIds = new Set(list.map((client) => client.id))
  for (const id of data.manuallyAddedClientIds) {
    if (presentIds.has(id)) continue
    const client = candidatePool.find((c) => c.id === id)
    if (client) {
      list.push(client)
      presentIds.add(id)
    }
  }

  return list
}

/** Arma el resumen (para la lista) y el detalle de una estrategia recién creada a partir de los datos del wizard. */
function buildStrategyFromWizardData(data: StrategyWizardData): { summary: StrategySummary; detail: StrategyDetail } {
  const id = crypto.randomUUID()
  const targetClients = resolveTargetClients(data)
  const objectiveLabel = objectiveLabels[data.objective ?? StrategyObjective.Other]

  const segmentParts = [
    cityOptions.find((option) => option.value === data.city)?.label,
    channelOptions.find((option) => option.value === data.channel)?.label,
  ].filter((part): part is string => !!part)
  const segmentLabel = segmentParts.length > 0 ? segmentParts.join(' · ') : `${targetClients.length} clientes objetivo`

  const summary: StrategySummary = {
    id,
    name: data.name,
    status: StrategyStatus.Active,
    objectiveLabel,
    segmentLabel,
    // La estrategia recién nace: aún no hay resultados reales, así que el impacto proyectado es la meta
    // que se fijó en el paso "KPI/Meta" del wizard, y el progreso arranca en 0%.
    projectedImpactPercent: data.metaPercent,
    progressPercent: 0,
  }

  const detail: StrategyDetail = {
    id,
    name: data.name,
    status: StrategyStatus.Active,
    dateRangeLabel: `${formatDate(data.startDate)} - ${formatDate(data.endDate)}`,
    objectiveDescription: data.description || objectiveLabel,
    metrics: {
      clientesObjetivo: targetClients.length,
      contactados: 0,
      reactivados: 0,
      tasaRecompra: 0,
      ventasAtribuibles: 0,
      ganancia: 0,
      roi: 0,
      venadoMoneyGenerado: 0,
    },
    impactChart: [
      { label: 'Antes (Promedio 3m)', value: 100 },
      { label: 'Después (Mes actual)', value: 100 },
    ],
    impactDeltaPercent: 0,
    impactNote: 'La estrategia se acaba de activar: el impacto se medirá con la actividad de los próximos días.',
  }

  return { summary, detail }
}

export function useCreateStrategy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: StrategyWizardData) =>
      fakeDelay(null, 500).then(() => {
        const { summary, detail } = buildStrategyFromWizardData(data)
        strategiesStore = [summary, ...strategiesStore]
        strategyDetailsStore = { ...strategyDetailsStore, [detail.id]: detail }
        return summary
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: strategiesKey })
    },
  })
}
