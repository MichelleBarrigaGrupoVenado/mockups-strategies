import { MapPinned, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTargetClients } from '@/features/strategies/api/useStrategies'
import { ConditionRow } from '@/features/strategies/components/ConditionRow'
import { ClientsMap } from '@/features/strategies/components/map/ClientsMap'
import { SelectClientsMapDialog } from '@/features/strategies/components/map/SelectClientsMapDialog'
import { ConditionFieldKind, getConditionFields, monthsOptions } from '@/features/strategies/data/condition-fields'
import { useWizardStore } from '@/features/strategies/store/useWizardStore'
import { ConditionJoin, ConditionOperator } from '@/features/strategies/types'
import { formatBs, formatDate } from '@/shared/utils/format'

const operatorLabels: Record<ConditionOperator, string> = {
  [ConditionOperator.GreaterThan]: '>',
  [ConditionOperator.LessThan]: '<',
  [ConditionOperator.Equals]: '=',
}

export function Step2Targeting() {
  const { data, addCondition, removeCondition, updateCondition, update } = useWizardStore()
  const [mapDialogOpen, setMapDialogOpen] = useState(false)

  const baseFilters = { city: data.city, channel: data.channel, subchannel: data.subchannel, conditions: data.conditions }
  const { data: candidatePool } = useTargetClients(baseFilters)
  const { data: displayedClients } = useTargetClients({ ...baseFilters, selectedClientIds: data.selectedClientIds })

  const hasManualSelection = !!data.selectedClientIds
  const conditionFields = getConditionFields(data.objective)

  const summary = data.conditions
    .map((c, i) => {
      const fieldConfig = conditionFields.find((f) => f.field === c.field)
      const text =
        fieldConfig?.kind === ConditionFieldKind.Boolean
          ? `${c.field}: ${c.value === 'true' ? 'Sí' : 'No aplica'}`
          : fieldConfig?.kind === ConditionFieldKind.Months
            ? `${c.field} ${operatorLabels[c.operator]} ${monthsOptions.find((m) => m.value === c.value)?.label ?? '…'}`
            : `${c.field} ${operatorLabels[c.operator]} ${c.value || '…'}`

      return i === 0 ? text : `${c.join ?? ConditionJoin.And} ${text}`
    })
    .join(' ')

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-foreground">Paso 2 - ¿A quién?</h2>
          <p className="text-sm text-muted-foreground">Define los clientes que quieres alcanzar configurando las reglas de segmentación.</p>
        </div>

        <div className="flex flex-col gap-2">
          {data.conditions.map((condition, index) => (
            <div key={condition.id} className="flex flex-col gap-2">
              {index > 0 && (
                <div className="flex items-center gap-2 pl-1">
                  <Button
                    type="button"
                    size="xs"
                    variant={condition.join === ConditionJoin.Or ? 'ghost' : 'secondary'}
                    onClick={() => updateCondition(condition.id, { join: ConditionJoin.And })}
                  >
                    AND
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    variant={condition.join === ConditionJoin.Or ? 'secondary' : 'ghost'}
                    onClick={() => updateCondition(condition.id, { join: ConditionJoin.Or })}
                  >
                    OR
                  </Button>
                </div>
              )}
              <ConditionRow
                condition={condition}
                objective={data.objective}
                onChange={(patch) => updateCondition(condition.id, patch)}
                onRemove={() => removeCondition(condition.id)}
              />
            </div>
          ))}
        </div>

        <Button variant="ghost" className="w-fit text-primary hover:text-primary" onClick={addCondition}>
          <Plus data-icon="inline-start" />
          Agregar condición
        </Button>

        <div className="rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Query Summary: </span>
          {summary || 'Agrega al menos una condición'}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPinned size={16} className="text-muted-foreground" />
          Georreferencia
        </div>
        <p className="-mt-2 text-sm text-muted-foreground">
          Clientes que cumplen la ciudad, canal, subcanal y condiciones definidas. Dibuja un polígono en el mapa para elegir un grupo específico a
          mano.
        </p>

        <ClientsMap clients={displayedClients ?? []} className="h-52 w-full overflow-hidden rounded-lg ring-1 ring-border" />

        {hasManualSelection && (
          <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
            <span>Grupo seleccionado a mano en el mapa</span>
            <button type="button" className="flex items-center gap-1 font-semibold hover:underline" onClick={() => update({ selectedClientIds: null })}>
              <X size={12} />
              Quitar selección
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Clientes en el mapa</span>
          <Badge variant="secondary">{displayedClients?.length ?? 0} clientes</Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Ticket prom.</TableHead>
              <TableHead>Última compra</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedClients?.map((client, i) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium text-foreground">
                  {i === 0 && <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary align-middle" />}
                  {client.name}
                </TableCell>
                <TableCell>{formatBs(client.ticketPromedio)}</TableCell>
                <TableCell>{formatDate(client.ultimaCompra)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button className="w-full" onClick={() => setMapDialogOpen(true)}>
          Seleccionar grupo de clientes
        </Button>
      </div>

      <SelectClientsMapDialog
        open={mapDialogOpen}
        onOpenChange={setMapDialogOpen}
        candidates={candidatePool ?? []}
        onConfirm={(clientIds) => update({ selectedClientIds: clientIds })}
      />
    </div>
  )
}
