import { Coins } from 'lucide-react'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

interface PointsInputFieldProps {
  value: number
  onChange: (value: number) => void
  description?: string
}

export function PointsInputField({ value, onChange, description }: PointsInputFieldProps) {
  return (
    <Field>
      <FieldLabel>Puntos otorgados *</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <Coins size={15} />
        </InputGroupAddon>
        <InputGroupInput type="number" min="0" value={value} onChange={(e) => onChange(Number(e.target.value))} />
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}
