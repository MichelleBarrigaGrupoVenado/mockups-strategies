import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'

interface Option {
  value: string
  label: string
}

interface ProductSearchSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ProductSearchSelect({ options, value, onChange, placeholder, disabled }: ProductSearchSelectProps) {
  const selected = options.find((option) => option.value === value) ?? null

  return (
    <Combobox
      items={options}
      value={selected}
      onValueChange={(item) => onChange(item ? (item as Option).value : '')}
      itemToStringLabel={(item) => (item as Option).label}
      disabled={disabled}
    >
      <ComboboxInput placeholder={disabled ? 'Selecciona un nivel primero' : (placeholder ?? 'Buscar...')} showClear />
      <ComboboxContent>
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
  )
}
