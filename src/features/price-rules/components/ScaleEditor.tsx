import { AlertTriangle, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OUTCOME_TYPE_LABELS } from '@/features/price-rules/labels'
import type { OutcomeType, ScaleRow } from '@/features/price-rules/types'

/**
 * Sub-panel dinámico cuando Tipo de Regla = Escala.
 *
 * `requireValue=false` (Bonificación/Recargo): el resultado de cada escalón son los productos
 * cargados en el panel de arriba, no un monto — el campo/columna "Valor" no aplica y se oculta.
 */
export function ScaleEditor({
  scales,
  onChange,
  outcomeType,
  requireValue = true,
}: {
  scales: ScaleRow[]
  onChange: (scales: ScaleRow[]) => void
  outcomeType: OutcomeType
  requireValue?: boolean
}) {
  const [firstFrom, setFirstFrom] = useState('0')
  const [to, setTo] = useState('')
  const [noLimit, setNoLimit] = useState(false)
  const [value, setValue] = useState('')

  const overlaps = hasOverlap(scales)

  // El "Valor" es un porcentaje para Descuento %, pero Bs para Descuento por monto y Precio Fijo — sin
  // la unidad al lado, "5" es ambiguo (¿5% o Bs 5?).
  const valueLabel = outcomeType === 'DISCOUNT_PERCENTAGE' ? 'Valor (%)' : 'Valor (Bs)'

  // La próxima "Desde" continúa automáticamente donde terminó la última escala cargada — evita dejar
  // huecos entre escalones. Solo el primer escalón (sin filas todavía) es editable.
  const maxTo = scales.length > 0 ? Math.max(...scales.map((s) => s.to ?? s.from)) : null
  const computedFrom = maxTo !== null ? maxTo + 1 : null
  const fromValue = computedFrom !== null ? String(computedFrom) : firstFrom
  const fromLocked = computedFrom !== null

  function addScale() {
    const fromNum = Number(fromValue)
    const toNum = noLimit ? null : to === '' ? null : Number(to)
    const valueNum = requireValue ? Number(value) : undefined
    if (Number.isNaN(fromNum)) return
    if (requireValue && Number.isNaN(valueNum)) return
    onChange([...scales, { id: crypto.randomUUID(), from: fromNum, to: toNum, value: valueNum, outcomeType }])
    setFirstFrom('0')
    setTo('')
    setNoLimit(false)
    setValue('')
  }

  function removeScale(id: string) {
    onChange(scales.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
      <div className={`grid grid-cols-2 gap-3 sm:items-start ${requireValue ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
        <div className="space-y-1.5">
          <Label htmlFor="scale-from">Desde</Label>
          <Input id="scale-from" type="number" value={fromValue} disabled={fromLocked} className={fromLocked ? 'bg-muted' : undefined} onChange={(e) => setFirstFrom(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="scale-to">Hasta</Label>
          <Input id="scale-to" type="number" value={to} disabled={noLimit} onChange={(e) => setTo(e.target.value)} />
          <div className="flex items-center gap-1.5 pt-1">
            <Checkbox id="scale-nolimit" checked={noLimit} onCheckedChange={(c) => setNoLimit(c === true)} />
            <Label htmlFor="scale-nolimit" className="text-xs font-normal text-muted-foreground">
              Este valor no tiene límite
            </Label>
          </div>
        </div>
        {requireValue && (
          <div className="space-y-1.5">
            <Label htmlFor="scale-value">{valueLabel}</Label>
            <Input id="scale-value" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
        )}
        <div className="space-y-1.5">
          <Label className="invisible select-none">Acción</Label>
          <Button type="button" onClick={addScale} className="w-full gap-1.5">
            <Plus /> Adicionar Escala
          </Button>
        </div>
      </div>

      {overlaps && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span>Hay escalas que se solapan. Ordená o ajustá los rangos para evitar ambigüedad.</span>
        </div>
      )}

      {scales.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-sm">Lista de Escalas</Label>
          <div className="rounded-lg border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Desde</TableHead>
                  <TableHead>Hasta</TableHead>
                  {requireValue && <TableHead>{valueLabel}</TableHead>}
                  <TableHead>Tipo</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...scales]
                  .sort((a, b) => a.from - b.from)
                  .map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.from}</TableCell>
                      <TableCell>{s.to ?? 'Sin límite'}</TableCell>
                      {requireValue && <TableCell>{s.value ?? '—'}</TableCell>}
                      <TableCell className="text-muted-foreground">{OUTCOME_TYPE_LABELS[s.outcomeType ?? outcomeType]}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-sm" onClick={() => removeScale(s.id)} aria-label="Eliminar">
                          <Trash2 className="text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

function hasOverlap(scales: ScaleRow[]): boolean {
  const sorted = [...scales].sort((a, b) => a.from - b.from)
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i]
    const next = sorted[i + 1]
    if (current.to === null || current.to >= next.from) return true
  }
  return false
}
