import { ArrowRight, FileText, Rocket } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { BeforeAfterResult } from '@/features/results/types'
import { formatBs } from '@/shared/utils/format'

export function BeforeAfterTab({ data }: { data: BeforeAfterResult }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Atribución de Resultados</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Métrica</TableHead>
                <TableHead>Antes</TableHead>
                <TableHead>Después</TableHead>
                <TableHead>Variación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell className="font-medium text-foreground">{row.metric}</TableCell>
                  <TableCell className="text-muted-foreground">{row.before}</TableCell>
                  <TableCell className="text-muted-foreground">{row.after}</TableCell>
                  <TableCell className="font-medium text-success">+{row.variationPercent}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 rounded-xl bg-primary/5 p-4 ring-1 ring-primary/10">
            <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <FileText size={13} />
              Beneficio Neto
            </span>
            <span className="text-2xl font-semibold text-foreground">{formatBs(data.beneficioNetoBs)}</span>
            <span className="text-xs text-muted-foreground">{data.beneficioNetoNote}</span>
          </div>
          <div className="flex flex-col gap-1.5 rounded-xl bg-primary/5 p-4 ring-1 ring-primary/10">
            <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <Rocket size={13} />
              Retorno (ROI)
            </span>
            <span className="text-2xl font-semibold text-primary">{data.roi}x</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4">
          {data.funnel.map((step, i) => (
            <div key={step.label} className="flex items-center gap-4">
              <div
                className={cn(
                  'flex w-44 flex-col items-center gap-1 rounded-3xl border p-6 text-center',
                  i === data.funnel.length - 1 ? 'border-transparent bg-primary text-primary-foreground' : 'border-border bg-card text-foreground'
                )}
              >
                <span className={cn('text-xs font-semibold tracking-wide uppercase', i === data.funnel.length - 1 ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                  {step.label}
                </span>
                <span className="font-mono text-lg font-semibold">{step.value}</span>
                <span className={cn('text-xs', i === data.funnel.length - 1 ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{step.description}</span>
              </div>
              {i < data.funnel.length - 1 && <ArrowRight size={20} className="shrink-0 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
