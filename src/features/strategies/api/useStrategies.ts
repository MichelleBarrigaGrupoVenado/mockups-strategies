import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mockStrategyDetails, mockStrategySummaries, mockTargetClients } from '@/features/strategies/data/mock-data'
import type { StrategyWizardData, TargetClient } from '@/features/strategies/types'

const strategiesKey = ['strategies'] as const
const strategyKey = (id: string) => ['strategies', id] as const
const targetClientsKey = (conditionsCount: number) => ['strategies', 'target-clients', conditionsCount] as const

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

/** El segmento se recalcula al vuelo mientras se editan las condiciones del paso "¿A quién?". */
export function useTargetClients(conditionsCount: number) {
  return useQuery<TargetClient[]>({
    queryKey: targetClientsKey(conditionsCount),
    queryFn: () => fakeDelay(mockTargetClients, 200),
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
