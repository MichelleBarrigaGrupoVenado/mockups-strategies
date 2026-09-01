import { io, type Socket } from 'socket.io-client'
import { env } from '@/shared/config/env'

let socket: Socket | null = null

/** Singleton de Socket.IO, conectado bajo demanda (dashboards en vivo, resultados de campaña). */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(env.wsUrl, { autoConnect: false, withCredentials: true })
  }
  return socket
}
