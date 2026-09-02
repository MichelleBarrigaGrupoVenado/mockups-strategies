import { Calendar, Flag, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useResultStrategyDetail } from '@/features/results/api/useResults'
import { ABTestTab } from '@/features/results/components/ABTestTab'
import { BeforeAfterTab } from '@/features/results/components/BeforeAfterTab'
import { StatisticalModelTab } from '@/features/results/components/StatisticalModelTab'
import { StatusBadge } from '@/features/strategies/components/StatusBadge'

export function ResultDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: result, isLoading } = useResultStrategyDetail(id)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-sm text-muted-foreground">No se encontraron resultados para esta estrategia.</p>
        <Button asChild variant="outline">
          <Link to="/resultados">Volver a Resultados</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link to="/resultados" className="w-fit text-xs font-medium text-muted-foreground uppercase hover:text-foreground">
        Resultados de Estrategias
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-foreground">{result.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Flag size={14} />
              Objetivo: {result.objectiveLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} />
              Segmento: {result.segmentLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {result.dateRangeLabel}
            </span>
          </div>
        </div>
        <StatusBadge status={result.status} />
      </div>

      <Tabs defaultValue="before-after">
        <TabsList variant="line">
          <TabsTrigger value="before-after">Antes y Después</TabsTrigger>
          <TabsTrigger value="ab-test">A/B Test</TabsTrigger>
          <TabsTrigger value="statistical-model">Modelo Estadístico</TabsTrigger>
        </TabsList>

        <TabsContent value="before-after" className="pt-4">
          <BeforeAfterTab data={result.beforeAfter} />
        </TabsContent>
        <TabsContent value="ab-test" className="pt-4">
          <ABTestTab data={result.abTest} />
        </TabsContent>
        <TabsContent value="statistical-model" className="pt-4">
          <StatisticalModelTab data={result.statisticalModel} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
