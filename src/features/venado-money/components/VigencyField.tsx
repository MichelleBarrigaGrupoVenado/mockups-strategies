import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { VigencyType } from '@/features/venado-money/types'

interface VigencyFieldProps {
  title?: string
  vigency: VigencyType
  onVigencyChange: (vigency: VigencyType) => void
  startDate: string
  onStartDateChange: (value: string) => void
  endDate: string
  onEndDateChange: (value: string) => void
}

export function VigencyField({ title = 'Vigencia', vigency, onVigencyChange, startDate, onStartDateChange, endDate, onEndDateChange }: VigencyFieldProps) {
  const hasEndDate = vigency === VigencyType.WithEndDate

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</span>

      <RadioGroup value={vigency} onValueChange={(value) => onVigencyChange(value as VigencyType)} className="flex flex-row gap-6">
        <Label className="flex items-center gap-2 text-sm font-normal">
          <RadioGroupItem value={VigencyType.Permanent} />
          Permanente
        </Label>
        <Label className="flex items-center gap-2 text-sm font-normal">
          <RadioGroupItem value={VigencyType.WithEndDate} />
          Con fecha de finalización
        </Label>
      </RadioGroup>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Fecha de inicio</FieldLabel>
          <Input type="date" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel>Fecha de finalización</FieldLabel>
          <Input type="date" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} disabled={!hasEndDate} min={startDate || undefined} />
        </Field>
      </div>
    </div>
  )
}
