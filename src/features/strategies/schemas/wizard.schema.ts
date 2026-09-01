import { z } from 'zod'
import { ActionType, StrategyObjective } from '@/features/strategies/types'

/** Compartido con la app móvil: valida cada paso del wizard antes de avanzar. */
export const objectiveStepSchema = z.object({
  objective: z.nativeEnum(StrategyObjective),
  name: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().trim().optional(),
})

export const targetingStepSchema = z.object({
  conditions: z.array(z.object({ field: z.string(), operator: z.string(), value: z.string() })).min(1, {
    message: 'Agrega al menos una condición de segmentación',
  }),
})

export const kpiStepSchema = z.object({
  kpiPrincipal: z.string().min(1, 'Selecciona un KPI'),
  metaMinPercent: z.number(),
  metaMaxPercent: z.number(),
})

export const actionStepSchema = z.object({
  actionType: z.nativeEnum(ActionType),
  actionDetail: z.string().trim().min(10, 'Describe la instrucción para el equipo comercial'),
})
