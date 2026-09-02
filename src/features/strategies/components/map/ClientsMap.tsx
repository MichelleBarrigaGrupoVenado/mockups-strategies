import L from 'leaflet'
import { useEffect, type ComponentType, type ReactNode } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import * as ReactLeafletCluster from 'react-leaflet-cluster'
import type { TargetClient } from '@/features/strategies/types'
import { formatBs, formatDate } from '@/shared/utils/format'
import { defaultPinIcon } from './marker-icon'

// El build CJS de react-leaflet-cluster queda doblemente envuelto por el interop del bundler
// (`{ default: { default: ForwardRefComponent } }`). Se desenvuelve hasta encontrar algo que React
// pueda renderizar (función u objeto forwardRef/memo con `$$typeof`), en vez de asumir cuántas
// vueltas de `.default` hacen falta.
function unwrapDefault(value: unknown): unknown {
  let current = value
  while (current && typeof current === 'object' && !('$$typeof' in current) && 'default' in current) {
    current = (current as { default: unknown }).default
  }
  return current
}

const MarkerClusterGroup = unwrapDefault(ReactLeafletCluster) as ComponentType<{
  chunkedLoading?: boolean
  children: ReactNode
}>

const BOLIVIA_CENTER: [number, number] = [-17.3, -65.5]

function FitToClients({ clients }: { clients: TargetClient[] }) {
  const map = useMap()

  useEffect(() => {
    if (clients.length === 0) return
    const bounds = L.latLngBounds(clients.map((c) => [c.lat, c.lng]))
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 14 })
  }, [clients, map])

  return null
}

export function ClientsMap({ clients, className }: { clients: TargetClient[]; className?: string }) {
  return (
    <div className={className}>
      <MapContainer center={BOLIVIA_CENTER} zoom={6} scrollWheelZoom={false} className="h-full w-full rounded-lg">
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitToClients clients={clients} />
        <MarkerClusterGroup chunkedLoading>
          {clients.map((client) => (
            <Marker key={client.id} position={[client.lat, client.lng]} icon={defaultPinIcon}>
              <Popup>
                <p className="font-semibold">{client.name}</p>
                <p>Ticket promedio: {formatBs(client.ticketPromedio)}</p>
                <p>Última compra: {formatDate(client.ultimaCompra)}</p>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
