import { useMemo } from 'react'
import { useTargetClients } from '@/features/strategies/api/useStrategies'
import { useWizardStore } from '@/features/strategies/store/useWizardStore'

/**
 * Resultado final de targeting compartido por los pasos del wizard: el grupo activo (filtro
 * automático o polígono dibujado a mano), menos lo quitado a mano, más lo re-agregado a mano
 * (por ejemplo un cliente que cumple las condiciones pero quedó fuera del polígono dibujado).
 */
export function useDisplayedTargetClients() {
  const { data, update } = useWizardStore()

  const baseFilters = { city: data.city, channel: data.channel, subchannel: data.subchannel, conditions: data.conditions }
  /** Todo lo que cumple ciudad/canal/subcanal/condiciones, sin acotar por polígono — el pool del que se puede "agregar cliente" de vuelta. */
  const { data: candidatePool } = useTargetClients(baseFilters)
  /** Lo que arroja el modo activo (filtro automático o polígono dibujado a mano), antes de excluir/agregar clientes puntuales. */
  const { data: autoOrPolygonClients } = useTargetClients({ ...baseFilters, selectedClientIds: data.selectedClientIds })

  const displayedClients = useMemo(() => {
    const base = autoOrPolygonClients ?? []
    const excluded = new Set(data.excludedClientIds)
    const list = base.filter((client) => !excluded.has(client.id))

    const presentIds = new Set(list.map((client) => client.id))
    const pool = candidatePool ?? []

    for (const id of data.manuallyAddedClientIds) {
      if (presentIds.has(id)) continue
      const client = pool.find((c) => c.id === id)
      if (client) {
        list.push(client)
        presentIds.add(id)
      }
    }

    return list
  }, [autoOrPolygonClients, candidatePool, data.excludedClientIds, data.manuallyAddedClientIds])

  const addableClientOptions = useMemo(() => {
    const displayedIds = new Set(displayedClients.map((client) => client.id))
    return (candidatePool ?? [])
      .filter((client) => !displayedIds.has(client.id))
      .map((client) => ({ value: client.id, label: client.name }))
  }, [candidatePool, displayedClients])

  function handleAddClient(clientId: string) {
    update({
      manuallyAddedClientIds: [...data.manuallyAddedClientIds, clientId],
      excludedClientIds: data.excludedClientIds.filter((id) => id !== clientId),
    })
  }

  function handleRemoveClient(clientId: string) {
    if (data.manuallyAddedClientIds.includes(clientId)) {
      update({ manuallyAddedClientIds: data.manuallyAddedClientIds.filter((id) => id !== clientId) })
      return
    }
    update({ excludedClientIds: [...data.excludedClientIds, clientId] })
  }

  return { candidatePool, displayedClients, addableClientOptions, handleAddClient, handleRemoveClient }
}
