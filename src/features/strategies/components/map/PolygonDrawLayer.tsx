import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import type { Layer } from 'leaflet'
import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

interface PolygonDrawLayerProps {
  /** Se dispara con el listado completo de polígonos activos cada vez que se crea, edita o borra uno. */
  onPolygonsChange: (polygons: { lat: number; lng: number }[][]) => void
  /** Se dispara justo antes de que Geoman manipule su DOM (crear/editar/borrar), para que el padre pueda
   *  blindar temporalmente cualquier cierre disparado por esa mutación (ver SelectClientsMapDialog). */
  onBusy?: () => void
}

/** Habilita el control de dibujo de Geoman (polígono, con múltiples formas activas a la vez) y expone
 *  sus vértices al padre. */
export function PolygonDrawLayer({ onPolygonsChange, onBusy }: PolygonDrawLayerProps) {
  const map = useMap()
  const layersRef = useRef<Map<Layer, { lat: number; lng: number }[]>>(new Map())

  // Refs para la última versión de los callbacks: si el efecto de abajo dependiera de ellos
  // directamente, cada vértice dibujado (que dispara un cambio de estado en el padre y por lo tanto
  // una nueva identidad de función) volvería a montar los controles de Geoman a mitad del dibujo,
  // cancelando la forma en curso.
  const onPolygonsChangeRef = useRef(onPolygonsChange)
  useEffect(() => {
    onPolygonsChangeRef.current = onPolygonsChange
  }, [onPolygonsChange])
  const onBusyRef = useRef(onBusy)
  useEffect(() => {
    onBusyRef.current = onBusy
  }, [onBusy])

  useEffect(() => {
    // Referencia estable al mismo Map durante todo el ciclo de vida del efecto (layersRef nunca se
    // reasigna), capturada acá para que el cleanup no tenga que leer `.current` directamente.
    const layers = layersRef.current

    // `continueDrawing` deja la herramienta de polígono activa después de cerrar cada forma, así se
    // pueden dibujar varios polígonos seguidos sin volver a apretar el botón de la barra.
    map.pm.setGlobalOptions({ continueDrawing: true })
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

    function emitAll() {
      onPolygonsChangeRef.current(Array.from(layersRef.current.values()))
    }

    function handleCreate(e: { layer: Layer }) {
      onBusyRef.current?.()

      const layer = e.layer
      const polygonLayer = layer as unknown as { getLatLngs: () => { lat: number; lng: number }[][] }
      const rawPoints = polygonLayer.getLatLngs()[0]
      layersRef.current.set(layer, rawPoints.map((p) => ({ lat: p.lat, lng: p.lng })))

      // Geoman todavía está a mitad de su propio manejador de click (convirtiendo los marcadores de
      // edición en un path estático) cuando dispara `pm:create`. Si el callback re-renderiza React de
      // forma síncrona acá adentro, Geoman se queda manipulando nodos que ya no existen. Se difiere al
      // siguiente tick para dejarlo terminar primero.
      setTimeout(emitAll, 0)

      layer.on('pm:edit', () => {
        onBusyRef.current?.()
        const updated = polygonLayer.getLatLngs()[0]
        layersRef.current.set(layer, updated.map((p) => ({ lat: p.lat, lng: p.lng })))
        emitAll()
      })
    }

    function handleRemove(e: { layer: Layer }) {
      onBusyRef.current?.()
      layersRef.current.delete(e.layer)
      setTimeout(emitAll, 0)
    }

    map.on('pm:create', handleCreate)
    map.on('pm:remove', handleRemove)

    return () => {
      map.off('pm:create', handleCreate)
      map.off('pm:remove', handleRemove)
      map.pm.removeControls()
      layers.forEach((_points, layer) => map.removeLayer(layer))
      layers.clear()
    }
  }, [map])

  return null
}
