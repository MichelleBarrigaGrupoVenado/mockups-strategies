import { MoreVertical, PieChart, Sparkles, Target, TrendingUp } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { StatusBadge } from './StatusBadge'
import { StrategyStatus, type StrategySummary } from '@/features/strategies/types'

export function StrategyCard({ strategy }: { strategy: StrategySummary }) {
  const navigate = useNavigate()
  const isEvaluating = strategy.status === StrategyStatus.Evaluating

  return (
    <Card className="ring-1 ring-border">
      <CardHeader className="flex-row items-center justify-between px-4">
        <StatusBadge status={strategy.status} />
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}>
            <MoreVertical size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate(`/estrategias/${strategy.id}`)}>Ver detalle</DropdownMenuItem>
              <DropdownMenuItem>Duplicar</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Archivar</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <Link to={`/estrategias/${strategy.id}`} className="text-base leading-snug font-semibold text-foreground hover:underline">
          {strategy.name}
        </Link>

        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target size={14} strokeWidth={2} className="text-muted-foreground/70" />
            <span className="text-xs tracking-wide uppercase">Objetivo</span>
          </div>
          <p className="pl-5.5 -mt-1 text-foreground">{strategy.objectiveLabel}</p>

          <div className="mt-1.5 flex items-center gap-2 text-muted-foreground">
            <PieChart size={14} strokeWidth={2} className="text-muted-foreground/70" />
            <span className="text-xs tracking-wide uppercase">Segmento</span>
          </div>
          <p className="pl-5.5 -mt-1 text-foreground">{strategy.segmentLabel}</p>
        </div>
      </CardContent>

      <Separator />

      <CardContent>
        {isEvaluating ? (
          <div className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
            <Sparkles size={14} className="mt-0.5 shrink-0 text-primary" />
            Venado AI está analizando datos para proyectar impacto.
          </div>
        ) : (
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs tracking-wide text-muted-foreground uppercase">Impacto proyectado</span>
              <span className="flex items-center gap-1 text-base font-semibold text-success">
                +{strategy.projectedImpactPercent}%
                <TrendingUp size={14} strokeWidth={2.5} />
              </span>
            </div>

            {strategy.roiEstimate !== undefined && (
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-xs tracking-wide text-muted-foreground uppercase">ROI estimado</span>
                <span className="text-base font-semibold text-foreground">{strategy.roiEstimate}x</span>
              </div>
            )}

            {strategy.progressPercent !== undefined && (
              <div className="flex flex-1 flex-col items-end gap-1">
                <Progress value={strategy.progressPercent} className="w-full" />
                <span className="text-xs text-muted-foreground">{strategy.progressPercent}% progreso</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
