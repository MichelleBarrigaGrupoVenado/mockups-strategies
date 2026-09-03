import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mockStrategyDetails, mockStrategySummaries, mockTargetClients } from '@/features/strategies/data/mock-data'
import { ConditionOperator, type StrategyWizardData, type TargetClient, type TargetingCondition } from '@/features/strategies/types'

const strategiesKey = ['strategies'] as const
const strategyKey = (id: string) => ['strategies', id] as const

async function fakeDelay<T>(value: T, ms = 300): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms))
  return value
}

export function useStrategies() {
  return useQuery({
    queryKey: strategiesKey,
    queryFn: () => fakeDelay(mockStrategySummaries),
  })
}

export function useStrategy(id: string | undefined) {
  return useQuery({
    queryKey: strategyKey(id ?? ''),
    queryFn: () => fakeDelay(id ? mockStrategyDetails[id] : undefined),
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
    case 'Ventas históricas':
    case 'Ticket':
    case 'Ticket promedio del Origen': {
      const numeric = Number(condition.value.replace(/[.,]/g, ''))
      if (Number.isNaN(numeric)) return true
      return compareNumeric(client.ticketPromedio, condition.operator, numeric)
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

export function useCreateStrategy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: StrategyWizardData) => fakeDelay({ id: crypto.randomUUID(), ...data }, 500),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: strategiesKey })
    },
  })
}
