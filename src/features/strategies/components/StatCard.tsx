import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  hint?: ReactNode
  emphasize?: boolean
  className?: string
}

export function StatCard({ label, value, hint, emphasize, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-xl p-4 ring-1',
        emphasize ? 'bg-incentive text-incentive-foreground ring-incentive/40' : 'bg-card text-card-foreground ring-border',
        className
      )}
    >
      <span className={cn('text-xs font-medium', emphasize ? 'text-incentive-foreground/80' : 'text-muted-foreground')}>{label}</span>
      <span className="text-2xl font-semibold">{value}</span>
      {hint && <span className={cn('text-xs', emphasize ? 'text-incentive-foreground/80' : 'text-muted-foreground')}>{hint}</span>}
    </div>
  )
}
