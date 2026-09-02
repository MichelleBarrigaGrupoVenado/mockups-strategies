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

/** Solo la condición de "Ventas históricas" tiene un campo mock real (ticketPromedio) contra el cual filtrar. */
function matchesCondition(client: TargetClient, condition: TargetingCondition): boolean {
  if (condition.field !== 'Ventas históricas') return true
  const numeric = Number(condition.value.replace(/[.,]/g, ''))
  if (Number.isNaN(numeric)) return true

  switch (condition.operator) {
    case ConditionOperator.GreaterThan:
      return client.ticketPromedio > numeric
    case ConditionOperator.LessThan:
      return client.ticketPromedio < numeric
    case ConditionOperator.Equals:
      return client.ticketPromedio === numeric
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
