import { Calendar, Coins, Pencil, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useTogglePointsItemStatus } from '@/features/venado-money/api/usePointsItems'
import { ItemStatusBadge } from '@/features/venado-money/components/ItemStatusBadge'
import { ItemTypeBadge } from '@/features/venado-money/components/ItemTypeBadge'
import { PointsItemStatus, VigencyType, type PointsItem } from '@/features/venado-money/types'
import { formatDate } from '@/shared/utils/format'

interface PointsItemDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: PointsItem | null
  onEdit: (item: PointsItem) => void
}

export function PointsItemDetailSheet({ open, onOpenChange, item, onEdit }: PointsItemDetailSheetProps) {
  const { mutate: toggleStatus, isPending } = useTogglePointsItemStatus()

  if (!item) return null

  const isActive = item.status === PointsItemStatus.Active
  const vigencyLabel =
    item.vigency === VigencyType.Permanent
      ? 'Permanente'
      : `${item.startDate ? formatDate(item.startDate) : '—'} al ${item.endDate ? formatDate(item.endDate) : '—'}`

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <ItemTypeBadge type={item.type} />
            <ItemStatusBadge status={item.status} />
          </div>
          <SheetTitle className="text-lg">{item.name}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Información general</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Código</span>
                <span className="text-sm font-medium text-foreground">{item.code}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">Categoría</span>
                <span className="text-sm font-medium text-foreground">{item.categoryLabel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg bg-primary/5 p-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Valor asignado</span>
              <span className="text-xl font-semibold text-foreground">{item.points.toLocaleString('es-BO')} puntos</span>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Coins size={16} />
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Vigencia</span>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Calendar size={14} className="text-muted-foreground" />
              {vigencyLabel}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Configuración y metadatos</span>
            <div className="flex flex-col rounded-lg border border-border">
              <div className="flex items-center justify-between border-b border-border px-3 py-2 text-sm">
                <span className="text-muted-foreground">Creado por</span>
                <span className="font-medium text-foreground">{item.createdBy}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border px-3 py-2 text-sm">
                <span className="text-muted-foreground">Fecha de creación</span>
                <span className="font-medium text-foreground">{formatDate(item.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="text-muted-foreground">Última modificación</span>
                <span className="font-medium text-foreground">{formatDate(item.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row justify-end border-t border-border">
          <Button variant={isActive ? 'destructive' : 'outline'} onClick={() => toggleStatus(item.id)} disabled={isPending}>
            <Power data-icon="inline-start" />
            {isActive ? 'Desactivar' : 'Activar'}
          </Button>
          <Button onClick={() => onEdit(item)}>
            <Pencil data-icon="inline-start" />
            Editar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
