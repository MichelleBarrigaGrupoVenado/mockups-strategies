import { MapPin } from 'lucide-react'
import type { TargetClient } from '@/features/strategies/types'
import { formatBs, formatDate } from '@/shared/utils/format'

export function MapPreview({ focusClient }: { focusClient?: TargetClient }) {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-lg bg-muted">
      <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full text-primary/25" preserveAspectRatio="none">
        <rect width="400" height="200" fill="hsl(var(--muted))" />
        <path d="M20 40 L120 20 L160 90 L60 130 Z" fill="currentColor" />
        <path d="M180 60 L300 30 L340 110 L220 150 Z" fill="currentColor" opacity="0.6" />
        <path d="M40 140 L140 120 L170 190 L30 190 Z" fill="currentColor" opacity="0.4" />
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={i * 50} y1="0" x2={i * 50} y2="200" stroke="hsl(var(--border))" strokeWidth="1" />
        ))}
      </svg>

      <span className="absolute top-1/3 left-1/3 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-primary/20">
        <MapPin size={12} fill="currentColor" />
      </span>

      {focusClient && (
        <div className="absolute top-2 left-2 w-44 rounded-lg bg-popover p-2.5 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10">
          <p className="font-semibold text-foreground">{focusClient.name}</p>
          <p className="text-muted-foreground">Ticket promedio: {formatBs(focusClient.ticketPromedio)}</p>
          <p className="text-muted-foreground">Última compra: {formatDate(focusClient.ultimaCompra)}</p>
        </div>
      )}
    </div>
  )
}
