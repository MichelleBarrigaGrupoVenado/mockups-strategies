import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StrategyStatus } from '@/features/strategies/types'

const statusConfig: Record<StrategyStatus, { label: string; dotClass: string }> = {
  [StrategyStatus.Active]: { label: 'Activa', dotClass: 'bg-success' },
  [StrategyStatus.Evaluating]: { label: 'En evaluación', dotClass: 'bg-info' },
  [StrategyStatus.Paused]: { label: 'Pausada', dotClass: 'bg-muted-foreground' },
  [StrategyStatus.Draft]: { label: 'Borrador', dotClass: 'bg-muted-foreground' },
}

export function StatusBadge({ status, className }: { status: StrategyStatus; className?: string }) {
  const config = statusConfig[status]

  if (status === StrategyStatus.Evaluating) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-info/10 px-2.5 py-1 text-xs font-medium text-info', className)}>
        <MessageCircle size={12} strokeWidth={2.5} />
        {config.label}
      </span>
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium text-foreground', className)}>
      <span className={cn('size-1.5 shrink-0 rounded-full', config.dotClass)} />
      {config.label}
    </span>
  )
}
