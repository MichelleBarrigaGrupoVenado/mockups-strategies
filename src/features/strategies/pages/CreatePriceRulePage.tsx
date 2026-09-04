import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { CatalogCombobox, CatalogMultiSelect } from '@/features/price-rules/components/CatalogCombobox'
import { SpecificRowsPanel } from '@/features/price-rules/components/CriteriaRowsPanel'
import { OutcomeProductsPanel } from '@/features/price-rules/components/OutcomeProductsPanel'
import { ScaleEditor } from '@/features/price-rules/components/ScaleEditor'
import { BRANDS, CATEGORIES, DISTRIBUTORS, DIVISIONS, FAMILIES, PRODUCTS, SUB_FAMILIES, WAREHOUSES } from '@/features/price-rules/data/catalogs'
import { ACCUMULATION_SCOPE_LABELS, COMPANY_LABELS, EXCLUSIVE_OUTCOME_LABELS, OUTCOME_TYPE_LABELS, RULE_TYPE_LABELS, SCALE_TYPE_LABELS, TARGET_LABELS } from '@/features/price-rules/labels'
import {
  emptyPriceRuleDraft,
  type AccumulationScope,
  type Company,
  type ExclusiveOutcome,
  type OutcomeMode,
  type OutcomeType,
  type PriceRuleDraft,
  type RuleType,
  type ScaleType,
  type TargetEnum,
} from '@/features/price-rules/types'
import { useWizardStore } from '@/features/strategies/store/useWizardStore'

const OUTCOME_MODES: { value: OutcomeMode; label: string; hint: string }[] = [
  { value: 'SINGLE', label: 'Tradicional', hint: 'Un solo valor de resultado.' },
  { value: 'SCALE', label: 'Escala', hint: 'El resultado depende de un rango (cantidad o monto).' },
  { value: 'FREQUENCY', label: 'Frecuencia', hint: 'El resultado se repite cada N unidades/monto.' },
  { value: 'ACCUMULATED', label: 'Acumulado', hint: 'El resultado se activa cuando el Dueño supera un monto acumulado de compras.' },
]

// Qué Tipo de Resultado combina con qué Tipo de Regla: Frecuencia ("bonificación" en la jerga de
// Comercial, su único uso real hoy es el 3x2) solo admite Bonificación de Productos. Escala admite
// Bonificación de Productos y Descuento %. Tradicional admite Bonificación de Productos y Recargo por
// producto. Acumulado se asume con los mismos permisos que Escala.
const OUTCOME_MODE_ALLOWED_TYPES: Record<OutcomeMode, OutcomeType[]> = {
  SINGLE: ['PRODUCT', 'PRODUCT_SURCHARGE'],
  FREQUENCY: ['PRODUCT'],
  SCALE: ['PRODUCT', 'DISCOUNT_PERCENTAGE'],
  ACCUMULATED: ['PRODUCT', 'DISCOUNT_PERCENTAGE'],
}

const ACCUMULATION_SCOPE_CATALOGS = {
  MARCA: BRANDS,
  FAMILIA: FAMILIES,
  CATEGORIA: CATEGORIES,
  PRODUCTO: PRODUCTS,
} as const

const VALUE_INPUT_LABELS: Record<OutcomeType, string> = {
  DISCOUNT_PERCENTAGE: 'Porcentaje de Descuento (%)',
  DISCOUNT_AMOUNT: 'Descuento (Bs)',
  FIXED_PRICE: 'Precio Fijo (Bs)',
  PRODUCT: '',
  PRODUCT_SURCHARGE: '',
}

const SPECIFIC_ELEMENTS = [
  { value: 'DIVISION' as const, label: 'División', catalog: DIVISIONS },
  { value: 'MARCA' as const, label: 'Marca', catalog: BRANDS },
  { value: 'CATEGORIA' as const, label: 'Categoría', catalog: CATEGORIES },
  { value: 'FAMILIA' as const, label: 'Familia', catalog: FAMILIES },
  { value: 'SUB_FAMILIA' as const, label: 'Sub-Familia', catalog: SUB_FAMILIES },
  { value: 'PRODUCTO' as const, label: 'Producto', catalog: PRODUCTS },
]

