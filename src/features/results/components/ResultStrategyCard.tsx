import { MoreVertical, PieChart, Target, TrendingUp } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/features/strategies/components/StatusBadge'
import type { ResultStrategySummary } from '@/features/results/types'

export function ResultStrategyCard({ result }: { result: ResultStrategySummary }) {
  const navigate = useNavigate()

  return (
    <Card className="ring-1 ring-border">
      <CardHeader className="flex-row items-center justify-between px-4">
        <StatusBadge status={result.status} />
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}>
            <MoreVertical size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate(`/resultados/${result.id}`)}>Ver detalle</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <Link to={`/resultados/${result.id}`} className="text-base leading-snug font-semibold text-foreground hover:underline">
          {result.name}
        </Link>

        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target size={14} strokeWidth={2} className="text-muted-foreground/70" />
            <span className="text-xs tracking-wide uppercase">Objetivo</span>
          </div>
          <p className="pl-5.5 -mt-1 text-foreground">{result.objectiveLabel}</p>

          <div className="mt-1.5 flex items-center gap-2 text-muted-foreground">
            <PieChart size={14} strokeWidth={2} className="text-muted-foreground/70" />
            <span className="text-xs tracking-wide uppercase">Segmento</span>
          </div>
          <p className="pl-5.5 -mt-1 text-foreground">{result.segmentLabel}</p>
        </div>
      </CardContent>

      <Separator />

      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-muted-foreground uppercase">Impacto proyectado</span>
            <span className="flex items-center gap-1 text-base font-semibold text-success">
              +{result.projectedImpactPercent}%
              <TrendingUp size={14} strokeWidth={2.5} />
            </span>
          </div>

          {result.roiEstimate !== undefined && (
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-xs tracking-wide text-muted-foreground uppercase">ROI estimado</span>
              <span className="text-base font-semibold text-foreground">{result.roiEstimate}x</span>
            </div>
          )}

          {result.progressPercent !== undefined && (
            <div className="flex flex-1 flex-col items-end gap-1">
              <Progress value={result.progressPercent} className="w-full" />
              <span className="text-xs text-muted-foreground">{result.progressPercent}% progreso</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
