import { BarChart3, X } from 'lucide-react'
import { useState } from 'react'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTargetClients } from '@/features/strategies/api/useStrategies'
import { useWizardStore } from '@/features/strategies/store/useWizardStore'
import { formatBs, formatDate } from '@/shared/utils/format'

type ClientMetaOverrides = Record<
  string,
  {
    metaMin?: number
    metaMax?: number
  }
>

export function Step3Kpi() {
  const { data, update } = useWizardStore()
  const { data: clients } = useTargetClients({
    city: data.city,
    channel: data.channel,
    subchannel: data.subchannel,
    conditions: data.conditions,
    selectedClientIds: data.selectedClientIds,
  })
  const [metaOverrides, setMetaOverrides] = useState<ClientMetaOverrides>({})

  const calculateMeta = (ticketPromedio: number, percent: number) => {
    return ticketPromedio * (1 + percent / 100)
  }

  const getMetaMin = (client: NonNullable<typeof clients>[number]) => {
    return metaOverrides[client.id]?.metaMin
      ?? calculateMeta(client.ticketPromedio, data.metaMinPercent)
  }

  const getMetaMax = (client: NonNullable<typeof clients>[number]) => {
    return metaOverrides[client.id]?.metaMax
      ?? calculateMeta(client.ticketPromedio, data.metaMaxPercent)
  }

  const updateClientMeta = (
    clientId: string,
    field: 'metaMin' | 'metaMax',
    value: string,
  ) => {
    const numericValue = value === '' ? undefined : Number(value)

    setMetaOverrides((prev) => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [field]: numericValue,
      },
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">¿Cómo sabremos si funcionó?</h2>
        <p className="text-sm text-muted-foreground">Selecciona un KPI o Meta.</p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-5">
          <FieldGroup>
            <Field>
              <FieldLabel>KPI Principal</FieldLabel>
              <NativeSelect value={data.kpiPrincipal} onChange={(e) => update({ kpiPrincipal: e.target.value })}>
                <NativeSelectOption value="Ticket promedio">Ticket promedio</NativeSelectOption>
                <NativeSelectOption value="Frecuencia de compra">Frecuencia de compra</NativeSelectOption>
                <NativeSelectOption value="Productos por cliente">Productos por cliente</NativeSelectOption>
              </NativeSelect>
            </Field>
          </FieldGroup>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Rango de Meta Mínimo</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type="number"
                  value={data.metaMinPercent}
                  onChange={(e) => update({ metaMinPercent: Number(e.target.value) })}
                />
                <InputGroupAddon align="inline-end">%</InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel>Rango de Meta Máximo</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type="number"
                  value={data.metaMaxPercent}
                  onChange={(e) => update({ metaMaxPercent: Number(e.target.value) })}
                />
                <InputGroupAddon align="inline-end">%</InputGroupAddon>
              </InputGroup>
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Clientes en el mapa</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{clients?.length ?? 0} clientes</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Última compra</TableHead>
                  <TableHead>Última visita</TableHead>
                  <TableHead>Ticket prom.</TableHead>
                  <TableHead>Meta mín.</TableHead>
                  <TableHead>Meta máx.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients?.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium text-foreground">{client.name}</TableCell>
                    <TableCell>{formatDate(client.ultimaCompra)}</TableCell>
                    <TableCell>{client.ultimaVisita ? formatDate(client.ultimaVisita) : '—'}</TableCell>
                    <TableCell>{formatBs(client.ticketPromedio)}</TableCell>
                    <TableCell>
                      <InputGroup className="w-32">
                        <InputGroupAddon align="inline-start">Bs</InputGroupAddon>
                        <InputGroupInput
                          type="number"
                          min="0"
                          value={getMetaMin(client)}
                          onChange={(e) =>
                            updateClientMeta(client.id, 'metaMin', e.target.value)
                          }
                        />
                      </InputGroup>
                    </TableCell>

                    <TableCell>
                      <InputGroup className="w-32">
                        <InputGroupAddon align="inline-start">Bs</InputGroupAddon>
                        <InputGroupInput
                          type="number"
                          min="0"
                          value={getMetaMax(client)}
                          onChange={(e) =>
                            updateClientMeta(client.id, 'metaMax', e.target.value)
                          }
                        />
                      </InputGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <BarChart3 size={16} />
              Incremento de ticket
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg bg-muted p-3 text-center text-xs">
              <span className="rounded-md bg-card px-2 py-1.5 font-medium ring-1 ring-border">Ticket Actual</span>
              <span className="text-muted-foreground">×</span>
              <span className="rounded-md bg-card px-2 py-1.5 font-medium ring-1 ring-border">Meta %</span>
              <span className="text-muted-foreground">=</span>
              <span className="rounded-md bg-primary px-2 py-1.5 font-medium text-primary-foreground">Nuevo Ticket</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
