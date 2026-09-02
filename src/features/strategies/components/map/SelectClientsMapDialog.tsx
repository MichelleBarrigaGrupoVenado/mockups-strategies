import { Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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

export function SelectClientsMapDialog({ open, onOpenChange, candidates, onConfirm }: SelectClientsMapDialogProps) {
  const [polygonPoints, setPolygonPoints] = useState<{ lat: number; lng: number }[] | null>(null)

  const selectedClients = useMemo(() => {
    if (!polygonPoints || polygonPoints.length < 3) return []
    return candidates.filter((client) => isPointInPolygon(client, polygonPoints))
  }, [candidates, polygonPoints])

  const selectedIds = useMemo(() => new Set(selectedClients.map((c) => c.id)), [selectedClients])

  function handleConfirm() {
    onConfirm(selectedClients.map((c) => c.id))
    onOpenChange(false)
  }

  // Geoman reemplaza el DOM de sus marcadores de edición al cerrar una forma (vértice → path), y eso
  // dispara el cierre del diálogo por pérdida de foco pase lo que pase con `disablePointerDismissal`.
  // En vez de pelear contra eso, se adopta como el gesto de confirmación: terminar de dibujar el
  // polígono YA aplica la selección, así el cierre (voluntario o inducido por Geoman) nunca pierde el
  // resultado. El botón "Confirmar selección" queda como respaldo explícito para cuando el diálogo sí
  // permanece abierto.
  function handlePolygonChange(points: { lat: number; lng: number }[] | null) {
    setPolygonPoints(points)
    if (!points || points.length < 3) return

    const selected = candidates.filter((client) => isPointInPolygon(client, points))
    if (selected.length > 0) {
      onConfirm(selected.map((client) => client.id))
      onOpenChange(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setPolygonPoints(null)
        onOpenChange(nextOpen)
      }}
      // Defensivo: evita que un click perdido sobre el backdrop (fuera del mapa) cierre el diálogo
      // mientras se está dibujando un polígono.
      disablePointerDismissal
      modal={false}
    >
      {/* El botón "X" por defecto se posiciona absoluto sobre la esquina superior derecha del contenido,
          justo encima del mapa: un vértice dibujado ahí termina haciendo click en él en vez de en
          Geoman ("close-press"). Se oculta porque "Cancelar" ya cubre esa salida. */}
      <DialogContent className="flex h-[85vh] w-[92vw] max-w-4xl flex-col sm:max-w-4xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Seleccionar grupo de clientes</DialogTitle>
          <DialogDescription>
            Usa la herramienta de polígono (ícono de la izquierda del mapa) para encerrar a los clientes que quieres incluir en el segmento. Al
            cerrar la forma la selección se aplica automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg ring-1 ring-border">
          <MapContainer center={BOLIVIA_CENTER} zoom={6} className="h-full w-full">
            <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <PolygonDrawLayer onPolygonChange={handlePolygonChange} />
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

        <DialogFooter className="items-center sm:justify-between">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users size={15} />
            {selectedClients.length} de {candidates.length} clientes dentro del polígono
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
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
