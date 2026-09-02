import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Coins } from 'lucide-react'
import { ItemStatusBadge } from '@/features/venado-money/components/ItemStatusBadge'
import { ItemTypeBadge } from '@/features/venado-money/components/ItemTypeBadge'
import { ItemVisual } from '@/features/venado-money/components/ItemVisual'
import { VigencyType, type PointsItem } from '@/features/venado-money/types'
import { formatDate } from '@/shared/utils/format'

interface PointsItemsTableProps {
  items: PointsItem[]
  isLoading: boolean
  onSelectItem: (item: PointsItem) => void
}

function vigencyLabel(item: PointsItem): string {
  if (item.vigency === VigencyType.Permanent) return 'Permanente'
  const days =
    item.startDate && item.endDate
      ? Math.max(1, Math.round((new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / 86_400_000))
      : null
  return days ? `${days} días` : item.endDate ? `Hasta ${formatDate(item.endDate)}` : 'Con fecha'
}

export function PointsItemsTable({ items, isLoading, onSelectItem }: PointsItemsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ítem</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Puntos</TableHead>
          <TableHead>Vigencia</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={6}>
                <Skeleton className="h-8 w-full" />
              </TableCell>
            </TableRow>
          ))}

        {!isLoading && items.length === 0 && (
          <TableRow>
            <TableCell colSpan={6}>
              <Empty className="py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Coins />
                  </EmptyMedia>
                  <EmptyTitle>Sin ítems</EmptyTitle>
                  <EmptyDescription>No se encontraron ítems con los filtros seleccionados.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          items.map((item) => (
            <TableRow key={item.id} className="cursor-pointer" onClick={() => onSelectItem(item)}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <ItemVisual item={item} />
                  <span className="font-medium text-foreground">{item.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <ItemTypeBadge type={item.type} />
              </TableCell>
              <TableCell className="text-muted-foreground">{item.categoryLabel}</TableCell>
              <TableCell className="font-semibold text-foreground">{item.points.toLocaleString('es-BO')}</TableCell>
              <TableCell className="text-muted-foreground">{vigencyLabel(item)}</TableCell>
              <TableCell>
                <ItemStatusBadge status={item.status} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
