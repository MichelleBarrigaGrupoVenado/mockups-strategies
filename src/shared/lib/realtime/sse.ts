/** Conexión SSE genérica (notificaciones, progreso de campañas) con reconexión simple. */
export function createSSEConnection(
  url: string,
  handlers: { onMessage: (data: unknown) => void; onError?: (err: Event) => void }
) {
  const source = new EventSource(url, { withCredentials: true })

  source.onmessage = (event) => {
    try {
      handlers.onMessage(JSON.parse(event.data))
    } catch {
      handlers.onMessage(event.data)
    }
  }

  source.onerror = (event) => {
    handlers.onError?.(event)
  }

  return () => source.close()
}
