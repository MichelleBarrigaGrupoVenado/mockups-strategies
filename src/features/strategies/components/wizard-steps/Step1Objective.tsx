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
import { addMonthsIso } from '@/shared/utils/format'

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
          Elige uno o más segmentos que el cliente ya compra (Segmento Origen) y uno o más segmentos a los que quieres que se cambie o
          sume (Segmento Objetivo). La estrategia buscará clientes que compran el origen pero todavía no compran el objetivo.
        </p>

        <FieldGroup className="gap-3 rounded-lg border border-border p-3">
          <span className="text-xs font-semibold text-primary uppercase">Segmento Origen — que ya compran</span>
          <ProductLevelField
            levelLabel="Nivel del segmento origen"
            valueLabel="Buscar segmento origen"
            level={data.productLevelA}
            values={data.productLevelValuesA}
            onLevelChange={(level) => update({ productLevelA: level })}
            onValuesChange={(values) => update({ productLevelValuesA: values })}
          />
        </FieldGroup>

        <div className="flex items-center justify-center text-muted-foreground">
          <ArrowRight size={16} />
        </div>

        <FieldGroup className="gap-3 rounded-lg border border-border p-3">
          <span className="text-xs font-semibold text-primary uppercase">Segmento Objetivo — que queremos que compren</span>
          <ProductLevelField
            levelLabel="Nivel del segmento objetivo"
            valueLabel="Buscar segmento objetivo"
            level={data.productLevelB}
            values={data.productLevelValuesB}
            onLevelChange={(level) => update({ productLevelB: level })}
            onValuesChange={(values) => update({ productLevelValuesB: values })}
          />
        </FieldGroup>
      </div>
    )
  }

  const labelByObjective: Partial<Record<StrategyObjective, string>> = {
    [StrategyObjective.RecoverCustomers]: 'Segmentos que dejaron de comprar',
    [StrategyObjective.IncreaseTicket]: 'Segmentos a impulsar',
    [StrategyObjective.Other]: 'Segmentos relacionados',
  }

  const hintByObjective: Partial<Record<StrategyObjective, string>> = {
    // Único caso donde dejar la selección vacía es intencional: la estrategia puede aplicarse a
    // clientes inactivos sin acotar a un segmento de producto específico.
    [StrategyObjective.RecoverCustomers]: 'Opcional: puedes dejarlo vacío para no acotar por producto.',
  }

  return (
    <FieldGroup className="gap-3">
      <ProductLevelField
        levelLabel="Seleccionar nivel de productos"
        valueLabel={objective ? (labelByObjective[objective] ?? 'Buscar producto') : 'Buscar producto'}
        level={data.productLevel}
        values={data.productLevelValues}
        onLevelChange={(level) => update({ productLevel: level })}
        onValuesChange={(values) => update({ productLevelValues: values })}
        hint={objective ? hintByObjective[objective] : undefined}
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
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="strategy-start-date">Fecha inicio</FieldLabel>
                <Input
                  id="strategy-start-date"
                  type="date"
                  value={data.startDate}
                  onChange={(e) => {
                    const startDate = e.target.value
                    update({ startDate, endDate: startDate ? addMonthsIso(startDate, 3) : data.endDate })
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="strategy-end-date">Fecha finalización</FieldLabel>
                <Input
                  id="strategy-end-date"
                  type="date"
                  value={data.endDate}
                  min={data.startDate || undefined}
                  onChange={(e) => update({ endDate: e.target.value })}
                />
              </Field>
            </div>
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
