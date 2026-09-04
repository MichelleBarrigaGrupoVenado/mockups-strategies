import { Info, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { CatalogItem, ProductCatalogItem } from '@/features/price-rules/data/catalogs'
import { SALE_CHANNELS } from '@/features/price-rules/data/catalogs'
import type { CriteriaElementType, CriteriaRow, SpecificElementType, SpecificRow } from '@/features/price-rules/types'
import { CatalogCombobox } from './CatalogCombobox'

interface ElementConfig<T extends string> {
  value: T
  label: string
  catalog: CatalogItem[]
}

/** Panel "Criterios de la Regla" (el "quién"). */
export function CriteriaRowsPanel({
  rows,
  onChange,
  elements,
  hasDistributor,
}: {
  rows: CriteriaRow[]
  onChange: (rows: CriteriaRow[]) => void
  elements: ElementConfig<CriteriaElementType>[]
  hasDistributor: boolean
}) {
  const [selectedType, setSelectedType] = useState<CriteriaElementType>('UNIVERSAL')
  const activeType = rows.length > 0 ? rows[0].type : selectedType
  const config = elements.find((e) => e.value === activeType)
  const locked = rows.length > 0

  // Ruta exige elegir también un Canal de Venta — una ruta por sí sola es ambigua entre canales. Se
  // guarda junto a la fila, no aparte.
  const [pendingSaleChannel, setPendingSaleChannel] = useState<CatalogItem | null>(null)

  function addRow(item: CatalogItem) {
    if (activeType === 'RUTA' && !pendingSaleChannel) return
    onChange([
      ...rows,
      {
        id: crypto.randomUUID(),
        type: activeType,
        code: item.code,
        name: item.name,
        ...(activeType === 'RUTA' && pendingSaleChannel
          ? { saleChannelId: pendingSaleChannel.id, saleChannelCode: pendingSaleChannel.code, saleChannelName: pendingSaleChannel.name }
          : {}),
      },
    ])
    setPendingSaleChannel(null)
  }

  function removeRow(id: string) {
    onChange(rows.filter((r) => r.id !== id))
  }

  const isCustomerAndBlocked = activeType === 'CLIENTE' && !hasDistributor

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <label className="text-sm font-medium">Elemento</label>
          <NativeSelect
            className="w-full"
            value={activeType}
            disabled={locked}
            onChange={(e) => {
              setSelectedType(e.target.value as CriteriaElementType)
              setPendingSaleChannel(null)
            }}
          >
            <NativeSelectOption value="UNIVERSAL">Universal</NativeSelectOption>
            {elements.map((e) => (
              <NativeSelectOption key={e.value} value={e.value}>
                {e.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        {locked && (
          <Tooltip>
            <TooltipTrigger render={<Info className="mb-2.5 size-4 shrink-0 text-muted-foreground" />} />
            <TooltipContent>Elimina las filas cargadas para cambiar el tipo de criterio.</TooltipContent>
          </Tooltip>
        )}
      </div>

      {activeType === 'UNIVERSAL' ? (
        <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
          Sin restricción — aplica a todos los sujetos de este criterio.
        </p>
      ) : (
        <>
          {isCustomerAndBlocked ? (
            <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
              Selecciona al menos una Distribuidora en Criterios Generales para buscar clientes.
            </p>
          ) : (
            <div className="flex gap-2">
              {activeType === 'RUTA' && (
                <div className="w-56 space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Canal de Venta</Label>
                  <NativeSelect
                    className="w-full"
                    value={pendingSaleChannel?.code ?? ''}
                    onChange={(e) => setPendingSaleChannel(SALE_CHANNELS.find((c) => c.code === e.target.value) ?? null)}
                  >
                    <NativeSelectOption value="">Elegí un canal…</NativeSelectOption>
                    {SALE_CHANNELS.map((c) => (
                      <NativeSelectOption key={c.code} value={c.code}>
                        {c.name}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
              )}
              <div className="flex-1 space-y-1.5">
                {activeType === 'RUTA' && <Label className="invisible text-xs text-muted-foreground select-none">Ruta</Label>}
                <CatalogCombobox
                  items={config?.catalog ?? []}
                  onSelect={addRow}
                  disabled={activeType === 'RUTA' && !pendingSaleChannel}
                  placeholder={activeType === 'RUTA' && !pendingSaleChannel ? 'Elegí primero un Canal de Venta…' : `Buscar ${config?.label.toLowerCase() ?? ''}…`}
                />
              </div>
            </div>
          )}

          {rows.length > 0 && (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    {activeType === 'RUTA' && <TableHead>Canal de Venta</TableHead>}
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-muted-foreground">{elements.find((e) => e.value === row.type)?.label}</TableCell>
                      <TableCell className="font-mono text-xs">{row.code}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      {activeType === 'RUTA' && <TableCell className="text-muted-foreground">{row.saleChannelName ?? '—'}</TableCell>}
                      <TableCell>
                        <Button variant="ghost" size="icon-sm" onClick={() => removeRow(row.id)} aria-label="Eliminar">
                          <Trash2 className="text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/** Panel "Criterios Específicos" (el "sobre qué producto") — misma mecánica, filas con Unidad de Medida. */
export function SpecificRowsPanel({
  rows,
  onChange,
  elements,
  requireQty = false,
}: {
  rows: SpecificRow[]
  onChange: (rows: SpecificRow[]) => void
  elements: ElementConfig<SpecificElementType>[]
  // Tipo de Resolución "Restrictivo por Cantidad" — cada fila Producto exige además una cantidad
  // mínima propia, no solo su presencia en el pedido.
  requireQty?: boolean
}) {
  const [selectedType, setSelectedType] = useState<SpecificElementType>('UNIVERSAL')
  const activeType = rows.length > 0 ? rows[0].type : selectedType
  const config = elements.find((e) => e.value === activeType)
  const locked = rows.length > 0

  // Producto pasa por un paso intermedio: al elegirlo se muestra su Unidad de Medida real (viene del
  // catálogo, no se puede tocar) y recién con "Adicionar" se agrega la fila.
  const [pendingProduct, setPendingProduct] = useState<ProductCatalogItem | null>(null)
  const [pendingQty, setPendingQty] = useState('')

  function addRow(item: CatalogItem) {
    if (activeType === 'PRODUCTO') {
      setPendingProduct(item as ProductCatalogItem)
      return
    }
    onChange([...rows, { id: crypto.randomUUID(), type: activeType, code: item.code, name: item.name }])
  }

  function confirmAddProduct() {
    if (!pendingProduct) return
    if (requireQty && (!pendingQty || Number(pendingQty) <= 0)) return
    onChange([
      ...rows,
      {
        id: crypto.randomUUID(),
        type: 'PRODUCTO',
        code: pendingProduct.code,
        name: pendingProduct.name,
        unit: pendingProduct.unit,
        ...(requireQty ? { requiredQty: Number(pendingQty) } : {}),
      },
    ])
    setPendingProduct(null)
    setPendingQty('')
  }

  function removeRow(id: string) {
    onChange(rows.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <label className="text-sm font-medium">Elemento</label>
          <NativeSelect
            className="w-full"
            value={activeType}
            disabled={locked}
            onChange={(e) => {
              setSelectedType(e.target.value as SpecificElementType)
              setPendingProduct(null)
            }}
          >
            <NativeSelectOption value="UNIVERSAL">Universal</NativeSelectOption>
            {elements.map((e) => (
              <NativeSelectOption key={e.value} value={e.value}>
                {e.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        {locked && (
          <Tooltip>
            <TooltipTrigger render={<Info className="mb-2.5 size-4 shrink-0 text-muted-foreground" />} />
            <TooltipContent>Elimina las filas cargadas para cambiar el tipo de criterio.</TooltipContent>
          </Tooltip>
        )}
      </div>

      {activeType === 'UNIVERSAL' ? (
        <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">Sin restricción — aplica a todos los productos.</p>
      ) : (
        <>
          <CatalogCombobox
            items={config?.catalog ?? []}
            onSelect={addRow}
            placeholder={activeType === 'PRODUCTO' && pendingProduct ? pendingProduct.name : `Buscar ${config?.label.toLowerCase() ?? ''}…`}
          />

          {activeType === 'PRODUCTO' && pendingProduct && (
            <div className="flex items-end gap-2 rounded-lg border bg-muted/30 p-3">
              <div className="flex-1 space-y-1.5">
                <Label>Unidad de Medida</Label>
                <Input value={pendingProduct.unit} disabled className="bg-muted" />
              </div>
              {requireQty && (
                <div className="w-32 space-y-1.5">
                  <Label>Cantidad Requerida</Label>
                  <Input type="number" min={1} value={pendingQty} onChange={(e) => setPendingQty(e.target.value)} />
                </div>
              )}
              <Button type="button" onClick={confirmAddProduct} disabled={requireQty && (!pendingQty || Number(pendingQty) <= 0)} className="gap-1.5">
                <Plus /> Adicionar
              </Button>
            </div>
          )}

          {rows.length > 0 && (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Producto / Valor</TableHead>
                    <TableHead>Unidad de Medida</TableHead>
                    {requireQty && <TableHead>Cantidad Requerida</TableHead>}
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-muted-foreground">{elements.find((e) => e.value === row.type)?.label}</TableCell>
                      <TableCell className="font-mono text-xs">{row.code}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">{row.unit ?? '—'}</TableCell>
                      {requireQty && <TableCell>{row.requiredQty ?? '—'}</TableCell>}
                      <TableCell>
                        <Button variant="ghost" size="icon-sm" onClick={() => removeRow(row.id)} aria-label="Eliminar">
                          <Trash2 className="text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
