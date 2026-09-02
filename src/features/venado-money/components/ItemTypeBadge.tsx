import { cn } from '@/lib/utils'
import { PointsItemType } from '@/features/venado-money/types'

export function ItemTypeBadge({ type, className }: { type: PointsItemType; className?: string }) {
  const isProduct = type === PointsItemType.Product

  return (
    <span
      className={cn(
        'inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        isProduct ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
        className
      )}
    >
      {isProduct ? 'Producto' : 'Ítem Externo'}
    </span>
  )
}
