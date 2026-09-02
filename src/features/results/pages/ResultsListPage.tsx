import { LayoutGrid, ListFilter, Search, Table2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useResultStrategies } from '@/features/results/api/useResults'
import { ResultStrategyCard } from '@/features/results/components/ResultStrategyCard'

export function ResultsListPage() {
  const { data: results, isLoading } = useResultStrategies()
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')

  const filtered = results?.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-foreground">Impacto y Atribución</h1>
        <p className="text-sm text-muted-foreground">
          ¿La estrategia realmente funciona? Análisis detallado de los resultados experimentales y la atribución directa del valor generado.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <InputGroup className="w-72 max-w-full">
            <InputGroupAddon>
              <Search size={16} />
            </InputGroupAddon>
            <InputGroupInput placeholder="Buscar estrategias..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <Button variant="outline">
            <ListFilter data-icon="inline-start" />
            Filtros
          </Button>
        </div>

        <div className="flex items-center rounded-lg border border-border p-0.5">
          <button
            type="button"
            onClick={() => setView('grid')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}
          >
            <LayoutGrid size={14} />
            Vista Grid
          </button>
          <button
            type="button"
            onClick={() => setView('table')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              view === 'table' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}
          >
            <Table2 size={14} />
            Vista Tabla
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}

        {filtered?.map((result) => (
          <ResultStrategyCard key={result.id} result={result} />
        ))}
      </div>
    </div>
  )
}
