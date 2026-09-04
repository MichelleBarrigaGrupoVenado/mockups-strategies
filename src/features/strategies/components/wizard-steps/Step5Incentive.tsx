import { ArrowRight, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select'

import { useWizardStore } from '@/features/strategies/store/useWizardStore'
import {
  ClientIncentiveType,
  ProductUnitType,
} from '@/features/strategies/types'

// "Por cumplimiento" es hoy el único tipo de incentivo para clientes que se ofrece — el selector y los
// paneles de "Por monto de compra" / "Por producto" quedan listos pero ocultos por si se reactivan más
// adelante, en vez de borrarlos.
const SHOW_CLIENT_INCENTIVE_TYPE_PICKER = false

const mockProducts = [
  {
    id: 'p1',
    code: 'VEN-001',
    name: 'Ketchup 200g',
  },
  {
    id: 'p2',
    code: 'VEN-002',
    name: 'Mayonesa 500g',
  },
  {
    id: 'p3',
    code: 'VEN-003',
    name: 'Salsa de tomate 250g',
  },
  {
    id: 'p4',
    code: 'VEN-004',
    name: 'Aceite vegetal 900ml',
  },
  {
    id: 'p5',
    code: 'VEN-005',
    name: 'Galletas familiares',
  },
]

export function Step5Incentive() {
  const {
    data,
    update,
    addPointsRule,
    removePointsRule,
    updatePointsRule,
    addClientComplianceRule,
    removeClientComplianceRule,
    updateClientComplianceRule,
    updateComplianceRule,
  } = useWizardStore()

  const navigate = useNavigate()
  const [productSearch, setProductSearch] = useState('')

  const filteredProducts = mockProducts.filter((product) => {
    const search = productSearch.toLowerCase()

    return (
      product.name.toLowerCase().includes(search) ||
      product.code.toLowerCase().includes(search)
    )
  })

  const addProductRule = () => {
    update({
      productPointsRules: [
        ...data.productPointsRules,
        {
          id: crypto.randomUUID(),
          productId: '',
          productCode: '',
          productName: '',
          unitType: ProductUnitType.Unit,
          quantity: 1,
          points: 10,
        },
      ],
    })
  }

  const removeProductRule = (id: string) => {
    update({
      productPointsRules: data.productPointsRules.filter(
        (rule) => rule.id !== id,
      ),
    })
  }

  const updateProductRule = (
    id: string,
    changes: Partial<(typeof data.productPointsRules)[number]>,
  ) => {
    update({
      productPointsRules: data.productPointsRules.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              ...changes,
            }
          : rule,
      ),
    })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* CLIENTES */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-semibold text-foreground">
            Venado Money para Clientes
          </span>

          <span className="text-sm text-muted-foreground">
            ¿Quieres asociar un incentivo a esta estrategia?
          </span>
        </div>

        <Switch
          checked={data.clientIncentiveEnabled}
          onCheckedChange={(checked) =>
            update({
              clientIncentiveEnabled: !!checked,
            })
          }
        />
      </div>

      {data.clientIncentiveEnabled && (
        <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
          {/* TIPO DE INCENTIVO — oculto: ver SHOW_CLIENT_INCENTIVE_TYPE_PICKER arriba. */}
          {SHOW_CLIENT_INCENTIVE_TYPE_PICKER && (
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-foreground">
              Tipo de incentivo
            </span>

            <RadioGroup
              value={data.clientIncentiveType}
              onValueChange={(value) =>
                update({
                  clientIncentiveType:
                    value as ClientIncentiveType,
                })
              }
              className="grid grid-cols-1 gap-3 md:grid-cols-3"
            >
              <Label
                htmlFor="incentive-purchase"
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4"
              >
                <RadioGroupItem
                  id="incentive-purchase"
                  value={ClientIncentiveType.PurchaseAmount}
                />

                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    Por monto de compra
                  </span>

                  <span className="text-xs text-muted-foreground">
                    El cliente recibe puntos según el monto acumulado
                    de su compra.
                  </span>
                </div>
              </Label>

              <Label
                htmlFor="incentive-product"
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4"
              >
                <RadioGroupItem
                  id="incentive-product"
                  value={ClientIncentiveType.Product}
                />

                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    Por producto
                  </span>

                  <span className="text-xs text-muted-foreground">
                    El cliente recibe puntos al comprar una cantidad
                    determinada de un producto.
                  </span>
                </div>
              </Label>

              <Label
                htmlFor="incentive-compliance"
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4"
              >
                <RadioGroupItem
                  id="incentive-compliance"
                  value={ClientIncentiveType.Compliance}
                />

                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    Por cumplimiento
                  </span>

                  <span className="text-xs text-muted-foreground">
                    El cliente recibe puntos según su % de cumplimiento
                    de la meta (100% a 150%).
                  </span>
                </div>
              </Label>
            </RadioGroup>
          </div>
          )}

          {/* POR MONTO — oculto: ver SHOW_CLIENT_INCENTIVE_TYPE_PICKER arriba. */}
          {SHOW_CLIENT_INCENTIVE_TYPE_PICKER &&
            data.clientIncentiveType ===
            ClientIncentiveType.PurchaseAmount && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Reglas de Asignación de Puntos
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary"
                  onClick={addPointsRule}
                >
                  <Plus data-icon="inline-start" />
                  Agregar Regla
                </Button>
              </div>

              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <tr>
                      <th className="px-3 py-2 text-left">
                        Monto de compra
                      </th>

                      <th className="px-3 py-2 text-left">
                        Puntos ganados
                      </th>

                      <th className="w-10" />
                    </tr>
                  </thead>

                  <tbody>
                    {data.pointsRules.map((rule) => (
                      <tr
                        key={rule.id}
                        className="border-t border-border"
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="size-1.5 shrink-0 rounded-full bg-primary" />

                            <Input
                              type="number"
                              min="0"
                              className="h-8 w-28"
                              value={rule.amountBs}
                              onChange={(e) =>
                                updatePointsRule(rule.id, {
                                  amountBs: Number(e.target.value),
                                })
                              }
                            />

                            <span className="text-muted-foreground">
                              Bs
                            </span>
                          </div>
                        </td>

                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min="0"
                            className="h-8 w-28"
                            value={rule.points}
                            onChange={(e) =>
                              updatePointsRule(rule.id, {
                                points: Number(e.target.value),
                              })
                            }
                          />
                        </td>

                        <td className="px-3 py-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              removePointsRule(rule.id)
                            }
                          >
                            <Trash2 size={15} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* POR CUMPLIMIENTO */}
          {data.clientIncentiveType ===
            ClientIncentiveType.Compliance && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    Rangos de Cumplimiento
                  </span>

                  <span className="text-xs text-muted-foreground">
                    Define los puntos según el % de cumplimiento de la meta alcanzado (100% a 150%).
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary"
                  onClick={addClientComplianceRule}
                >
                  <Plus data-icon="inline-start" />
                  Agregar Rango
                </Button>
              </div>

              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <tr>
                      <th className="px-3 py-2 text-left">
                        Cumplimiento (%)
                      </th>

                      <th className="px-3 py-2 text-left">
                        Puntos ganados
                      </th>

                      <th className="w-10" />
                    </tr>
                  </thead>

                  <tbody>
                    {data.clientComplianceRules.map((rule) => (
                      <tr
                        key={rule.id}
                        className="border-t border-border"
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="size-1.5 shrink-0 rounded-full bg-primary" />

                            <Input
                              type="number"
                              min={100}
                              max={150}
                              className="h-8 w-28"
                              value={rule.percent}
                              onChange={(e) =>
                                updateClientComplianceRule(rule.id, {
                                  percent: Number(e.target.value),
                                })
                              }
                              onBlur={(e) => {
                                const clamped = Math.min(
                                  150,
                                  Math.max(100, Number(e.target.value) || 100),
                                )

                                updateClientComplianceRule(rule.id, {
                                  percent: clamped,
                                })
                              }}
                            />

                            <span className="text-muted-foreground">
                              %
                            </span>
                          </div>
                        </td>

                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min="0"
                            className="h-8 w-28"
                            value={rule.points}
                            onChange={(e) =>
                              updateClientComplianceRule(rule.id, {
                                points: Number(e.target.value),
                              })
                            }
                          />
                        </td>

                        <td className="px-3 py-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              removeClientComplianceRule(rule.id)
                            }
                          >
                            <Trash2 size={15} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* POR PRODUCTO — oculto: ver SHOW_CLIENT_INCENTIVE_TYPE_PICKER arriba. */}
          {SHOW_CLIENT_INCENTIVE_TYPE_PICKER &&
            data.clientIncentiveType ===
            ClientIncentiveType.Product && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    Reglas por producto
                  </span>

                  <span className="text-xs text-muted-foreground">
                    Define qué cantidad de un producto genera puntos.
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary"
                  onClick={addProductRule}
                >
                  <Plus data-icon="inline-start" />
                  Agregar Producto
                </Button>
              </div>

              <div className="overflow-visible rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <tr>
                      <th className="px-3 py-2 text-left">
                        Producto
                      </th>

                      <th className="px-3 py-2 text-left">
                        Unidad de medida
                      </th>

                      <th className="px-3 py-2 text-left">
                        Cantidad
                      </th>

                      <th className="px-3 py-2 text-left">
                        Puntos ganados
                      </th>

                      <th className="w-10" />
                    </tr>
                  </thead>

                  <tbody>
                    {data.productPointsRules.map((rule) => (
                      <tr
                        key={rule.id}
                        className="border-t border-border"
                      >
                        {/* PRODUCTO */}
                        <td className="px-3 py-2">
                          <div className="relative min-w-[230px]">
                            <div className="flex items-center gap-2">
                              <Input
                                className="h-8"
                                placeholder="Buscar producto..."
                                value={
                                  rule.productName ||
                                  productSearch
                                }
                                onChange={(e) => {
                                  setProductSearch(e.target.value)

                                  updateProductRule(rule.id, {
                                    productName: e.target.value,
                                    productId: '',
                                    productCode: '',
                                  })
                                }}
                              />

                              <Search
                                size={15}
                                className="text-muted-foreground"
                              />
                            </div>

                            {productSearch &&
                              rule.productId === '' && (
                                <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-md">
                                  {filteredProducts.map(
                                    (product) => (
                                      <button
                                        key={product.id}
                                        type="button"
                                        className="flex w-full flex-col px-3 py-2 text-left hover:bg-muted"
                                        onClick={() => {
                                          updateProductRule(
                                            rule.id,
                                            {
                                              productId:
                                                product.id,
                                              productCode:
                                                product.code,
                                              productName:
                                                product.name,
                                            },
                                          )

                                          setProductSearch('')
                                        }}
                                      >
                                        <span className="text-sm font-medium">
                                          {product.name}
                                        </span>

                                        <span className="text-xs text-muted-foreground">
                                          {product.code}
                                        </span>
                                      </button>
                                    ),
                                  )}

                                  {filteredProducts.length ===
                                    0 && (
                                    <div className="px-3 py-2 text-xs text-muted-foreground">
                                      No se encontraron productos.
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        </td>

                        {/* UNIDAD / PAQUETE */}
                        <td className="px-3 py-2">
                          <NativeSelect
                            value={rule.unitType}
                            onChange={(e) =>
                              updateProductRule(rule.id, {
                                unitType:
                                  e.target
                                    .value as ProductUnitType,
                              })
                            }
                          >
                            <NativeSelectOption
                              value={ProductUnitType.Unit}
                            >
                              Unidad
                            </NativeSelectOption>

                            <NativeSelectOption
                              value={ProductUnitType.Package}
                            >
                              Paquete
                            </NativeSelectOption>
                          </NativeSelect>
                        </td>

                        {/* CANTIDAD */}
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min="1"
                            className="h-8 w-24"
                            value={rule.quantity}
                            onChange={(e) =>
                              updateProductRule(rule.id, {
                                quantity: Number(
                                  e.target.value,
                                ),
                              })
                            }
                          />
                        </td>

                        {/* PUNTOS */}
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min="0"
                            className="h-8 w-24"
                            value={rule.points}
                            onChange={(e) =>
                              updateProductRule(rule.id, {
                                points: Number(
                                  e.target.value,
                                ),
                              })
                            }
                          />
                        </td>

                        <td className="px-3 py-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              removeProductRule(rule.id)
                            }
                          >
                            <Trash2 size={15} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIGENCIA */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Vigencia de los puntos
            </span>

            <RadioGroup
              className="flex flex-row gap-6"
              value={data.pointsExpire ? 'con-vencimiento' : 'sin-vencimiento'}
              onValueChange={(value) => {
                const hasExpiration = value === 'con-vencimiento'

                update({
                  pointsExpire: hasExpiration,
                  pointsExpirationDate: hasExpiration
                    ? data.pointsExpirationDate
                    : undefined,
                })
              }}
            >
              <Label className="flex items-center gap-2 text-sm font-normal">
                <RadioGroupItem value="sin-vencimiento" />
                Sin vencimiento
              </Label>

              <Label className="flex items-center gap-2 text-sm font-normal">
                <RadioGroupItem value="con-vencimiento" />
                Con fecha de vencimiento
              </Label>
              {data.pointsExpire && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="pointsExpirationDate">
                    Fecha de vencimiento
                  </Label>

                  <Input
                    id="pointsExpirationDate"
                    type="date"
                    value={data.pointsExpirationDate ?? ''}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) =>
                      update({
                        pointsExpirationDate: e.target.value,
                      })
                    }
                    className="w-fit"
                  />

                  <span className="text-xs text-muted-foreground">
                    Los puntos generados por esta estrategia vencerán en esta fecha.
                  </span>
                </div>
              )}
            </RadioGroup>
          </div>
        </div>
      )}

      {/* EMPLEADOS */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-semibold text-foreground">
            Venado Money para Empleados
          </span>

          <span className="text-sm text-muted-foreground">
            ¿Quieres asociar un incentivo a esta estrategia?
          </span>
        </div>

        <Switch
          checked={data.employeeIncentiveEnabled}
          onCheckedChange={(checked) =>
            update({
              employeeIncentiveEnabled: !!checked,
            })
          }
        />
      </div>

      {data.employeeIncentiveEnabled && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <span className="text-sm font-semibold text-foreground">
            Nivel de Cumplimiento para Empleado
          </span>

          <span className="-mt-2 text-xs text-muted-foreground">
            El cumplimiento del empleado se evalúa siempre al 100% de la meta; solo se define cuántos puntos gana al alcanzarla.
          </span>

          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-3 py-2 text-left">
                    Cumplimiento (%)
                  </th>

                  <th className="px-3 py-2 text-left">
                    Puntos ganados
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.complianceRules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="border-t border-border"
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />

                        <Input
                          type="number"
                          className="h-8 w-28"
                          value={rule.percent}
                          disabled
                        />

                        <span className="text-muted-foreground">
                          %
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        min="0"
                        className="h-8 w-28"
                        value={rule.points}
                        onChange={(e) =>
                          updateComplianceRule(rule.id, {
                            points: Number(e.target.value),
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REGLA DE PRECIOS */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-semibold text-foreground">
            Regla de Precios
          </span>

          <span className="text-sm text-muted-foreground">
            ¿Quieres asociar un ajuste de precios a esta estrategia?
          </span>
        </div>

        <Switch
          checked={data.priceRuleIncentiveEnabled}
          onCheckedChange={(checked) =>
            update({
              priceRuleIncentiveEnabled: !!checked,
            })
          }
        />
      </div>

      {data.priceRuleIncentiveEnabled && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">
              Ajuste de precios
            </span>

            <span className="text-xs text-muted-foreground">
              Define descuentos, precios fijos o recargos para los productos de esta estrategia.
            </span>
          </div>

          {data.priceRule ? (
            <div className="flex flex-col gap-2">
              <div className="rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
                La regla de precios{' '}
                <span className="font-semibold text-foreground">
                  "{data.priceRule.name}"
                </span>{' '}
                podrá ser utilizada una vez el cliente cumpla con el objetivo.
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-fit text-primary hover:text-primary"
                onClick={() => navigate('/estrategias/crear/regla-precios')}
              >
                Editar regla de precios
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => navigate('/estrategias/crear/regla-precios')}
            >
              Crear regla de precios
              <ArrowRight data-icon="inline-end" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
