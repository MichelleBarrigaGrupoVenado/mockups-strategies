import { useMemo, useState } from 'react'

/** Pagina un arreglo en el cliente. La página se reinicia a 1 si el total encoge por debajo de ella (ej. tras cambiar un filtro). */
export function usePagination<T>(items: T[] | undefined, pageSize: number) {
  const [page, setPage] = useState(1)

  const total = items?.length ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return items?.slice(start, start + pageSize) ?? []
  }, [items, currentPage, pageSize])

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const rangeEnd = Math.min(currentPage * pageSize, total)

  return {
    page: currentPage,
    setPage,
    totalPages,
    total,
    paginatedItems,
    rangeStart,
    rangeEnd,
  }
}
