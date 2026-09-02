import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSavePointsItem } from '@/features/venado-money/api/usePointsItems'
import { CatalogProductFields } from '@/features/venado-money/components/CatalogProductFields'
import { ExternalItemFields } from '@/features/venado-money/components/ExternalItemFields'
import { PointsInputField } from '@/features/venado-money/components/PointsInputField'
import { VigencyField } from '@/features/venado-money/components/VigencyField'
import {
  PointsItemStatus,
  PointsItemType,
  ProductUnitType,
  VigencyType,
  type PointsItem,
  type PointsItemFormValues,
} from '@/features/venado-money/types'
import type { ProductLevel } from '@/features/strategies/data/product-hierarchy'

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function buildInitialValues(item: PointsItem | null): PointsItemFormValues {
  if (!item) {
    return {
      type: PointsItemType.Product,
      productLevel: '',
      productLevelValue: '',
      productId: '',
      unitType: ProductUnitType.Package,
      name: '',
      description: '',
      externalCategory: '',
      externalCode: '',
      imageUrl: '',
      points: 0,
      status: PointsItemStatus.Active,
      vigency: VigencyType.Permanent,
      startDate: todayIso(),
      endDate: '',
    }
  }

  return {
    type: item.type,
    productLevel: (item.productLevel as ProductLevel) ?? '',
    productLevelValue: item.productLevelValue ?? '',
    productId: item.productId ?? '',
    unitType: item.unitType ?? ProductUnitType.Package,
    name: item.name,
    description: item.description ?? '',
    externalCategory: item.externalCategory ?? '',
    externalCode: item.type === PointsItemType.External ? item.code : '',
    imageUrl: item.imageUrl ?? '',
    points: item.points,
    status: item.status,
    vigency: item.vigency,
    startDate: item.startDate ?? todayIso(),
    endDate: item.endDate ?? '',
  }
}

interface AssignPointsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: PointsItem | null
}

export function AssignPointsSheet({ open, onOpenChange, item = null }: AssignPointsSheetProps) {
  const [values, setValues] = useState<PointsItemFormValues>(() => buildInitialValues(item))
  const { mutate: savePointsItem, isPending } = useSavePointsItem()

  useEffect(() => {
    if (open) setValues(buildInitialValues(item))
  }, [open, item])

  const update = (patch: Partial<PointsItemFormValues>) => setValues((prev) => ({ ...prev, ...patch }))

  const isValid = values.type === PointsItemType.External ? values.name.trim().length > 0 && !!values.externalCategory : true

  const handleSubmit = () => {
    if (!isValid) return
    savePointsItem(
      { id: item?.id, values },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {values.type === PointsItemType.Product ? 'Producto del catálogo' : 'Ítem externo'}
          </span>
          <SheetTitle className="text-lg">{item ? 'Editar puntos' : 'Asignar puntos'}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">1. Tipo de ítem</span>
            <Tabs value={values.type} onValueChange={(value) => update({ type: value as PointsItemType })}>
              <TabsList className="w-full">
                <TabsTrigger value={PointsItemType.Product} className="flex-1">
                  Producto del catálogo
                </TabsTrigger>
                <TabsTrigger value={PointsItemType.External} className="flex-1">
                  Ítem externo
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {values.type === PointsItemType.Product ? (
            <CatalogProductFields
              productLevel={values.productLevel}
              productLevelValue={values.productLevelValue}
              onLevelChange={(level) => update({ productLevel: level })}
              onLevelValueChange={(value) => update({ productLevelValue: value })}
              productId={values.productId}
              onProductIdChange={(value) => update({ productId: value })}
              unitType={values.unitType}
              onUnitTypeChange={(value) => update({ unitType: value })}
            />
          ) : (
            <ExternalItemFields
              name={values.name}
              onNameChange={(value) => update({ name: value })}
              description={values.description}
              onDescriptionChange={(value) => update({ description: value })}
              category={values.externalCategory}
              onCategoryChange={(value) => update({ externalCategory: value })}
              externalCode={values.externalCode}
              onExternalCodeChange={(value) => update({ externalCode: value })}
              imageUrl={values.imageUrl}
              onImageUrlChange={(value) => update({ imageUrl: value })}
            />
          )}

          <div className="grid grid-cols-2 items-end gap-3">
            <PointsInputField
              value={values.points}
              onChange={(value) => update({ points: value })}
              description={values.type === PointsItemType.Product ? 'Cantidad de puntos fijos a sumar por unidad.' : undefined}
            />
            {values.type === PointsItemType.External && (
              <Field className="pb-1.5">
                <Label className="flex items-center justify-between gap-2">
                  Estado
                  <Switch
                    checked={values.status === PointsItemStatus.Active}
                    onCheckedChange={(checked) => update({ status: checked ? PointsItemStatus.Active : PointsItemStatus.Inactive })}
                  />
                </Label>
              </Field>
            )}
          </div>

          <VigencyField
            title={values.type === PointsItemType.Product ? 'Vigencia (Opcional)' : 'Vigencia'}
            vigency={values.vigency}
            onVigencyChange={(value) => update({ vigency: value })}
            startDate={values.startDate}
            onStartDateChange={(value) => update({ startDate: value })}
            endDate={values.endDate}
            onEndDateChange={(value) => update({ endDate: value })}
          />
        </div>

        <SheetFooter className="flex-row justify-end border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isPending}>
            {item ? 'Guardar cambios' : 'Asignar puntos'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
