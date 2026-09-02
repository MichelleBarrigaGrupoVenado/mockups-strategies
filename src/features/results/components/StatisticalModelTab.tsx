import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatCard } from '@/features/strategies/components/StatCard'
import { StatisticalModelView, type StatisticalModelResult } from '@/features/results/types'
import { formatBs, formatPercent } from '@/shared/utils/format'

const breakdownChartConfig = {
  costoBs: { label: 'Costo', color: '#f59e0b' },
  gananciaBs: { label: 'Ganancia', color: 'hsl(var(--success))' },
} satisfies ChartConfig

const salesChartConfig = {
  ventasBs: { label: 'Ventas', color: 'hsl(var(--primary))' },
  gananciaPercent: { label: 'Ganancia %', color: 'hsl(var(--success))' },
} satisfies ChartConfig

export function StatisticalModelTab({ data }: { data: StatisticalModelResult }) {
  const [view, setView] = useState<StatisticalModelView>(StatisticalModelView.ByMonth)
  const rows = view === StatisticalModelView.ByMonth ? data.byMonth : data.byProduct
  const columnLabel = view === StatisticalModelView.ByMonth ? 'Mes' : 'Producto'
  const rotateLabels = rows.length > 8

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Beneficio Atribuible"
          value={formatBs(data.attributableBenefitBs)}
          hint={<span className="text-success">+{data.benefitIncreasePercent}% de incremento</span>}
        />
        <StatCard
          label="Intervalo de Confianza"
          value={`${formatBs(data.confidenceIntervalBs[0])} — ${formatBs(data.confidenceIntervalBs[1])}`}
          hint={`Nivel de confianza: ${data.confidenceLevel}%`}
        />
        <StatCard label="Incremento de Ventas" value={formatPercent(data.salesIncreasePercent)} hint="De incremento en Ventas" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">Análisis de Impacto Financiero</h3>
            <p className="text-sm text-muted-foreground">Desglose detallado de gastos operativos y rentabilidad de la estrategia.</p>
          </div>
          <Tabs value={view} onValueChange={(value) => setView(value as StatisticalModelView)}>
            <TabsList>
              <TabsTrigger value={StatisticalModelView.ByMonth}>Análisis por Mes</TabsTrigger>
              <TabsTrigger value={StatisticalModelView.ByProduct}>Análisis por Producto</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-6">
            {view === StatisticalModelView.ByMonth && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Gastos operativos por {columnLabel.toLowerCase()}</span>
                <ChartContainer config={breakdownChartConfig} className="aspect-auto h-56 w-full">
                  <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      interval={0}
                      angle={rotateLabels ? -35 : 0}
                      textAnchor={rotateLabels ? 'end' : 'middle'}
                      height={rotateLabels ? 50 : 24}
                    />
                    <YAxis hide />
                    <ChartTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="costoBs" stackId="breakdown" fill="var(--color-costoBs)" />
                    <Bar dataKey="gananciaBs" stackId="breakdown" fill="var(--color-gananciaBs)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Ventas y ganancia por {columnLabel.toLowerCase()}</span>
              <ChartContainer config={salesChartConfig} className="aspect-auto h-56 w-full">
                <ComposedChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={0}
                    angle={rotateLabels ? -35 : 0}
                    textAnchor={rotateLabels ? 'end' : 'middle'}
                    height={rotateLabels ? 50 : 24}
                  />
                  <YAxis yAxisId="left" hide />
                  <YAxis yAxisId="right" orientation="right" hide domain={[0, 100]} />
                  <ChartTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="ventasBs" fill="var(--color-ventasBs)" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  <Line yAxisId="right" type="monotone" dataKey="gananciaPercent" stroke="var(--color-gananciaPercent)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </ComposedChart>
              </ChartContainer>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{columnLabel}</TableHead>
                    <TableHead>Ventas</TableHead>
                    <TableHead>Ganancia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="font-medium text-foreground">{row.label}</TableCell>
                      <TableCell className="text-muted-foreground">{formatBs(row.ventasBs)}</TableCell>
                      <TableCell className="text-success">{formatBs(row.gananciaBs)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-2 rounded-lg bg-primary/5 p-4 ring-1 ring-primary/10">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Estado de Resultados</span>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ingresos</span>
                <span className="font-medium text-foreground">{formatBs(data.summary.revenueBs)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Costos</span>
                <span className="font-medium text-foreground">{formatBs(data.summary.costBs)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-primary/10 pt-2 text-sm">
                <span className="font-medium text-foreground">Beneficio Atribuible</span>
                <span className="font-semibold text-primary">{formatBs(data.summary.attributableBenefitBs)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
