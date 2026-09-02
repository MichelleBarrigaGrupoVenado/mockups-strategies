import L from 'leaflet'

/** Pin SVG propio: evita el ícono default de Leaflet, que rompe con bundlers (rutas de imagen). */
export function createPinIcon(color: string, selected = false) {
  const size = selected ? 30 : 24
  return L.divIcon({
    className: 'venado-map-pin',
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.35))">
      <path d="M12 22s7-7.58 7-13A7 7 0 0 0 5 9c0 5.42 7 13 7 13Z" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="9" r="2.5" fill="white"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

export const defaultPinIcon = createPinIcon('hsl(229 45% 22%)')
export const selectedPinIcon = createPinIcon('hsl(142 71% 35%)', true)
