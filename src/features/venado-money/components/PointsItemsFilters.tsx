import { ListFilter, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { productLevelOptions, getProductOptions, type ProductLevel } from '@/features/strategies/data/product-hierarchy'
import { PointsItemStatus, PointsItemType, VigencyType } from '@/features/venado-money/types'
import { cn } from '@/lib/utils'

const catalogLevelOptions = productLevelOptions.filter((option) => option.value !== 'producto')

interface PointsItemsFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  type: PointsItemType | ''
  onTypeChange: (value: PointsItemType | '') => void
  level: ProductLevel | ''
  onLevelChange: (value: ProductLevel | '') => void
  levelValue: string
  onLevelValueChange: (value: string) => void
  status: PointsItemStatus | ''
  onStatusChange: (value: PointsItemStatus | '') => void
  vigency: VigencyType | ''
  onVigencyChange: (value: VigencyType | '') => void
  moreFiltersOpen: boolean
  onToggleMoreFilters: () => void
}

export function PointsItemsFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  level,
  onLevelChange,
  levelValue,
  onLevelValueChange,
  status,
  onStatusChange,
  vigency,
  onVigencyChange,
  moreFiltersOpen,
  onToggleMoreFilters,
}: PointsItemsFiltersProps) {
  const levelValueOptions = getProductOptions(level)

  return (
    <Card className="gap-3 p-5">
      <div className="flex flex-wrap items-center gap-4">
        <InputGroup className="w-64 max-w-full">
          <InputGroupAddon>
            <Search size={15} />
          </InputGroupAddon>
          <InputGroupInput placeholder="Buscar por nombre..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
        </InputGroup>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tipo:</span>
          <NativeSelect value={type} onChange={(e) => onTypeChange(e.target.value as PointsItemType | '')}>
            <NativeSelectOption value="">Todos</NativeSelectOption>
            <NativeSelectOption value={PointsItemType.Product}>Producto</NativeSelectOption>
            <NativeSelectOption value={PointsItemType.External}>Ítem Externo</NativeSelectOption>
          </NativeSelect>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Nivel:</span>
          <NativeSelect
            value={level}
            onChange={(e) => {
              onLevelChange(e.target.value as ProductLevel | '')
              onLevelValueChange('')
            }}
          >
            <NativeSelectOption value="">Todos</NativeSelectOption>
            {catalogLevelOptions.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Valor:</span>
          <NativeSelect value={levelValue} onChange={(e) => onLevelValueChange(e.target.value)} disabled={!level}>
            <NativeSelectOption value="">Todos</NativeSelectOption>
            {levelValueOptions.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Estado:</span>
          <NativeSelect value={status} onChange={(e) => onStatusChange(e.target.value as PointsItemStatus | '')}>
            <NativeSelectOption value="">Todos los estados</NativeSelectOption>
            <NativeSelectOption value={PointsItemStatus.Active}>Activo</NativeSelectOption>
            <NativeSelectOption value={PointsItemStatus.Inactive}>Inactivo</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleMoreFilters}
        className={cn(
          'flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground',
          moreFiltersOpen && 'text-foreground'
        )}
      >
        <ListFilter size={14} />
        Más filtros
      </button>

      {moreFiltersOpen && (
        <div className="flex items-center gap-2 border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">Vigencia:</span>
          <NativeSelect value={vigency} onChange={(e) => onVigencyChange(e.target.value as VigencyType | '')}>
            <NativeSelectOption value="">Todas</NativeSelectOption>
            <NativeSelectOption value={VigencyType.Permanent}>Permanente</NativeSelectOption>
            <NativeSelectOption value={VigencyType.WithEndDate}>Con fecha de finalización</NativeSelectOption>
          </NativeSelect>
        </div>
      )}
    </Card>
  )
}
