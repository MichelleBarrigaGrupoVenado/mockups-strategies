import { MapPin, MoreHorizontal, Package, ShoppingCart, Tags, ThumbsUp } from 'lucide-react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { IconOptionCard } from '@/features/strategies/components/IconOptionCard'
import { useWizardStore } from '@/features/strategies/store/useWizardStore'
import { ActionType } from '@/features/strategies/types'

const actionOptions = [
  { value: ActionType.OfferProduct, icon: Package, title: 'Ofrecer producto', description: 'Presenta un producto puntual al cliente.' },
  { value: ActionType.RecommendProducts, icon: ThumbsUp, title: 'Recomendar productos', description: 'Sugiere productos relacionados al historial de compra.' },
  { value: ActionType.VisitClient, icon: MapPin, title: 'Visitar cliente', description: 'Programa una visita presencial del vendedor.' },
  { value: ActionType.SellProducts, icon: ShoppingCart, title: 'Vender productos', description: 'Impulsa el cierre directo de una venta.' },
  { value: ActionType.OfferPoints, icon: Tags, title: 'Ofrecer puntos al cliente', description: 'Otorga puntos Venado Money como incentivo.' },
  { value: ActionType.Other, icon: MoreHorizontal, title: 'Otro', description: 'Define una acción personalizada.' },
]

export function Step4Action() {
  const { data, update } = useWizardStore()

  const toggleAction = (action: ActionType) => {
    const isSelected = data.actionTypes.includes(action)

    update({
      actionTypes: isSelected
        ? data.actionTypes.filter((item) => item !== action)
        : [...data.actionTypes, action],
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
