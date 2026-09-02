import { CheckCircle2, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { StatCard } from '@/features/strategies/components/StatCard'
import type { ABTestResult } from '@/features/results/types'
import { formatBs } from '@/shared/utils/format'

export function ABTestTab({ data }: { data: ABTestResult }) {
  const maxLift = Math.max(...data.groups.map((g) => g.liftPercent), 1)

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Lift de la Estrategia"
          value={`+${data.liftPercent}%`}
          hint={
            <span className="flex items-center gap-1 text-success">
              <TrendingUp size={12} />
            </span>
          }
        />
        <StatCard label="Beneficio Incremental" value={formatBs(data.incrementalBenefitBs)} />
        <StatCard label="Nivel de Confianza" value={`${data.confidenceLevel}%`} />
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-card p-4 text-center ring-1 ring-border">
          <CheckCircle2 size={22} className="text-success" />
          <span className="text-xs text-muted-foreground">{data.isSignificant ? 'Resultado estadísticamente significativo' : 'Resultado no concluyente'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Comparación de Grupos</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>KPI</TableHead>
                <TableHead>Control (A)</TableHead>
                <TableHead>Tratamiento (B)</TableHead>
                <TableHead>Incremental</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.comparisonRows.map((row) => (
                <TableRow key={row.kpi}>
                  <TableCell className="font-medium text-foreground">{row.kpi}</TableCell>
                  <TableCell className="text-muted-foreground">{row.control}</TableCell>
                  <TableCell className="text-muted-foreground">{row.treatment}</TableCell>
                  <TableCell className={cn('font-medium', row.incrementalPercent > 0 ? 'text-success' : 'text-muted-foreground')}>
                    {row.incrementalPercent > 0 ? '+' : ''}
                    {row.incrementalPercent}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">Comparación Experimental (A/B Test)</h3>
          {data.groups.map((group) => (
            <div key={group.key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{group.label}</span>
                  <Badge variant="secondary">{group.tag}</Badge>
                </div>
                <span className="text-lg font-semibold text-primary">+{group.liftPercent}%</span>
              </div>
              <span className="text-xs text-muted-foreground">{group.clients.toLocaleString('es-BO')} clientes</span>
              <Progress value={(group.liftPercent / maxLift) * 100} className={cn(group.tag === 'Control' && 'opacity-50')} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
