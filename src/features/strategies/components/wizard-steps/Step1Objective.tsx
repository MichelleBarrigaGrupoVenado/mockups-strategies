import { ArrowRight, Package, Recycle, ShoppingCart, UserPlus, Users2 } from 'lucide-react'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { IconOptionCard } from '@/features/strategies/components/IconOptionCard'
import { ProductLevelField } from '@/features/strategies/components/ProductLevelField'
import { createDefaultCondition } from '@/features/strategies/data/condition-fields'
import { channelOptions, cityOptions, subChannelOptionsByChannel } from '@/features/strategies/data/criteria'
import { useWizardStore } from '@/features/strategies/store/useWizardStore'
import { StrategyObjective } from '@/features/strategies/types'

const objectiveOptions = [
  { value: StrategyObjective.IncreaseTicket, icon: ShoppingCart, title: 'Incrementar ticket', description: 'Aumentar el valor promedio de cada transacción.' },
  { value: StrategyObjective.IncreasePortfolio, icon: Package, title: 'Incrementar portafolio', description: 'Ampliar la variedad de productos que compran los clientes actuales.' },
  { value: StrategyObjective.RecoverCustomers, icon: Recycle, title: 'Recuperar clientes', description: 'Reactivar clientes que han dejado de comprar en el último periodo.' },
  { value: StrategyObjective.NewCustomers, icon: UserPlus, title: 'Crear nuevos clientes', description: 'Adquirir prospectos y convertirlos en compradores por primera vez.' },
]

function ProductSegmentSection({ objective }: { objective: StrategyObjective | null }) {
  const { data, update } = useWizardStore()

  if (objective === StrategyObjective.NewCustomers) {
    return (
      <p className="rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
        Este objetivo busca prospectos sin historial de compra, así que no aplica un segmento de productos.
      </p>
    )
  }

  if (objective === StrategyObjective.IncreasePortfolio) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Elige el producto que el cliente ya compra (A) y el producto al que quieres que se cambie o sume (B). La estrategia buscará
          clientes que compran A pero todavía no compran B.
        </p>

        <FieldGroup className="gap-3 rounded-lg border border-border p-3">
          <span className="text-xs font-semibold text-primary uppercase">Producto A — que ya compran</span>
          <ProductLevelField
            levelLabel="Nivel de producto A"
            valueLabel="Buscar producto A"
            level={data.productLevelA}
            value={data.productLevelValueA}
            onLevelChange={(level) => update({ productLevelA: level })}
            onValueChange={(value) => update({ productLevelValueA: value })}
          />
        </FieldGroup>

        <div className="flex items-center justify-center text-muted-foreground">
          <ArrowRight size={16} />
        </div>

        <FieldGroup className="gap-3 rounded-lg border border-border p-3">
          <span className="text-xs font-semibold text-primary uppercase">Producto B — que queremos que compren</span>
          <ProductLevelField
            levelLabel="Nivel de producto B"
            valueLabel="Buscar producto B"
            level={data.productLevelB}
            value={data.productLevelValueB}
            onLevelChange={(level) => update({ productLevelB: level })}
            onValueChange={(value) => update({ productLevelValueB: value })}
          />
        </FieldGroup>
      </div>
    )
  }

  const labelByObjective: Partial<Record<StrategyObjective, string>> = {
    [StrategyObjective.RecoverCustomers]: 'Producto que dejaron de comprar',
    [StrategyObjective.IncreaseTicket]: 'Producto a impulsar',
    [StrategyObjective.Other]: 'Producto relacionado',
  }

  return (
    <FieldGroup className="gap-3">
      <ProductLevelField
        levelLabel="Seleccionar nivel de productos"
        valueLabel={objective ? (labelByObjective[objective] ?? 'Buscar producto') : 'Buscar producto'}
        level={data.productLevel}
        value={data.productLevelValue}
        onLevelChange={(level) => update({ productLevel: level })}
        onValueChange={(value) => update({ productLevelValue: value })}
      />
    </FieldGroup>
  )
}

export function Step1Objective() {
  const { data, update } = useWizardStore()
  const subChannelOptions = data.channel ? (subChannelOptionsByChannel[data.channel] ?? []) : []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs font-semibold tracking-wide text-primary uppercase">Paso 1 — Objetivo</span>
        <h2 className="text-2xl font-semibold text-foreground">¿Qué quieres mejorar?</h2>
        <p className="text-sm text-muted-foreground">Selecciona el objetivo principal de esta estrategia.</p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-5">
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
            <Package size={16} className="text-muted-foreground" />
            Segmento de Productos
          </div>

          <ProductSegmentSection objective={data.objective} />

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
                {cityOptions.map((option) => (
                  <NativeSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel>Seleccionar Canal</FieldLabel>
              <NativeSelect
                value={data.channel}
                onChange={(e) => update({ channel: e.target.value, subchannel: '' })}
              >
                <NativeSelectOption value="">Seleccionar Canal</NativeSelectOption>
                {channelOptions.map((option) => (
                  <NativeSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel>Seleccionar Subcanal</FieldLabel>
              <NativeSelect value={data.subchannel} disabled={!data.channel} onChange={(e) => update({ subchannel: e.target.value })}>
                <NativeSelectOption value="">{data.channel ? 'Seleccionar Subcanal' : 'Elige un canal primero'}</NativeSelectOption>
                {subChannelOptions.map((option) => (
                  <NativeSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </NativeSelectOption>
                ))}
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
              onClick={() =>
                update({
                  objective: option.value,
                  // Cada objetivo tiene su propio set de condiciones (Step2Targeting), así que al
                  // cambiarlo las condiciones ya agregadas dejan de tener sentido y se reinician.
                  conditions: data.objective === option.value ? data.conditions : [createDefaultCondition(option.value)],
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
