import { GripVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ConditionOperator, type TargetingCondition } from '@/features/strategies/types'

const fieldOptions = ['Ventas históricas', 'Cliente activo', 'Frecuencia de compra', 'Días sin comprar', 'Categorías compradas']

const operatorLabels: Record<ConditionOperator, string> = {
  [ConditionOperator.GreaterThan]: 'sea mayor a',
  [ConditionOperator.LessThan]: 'sea menor a',
  [ConditionOperator.Equals]: 'sea igual a',
}

interface ConditionRowProps {
  condition: TargetingCondition
  onChange: (patch: Partial<TargetingCondition>) => void
  onRemove: () => void
}

export function ConditionRow({ condition, onChange, onRemove }: ConditionRowProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5">
      <GripVertical size={16} className="shrink-0 text-muted-foreground" />

      <NativeSelect className="min-w-36" value={condition.field} onChange={(e) => onChange({ field: e.target.value })}>
        {fieldOptions.map((field) => (
          <NativeSelectOption key={field} value={field}>
            {field}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NativeSelect className="w-fit" value={condition.operator} onChange={(e) => onChange({ operator: e.target.value as ConditionOperator })}>
        {Object.values(ConditionOperator).map((op) => (
          <NativeSelectOption key={op} value={op}>
            {operatorLabels[op]}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <Input className="w-28" value={condition.value} onChange={(e) => onChange({ value: e.target.value })} />

      <Button variant="ghost" size="icon-sm" className="ml-auto shrink-0 text-muted-foreground hover:text-destructive" onClick={onRemove}>
        <Trash2 size={15} />
      </Button>
    </div>
  )
}
