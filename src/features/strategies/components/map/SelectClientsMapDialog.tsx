import { Users } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { mockMarkets, type Market } from '@/features/strategies/data/mercados'
import type { TargetClient } from '@/features/strategies/types'
import { formatBs, formatDate } from '@/shared/utils/format'
import { defaultPinIcon, selectedPinIcon } from './marker-icon'
import { isPointInPolygon } from './point-in-polygon'
import { PolygonDrawLayer } from './PolygonDrawLayer'

const BOLIVIA_CENTER: [number, number] = [-17.3, -65.5]

interface SelectClientsMapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidates: TargetClient[]
  onConfirm: (clientIds: string[]) => void
}

function clientsInMarket(market: Market, candidates: TargetClient[]): TargetClient[] {
  return candidates.filter((client) => market.manzanos.some((manzano) => isPointInPolygon(client, manzano.polygon)))
}

export function SelectClientsMapDialog({ open, onOpenChange, candidates, onConfirm }: SelectClientsMapDialogProps) {
  const [polygons, setPolygons] = useState<{ lat: number; lng: number }[][]>([])
  const [selectedMarketIds, setSelectedMarketIds] = useState<string[]>([])
  // Cambia de valor para forzar un remount de PolygonDrawLayer (su cleanup borra todas las formas de
  // Geoman) cuando se limpia la selección a mano, ya que Geoman guarda sus capas fuera de React.
  const [polygonLayerKey, setPolygonLayerKey] = useState(0)

  // Geoman reemplaza el DOM de sus marcadores de edición al cerrar/editar una forma (vértice → path), y
  // eso puede disparar el cierre del diálogo por pérdida de foco pase lo que pase con
  // `disablePointerDismissal`. En vez de pelear contra eso, se blinda el diálogo brevemente cada vez que
  // Geoman está por mutar su DOM (ver `onBusy` en PolygonDrawLayer).
  const suppressCloseRef = useRef(false)
  function markBusy() {
    suppressCloseRef.current = true
    window.setTimeout(() => {
      suppressCloseRef.current = false
    }, 300)
  }

  const marketClients = useMemo(() => {
    const selected = mockMarkets.filter((m) => selectedMarketIds.includes(m.id))
    const map = new Map<string, TargetClient>()
    for (const market of selected) {
      for (const client of clientsInMarket(market, candidates)) map.set(client.id, client)
    }
    return map
  }, [candidates, selectedMarketIds])

  const polygonClients = useMemo(() => {
    const validPolygons = polygons.filter((p) => p.length >= 3)
    const map = new Map<string, TargetClient>()
    if (validPolygons.length === 0) return map
    for (const client of candidates) {
      if (validPolygons.some((polygon) => isPointInPolygon(client, polygon))) map.set(client.id, client)
    }
    return map
  }, [candidates, polygons])

  // Unión: un mercado marcado y un polígono dibujado a mano suman clientes de forma independiente — un
  // polígono dibujado encima de un mercado no lo "recorta" ni depende de él.
  const selectedClients = useMemo(() => {
    const map = new Map<string, TargetClient>([...marketClients, ...polygonClients])
    return Array.from(map.values())
  }, [marketClients, polygonClients])

  const selectedIds = useMemo(() => new Set(selectedClients.map((c) => c.id)), [selectedClients])

  function toggleMarket(marketId: string) {
    setSelectedMarketIds((ids) => (ids.includes(marketId) ? ids.filter((id) => id !== marketId) : [...ids, marketId]))
  }

  function resetSelection() {
    setPolygons([])
    setSelectedMarketIds([])
    setPolygonLayerKey((k) => k + 1)
  }

  function handleConfirm() {
    onConfirm(selectedClients.map((c) => c.id))
    onOpenChange(false)
  }

  const hasSelection = selectedMarketIds.length > 0 || polygons.length > 0

  // También usado directamente por el botón "Cancelar": ese onClick llama al setter del padre sin pasar
  // por Base UI, así que si solo viviera en la prop `onOpenChange` de <Dialog> el guard de `suppressCloseRef`
  // y el reset de la selección a mano nunca correrían al cancelar.
  function handleDialogOpenChange(nextOpen: boolean) {
    if (!nextOpen && suppressCloseRef.current) return
    if (!nextOpen) resetSelection()
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}
      // Defensivo: evita que un click perdido sobre el backdrop (fuera del mapa) cierre el diálogo
      // mientras se está dibujando un polígono.
      disablePointerDismissal
      modal={false}
    >
      {/* El botón "X" por defecto se posiciona absoluto sobre la esquina superior derecha del contenido,
          justo encima del mapa: un vértice dibujado ahí termina haciendo click en él en vez de en
          Geoman ("close-press"). Se oculta porque "Cancelar" ya cubre esa salida. */}
      <DialogContent className="flex h-[85vh] w-[92vw] max-w-5xl flex-col sm:max-w-5xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Seleccionar grupo de clientes</DialogTitle>
          <DialogDescription>
            Marca uno o varios mercados de la lista, y/o dibuja uno o más polígonos con la herramienta de la izquierda del mapa (se puede seguir
            dibujando sin volver a apretar el botón). Un polígono dibujado a mano suma clientes por su cuenta, caiga o no dentro de un mercado
            marcado.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 gap-3">
          <div className="flex w-56 shrink-0 flex-col gap-1 overflow-y-auto rounded-lg border border-border p-2">
            <span className="px-1 pb-1 text-xs font-semibold text-muted-foreground">Mercados</span>
            {mockMarkets.map((market) => {
              const count = clientsInMarket(market, candidates).length
              const checked = selectedMarketIds.includes(market.id)
              return (
                <button
                  key={market.id}
                  type="button"
                  onClick={() => toggleMarket(market.id)}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                    checked ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                >
                  <span
                    className="size-3 shrink-0 rounded-sm ring-1 ring-inset ring-black/10"
                    style={{ backgroundColor: market.color, opacity: checked ? 1 : 0.5 }}
                  />
                  <span className="flex-1 leading-tight text-foreground">{market.name}</span>
                  <span className="shrink-0 text-muted-foreground">{count}</span>
                </button>
              )
            })}
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg ring-1 ring-border">
            <MapContainer center={BOLIVIA_CENTER} zoom={6} className="h-full w-full">
              <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <PolygonDrawLayer key={polygonLayerKey} onPolygonsChange={setPolygons} onBusy={markBusy} />
              {mockMarkets.flatMap((market) =>
                market.manzanos.map((manzano) => (
                  <Polygon
                    key={manzano.id}
                    positions={manzano.polygon.map((p) => [p.lat, p.lng] as [number, number])}
                    interactive={false}
                    pathOptions={{
                      color: market.color,
                      weight: selectedMarketIds.includes(market.id) ? 2.5 : 1,
                      fillColor: market.color,
                      fillOpacity: selectedMarketIds.includes(market.id) ? 0.32 : 0.12,
                    }}
                  />
                )),
              )}
              {candidates.map((client) => (
                <Marker key={client.id} position={[client.lat, client.lng]} icon={selectedIds.has(client.id) ? selectedPinIcon : defaultPinIcon}>
                  <Popup>
                    <p className="font-semibold">{client.name}</p>
                    <p>Ticket promedio: {formatBs(client.ticketPromedio)}</p>
                    <p>Última compra: {formatDate(client.ultimaCompra)}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <DialogFooter className="items-center sm:justify-between">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users size={15} />
            {selectedClients.length} de {candidates.length} clientes seleccionados
            {selectedMarketIds.length > 0 && ` · ${selectedMarketIds.length} mercado${selectedMarketIds.length === 1 ? '' : 's'}`}
            {polygons.length > 0 && ` · ${polygons.length} polígono${polygons.length === 1 ? '' : 's'}`}
          </span>
          <div className="flex gap-2">
            {hasSelection && (
              <Button variant="ghost" onClick={resetSelection}>
                Limpiar selección
              </Button>
            )}
            <Button variant="outline" onClick={() => handleDialogOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={selectedClients.length === 0}>
              Confirmar selección
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