export function CreatePriceRulePage() {
  const navigate = useNavigate()
  const { data: wizardData, update: updateWizard } = useWizardStore()
  const existing = wizardData.priceRule
  const isEditing = !!existing

  const [rule, setRule] = useState<PriceRuleDraft>(() => (existing ? { ...existing } : emptyPriceRuleDraft()))
  const [confirmOpen, setConfirmOpen] = useState(false)

  function set<K extends keyof PriceRuleDraft>(key: K, value: PriceRuleDraft[K]) {
    setRule((prev) => ({ ...prev, [key]: value }))
  }

  // Bloqueo progresivo de Empresa una vez definidos Criterios Específicos o Resultado.
  const companyLocked = rule.specificRows.length > 0 || Boolean(rule.value) || (rule.scales?.length ?? 0) > 0 || (rule.outcomeProducts?.length ?? 0) > 0

  const showProductTargetWarning = rule.target === 'PRODUCT' && rule.specificRows.length === 0

  const isProductOutcome = rule.outcomeType === 'PRODUCT' || rule.outcomeType === 'PRODUCT_SURCHARGE'

  const canSubmit = rule.name.trim().length > 0 && rule.fromDate.trim().length > 0 && rule.thruDate.trim().length > 0

  function handleSave() {
    updateWizard({ priceRule: rule })
    toast.success(isEditing ? 'Regla de precios actualizada correctamente.' : 'Regla de precios creada correctamente.')
    setConfirmOpen(false)
    navigate('/estrategias/crear')
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Creador de campaña</span>
          <h1 className="text-2xl font-semibold text-foreground">{isEditing ? 'Editar Regla de Precios' : 'Nueva Regla de Precio'}</h1>
          <p className="text-sm text-muted-foreground">Los campos marcados con * son obligatorios.</p>
        </div>
        <Link to="/estrategias/crear" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <X size={16} />
          Volver a la estrategia
        </Link>
      </div>

      {/* DATOS GENERALES */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Datos Generales</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Empresa *</Label>
            <NativeSelect className="w-full" value={rule.company} disabled={companyLocked} onChange={(e) => set('company', e.target.value as Company)}>
              {Object.entries(COMPANY_LABELS).map(([k, v]) => (
                <NativeSelectOption key={k} value={k}>
                  {v}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {companyLocked && <p className="text-xs text-muted-foreground">No se puede cambiar una vez definidos Criterios Específicos o Resultado.</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price-rule-name">Nombre * (máx. 100)</Label>
            <Input id="price-rule-name" maxLength={100} value={rule.name} onChange={(e) => set('name', e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="price-rule-description">Descripción (máx. 255)</Label>
            <Textarea id="price-rule-description" maxLength={255} value={rule.description} onChange={(e) => set('description', e.target.value)} rows={2} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price-rule-from">Desde *</Label>
            <Input id="price-rule-from" type="date" value={rule.fromDate} onChange={(e) => set('fromDate', e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price-rule-thru">Hasta *</Label>
            <Input id="price-rule-thru" type="date" value={rule.thruDate} onChange={(e) => set('thruDate', e.target.value)} />
            <p className="text-xs text-muted-foreground">Toda regla tiene una fecha de fin — la vigencia no puede quedar abierta.</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Tipo de Regla *</Label>
          <div className="flex flex-wrap gap-2">
            {OUTCOME_MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => {
                  set('outcomeMode', m.value)
                  // Si el Tipo de Resultado actual ya no es válido para el nuevo Tipo de Regla, se cae
                  // al primero permitido (siempre Bonificación de Productos) para no dejar una
                  // combinación inválida.
                  if (!OUTCOME_MODE_ALLOWED_TYPES[m.value].includes(rule.outcomeType)) {
                    set('outcomeType', OUTCOME_MODE_ALLOWED_TYPES[m.value][0])
                  }
                }}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  rule.outcomeMode === m.value ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
                }`}
              >
                <div className="font-medium text-foreground">{m.label}</div>
                <div className="text-xs text-muted-foreground">{m.hint}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="price-rule-apply-once" checked={rule.applyOnlyOnce} onCheckedChange={(c) => set('applyOnlyOnce', c === true)} />
          <Label htmlFor="price-rule-apply-once" className="font-normal">
            Aplicar una sola vez por cliente
          </Label>
        </div>
      </div>

      {/* CRITERIOS GENERALES */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Criterios Generales</h2>

        <p className="-mt-2 text-xs text-muted-foreground">Aplica a todas las distribuidoras, almacenes y condiciones de pago.</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Distribuidora</Label>
            <CatalogMultiSelect items={DISTRIBUTORS} selectedIds={rule.distributorIds} onChange={() => {}} placeholder="Todas las distribuidoras" disabled />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Almacenes</Label>
            <CatalogMultiSelect items={WAREHOUSES} selectedIds={rule.warehouseIds} onChange={() => {}} placeholder="Todos los almacenes" disabled />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Condición de Pago</Label>
            <NativeSelect className="w-full" value="TODOS" disabled onChange={() => {}}>
              <NativeSelectOption value="TODOS">Todos</NativeSelectOption>
              <NativeSelectOption value="CASH">Contado</NativeSelectOption>
              <NativeSelectOption value="CREDIT">Crédito</NativeSelectOption>
              <NativeSelectOption value="CREDIT_ON_DELIVERY">Pronto Pago</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
      </div>

      {/* CRITERIOS DE LA REGLA */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Criterios de la Regla</h2>
          <p className="text-xs text-muted-foreground">A quién se le aplica esta regla.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Elemento</Label>
          <NativeSelect className="w-full" value="PROPIETARIO" disabled onChange={() => {}}>
            <NativeSelectOption value="PROPIETARIO">Propietario</NativeSelectOption>
          </NativeSelect>
        </div>

        <p className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">La regla se aplicará a todos los que cumplan el objetivo.</p>
      </div>

      {/* CRITERIOS ESPECÍFICOS */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Criterios Específicos</h2>
          <p className="text-xs text-muted-foreground">Sobre qué producto aplica esta regla.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Tipo de Resolución</Label>
          <div className="flex gap-2">
            {(['RESTRICTED', 'GENERAL', 'RESTRICTED_QUANTITY'] as RuleType[]).map((rt) => (
              <Button key={rt} type="button" size="sm" variant={rule.ruleType === rt ? 'default' : 'outline'} onClick={() => set('ruleType', rt)}>
                {RULE_TYPE_LABELS[rt]}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {rule.ruleType === 'RESTRICTED' && 'Deben calzar todos los sujetos cargados abajo (el más estricto).'}
            {rule.ruleType === 'GENERAL' && 'Basta con que uno de los sujetos cargados abajo calce.'}
            {rule.ruleType === 'RESTRICTED_QUANTITY' &&
              'Igual que Restrictivo, pero además cada Producto cargado abajo exige su propia cantidad mínima en el pedido (ej. 10 Ketchup + 10 Mayonesa + 10 Mostaza, no solo que estén presentes).'}
          </p>
        </div>

        <SpecificRowsPanel rows={rule.specificRows} onChange={(rows) => set('specificRows', rows)} elements={SPECIFIC_ELEMENTS} requireQty={rule.ruleType === 'RESTRICTED_QUANTITY'} />
      </div>

      {/* CONFIGURACIÓN DEL RESULTADO ESPERADO */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Configuración del Resultado Esperado</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Objetivo</Label>
            <NativeSelect className="w-full" value={rule.target} onChange={(e) => set('target', e.target.value as TargetEnum)}>
              {Object.entries(TARGET_LABELS).map(([k, v]) => (
                <NativeSelectOption key={k} value={k}>
                  {v}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {showProductTargetWarning && (
              <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-3.5" /> No hay Criterios Específicos cargados — el resultado no tiene sobre qué producto aplicarse.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Tipo de Resultado *</Label>
            <NativeSelect
              className="w-full"
              value={rule.outcomeType}
              onChange={(e) => {
                const v = e.target.value as OutcomeType
                set('outcomeType', v)
                // Solo Bonificación de Productos puede ser Acumulable — cualquier otro tipo se fuerza a
                // No Acumulable, no queda a elección.
                if (v !== 'PRODUCT') set('exclusiveOutcome', 'OUTCOME_TYPE')
              }}
            >
              {Object.entries(OUTCOME_TYPE_LABELS)
                .filter(([k]) => k === rule.outcomeType || OUTCOME_MODE_ALLOWED_TYPES[rule.outcomeMode].includes(k as OutcomeType))
                .map(([k, v]) => (
                  <NativeSelectOption key={k} value={k}>
                    {v}
                  </NativeSelectOption>
                ))}
            </NativeSelect>
            <p className="text-xs text-muted-foreground">
              {rule.outcomeMode === 'SCALE' && 'Escala admite Bonificación de Productos o Descuento %.'}
              {rule.outcomeMode === 'SINGLE' && 'Tradicional admite Bonificación de Productos o Recargo por producto.'}
              {rule.outcomeMode === 'FREQUENCY' && 'Frecuencia solo admite Bonificación de Productos.'}
              {rule.outcomeMode === 'ACCUMULATED' && 'Acumulado admite Bonificación de Productos o Descuento %.'}
            </p>
          </div>
        </div>

        <Separator />

        {/* Tipo de Validación — Frecuencia o Escala, para cualquier Tipo de Resultado permitido en ese modo. */}
        {(rule.outcomeMode === 'FREQUENCY' || rule.outcomeMode === 'SCALE') && (
          <div className="flex flex-col gap-1.5 sm:max-w-xs">
            <Label>Tipo de Validación</Label>
            <div className="flex gap-1">
              {(['QUANTITY', 'AMOUNT'] as ScaleType[]).map((t) => (
                <Button key={t} type="button" size="sm" variant={(rule.scaleType ?? 'QUANTITY') === t ? 'default' : 'outline'} onClick={() => set('scaleType', t)}>
                  {SCALE_TYPE_LABELS[t]}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Acumulado — el "quién" sigue siendo Criterios de la Regla como cualquier otro modo, esto
            solo define sobre qué se suma el histórico y cuánto hay que superar para activar el
            resultado. La sumatoria siempre agrupa por Dueño. */}
        {rule.outcomeMode === 'ACCUMULATED' && (
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              El acumulado se calcula por Dueño — suma las compras de todos los pedidos de ese Dueño en el período, sin importar qué Cliente puntual hizo cada pedido.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Se acumula</Label>
                <NativeSelect
                  className="w-full"
                  value={rule.accumulationScope ?? 'TOTAL'}
                  onChange={(e) => {
                    set('accumulationScope', e.target.value as AccumulationScope)
                    set('accumulationScopeRef', undefined)
                  }}
                >
                  {Object.entries(ACCUMULATION_SCOPE_LABELS).map(([k, v]) => (
                    <NativeSelectOption key={k} value={k}>
                      {v}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              {rule.accumulationScope && rule.accumulationScope !== 'TOTAL' && (
                <div className="flex flex-col gap-1.5">
                  <Label>{ACCUMULATION_SCOPE_LABELS[rule.accumulationScope]}</Label>
                  <CatalogCombobox
                    items={ACCUMULATION_SCOPE_CATALOGS[rule.accumulationScope as keyof typeof ACCUMULATION_SCOPE_CATALOGS]}
                    onSelect={(item) => set('accumulationScopeRef', { code: item.code, name: item.name })}
                    placeholder={rule.accumulationScopeRef ? rule.accumulationScopeRef.name : `Buscar ${ACCUMULATION_SCOPE_LABELS[rule.accumulationScope].toLowerCase()}…`}
                  />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="price-rule-acc-from">Ventana de tiempo — Desde</Label>
                <Input id="price-rule-acc-from" type="date" value={rule.accumulationFromDate ?? ''} onChange={(e) => set('accumulationFromDate', e.target.value || undefined)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="price-rule-acc-to">Ventana de tiempo — Hasta</Label>
                <Input id="price-rule-acc-to" type="date" value={rule.accumulationToDate ?? ''} onChange={(e) => set('accumulationToDate', e.target.value || undefined)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="price-rule-acc-threshold">Monto Umbral (Bs)</Label>
                <Input
                  id="price-rule-acc-threshold"
                  type="number"
                  min={0}
                  step="0.01"
                  value={rule.accumulationThreshold ?? ''}
                  onChange={(e) => set('accumulationThreshold', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Solo Bonificación de Productos puede ser Acumulable. Cualquier otro Tipo de Resultado queda
            fijo en No Acumulable, sin elección. */}
        {rule.outcomeType === 'PRODUCT' ? (
          <div className="flex flex-col gap-1.5 sm:max-w-xs">
            <Label>Aplicación Regla</Label>
            <NativeSelect className="w-full" value={rule.exclusiveOutcome} onChange={(e) => set('exclusiveOutcome', e.target.value as ExclusiveOutcome)}>
              {Object.entries(EXCLUSIVE_OUTCOME_LABELS).map(([k, v]) => (
                <NativeSelectOption key={k} value={k}>
                  {v}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        ) : (
          isProductOutcome && <p className="text-xs text-muted-foreground">Aplicación Regla: No Acumulable — solo Bonificación de Productos puede ser Acumulable.</p>
        )}

        {/* Escala con resultado numérico (%, monto, precio fijo) — el "Valor" vive en cada escalón. */}
        {rule.outcomeMode === 'SCALE' && !isProductOutcome && <ScaleEditor scales={rule.scales ?? []} onChange={(scales) => set('scales', scales)} outcomeType={rule.outcomeType} />}

        {/* Bonificación de Productos / Recargo por producto — mismo panel para cualquier modo. Las
            equivalencias (Productos Opcionales) solo tienen sentido para Bonificación. */}
        {isProductOutcome && (
          <OutcomeProductsPanel rows={rule.outcomeProducts ?? []} onChange={(rows) => set('outcomeProducts', rows)} allowOptionalProducts={rule.outcomeType === 'PRODUCT'} />
        )}

        {/* Escala con resultado en productos — mismo Desde/Hasta, sin "Valor" (lo da el panel de arriba). */}
        {rule.outcomeMode === 'SCALE' && isProductOutcome && (
          <ScaleEditor scales={rule.scales ?? []} onChange={(scales) => set('scales', scales)} outcomeType={rule.outcomeType} requireValue={false} />
        )}

        {/* Valor simple — Tradicional, Frecuencia o Acumulado con resultado numérico. */}
        {(rule.outcomeMode === 'SINGLE' || rule.outcomeMode === 'FREQUENCY' || rule.outcomeMode === 'ACCUMULATED') && !isProductOutcome && (
          <div className="flex max-w-xs flex-col gap-1.5">
            <Label htmlFor="price-rule-value">{VALUE_INPUT_LABELS[rule.outcomeType]}</Label>
            <Input id="price-rule-value" type="number" step="0.01" value={rule.value ?? ''} onChange={(e) => set('value', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
        )}

        {/* Frecuencia — al final, para cualquier Tipo de Resultado permitido en ese modo. */}
        {rule.outcomeMode === 'FREQUENCY' && (
          <div className="flex max-w-xs flex-col gap-1.5">
            <Label htmlFor="price-rule-frequency">Frecuencia</Label>
            <Input id="price-rule-frequency" type="number" min={1} value={rule.frequency ?? ''} onChange={(e) => set('frequency', e.target.value ? Number(e.target.value) : undefined)} />
            <p className="text-xs text-muted-foreground">Cada N unidades/monto se dispara el resultado (división entera hacia abajo).</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
        <Button variant="outline" asChild>
          <Link to="/estrategias/crear">Cancelar</Link>
        </Button>
        <Button disabled={!canSubmit} onClick={() => setConfirmOpen(true)}>
          Guardar
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar</DialogTitle>
            <DialogDescription>{isEditing ? `Vas a guardar los cambios de "${rule.name}".` : `Vas a crear la regla "${rule.name}".`}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Seguir editando
            </Button>
            <Button onClick={handleSave}>Confirmar y guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
