import { GripVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ConditionFieldKind, getConditionFields, monthsOptions } from '@/features/strategies/data/condition-fields'
import { ConditionOperator, type StrategyObjective, type TargetingCondition } from '@/features/strategies/types'

const operatorLabels: Record<ConditionOperator, string> = {
  [ConditionOperator.GreaterThan]: 'sea mayor a',
  [ConditionOperator.LessThan]: 'sea menor a',
  [ConditionOperator.Equals]: 'sea igual a',
}

interface ConditionRowProps {
  condition: TargetingCondition
  objective: StrategyObjective | null
  onChange: (patch: Partial<TargetingCondition>) => void
  onRemove: () => void
}

export function ConditionRow({ condition, objective, onChange, onRemove }: ConditionRowProps) {
  const fields = getConditionFields(objective)
  const activeField = fields.find((f) => f.field === condition.field) ?? fields[0]

  function handleFieldChange(fieldName: string) {
    const next = fields.find((f) => f.field === fieldName)
    if (!next) return

    const value =
      next.kind === ConditionFieldKind.Boolean ? 'false' : next.kind === ConditionFieldKind.Months ? '3' : ''

    onChange({ field: fieldName, value })
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5">
      <GripVertical size={16} className="shrink-0 text-muted-foreground" />

      <NativeSelect className="min-w-36 flex-1 basis-40" value={condition.field} onChange={(e) => handleFieldChange(e.target.value)}>
        {fields.map((f) => (
          <NativeSelectOption key={f.field} value={f.field}>
            {f.field}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      {activeField.kind === ConditionFieldKind.Boolean ? (
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox
            checked={condition.value === 'true'}
            onCheckedChange={(checked) => onChange({ value: checked ? 'true' : 'false', operator: ConditionOperator.Equals })}
          />
          Debe cumplirse
        </label>
      ) : (
        <>
          <NativeSelect className="w-fit" value={condition.operator} onChange={(e) => onChange({ operator: e.target.value as ConditionOperator })}>
            {Object.values(ConditionOperator).map((op) => (
              <NativeSelectOption key={op} value={op}>
                {operatorLabels[op]}
              </NativeSelectOption>
            ))}
          </NativeSelect>

          {activeField.kind === ConditionFieldKind.Months ? (
            <NativeSelect className="w-fit" value={condition.value} onChange={(e) => onChange({ value: e.target.value })}>
              {monthsOptions.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          ) : (
            <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:flex-none">
              <Input
                type="number"
                className="w-24 min-w-0 flex-1 sm:w-28 sm:flex-none"
                value={condition.value}
                onChange={(e) => onChange({ value: e.target.value })}
              />
              {activeField.unit && <span className="shrink-0 text-sm text-muted-foreground">{activeField.unit}</span>}
            </div>
          )}
        </>
      )}

      <Button variant="ghost" size="icon-sm" className="ml-auto shrink-0 text-muted-foreground hover:text-destructive" onClick={onRemove}>
        <Trash2 size={15} />
      </Button>
    </div>
  )
}
