import { Layers, X } from 'lucide-react'
import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ProductSearchSelect } from '@/features/strategies/components/ProductSearchSelect'
import {
  getDescendantOptions,
  getProductNodeLevel,
  getProductNodePath,
  getProductOptions,
  isDescendantOf,
  productLevelOptions,
  productLevelOrder,
  type ProductLevel,
} from '@/features/strategies/data/product-hierarchy'

interface Option {
  value: string
  label: string
}

const levelLabelByValue = new Map(productLevelOptions.map((option) => [option.value, option.label]))

interface ProductLevelFieldProps {
  levelLabel?: string
  valueLabel?: string
  /**
   * Ids de nodos de la jerarquía seleccionados, potencialmente de distintos niveles a la vez (ej. una
   * marca completa más dos familias puntuales de esa misma marca).
   */
  values: string[]
  onValuesChange: (values: string[]) => void
  /** Texto de ayuda bajo el selector (ej. aclarar que es opcional). */
  hint?: string
}

export function ProductLevelField({
  levelLabel = 'Nivel de productos',
  valueLabel = 'Buscar producto',
  values,
  onValuesChange,
  hint,
}: ProductLevelFieldProps) {
  // "Acotar por" (opcional): un nodo de referencia (ej. la marca Bristar) que filtra las opciones del
  // selector de abajo sin obligar a completar los niveles intermedios (Categoría, Grupo).
  const [scopeLevel, setScopeLevel] = useState<ProductLevel | ''>('')
  const [scopeId, setScopeId] = useState('')
  const [targetLevel, setTargetLevel] = useState<ProductLevel | ''>('')

  const scopeOptions = getProductOptions(scopeLevel)
  const targetLevelOptions = scopeLevel ? productLevelOrder.slice(productLevelOrder.indexOf(scopeLevel)) : productLevelOrder
  const targetOptions: Option[] = getDescendantOptions(targetLevel, scopeId || undefined)

  const anchorRef = useComboboxAnchor()

  function handleScopeLevelChange(level: ProductLevel | '') {
    setScopeLevel(level)
    setScopeId('')
    // Por defecto se refina en el mismo nivel elegido — así con solo tildar la opción que aparece se
    // agrega el nodo completo (ej. toda la marca), sin un paso extra.
    setTargetLevel(level)
  }

  function handleScopeIdChange(id: string) {
    setScopeId(id)
    if (!targetLevel) setTargetLevel(scopeLevel)
  }

  function isInCurrentBucket(id: string) {
    if (getProductNodeLevel(id) !== targetLevel) return false
    if (scopeId && !isDescendantOf(id, scopeId)) return false
    return true
  }

  function handleTargetValuesChange(selected: Option[]) {
    const kept = values.filter((id) => !isInCurrentBucket(id))
    onValuesChange([...kept, ...selected.map((option) => option.value)])
  }

  function handleRemove(id: string) {
    onValuesChange(values.filter((value) => value !== id))
  }

  return (
    <>
      <Field>
        <FieldLabel>{levelLabel}</FieldLabel>
        <p className="text-xs text-muted-foreground">
          Opcional: acota primero por un nivel superior (ej. una marca) para que abajo solo aparezcan sus opciones.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <NativeSelect value={scopeLevel} onChange={(e) => handleScopeLevelChange(e.target.value as ProductLevel | '')}>
            <NativeSelectOption value="">Sin acotar (todo el catálogo)</NativeSelectOption>
            {productLevelOptions.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <ProductSearchSelect
            options={scopeOptions}
            value={scopeId}
            onChange={handleScopeIdChange}
            disabled={!scopeLevel}
            placeholder={scopeLevel ? `Buscar ${levelLabelByValue.get(scopeLevel)?.toLowerCase()}...` : 'Elige un nivel primero'}
          />
        </div>
      </Field>

      <Field>
        <FieldLabel>{valueLabel}</FieldLabel>
        <div className="grid grid-cols-[140px_1fr] gap-2">
          <NativeSelect
            value={targetLevel}
            disabled={!!scopeLevel && !scopeId}
            onChange={(e) => setTargetLevel(e.target.value as ProductLevel | '')}
          >
            <NativeSelectOption value="">Nivel</NativeSelectOption>
            {targetLevelOptions.map((level) => (
              <NativeSelectOption key={level} value={level}>
                {levelLabelByValue.get(level)}
              </NativeSelectOption>
            ))}
          </NativeSelect>

          <Combobox
            items={targetOptions}
            multiple
            value={targetOptions.filter((option) => values.includes(option.value))}
            onValueChange={handleTargetValuesChange}
            itemToStringLabel={(item) => (item as Option).label}
            disabled={!targetLevel}
          >
            <ComboboxChips ref={anchorRef} className="min-h-8">
              <ComboboxValue>
                {(selected: Option[]) => selected.map((item) => <ComboboxChip key={item.value}>{item.label}</ComboboxChip>)}
              </ComboboxValue>
              <ComboboxChipsInput placeholder={targetLevel ? 'Buscar por nombre...' : 'Elige un nivel primero'} />
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
        </div>

        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </Field>

      {values.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {values.map((id) => {
            const path = getProductNodePath(id)
            const leaf = path.at(-1)
            const ancestors = path.slice(0, -1).map((node) => node.name)

            return (
              <div key={id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Layers size={13} />
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">{leaf?.name ?? id}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {leaf ? levelLabelByValue.get(leaf.level) : ''}
                      {ancestors.length > 0 ? ` · ${ancestors.join(' / ')}` : ''}
                    </span>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon-xs" className="shrink-0" onClick={() => handleRemove(id)}>
                  <X size={13} />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
