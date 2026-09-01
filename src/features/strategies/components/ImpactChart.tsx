import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'

const chartConfig = {
  value: { label: 'Ticket promedio', color: 'hsl(var(--primary))' },
} satisfies ChartConfig

export function ImpactChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <BarChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis hide />
        <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} maxBarSize={96}>
          <LabelList
            dataKey="value"
            position="top"
            formatter={(value: unknown) => `Bs${value}`}
            className="fill-foreground text-xs font-semibold"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
