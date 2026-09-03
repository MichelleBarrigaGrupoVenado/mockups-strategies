import { X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { getProductOptions, productLevelOptions, type ProductLevel } from '@/features/strategies/data/product-hierarchy'

const AdjustmentType = {
  DiscountPercent: 'discount_percent',
  FixedPrice: 'fixed_price',
  SurchargePercent: 'surcharge_percent',
} as const
type AdjustmentType = (typeof AdjustmentType)[keyof typeof AdjustmentType]

const adjustmentTypeOptions: { value: AdjustmentType; label: string; description: string }[] = [
  { value: AdjustmentType.DiscountPercent, label: 'Descuento %', description: 'Reduce el precio en un porcentaje.' },
  { value: AdjustmentType.FixedPrice, label: 'Precio fijo', description: 'Reemplaza el precio por un monto fijo en Bs.' },
  { value: AdjustmentType.SurchargePercent, label: 'Recargo %', description: 'Aumenta el precio en un porcentaje.' },
]

export function CreatePriceRulePage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [productLevel, setProductLevel] = useState<ProductLevel | ''>('')
  const [productLevelValue, setProductLevelValue] = useState('')
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>(AdjustmentType.DiscountPercent)
  const [adjustmentValue, setAdjustmentValue] = useState(10)
  const [hasEndDate, setHasEndDate] = useState(false)
  const [endDate, setEndDate] = useState('')

  const valueOptions = getProductOptions(productLevel)
  const adjustmentSuffix = adjustmentType === AdjustmentType.FixedPrice ? 'Bs' : '%'

  function handleSave() {
    if (!name.trim()) {
      toast.error('Ingresa un nombre para la regla de precios.')
      return
    }

    if (!productLevel || !productLevelValue) {
      toast.error('Selecciona el nivel y el valor sobre el que aplica la regla.')
      return
    }

    toast.success('Regla de precios creada correctamente.')
    navigate('/estrategias/crear')
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Creador de campaña</span>
          <h1 className="text-2xl font-semibold text-foreground">Crear Regla de Precios</h1>
          <p className="text-sm text-muted-foreground">Configura un ajuste de precio para aplicar dentro de esta estrategia.</p>
        </div>
        <Link to="/estrategias/crear" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <X size={16} />
          Volver a la estrategia
        </Link>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price-rule-name">Nombre de la regla</Label>
          <Input
            id="price-rule-name"
            placeholder="Ej: Descuento lanzamiento Ketchup"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="price-rule-level">Nivel de aplicación</Label>
            <NativeSelect
              id="price-rule-level"
              value={productLevel}
              onChange={(e) => {
                setProductLevel(e.target.value as ProductLevel)
                setProductLevelValue('')
              }}
            >
              <NativeSelectOption value="">Seleccionar...</NativeSelectOption>
              {productLevelOptions.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price-rule-value">Valor</Label>
            <NativeSelect
              id="price-rule-value"
              value={productLevelValue}
              onChange={(e) => setProductLevelValue(e.target.value)}
              disabled={!productLevel}
            >
              <NativeSelectOption value="">Seleccionar...</NativeSelectOption>
              {valueOptions.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-foreground">Tipo de ajuste</span>

          <RadioGroup
            value={adjustmentType}
            onValueChange={(value) => setAdjustmentType(value as AdjustmentType)}
            className="grid grid-cols-1 gap-3 md:grid-cols-3"
          >
            {adjustmentTypeOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={`adjustment-${option.value}`}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4"
              >
                <RadioGroupItem id={`adjustment-${option.value}`} value={option.value} />

                <div className="flex flex-col gap-1">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price-rule-adjustment-value">Valor del ajuste</Label>
          <div className="flex items-center gap-2">
            <Input
              id="price-rule-adjustment-value"
              type="number"
              min="0"
              className="w-32"
              value={adjustmentValue}
              onChange={(e) => setAdjustmentValue(Number(e.target.value))}
            />
            <span className="text-sm text-muted-foreground">{adjustmentSuffix}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Vigencia</span>

          <RadioGroup
            className="flex flex-row gap-6"
            value={hasEndDate ? 'con-vencimiento' : 'sin-vencimiento'}
            onValueChange={(value) => setHasEndDate(value === 'con-vencimiento')}
          >
            <Label className="flex items-center gap-2 text-sm font-normal">
              <RadioGroupItem value="sin-vencimiento" />
              Permanente
            </Label>

            <Label className="flex items-center gap-2 text-sm font-normal">
              <RadioGroupItem value="con-vencimiento" />
              Con fecha de finalización
            </Label>

            {hasEndDate && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="price-rule-end-date">Fecha de finalización</Label>
                <Input
                  id="price-rule-end-date"
                  type="date"
                  value={endDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-fit"
                />
              </div>
            )}
          </RadioGroup>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
        <Button variant="outline" asChild>
          <Link to="/estrategias/crear">Cancelar</Link>
        </Button>
        <Button onClick={handleSave}>Guardar regla</Button>
      </div>
    </div>
  )
}
