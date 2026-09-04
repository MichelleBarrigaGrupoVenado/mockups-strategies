import { ChevronsUpDown, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { CatalogItem } from '@/features/price-rules/data/catalogs'

/** Combobox con búsqueda "contiene" (no prefijo) — replica el select2 typeahead del formulario original. */
export function CatalogCombobox({
  items,
  onSelect,
  placeholder = 'Buscar…',
  disabled = false,
  emptyMessage = 'Sin resultados.',
}: {
  items: CatalogItem[]
  onSelect: (item: CatalogItem) => void
  placeholder?: string
  disabled?: boolean
  emptyMessage?: string
}) {
  const [open, setOpen] = useState(false)
  // Buscador controlado: cmdk lo deja como estaba entre aperturas si no se resetea a mano, así que al
  // elegir un item o cerrar el popover se limpia para que la próxima búsqueda arranque en blanco.
  const [search, setSearch] = useState('')

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) setSearch('')
      }}
    >
      <PopoverTrigger
        render={
          <Button variant="outline" role="combobox" aria-expanded={open} disabled={disabled} className="w-full justify-between font-normal text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Search className="size-3.5" />
              {placeholder}
            </span>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
          <CommandInput placeholder={placeholder} value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.code} ${item.name}`}
                  onSelect={() => {
                    onSelect(item)
                    setSearch('')
                    setOpen(false)
                  }}
                >
                  <span className="flex flex-col">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.code}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Multi-select sobre el mismo patrón (Distribuidora, Almacenes) — las opciones ya seleccionadas se
 * muestran como chips debajo del trigger y desaparecen de la lista del dropdown al reabrirlo.
 */
export function CatalogMultiSelect<TKey extends string | number = number>({
  items,
  selectedIds,
  onChange,
  placeholder = 'Seleccionar…',
  getKey = (item) => item.id as unknown as TKey,
  disabled = false,
}: {
  items: CatalogItem[]
  selectedIds: TKey[]
  onChange: (ids: TKey[]) => void
  placeholder?: string
  getKey?: (item: CatalogItem) => TKey
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  function add(key: TKey) {
    onChange([...selectedIds, key])
    setSearch('')
  }

  function remove(key: TKey) {
    onChange(selectedIds.filter((i) => i !== key))
  }

  const selectedItems = selectedIds.map((key) => items.find((item) => getKey(item) === key)).filter((item): item is CatalogItem => Boolean(item))

  const availableItems = items.filter((item) => !selectedIds.includes(getKey(item)))

  return (
    <div className="space-y-1.5">
      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o)
          if (!o) setSearch('')
        }}
      >
        <PopoverTrigger
          render={
            <Button variant="outline" role="combobox" aria-expanded={open} disabled={disabled} className="w-full justify-between font-normal text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Search className="size-3.5" />
                {placeholder}
              </span>
              <ChevronsUpDown className="opacity-50" />
            </Button>
          }
        />
        <PopoverContent className="w-[320px] p-0" align="start">
          <Command filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
            <CommandInput placeholder="Buscar…" value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>{availableItems.length === 0 && items.length > 0 ? 'Ya se seleccionaron todos.' : 'Sin resultados.'}</CommandEmpty>
              <CommandGroup>
                {availableItems.map((item) => (
                  <CommandItem key={getKey(item)} value={`${item.code} ${item.name}`} onSelect={() => add(getKey(item))}>
                    <span className="flex flex-col">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.code}</span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedItems.map((item) => (
            <Badge key={getKey(item)} variant="secondary" className="gap-1 py-1 pr-1">
              {item.name}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => remove(getKey(item))}
                  aria-label={`Quitar ${item.name}`}
                  className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <X className="size-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
