import { useState } from 'react'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'

interface Option {
  value: string
  label: string
}

interface AddClientSearchProps {
  options: Option[]
  onAdd: (clientId: string) => void
  disabled?: boolean
}

/**
 * Buscador para volver a agregar, uno por uno, a un cliente específico que cumple las condiciones de
 * segmentación pero no aparece en la tabla (ej. quedó fuera del polígono dibujado en el mapa, o fue
 * quitado a mano). Se remonta con una `key` tras cada selección: al no guardar el valor elegido, es la
 * forma simple de limpiar el input y cerrar el popup para poder seguir agregando clientes.
 */
export function AddClientSearch({ options, onAdd, disabled }: AddClientSearchProps) {
  const [resetKey, setResetKey] = useState(0)

  return (
    <Combobox
      key={resetKey}
      items={options}
      onValueChange={(item) => {
        if (!item) return
        onAdd((item as Option).value)
        setResetKey((k) => k + 1)
      }}
      itemToStringLabel={(item) => (item as Option).label}
      disabled={disabled || options.length === 0}
    >
      <ComboboxInput placeholder={options.length === 0 ? 'No hay clientes para agregar' : 'Buscar cliente por nombre...'} showTrigger={false} />
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
