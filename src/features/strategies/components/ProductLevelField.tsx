import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { Field, FieldLabel } from '@/components/ui/field'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { getProductOptions, productLevelOptions, type ProductLevel } from '@/features/strategies/data/product-hierarchy'

interface Option {
  value: string
  label: string
}

interface ProductLevelFieldProps {
  levelLabel?: string
  valueLabel?: string
  level: string
  /** Uno o más nodos seleccionados dentro de `level` (ej. Ketchup y Mostaza en "Familia"). */
  values: string[]
  onLevelChange: (level: string) => void
  onValuesChange: (values: string[]) => void
  /** Texto de ayuda bajo el selector (ej. aclarar que es opcional). */
  hint?: string
}

export function ProductLevelField({
  levelLabel = 'Nivel de productos',
  valueLabel = 'Buscar producto',
  level,
  values,
  onLevelChange,
  onValuesChange,
  hint,
}: ProductLevelFieldProps) {
  const options = getProductOptions(level as ProductLevel | '')
  // Se resuelven desde `options` (no se guardan objetos en el store) para que la igualdad referencial
  // con `items` se mantenga y el combobox pueda marcar los chips como seleccionados correctamente.
  const selectedOptions = values
    .map((value) => options.find((option) => option.value === value))
    .filter((option): option is Option => !!option)
  const anchorRef = useComboboxAnchor()

  return (
    <>
      <Field>
        <FieldLabel>{levelLabel}</FieldLabel>
        <NativeSelect
          value={level}
          onChange={(e) => {
            onLevelChange(e.target.value)
            onValuesChange([])
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
        <Combobox
          items={options}
          multiple
          value={selectedOptions}
          onValueChange={(items) => onValuesChange(items.map((item) => item.value))}
          itemToStringLabel={(item) => item.label}
          disabled={!level}
        >
          <ComboboxChips ref={anchorRef} className="min-h-8">
            <ComboboxValue>
              {(selected: Option[]) => selected.map((item) => <ComboboxChip key={item.value}>{item.label}</ComboboxChip>)}
            </ComboboxValue>
            <ComboboxChipsInput placeholder={level ? 'Buscar por nombre...' : 'Selecciona un nivel primero'} />
          </ComboboxChips>
          <ComboboxContent anchor={anchorRef}>
            <ComboboxEmpty>Sin resultados.</ComboboxEmpty>
            <ComboboxList>
              {(item: Option) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </Field>
    </>
  )
}
