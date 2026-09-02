import { useQuery } from '@tanstack/react-query'
import { mockResultDetails, mockResultSummaries } from '@/features/results/data/mock-data'

const resultsKey = ['results'] as const
const resultKey = (id: string) => ['results', id] as const

async function fakeDelay<T>(value: T, ms = 300): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms))
  return value
}

export function useResultStrategies() {
  return useQuery({
    queryKey: resultsKey,
    queryFn: () => fakeDelay(mockResultSummaries),
  })
}

export function useResultStrategyDetail(id: string | undefined) {
  return useQuery({
    queryKey: resultKey(id ?? ''),
    queryFn: () => fakeDelay(id ? mockResultDetails[id] : undefined),
    enabled: !!id,
  })
}
