import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import type { Layer } from 'leaflet'
import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

interface PolygonDrawLayerProps {
  onPolygonChange: (points: { lat: number; lng: number }[] | null) => void
}

/** Habilita el control de dibujo de Geoman (solo polígono) y expone sus vértices al padre. */
export function PolygonDrawLayer({ onPolygonChange }: PolygonDrawLayerProps) {
  const map = useMap()
  const currentLayerRef = useRef<Layer | null>(null)

  // Ref para la última versión del callback: si el efecto de abajo dependiera de `onPolygonChange`
  // directamente, cada vértice dibujado (que dispara un cambio de estado en el padre y por lo tanto
  // una nueva identidad de función) volvería a montar los controles de Geoman a mitad del dibujo,
  // cancelando la forma en curso.
  const onPolygonChangeRef = useRef(onPolygonChange)
  useEffect(() => {
    onPolygonChangeRef.current = onPolygonChange
  }, [onPolygonChange])

  useEffect(() => {
    map.pm.removeControls()
    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawCircle: false,
      drawText: false,
      drawPolygon: true,
      editMode: true,
      dragMode: false,
      cutPolygon: false,
      removalMode: true,
      rotateMode: false,
    })

    function clearCurrentLayer() {
      if (currentLayerRef.current) {
        map.removeLayer(currentLayerRef.current)
        currentLayerRef.current = null
      }
    }

    function handleCreate(e: { layer: Layer }) {
      // Solo un polígono activo a la vez: uno nuevo reemplaza al anterior.
      clearCurrentLayer()
      currentLayerRef.current = e.layer

      const polygonLayer = e.layer as unknown as { getLatLngs: () => { lat: number; lng: number }[][] }
      const rawPoints = polygonLayer.getLatLngs()[0]
      const points = rawPoints.map((p) => ({ lat: p.lat, lng: p.lng }))
      // Geoman todavía está a mitad de su propio manejador de click (convirtiendo los marcadores de
      // edición en un path estático) cuando dispara `pm:create`. Si el callback re-renderiza React de
      // forma síncrona acá adentro (por ejemplo cerrando el diálogo que contiene este mismo mapa),
      // Geoman se queda manipulando nodos que ya no existen. Se difiere al siguiente tick para dejarlo
      // terminar primero.
      setTimeout(() => onPolygonChangeRef.current(points), 0)

      e.layer.on('pm:edit', () => {
        const updated = polygonLayer.getLatLngs()[0]
        onPolygonChangeRef.current(updated.map((p) => ({ lat: p.lat, lng: p.lng })))
      })
    }

    function handleRemove() {
      currentLayerRef.current = null
      setTimeout(() => onPolygonChangeRef.current(null), 0)
    }

    map.on('pm:create', handleCreate)
    map.on('pm:remove', handleRemove)

    return () => {
      map.off('pm:create', handleCreate)
      map.off('pm:remove', handleRemove)
      map.pm.removeControls()
      clearCurrentLayer()
    }
  }, [map])

  return null
}
