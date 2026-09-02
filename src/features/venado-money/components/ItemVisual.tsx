import { Gift, Package, Refrigerator, Smartphone, Ticket, Tv } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PointsItemType, type PointsItem } from '@/features/venado-money/types'

const categoryVisuals: Record<string, { icon: LucideIcon; className: string }> = {
  'Alimentos': { icon: Package, className: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  'Bebidas y Lácteos': { icon: Package, className: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  'Cuidado del Hogar': { icon: Package, className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  'Electrónica': { icon: Tv, className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  'Electrodomésticos': { icon: Refrigerator, className: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  'Tecnología': { icon: Smartphone, className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  'Vales': { icon: Ticket, className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  'Premios': { icon: Gift, className: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
}

export function ItemVisual({ item, className }: { item: PointsItem; className?: string }) {
  const fallback =
    item.type === PointsItemType.Product
      ? { icon: Package, className: 'bg-primary/10 text-primary' }
      : { icon: Gift, className: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' }

  const visual = categoryVisuals[item.categoryLabel] ?? fallback
  const Icon = visual.icon

  return (
    <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', visual.className, className)}>
      <Icon size={17} strokeWidth={2} />
    </span>
  )
}
