import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { IncentiveSeries, IncentiveUnit, type IncentivePeriodRow } from '@/features/results/types'
import { formatBs } from '@/shared/utils/format'

const seriesOrder = [IncentiveSeries.Granted, IncentiveSeries.Used, IncentiveSeries.Pending] as const

const seriesColors: Record<IncentiveSeries, string> = {
  [IncentiveSeries.Granted]: 'hsl(var(--primary))',
  [IncentiveSeries.Used]: 'hsl(var(--info))',
  [IncentiveSeries.Pending]: 'hsl(var(--muted-foreground) / 0.35)',
}

type NumericRowKey = Exclude<keyof IncentivePeriodRow, 'label'>

const primaryKey: Record<IncentiveSeries, NumericRowKey> = {
  [IncentiveSeries.Granted]: 'granted',
  [IncentiveSeries.Used]: 'used',
  [IncentiveSeries.Pending]: 'pending',
}

const bsKey: Record<IncentiveSeries, NumericRowKey> = {
  [IncentiveSeries.Granted]: 'grantedBs',
  [IncentiveSeries.Used]: 'usedBs',
  [IncentiveSeries.Pending]: 'pendingBs',
}

interface IncentiveEvolutionChartProps {
  title: string
  description: string
  rows: IncentivePeriodRow[]
  seriesLabels: Record<IncentiveSeries, string>
  /** Unidad primaria de la serie: puntos para Venado Money, aplicaciones para reglas de precio. */
  primaryUnit: { label: string; format: (value: number) => string }
  className?: string
  chartHeightClassName?: string
}

/**
 * Gráfico de barras agrupadas con dos filtros propios: la unidad de medida (unidad primaria o su
 * equivalente en Bs) y qué series se dibujan, controladas desde la leyenda con checkboxes.
 */
export function IncentiveEvolutionChart({
  title,
  description,
  rows,
  seriesLabels,
  primaryUnit,
  className,
  chartHeightClassName = 'h-56',
}: IncentiveEvolutionChartProps) {
  const [unit, setUnit] = useState<IncentiveUnit>(IncentiveUnit.Primary)
  const [visibleSeries, setVisibleSeries] = useState<IncentiveSeries[]>([...seriesOrder])

  const inBs = unit === IncentiveUnit.Bs
  const formatValue = (value: number) => (inBs ? formatBs(value) : primaryUnit.format(value))

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      granted: { label: seriesLabels.granted, color: seriesColors.granted },
      used: { label: seriesLabels.used, color: seriesColors.used },
      pending: { label: seriesLabels.pending, color: seriesColors.pending },
    }),
    [seriesLabels]
  )

  const chartRows = useMemo(
    () =>
      rows.map((row) => ({
        label: row.label,
        granted: row[inBs ? bsKey.granted : primaryKey.granted],
        used: row[inBs ? bsKey.used : primaryKey.used],
        pending: row[inBs ? bsKey.pending : primaryKey.pending],
      })),
    [rows, inBs]
  )

  const totals = useMemo(
    () =>
      seriesOrder.map((series) => ({
        series,
        primary: rows.reduce((acc, row) => acc + (row[primaryKey[series]] as number), 0),
        bs: rows.reduce((acc, row) => acc + (row[bsKey[series]] as number), 0),
      })),
    [rows]
  )

  const allVisible = visibleSeries.length === seriesOrder.length

  function toggleSeries(series: IncentiveSeries, checked: boolean) {
    setVisibleSeries((current) => {
      if (checked) return seriesOrder.filter((item) => item === series || current.includes(item))
      // Nunca dejamos el gráfico sin series: la última activa no se puede desmarcar.
      return current.length === 1 ? current : current.filter((item) => item !== series)
    })
  }

  return (
    <div className={cn('flex flex-col gap-4 rounded-xl border border-border bg-card p-5', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Tabs value={unit} onValueChange={(value) => setUnit(value as IncentiveUnit)}>
          <TabsList>
            <TabsTrigger value={IncentiveUnit.Primary}>En {primaryUnit.label}</TabsTrigger>
            <TabsTrigger value={IncentiveUnit.Bs}>En Bs</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {totals.map(({ series, primary, bs }) => (
          <label key={series} className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
            <Checkbox
              checked={visibleSeries.includes(series)}
              onCheckedChange={(checked) => toggleSeries(series, checked === true)}
            />
            <span className="size-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: seriesColors[series] }} />
            <span className="font-medium">{seriesLabels[series]}</span>
            <span className="text-muted-foreground">
              ({primaryUnit.format(primary)} / {formatBs(bs)})
            </span>
          </label>
        ))}
        <Button variant="outline" size="sm" className="ml-auto" disabled={allVisible} onClick={() => setVisibleSeries([...seriesOrder])}>
          Todos
        </Button>
      </div>

      <ChartContainer config={chartConfig} className={cn('aspect-auto w-full', chartHeightClassName)}>
        <BarChart data={chartRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval={0} />
          <YAxis hide />
          <ChartTooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="size-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: seriesColors[name as IncentiveSeries] }} />
                      {seriesLabels[name as IncentiveSeries]}
                    </span>
                    <span className="font-mono font-medium text-foreground tabular-nums">{formatValue(Number(value))}</span>
                  </div>
                )}
              />
            }
          />
          {seriesOrder
            .filter((series) => visibleSeries.includes(series))
            .map((series) => (
              <Bar
                key={series}
                dataKey={series}
                fill={`var(--color-${series})`}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              />
            ))}
        </BarChart>
      </ChartContainer>
    </div>
  )
}
