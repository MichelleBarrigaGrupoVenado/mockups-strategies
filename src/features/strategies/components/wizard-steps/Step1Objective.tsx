import { MapPinned, Package, Recycle, ShoppingCart, UserPlus, Users2 } from 'lucide-react'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { IconOptionCard } from '@/features/strategies/components/IconOptionCard'
import { VennDiagram } from '@/features/strategies/components/VennDiagram'
import { useWizardStore } from '@/features/strategies/store/useWizardStore'
import { StrategyObjective } from '@/features/strategies/types'

const objectiveOptions = [
  { value: StrategyObjective.IncreaseTicket, icon: ShoppingCart, title: 'Incrementar ticket', description: 'Aumentar el valor promedio de cada transacción.' },
  { value: StrategyObjective.IncreasePortfolio, icon: Package, title: 'Incrementar portafolio', description: 'Ampliar la variedad de productos que compran los clientes actuales.' },
  { value: StrategyObjective.RecoverCustomers, icon: Recycle, title: 'Recuperar clientes', description: 'Reactivar clientes que han dejado de comprar en el último periodo.' },
  { value: StrategyObjective.NewCustomers, icon: UserPlus, title: 'Crear nuevos clientes', description: 'Adquirir prospectos y convertirlos en compradores por primera vez.' },
  { value: StrategyObjective.Other, icon: MapPinned, title: 'Otro', description: 'Definir un objetivo personalizado para esta campaña.' },
]

export function Step1Objective() {
  const { data, update } = useWizardStore()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs font-semibold tracking-wide text-primary uppercase">Paso 1 — Objetivo</span>
        <h2 className="text-2xl font-semibold text-foreground">¿Qué quieres mejorar?</h2>
        <p className="text-sm text-muted-foreground">Selecciona el objetivo principal de esta estrategia.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Users2 size={16} className="text-muted-foreground" />
            Datos Generales
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="strategy-name">Nombre</FieldLabel>
              <Input id="strategy-name" placeholder="Ingresar Nombre..." value={data.name} onChange={(e) => update({ name: e.target.value })} />
            </Field>
            <Field>
              <FieldLabel htmlFor="strategy-description">Descripción</FieldLabel>
              <Textarea
                id="strategy-description"
                placeholder="Ingresar Descripción..."
                rows={3}
                value={data.description}
                onChange={(e) => update({ description: e.target.value })}
              />
            </Field>
          </FieldGroup>

          <Separator />

          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Users2 size={16} className="text-muted-foreground" />
            Segmento de Productos
          </div>

          <div className="relative">
            <VennDiagram className="pointer-events-none absolute inset-x-4 top-0 h-16 w-auto text-muted-foreground/15" />
            <FieldGroup className="relative gap-3">
              <Field>
                <FieldLabel>Seleccionar nivel de productos</FieldLabel>
                <NativeSelect value={data.productLevel} onChange={(e) => update({ productLevel: e.target.value })}>
                  <NativeSelectOption value="">Seleccionar Valor</NativeSelectOption>
                  <NativeSelectOption value="categoria">Categoría</NativeSelectOption>
                  <NativeSelectOption value="marca">Marca</NativeSelectOption>
                  <NativeSelectOption value="sku">SKU</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel>Seleccionar valor del nivel de productos</FieldLabel>
                <NativeSelect value={data.productLevelValue} onChange={(e) => update({ productLevelValue: e.target.value })}>
                  <NativeSelectOption value="">Seleccionar Valor</NativeSelectOption>
                  <NativeSelectOption value="bebidas">Bebidas</NativeSelectOption>
                  <NativeSelectOption value="lacteos">Lácteos</NativeSelectOption>
                  <NativeSelectOption value="limpieza">Limpieza</NativeSelectOption>
                </NativeSelect>
              </Field>
            </FieldGroup>
          </div>

          <Separator />

          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Users2 size={16} className="text-muted-foreground" />
            Criterios Generales
          </div>

          <FieldGroup className="gap-3">
            <Field>
              <FieldLabel>Seleccionar Ciudad</FieldLabel>
              <NativeSelect value={data.city} onChange={(e) => update({ city: e.target.value })}>
                <NativeSelectOption value="">Seleccionar Ciudad</NativeSelectOption>
                <NativeSelectOption value="santa-cruz">Santa Cruz</NativeSelectOption>
                <NativeSelectOption value="la-paz">La Paz</NativeSelectOption>
                <NativeSelectOption value="cochabamba">Cochabamba</NativeSelectOption>
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel>Seleccionar Canal</FieldLabel>
              <NativeSelect value={data.channel} onChange={(e) => update({ channel: e.target.value })}>
                <NativeSelectOption value="">Seleccionar Canal</NativeSelectOption>
                <NativeSelectOption value="moderno">Moderno</NativeSelectOption>
                <NativeSelectOption value="tradicional">Tradicional</NativeSelectOption>
                <NativeSelectOption value="mayorista">Mayorista</NativeSelectOption>
              </NativeSelect>
            </Field>
          </FieldGroup>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {objectiveOptions.map((option) => (
            <IconOptionCard
              key={option.value}
              icon={option.icon}
              title={option.title}
              description={option.description}
              selected={data.objective === option.value}
              onClick={() => update({ objective: option.value })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
