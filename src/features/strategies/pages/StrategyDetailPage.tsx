import { ArrowLeft, Pause, Pencil, TrendingUp } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useStrategy } from '@/features/strategies/api/useStrategies'
import { ImpactChart } from '@/features/strategies/components/ImpactChart'
import { StatCard } from '@/features/strategies/components/StatCard'
import { StatusBadge } from '@/features/strategies/components/StatusBadge'
import { formatBs, formatPercent } from '@/shared/utils/format'

export function StrategyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: strategy, isLoading } = useStrategy(id)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!strategy) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-sm text-muted-foreground">No se encontró esta estrategia.</p>
        <Button asChild variant="outline">
          <Link to="/estrategias">
            <ArrowLeft data-icon="inline-start" />
            Volver a Estrategias
          </Link>
        </Button>
      </div>
    )
  }

  const { metrics } = strategy

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-3">
        <Link to="/estrategias" className="flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase hover:text-foreground">
          <ArrowLeft size={13} />
          Estrategias / Detalle
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-foreground">{strategy.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <StatusBadge status={strategy.status} />
              <span>{strategy.dateRangeLabel}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline">
              <Pencil data-icon="inline-start" />
              Editar
            </Button>
            <Button>
              <Pause data-icon="inline-start" />
              Pausar
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <span className="text-sm font-semibold text-foreground">Objetivo Principal</span>
        <p className="mt-1.5 text-sm text-muted-foreground">{strategy.objectiveDescription}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Clientes Objetivo" value={metrics.clientesObjetivo.toLocaleString('es-BO')} />
        <StatCard label="Contactados" value={metrics.contactados.toLocaleString('es-BO')} hint={`${((metrics.contactados / metrics.clientesObjetivo) * 100).toFixed(1)}% alcance`} />
        <StatCard
          label="Reactivados"
          value={metrics.reactivados.toLocaleString('es-BO')}
          hint={
            <span className="flex items-center gap-1 text-success">
              <TrendingUp size={12} />
            </span>
          }
        />
        <StatCard label="Tasa de Recompra" value={formatPercent(metrics.tasaRecompra)} />

        <StatCard
          className="lg:col-span-2"
          label="Ventas Atribuibles"
          value={formatBs(metrics.ventasAtribuibles)}
          hint={
            <span className="flex items-center gap-4">
              <span>
                Ganancia <span className="font-semibold text-foreground">{formatBs(metrics.ganancia)}</span>
              </span>
              <span>
                ROI <span className="font-semibold text-foreground">{metrics.roi}x</span>
              </span>
            </span>
          }
        />
        <StatCard
          className="lg:col-span-2"
          emphasize
          label="Venado Money Generado"
          value={formatBs(metrics.venadoMoneyGenerado)}
          hint="Saldo entregado a clientes reactivados"
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Impacto Promedio por Cliente (Antes vs Después)</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
          <ImpactChart data={strategy.impactChart} />
          <div className="flex flex-col gap-1.5 self-start rounded-xl bg-success/10 p-4">
            <span className="flex items-center gap-1 text-lg font-semibold text-success">
              <TrendingUp size={16} />
              {formatPercent(strategy.impactDeltaPercent, { withSign: true })}
            </span>
            <p className="text-sm text-foreground">{strategy.impactNote}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
