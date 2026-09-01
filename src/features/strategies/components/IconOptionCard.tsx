import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconOptionCardProps {
  icon: LucideIcon
  title: string
  description: string
  selected?: boolean
  onClick?: () => void
}

export function IconOptionCard({ icon: Icon, title, description, selected, onClick }: IconOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-7 text-center ring-1 ring-foreground/10 transition-colors',
        selected ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:bg-muted/40'
      )}
    >
      <span
        className={cn(
          'flex size-12 items-center justify-center rounded-full',
          selected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
        )}
      >
        <Icon size={22} strokeWidth={1.8} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-base font-semibold text-foreground">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </span>
    </button>
  )
}
