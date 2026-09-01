import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const CACHE_KEY = 'crm-deal-web:query-cache'

/** Persistencia liviana en localStorage: guarda el cache al salir, lo restaura al arrancar. */
export function restoreQueryCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return
    const entries = JSON.parse(raw) as Array<[unknown[], unknown]>
    for (const [queryKey, data] of entries) {
      queryClient.setQueryData(queryKey as readonly unknown[], data)
    }
  } catch {
    // cache corrupto o inexistente: se ignora y arranca en frío
  }
}

export function persistQueryCache() {
  try {
    const entries = queryClient
      .getQueryCache()
      .getAll()
      .filter((q) => q.state.data !== undefined)
      .map((q) => [q.queryKey, q.state.data])
    localStorage.setItem(CACHE_KEY, JSON.stringify(entries))
  } catch {
    // storage lleno o no disponible: no bloquea la app
  }
}
