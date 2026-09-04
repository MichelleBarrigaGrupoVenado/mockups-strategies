import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { PRODUCTS, UNITS } from '@/features/price-rules/data/catalogs'
import type { OptionalProductRow } from '@/features/price-rules/types'
import { CatalogCombobox } from './CatalogCombobox'

/** Modal "Agregar producto opcional" — equivalencia intercambiable por un producto de bonificación puntual (una fila de OutcomeProductsPanel), no por toda la regla. */
export function OptionalProductDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (row: OptionalProductRow) => void
}) {
  const [product, setProduct] = useState<{ code: string; name: string } | null>(null)
  const [unit, setUnit] = useState('UN')
  const [qty, setQty] = useState('1')

  const canAdd = product !== null && Number(qty) > 0

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) {
          setProduct(null)
          setUnit('UN')
          setQty('1')
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar producto opcional</DialogTitle>
          <DialogDescription>Equivalencia intercambiable por este producto de regalo.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Producto</Label>
            <CatalogCombobox items={PRODUCTS} placeholder={product ? product.name : 'Buscar producto…'} onSelect={(item) => setProduct({ code: item.code, name: item.name })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Unidad de Medida</Label>
              <NativeSelect className="w-full" value={unit} onChange={(e) => setUnit(e.target.value)}>
                {UNITS.map((u) => (
                  <NativeSelectOption key={u.id} value={u.code}>
                    {u.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label>Cantidad</Label>
              <Input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={!canAdd}
            onClick={() => {
              if (!product) return
              onAdd({ id: crypto.randomUUID(), code: product.code, name: product.name, unit, qty: Number(qty) })
              onOpenChange(false)
            }}
          >
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
