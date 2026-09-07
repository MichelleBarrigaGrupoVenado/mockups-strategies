import type { ReactNode } from 'react'
import { CheckCircle2, Coins, Gift, Layers, Lock, Settings2, Tag, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmployeeIncentivesTable } from '@/features/results/components/EmployeeIncentivesTable'
import { IncentiveEvolutionChart } from '@/features/results/components/IncentiveEvolutionChart'
import { PriceRulesIncentiveSection } from '@/features/results/components/PriceRulesIncentiveSection'
import { IncentiveSeries, type IncentivesResult } from '@/features/results/types'
import {
  formatBs,
  formatBsAmount,
  formatCount,
  formatDecimal,
  formatPercentDecimal,
  formatPoints,
  formatPointsShort,
} from '@/shared/utils/format'

const pointsSeriesLabels: Record<IncentiveSeries, string> = {
  [IncentiveSeries.Granted]: 'Otorgados',
  [IncentiveSeries.Used]: 'Utilizados',
  [IncentiveSeries.Pending]: 'Pendientes',
}

interface IncentiveStatCardProps {
  label: string
  value: string
  icon: ReactNode
  badge?: string
  children?: ReactNode
  emphasize?: boolean
}

function IncentiveStatCard({ label, value, icon, badge, children, emphasize }: IncentiveStatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-xl border bg-card p-4',
        emphasize ? 'border-primary ring-1 ring-primary/20' : 'border-border'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
        <span className="shrink-0 text-muted-foreground">{icon}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold text-foreground">{value}</span>
        {badge && <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">{badge}</span>}
      </div>
      {children}
    </div>
  )
}

function BehaviorRow({ icon, label, value, valueClassName }: { icon: ReactNode; label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</span>
        <span className={cn('text-sm font-semibold text-foreground', valueClassName)}>{value}</span>
      </div>
      <span className="shrink-0 text-muted-foreground">{icon}</span>
    </div>
  )
}

export function IncentivesTab({ data }: { data: IncentivesResult }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <IncentiveStatCard label="Puntos otorgados" value={formatPoints(data.pointsGranted)} icon={<Coins size={16} />}>
          <span className="text-xs text-muted-foreground">
            Equivalente <span className="font-medium text-foreground">≈ {formatBs(data.pointsGrantedBs)}</span>
          </span>
        </IncentiveStatCard>

        <IncentiveStatCard label="Puntos utilizados" value={formatPoints(data.pointsUsed)} icon={<Gift size={16} />}>
          <span className="text-xs text-muted-foreground">
            Redimido <span className="font-medium text-info">≈ {formatBs(data.pointsUsedBs)}</span>
          </span>
        </IncentiveStatCard>

        <IncentiveStatCard
          label="Tasa utilización"
          value={formatPercentDecimal(data.utilizationPercent)}
          icon={<span className="text-[11px] font-medium text-success">Efectiva</span>}
        >
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-success transition-all" style={{ width: `${data.utilizationPercent}%` }} />
          </div>
          <span className="text-xs text-muted-foreground">
            {formatPointsShort(data.pointsUsed)} de {formatPointsShort(data.pointsGranted)}
          </span>
        </IncentiveStatCard>

        <IncentiveStatCard label="Reglas de precio" value={formatBsAmount(data.priceRulesBenefitBs)} icon={<Tag size={16} />}>
          <span className="text-xs text-muted-foreground">
            Aplicaciones <span className="font-medium text-foreground">{formatCount(data.priceRulesApplications)} directas</span>
          </span>
        </IncentiveStatCard>

        <IncentiveStatCard emphasize label="Total incentivos" value={formatBsAmount(data.totalIncentivesBs)} icon={<Layers size={16} />}>
          <span className="text-xs text-muted-foreground">{formatBsAmount(data.redeemedIncentivesBs)} redimidos</span>
        </IncentiveStatCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <IncentiveEvolutionChart
          title="Evolución de Puntos por Mes"
          description="Comparativa mensual de puntos entregados, canjeados y remanentes"
          rows={data.byMonth}
          seriesLabels={pointsSeriesLabels}
          primaryUnit={{ label: 'Puntos', format: (value) => formatPointsShort(value) }}
        />

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">Comportamiento de Canje</h3>
            <p className="text-sm text-muted-foreground">Velocidad y adherencia al programa</p>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg bg-primary/5 px-3 py-2.5 ring-1 ring-primary/10">
            <span className="text-xs text-foreground">
              Regla de conversión: <span className="font-semibold">1 Punto = {formatBsAmount(data.bsPerPoint)}</span>
            </span>
            <Settings2 size={14} className="shrink-0 text-muted-foreground" />
          </div>

          <BehaviorRow
            icon={<Timer size={16} />}
            label="Tiempo promedio de canje"
            value={`${formatDecimal(data.redemption.averageRedemptionDays)} días`}
          />
          <BehaviorRow
            icon={<CheckCircle2 size={16} className="text-success" />}
            label="Canjes realizados a tiempo"
            value={formatPercentDecimal(data.redemption.onTimeRedemptionPercent)}
            valueClassName="text-success"
          />
          <BehaviorRow icon={<Lock size={16} />} label="Costo pasivo remanente" value={formatBsAmount(data.redemption.remainingLiabilityBs)} />

          <p className="rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Nota de política:</span> {data.redemption.policyNote}
          </p>
        </div>
      </div>

      <PriceRulesIncentiveSection data={data} />

      <EmployeeIncentivesTable data={data} />
    </div>
  )
}
