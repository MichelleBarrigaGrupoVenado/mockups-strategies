import { ArrowLeftRight, Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PRODUCTS, type ProductCatalogItem } from '@/features/price-rules/data/catalogs'
import type { OutcomeProductRow } from '@/features/price-rules/types'
import { CatalogCombobox } from './CatalogCombobox'
import { OptionalProductDialog } from './OptionalProductDialog'

/**
 * Filas de "Bonificación de Productos" / "Recargo por producto" (Configuración del Resultado
 * Esperado) — a diferencia del producto de Criterios Específicos, acá la Unidad de Medida SÍ se
 * elige, pero limitada a la cadena de empaque del producto (ej. Ketchup: Display → Caja).
 *
 * `allowOptionalProducts` habilita la columna/ícono de equivalencias — solo aplica a Bonificación
 * (un Recargo no tiene "regalo" que sustituir por otro producto).
 */
export function OutcomeProductsPanel({
  rows,
  onChange,
  allowOptionalProducts = false,
}: {
  rows: OutcomeProductRow[]
  onChange: (rows: OutcomeProductRow[]) => void
  allowOptionalProducts?: boolean
}) {
  const [pendingProduct, setPendingProduct] = useState<ProductCatalogItem | null>(null)
  const [unit, setUnit] = useState('')
  const [qty, setQty] = useState('1')
  const [optionalModalForRow, setOptionalModalForRow] = useState<string | null>(null)

  function selectProduct(item: ProductCatalogItem) {
    setPendingProduct(item)
    setUnit('')
    setQty('1')
  }

  function addRow() {
    if (!pendingProduct || !unit) return
    const qtyNum = Number(qty)
    if (Number.isNaN(qtyNum) || qtyNum <= 0) return
    onChange([...rows, { id: crypto.randomUUID(), code: pendingProduct.code, name: pendingProduct.name, unit, qty: qtyNum }])
    setPendingProduct(null)
    setUnit('')
    setQty('1')
  }

  function removeRow(id: string) {
    onChange(rows.filter((r) => r.id !== id))
  }

  function removeOptional(rowId: string, optionalId: string) {
    onChange(rows.map((r) => (r.id === rowId ? { ...r, optionalProducts: (r.optionalProducts ?? []).filter((o) => o.id !== optionalId) } : r)))
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>Producto</Label>
        <CatalogCombobox items={PRODUCTS} placeholder={pendingProduct ? pendingProduct.name : 'Buscar producto…'} onSelect={(item) => selectProduct(item as ProductCatalogItem)} />
      </div>

      {pendingProduct && (
        <div className="flex items-end gap-2 rounded-lg border bg-muted/30 p-3">
          <div className="flex-1 space-y-1.5">
            <Label>Unidad de Medida</Label>
            <NativeSelect className="w-full" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <NativeSelectOption value="">Seleccionar Valor</NativeSelectOption>
              {pendingProduct.units.map((u) => (
                <NativeSelectOption key={u} value={u}>
                  {u}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="w-28 space-y-1.5">
            <Label>Cantidad</Label>
            <Input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} />
          </div>
          <Button type="button" onClick={addRow} disabled={!unit} className="gap-1.5">
            <Plus /> Adicionar
          </Button>
        </div>
      )}

      {rows.length > 0 && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Unidad de Medida</TableHead>
                <TableHead>Cantidad</TableHead>
                {allowOptionalProducts && <TableHead>Productos Opcionales</TableHead>}
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.unit}</TableCell>
                  <TableCell>{row.qty}</TableCell>
                  {allowOptionalProducts && (
                    <TableCell>
                      {(row.optionalProducts?.length ?? 0) > 0 ? (
                        <div className="space-y-1">
                          {row.optionalProducts!.map((op) => (
                            <div key={op.id} className="flex items-center gap-2 rounded border bg-muted/30 px-2 py-1 text-xs">
                              <span className="font-mono text-muted-foreground">{op.code}</span>
                              <span className="flex-1">{op.name}</span>
                              <span className="text-muted-foreground">{op.unit}</span>
                              <span>{op.qty}</span>
                              <button type="button" onClick={() => removeOptional(row.id, op.id)} aria-label={`Quitar ${op.name}`} className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10">
                                <Minus className="size-3 text-destructive" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center">
                      {allowOptionalProducts && (
                        <Button variant="ghost" size="icon-sm" onClick={() => setOptionalModalForRow(row.id)} aria-label="Agregar producto opcional">
                          <ArrowLeftRight className="text-muted-foreground" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-sm" onClick={() => removeRow(row.id)} aria-label="Eliminar">
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {allowOptionalProducts && (
        <OptionalProductDialog
          open={optionalModalForRow !== null}
          onOpenChange={(o) => {
            if (!o) setOptionalModalForRow(null)
          }}
          onAdd={(newOptional) => {
            if (!optionalModalForRow) return
            onChange(rows.map((r) => (r.id === optionalModalForRow ? { ...r, optionalProducts: [...(r.optionalProducts ?? []), newOptional] } : r)))
            setOptionalModalForRow(null)
          }}
        />
      )}
    </div>
  )
}
