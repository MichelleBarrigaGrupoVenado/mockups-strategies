import { cn } from '@/lib/utils'
import { PointsItemStatus } from '@/features/venado-money/types'

export function ItemStatusBadge({ status, className }: { status: PointsItemStatus; className?: string }) {
  const isActive = status === PointsItemStatus.Active

  return (
    <span
      className={cn(
        'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        isActive ? 'text-foreground' : 'text-muted-foreground',
        className
      )}
    >
      <span className={cn('size-1.5 shrink-0 rounded-full', isActive ? 'bg-success' : 'bg-muted-foreground')} />
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  )
}
