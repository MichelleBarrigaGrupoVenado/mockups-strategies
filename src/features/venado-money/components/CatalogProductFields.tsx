import { Package, X } from 'lucide-react'
import { Field, FieldLabel } from '@/components/ui/field'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Button } from '@/components/ui/button'
import {
  getProductBreadcrumb,
  getProductOptions,
  productLevelOptions,
  type ProductLevel,
} from '@/features/strategies/data/product-hierarchy'
import { ProductSearchSelect } from '@/features/strategies/components/ProductSearchSelect'
import { ProductUnitType } from '@/features/venado-money/types'

const catalogLevelOptions = productLevelOptions.filter((option) => option.value !== 'producto')
const productOptions = getProductOptions('producto')

interface CatalogProductFieldsProps {
  productLevel: ProductLevel | ''
  productLevelValue: string
  onLevelChange: (level: ProductLevel | '') => void
  onLevelValueChange: (value: string) => void
  productId: string
  onProductIdChange: (value: string) => void
  unitType: ProductUnitType
  onUnitTypeChange: (value: ProductUnitType) => void
}

export function CatalogProductFields({
  productLevel,
  productLevelValue,
  onLevelChange,
  onLevelValueChange,
  productId,
  onProductIdChange,
  unitType,
  onUnitTypeChange,
}: CatalogProductFieldsProps) {
  const levelValueOptions = getProductOptions(productLevel)
  const selectedProduct = productOptions.find((option) => option.value === productId)

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Selección de producto</span>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Nivel</FieldLabel>
          <NativeSelect
            value={productLevel}
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
        </Field>
        <Field>
          <FieldLabel>Valor</FieldLabel>
          <ProductSearchSelect
            options={levelValueOptions}
            value={productLevelValue}
            onChange={onLevelValueChange}
            disabled={!productLevel}
            placeholder="Todos"
          />
        </Field>
      </div>

      <Field>
        <FieldLabel>Buscar producto (Código, Nombre, SKU)</FieldLabel>
        <ProductSearchSelect options={productOptions} value={productId} onChange={onProductIdChange} placeholder="Ej: Ketchup..." />
      </Field>

      {selectedProduct && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Package size={15} />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">{selectedProduct.label}</span>
              <span className="text-xs text-muted-foreground">{getProductBreadcrumb(selectedProduct.value)}</span>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon-xs" onClick={() => onProductIdChange('')}>
            <X size={13} />
          </Button>
        </div>
      )}

      <Field>
        <FieldLabel>Unidad</FieldLabel>
        <NativeSelect value={unitType} onChange={(e) => onUnitTypeChange(e.target.value as ProductUnitType)}>
          <NativeSelectOption value={ProductUnitType.Package}>Paquete</NativeSelectOption>
          <NativeSelectOption value={ProductUnitType.Unit}>Unidad</NativeSelectOption>
        </NativeSelect>
      </Field>
    </div>
  )
}
