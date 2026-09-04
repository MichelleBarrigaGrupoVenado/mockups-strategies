export interface Manzano {
  id: string
  /** Vértices del polígono que delimita la manzana. */
  polygon: { lat: number; lng: number }[]
}

export interface Market {
  id: string
  name: string
  city: string
  /** Color suave usado para pintar las manzanas de este mercado en el mapa. */
  color: string
  manzanos: Manzano[]
}

/**
 * Mercados mock: cada uno agrupa un par de manzanas cuyo polígono cubre la zona donde caen los
 * clientes mock de esa ciudad (ver `cityCenters` / `rawTargetClients` en mock-data.ts), para que
 * seleccionar un mercado en el wizard siempre arrastre clientes reales de la demo.
 */
export const mockMarkets: Market[] = [
  {
    id: 'mkt-scz-norte',
    name: 'Mercado Norte — Santa Cruz',
    city: 'santa-cruz',
    color: '#7dd3fc',
    manzanos: [
      {
        id: 'scz-n1',
        polygon: [
          { lat: -17.72, lng: -63.22 },
          { lat: -17.72, lng: -63.185 },
          { lat: -17.775, lng: -63.185 },
          { lat: -17.775, lng: -63.22 },
        ],
      },
      {
        id: 'scz-n2',
        polygon: [
          { lat: -17.72, lng: -63.185 },
          { lat: -17.72, lng: -63.15 },
          { lat: -17.775, lng: -63.15 },
          { lat: -17.775, lng: -63.185 },
        ],
      },
    ],
  },
  {
    id: 'mkt-scz-sur',
    name: 'Mercado Sur — Santa Cruz',
    city: 'santa-cruz',
    color: '#fdba74',
    manzanos: [
      {
        id: 'scz-s1',
        polygon: [
          { lat: -17.775, lng: -63.22 },
          { lat: -17.775, lng: -63.185 },
          { lat: -17.83, lng: -63.185 },
          { lat: -17.83, lng: -63.22 },
        ],
      },
      {
        id: 'scz-s2',
        polygon: [
          { lat: -17.775, lng: -63.185 },
          { lat: -17.775, lng: -63.15 },
          { lat: -17.83, lng: -63.15 },
          { lat: -17.83, lng: -63.185 },
        ],
      },
    ],
  },
  {
    id: 'mkt-lpz',
    name: 'Mercado Central — La Paz',
    city: 'la-paz',
    color: '#86efac',
    manzanos: [
      {
        id: 'lpz-1',
        polygon: [
          { lat: -16.4738, lng: -68.1789 },
          { lat: -16.4738, lng: -68.1198 },
          { lat: -16.50135, lng: -68.1198 },
          { lat: -16.50135, lng: -68.1789 },
        ],
      },
      {
        id: 'lpz-2',
        polygon: [
          { lat: -16.50135, lng: -68.1789 },
          { lat: -16.50135, lng: -68.1198 },
          { lat: -16.5289, lng: -68.1198 },
          { lat: -16.5289, lng: -68.1789 },
        ],
      },
    ],
  },
  {
    id: 'mkt-cbb',
    name: 'Mercado Central — Cochabamba',
    city: 'cochabamba',
    color: '#c4b5fd',
    manzanos: [
      {
        id: 'cbb-1',
        polygon: [
          { lat: -17.3567, lng: -66.1956 },
          { lat: -17.3567, lng: -66.1301 },
          { lat: -17.3878, lng: -66.1301 },
          { lat: -17.3878, lng: -66.1956 },
        ],
      },
      {
        id: 'cbb-2',
        polygon: [
          { lat: -17.3878, lng: -66.1956 },
          { lat: -17.3878, lng: -66.1301 },
          { lat: -17.4189, lng: -66.1301 },
          { lat: -17.4189, lng: -66.1956 },
        ],
      },
    ],
  },
]
