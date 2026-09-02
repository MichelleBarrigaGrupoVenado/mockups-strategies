import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { ProductLevel } from '@/features/strategies/data/product-hierarchy'
import { usePointsItem, usePointsItems } from '@/features/venado-money/api/usePointsItems'
import { AssignPointsSheet } from '@/features/venado-money/components/AssignPointsSheet'
import { PointsItemDetailSheet } from '@/features/venado-money/components/PointsItemDetailSheet'
import { PointsItemsFilters } from '@/features/venado-money/components/PointsItemsFilters'
import { PointsItemsTable } from '@/features/venado-money/components/PointsItemsTable'
import { PointsItemStatus, PointsItemType, VigencyType, type PointsItem } from '@/features/venado-money/types'

const PAGE_SIZE = 8

export function VenadoMoneyPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<PointsItemType | ''>('')
  const [level, setLevel] = useState<ProductLevel | ''>('')
  const [levelValue, setLevelValue] = useState('')
  const [status, setStatus] = useState<PointsItemStatus | ''>('')
  const [vigency, setVigency] = useState<VigencyType | ''>('')
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)

  const [assignSheetOpen, setAssignSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PointsItem | null>(null)
  const [detailItemId, setDetailItemId] = useState<string | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  const { data: items, isLoading } = usePointsItems({ search, type, level, levelValue, status, vigency })
  const { data: detailItem } = usePointsItem(detailItemId ?? undefined)

  const total = items?.length ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return items?.slice(start, start + PAGE_SIZE) ?? []
  }, [items, currentPage])

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, total)

  const updateFilter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setPage(1)
  }

  const openCreateSheet = () => {
    setEditingItem(null)
    setAssignSheetOpen(true)
  }

  const openEditSheet = (item: PointsItem) => {
    setEditingItem(item)
    setDetailSheetOpen(false)
    setAssignSheetOpen(true)
  }

  const openDetailSheet = (item: PointsItem) => {
    setDetailItemId(item.id)
    setDetailSheetOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground">Gestión de Puntos</h1>
          <p className="text-sm text-muted-foreground">Define los puntos que otorga cada producto o artículo.</p>
        </div>
        <Button onClick={openCreateSheet}>
          <Plus data-icon="inline-start" />
          Asignar puntos
        </Button>
      </div>

      <PointsItemsFilters
        search={search}
        onSearchChange={updateFilter(setSearch)}
        type={type}
        onTypeChange={updateFilter(setType)}
        level={level}
        onLevelChange={updateFilter(setLevel)}
        levelValue={levelValue}
        onLevelValueChange={updateFilter(setLevelValue)}
        status={status}
        onStatusChange={updateFilter(setStatus)}
        vigency={vigency}
        onVigencyChange={updateFilter(setVigency)}
        moreFiltersOpen={moreFiltersOpen}
        onToggleMoreFilters={() => setMoreFiltersOpen((prev) => !prev)}
      />

      <Card className="gap-0 p-0">
        <PointsItemsTable items={paginatedItems} isLoading={isLoading} onSelectItem={openDetailSheet} />

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-sm text-muted-foreground">
            {total === 0 ? 'Sin resultados' : `Mostrando ${rangeStart} a ${rangeEnd} de ${total} items`}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>
              <ChevronLeft size={15} />
            </Button>
            <span className="px-2 text-sm text-foreground">{currentPage}</span>
            <Button variant="outline" size="icon-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      </Card>

      <AssignPointsSheet open={assignSheetOpen} onOpenChange={setAssignSheetOpen} item={editingItem} />
      <PointsItemDetailSheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen} item={detailItem ?? null} onEdit={openEditSheet} />
    </div>
  )
}
