import { CircleDollarSign, ClipboardCheck, Coins, Gift, Lightbulb, Tag } from 'lucide-react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { IconOptionCard } from '@/features/strategies/components/IconOptionCard'
import { useWizardStore } from '@/features/strategies/store/useWizardStore'
import { ActionType, type StrategyWizardData } from '@/features/strategies/types'

/**
 * Cada una de estas acciones tiene su propia sección en el Paso 5 (Incentivo) — al elegirla se
 * habilita automáticamente esa sección (y el paso deja de estar deshabilitado en el stepper); al
 * quitarla, la sección vuelve a ocultarse. Ver Step5Incentive y CreateStrategyPage.
 */
const incentiveFlagByAction: Partial<Record<ActionType, keyof StrategyWizardData>> = {
  [ActionType.OfferPoints]: 'clientIncentiveEnabled',
  [ActionType.OfferEmployeePoints]: 'employeeIncentiveEnabled',
  [ActionType.OfferPriceRule]: 'priceRuleIncentiveEnabled',
}

const actionOptions = [
  {
    value: ActionType.OfferProduct,
    icon: Gift,
    title: 'Ofrecer producto',
    description: 'Se envía una notificación por E-Venado al cliente.',
  },
  {
    value: ActionType.RecommendProducts,
    icon: Lightbulb,
    title: 'Recomendar productos',
    description:
      'Sugiere productos al cliente mediante la aplicación de E-Venado y al vendedor mediante la búsqueda.',
  },
  {
    value: ActionType.OfferPoints,
    icon: CircleDollarSign,
    title: 'Ofrecer puntos al Cliente',
    description:
      'Permite dar puntos tanto al cliente como al vendedor y añadir una regla de precios.',
  },
  {
    value: ActionType.AssignTask,
    icon: ClipboardCheck,
    title: 'Agregar tarea a vendedor',
    description:
      'Añade una tarea al vendedor para que vaya a ofrecer los productos.',
  },
  {
    value: ActionType.OfferEmployeePoints,
    icon: Coins,
    title: 'Ofrecer puntos al Empleado',
    description:
      'Otorga puntos Venado Money como incentivo al cumplir el objetivo.',
  },
  {
    value: ActionType.OfferPriceRule,
    icon: Tag,
    title: 'Ofrecer regla de precios',
    description:
      'Otorga una regla de precios al cliente al cumplir su objetivo.',
  },
]

export function Step4Action() {
  const { data, update } = useWizardStore()

  const toggleAction = (action: ActionType) => {
    const isSelected = data.actionTypes.includes(action)
    const incentiveFlag = incentiveFlagByAction[action]

    update({
      actionTypes: isSelected
        ? data.actionTypes.filter((item) => item !== action)
        : [...data.actionTypes, action],
      // Selecciona la acción → habilita su sección de incentivo en el paso 5; la deselecciona → la oculta.
      ...(incentiveFlag ? { [incentiveFlag]: !isSelected } : {}),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">¿Qué quieres que haga el equipo comercial?</h2>
        <p className="text-sm text-muted-foreground">Selecciona una acción sugerida para la fuerza de ventas o define una personalizada.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actionOptions.map((option) => (
          <IconOptionCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={data.actionTypes.includes(option.value)}
            onClick={() => toggleAction(option.value)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
        <FieldLabel className="flex items-center gap-2 text-sm font-semibold text-foreground">
          Recomendación detallada
        </FieldLabel>
        <p className="text-sm text-muted-foreground">Redacta la instrucción exacta que recibirá el equipo comercial. Sé específico.</p>
        <Field>
          <Textarea
            rows={4}
            placeholder="Ejemplo: Recomendar al vendedor ofrecer nuevamente la línea de bebidas que el cliente dejó de comprar."
            value={data.actionDetail}
            onChange={(e) => update({ actionDetail: e.target.value })}
          />
        </Field>
      </div>
    </div>
  )
}
