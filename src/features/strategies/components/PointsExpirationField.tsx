import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PointsExpirationMonths } from '@/features/strategies/types'
import { addMonthsIso, formatDate } from '@/shared/utils/format'

const expirationOptions: { value: PointsExpirationMonths; label: string }[] = [
  { value: PointsExpirationMonths.OneMonth, label: '1 mes' },
  { value: PointsExpirationMonths.ThreeMonths, label: '3 meses' },
  { value: PointsExpirationMonths.SixMonths, label: '6 meses' },
  { value: PointsExpirationMonths.TwelveMonths, label: '12 meses' },
]

interface PointsExpirationFieldProps {
  title: string
  expires: boolean
  months: PointsExpirationMonths
  /** Fecha desde la que se cuenta el plazo (el inicio de la estrategia); vacía si aún no se eligió. */
  startDate: string
  /** Sufijo del texto de ayuda, ej. "generados por esta estrategia". */
  subject: string
  onChange: (patch: { pointsExpire: boolean; months: PointsExpirationMonths }) => void
}

/**
 * Vigencia de los puntos: sin vencimiento, o con un plazo elegido entre 1, 3, 6 y 12 meses contados
 * desde el inicio de la estrategia. Se comparte entre los puntos del cliente y los del Vendedor.
 */
export function PointsExpirationField({ title, expires, months, startDate, subject, onChange }: PointsExpirationFieldProps) {
  const expirationDate = startDate ? formatDate(addMonthsIso(startDate, months)) : null

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{title}</span>

      <RadioGroup
        className="flex flex-row gap-6"
        value={expires ? 'con-vencimiento' : 'sin-vencimiento'}
        onValueChange={(value) => onChange({ pointsExpire: value === 'con-vencimiento', months })}
      >
        <Label className="flex items-center gap-2 text-sm font-normal">
          <RadioGroupItem value="sin-vencimiento" />
          Sin vencimiento
        </Label>

        <Label className="flex items-center gap-2 text-sm font-normal">
          <RadioGroupItem value="con-vencimiento" />
          Con fecha de vencimiento
        </Label>
      </RadioGroup>

      {expires && (
        <div className="flex flex-col gap-2 pt-1">
          <Label htmlFor={`${title}-expiration-months`}>Plazo de vencimiento</Label>

          <NativeSelect
            id={`${title}-expiration-months`}
            className="w-40"
            value={months}
            onChange={(e) => onChange({ pointsExpire: true, months: Number(e.target.value) as PointsExpirationMonths })}
          >
            {expirationOptions.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>

          <span className="text-xs text-muted-foreground">
            Los puntos {subject} vencerán {months === 1 ? 'al mes' : `a los ${months} meses`} de obtenerlos.
          </span>
        </div>
      )}
    </div>
  )
}
