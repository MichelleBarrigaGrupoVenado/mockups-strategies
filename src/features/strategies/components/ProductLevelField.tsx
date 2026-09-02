import { Field, FieldLabel } from '@/components/ui/field'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ProductSearchSelect } from '@/features/strategies/components/ProductSearchSelect'
import { getProductOptions, productLevelOptions, type ProductLevel } from '@/features/strategies/data/product-hierarchy'

interface ProductLevelFieldProps {
  levelLabel?: string
  valueLabel?: string
  level: string
  value: string
  onLevelChange: (level: string) => void
  onValueChange: (value: string) => void
}

export function ProductLevelField({
  levelLabel = 'Nivel de productos',
  valueLabel = 'Buscar producto',
  level,
  value,
  onLevelChange,
  onValueChange,
}: ProductLevelFieldProps) {
  const options = getProductOptions(level as ProductLevel | '')

  return (
    <>
      <Field>
        <FieldLabel>{levelLabel}</FieldLabel>
        <NativeSelect
          value={level}
          onChange={(e) => {
            onLevelChange(e.target.value)
            onValueChange('')
          }}
        >
          <NativeSelectOption value="">Seleccionar nivel</NativeSelectOption>
          {productLevelOptions.map((option) => (
            <NativeSelectOption key={option.value} value={option.value}>
              {option.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel>{valueLabel}</FieldLabel>
        <ProductSearchSelect options={options} value={value} onChange={onValueChange} disabled={!level} placeholder="Buscar por nombre..." />
      </Field>
    </>
  )
}
