import { BarChart3, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { PaginationBar } from '@/components/ui/pagination-bar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDisplayedTargetClients } from '@/features/strategies/api/useDisplayedTargetClients'
import { useWizardStore } from '@/features/strategies/store/useWizardStore'
import { usePagination } from '@/shared/hooks/use-pagination'
import { formatBs, formatDate, formatFrequency } from '@/shared/utils/format'

const CLIENTS_PAGE_SIZE = 8

type ClientMetaOverrides = Record<string, number | undefined>

export function Step3Kpi() {
  const { data, update } = useWizardStore()
  const { displayedClients, handleRemoveClient } = useDisplayedTargetClients()
  const [metaOverrides, setMetaOverrides] = useState<ClientMetaOverrides>({})
  const { page, setPage, totalPages, total, paginatedItems: pagedClients, rangeStart, rangeEnd } = usePagination(displayedClients, CLIENTS_PAGE_SIZE)

  const calculateMeta = (ticketPromedio: number, percent: number) => {
    return ticketPromedio * (1 + percent / 100)
  }

  const getMeta = (client: (typeof displayedClients)[number]) => {
    return metaOverrides[client.id] ?? calculateMeta(client.ticketPromedioSegmento, data.metaPercent)
  }

  const updateClientMeta = (clientId: string, value: string) => {
    const numericValue = value === '' ? undefined : Number(value)
    setMetaOverrides((prev) => ({ ...prev, [clientId]: numericValue }))
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

          <Field>
            <FieldLabel>% a incrementar</FieldLabel>
            <InputGroup className="max-w-48">
              <InputGroupInput
                type="number"
                value={data.metaPercent}
                onChange={(e) => update({ metaPercent: Number(e.target.value) })}
              />
              <InputGroupAddon align="inline-end">%</InputGroupAddon>
            </InputGroup>
          </Field>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Clientes en el mapa</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{total} clientes</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Ticket prom. general</TableHead>
                    <TableHead>Ticket prom. segmento</TableHead>
                    <TableHead>Última compra</TableHead>
                    <TableHead>Última visita</TableHead>
                    <TableHead>Recompra</TableHead>
                    <TableHead>Meta</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium text-foreground">{client.name}</TableCell>
                      <TableCell>{formatBs(client.ticketPromedio)}</TableCell>
                      <TableCell>{formatBs(client.ticketPromedioSegmento)}</TableCell>
                      <TableCell>{formatDate(client.ultimaCompra)}</TableCell>
                      <TableCell>{formatDate(client.ultimaVisita ?? client.ultimaCompra)}</TableCell>
                      <TableCell>{formatFrequency(client.frecuenciaCompra)}</TableCell>
                      <TableCell>
                        <InputGroup className="w-32">
                          <InputGroupAddon align="inline-start">Bs</InputGroupAddon>
                          <InputGroupInput
                            type="number"
                            min="0"
                            value={getMeta(client)}
                            onChange={(e) => updateClientMeta(client.id, e.target.value)}
                          />
                        </InputGroup>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveClient(client.id)}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {total === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-6 text-center text-sm text-muted-foreground">
                        Ningún cliente cumple los criterios definidos.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {total > 0 && (
                <PaginationBar page={page} totalPages={totalPages} total={total} rangeStart={rangeStart} rangeEnd={rangeEnd} onPageChange={setPage} itemLabel="clientes" />
              )}
            </div>
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
