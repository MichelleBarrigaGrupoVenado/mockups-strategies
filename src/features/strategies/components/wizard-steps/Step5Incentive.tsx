import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { useWizardStore } from '@/features/strategies/store/useWizardStore'

export function Step5Incentive() {
  const { data, update, addPointsRule, removePointsRule, updatePointsRule } = useWizardStore()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-semibold text-foreground">Venado Money para Clientes</span>
          <span className="text-sm text-muted-foreground">¿Quieres asociar un incentivo a esta estrategia?</span>
        </div>
        <Switch checked={data.clientIncentiveEnabled} onCheckedChange={(checked) => update({ clientIncentiveEnabled: !!checked })} />
      </div>

      {data.clientIncentiveEnabled && (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Reglas de Asignación de Puntos</span>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={addPointsRule}>
              <Plus data-icon="inline-start" />
              Agregar Regla
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-3 py-2 text-left">Monto de compra (Bs)</th>
                  <th className="px-3 py-2 text-left">Puntos ganados</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {data.pointsRules.map((rule) => (
                  <tr key={rule.id} className="border-t border-border">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                        <Input
                          type="number"
                          className="h-8 w-28"
                          value={rule.amountBs}
                          onChange={(e) => updatePointsRule(rule.id, { amountBs: Number(e.target.value) })}
                        />
                        <span className="text-muted-foreground">Bs</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        className="h-8 w-28"
                        value={rule.points}
                        onChange={(e) => updatePointsRule(rule.id, { points: Number(e.target.value) })}
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={() => removePointsRule(rule.id)}>
                        <Trash2 size={15} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Vigencia de los puntos</span>
            <RadioGroup
              className="flex flex-row gap-6"
              value={data.pointsExpire ? 'con-vencimiento' : 'sin-vencimiento'}
              onValueChange={(value) => update({ pointsExpire: value === 'con-vencimiento' })}
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
          </div>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-semibold text-foreground">Venado Money para Empleados</span>
          <span className="text-sm text-muted-foreground">¿Quieres asociar un incentivo a esta estrategia?</span>
        </div>
        <Switch checked={data.employeeIncentiveEnabled} onCheckedChange={(checked) => update({ employeeIncentiveEnabled: !!checked })} />
      </div>

      {data.employeeIncentiveEnabled && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
          <span className="text-sm font-semibold text-foreground">Nivel de Cumplimiento para Empleado</span>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-3 py-2 text-left">Cumplimiento (%)</th>
                  <th className="px-3 py-2 text-left">Puntos ganados</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {data.complianceRules.map((rule) => (
                  <tr key={rule.id} className="border-t border-border">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                        <Input type="number" className="h-8 w-28" defaultValue={rule.percent} />
                        <span className="text-muted-foreground">%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <Input type="number" className="h-8 w-28" defaultValue={rule.points} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive">
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
    </div>
  )
}
