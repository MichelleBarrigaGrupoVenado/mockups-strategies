import { LayoutGrid, ListFilter, Plus, Search, Table2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useStrategies } from '@/features/strategies/api/useStrategies'
import { StrategyCard } from '@/features/strategies/components/StrategyCard'

export function StrategiesListPage() {
  const { data: strategies, isLoading } = useStrategies()
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')

  const filtered = strategies?.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground">Estrategias comerciales</h1>
          <p className="text-sm text-muted-foreground">Diseña y administra estrategias para generar crecimiento comercial.</p>
        </div>
        <Button asChild>
          <Link to="/estrategias/crear">
            <Plus data-icon="inline-start" />
            Crear estrategia
          </Link>
        </Button>
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
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}

        {filtered?.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}

        <Link
          to="/estrategias/crear"
          className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border text-center transition-colors hover:border-primary/40 hover:bg-muted/40"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Plus size={20} />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">Nueva Estrategia</span>
            <span className="max-w-40 text-xs text-muted-foreground">Comienza desde cero o usa una plantilla</span>
          </span>
        </Link>
      </div>
    </div>
  )
}
