import { FlaskConical, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { monthsOptions } from '@/features/strategies/data/condition-fields'
import { mockStrategySummaries } from '@/features/strategies/data/mock-data'
import { StatCard } from '@/features/strategies/components/StatCard'
import { StatisticalModelTab } from '@/features/results/components/StatisticalModelTab'
import { calculateGananciaYRoi, DEFAULT_SIMULATION_INPUT, simulateStatisticalModel, type SimulationInput } from '@/features/experimentos/data/simulate'
import { formatBs, formatPercent } from '@/shared/utils/format'

const confidenceLevelOptions = [90, 95, 99]

export function ExperimentSimulatorPage() {
  const [strategyId, setStrategyId] = useState('')
  const [input, setInput] = useState<SimulationInput>(DEFAULT_SIMULATION_INPUT)

  function update(patch: Partial<SimulationInput>) {
    setInput((prev) => ({ ...prev, ...patch }))
  }

  function handleStrategyChange(id: string) {
    setStrategyId(id)
    const strategy = mockStrategySummaries.find((item) => item.id === id)
    // Si la estrategia elegida ya trae un impacto proyectado, se usa como punto de partida del
    // incremento de ventas esperado — el resto de los parámetros quedan a criterio de quien simula.
    if (strategy?.projectedImpactPercent) {
      update({ salesIncreasePercent: Math.round(strategy.projectedImpactPercent) })
    }
  }

  function handleReset() {
    setStrategyId('')
    setInput(DEFAULT_SIMULATION_INPUT)
  }

  const { gananciaNetaBs, roi } = useMemo(() => calculateGananciaYRoi(input.costosBs, input.ventasBs), [input.costosBs, input.ventasBs])
  const simulationResult = useMemo(() => simulateStatisticalModel(input), [input])

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 text-xs font-semibold tracking-wide text-primary uppercase">
          <FlaskConical size={14} />
          Experimentos
        </span>
        <h1 className="text-2xl font-semibold text-foreground">Simulador de Resultados</h1>
        <p className="text-sm text-muted-foreground">
          Proyecta el impacto financiero de una estrategia antes de lanzarla: ajusta costos y ventas esperadas y revisa cómo se vería su
          Modelo Estadístico.
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
        <span className="text-sm font-semibold text-foreground">Parámetros de la simulación</span>

        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field className="lg:col-span-3">
              <FieldLabel>Estrategia a simular (opcional)</FieldLabel>
              <NativeSelect value={strategyId} onChange={(e) => handleStrategyChange(e.target.value)}>
                <NativeSelectOption value="">Simulación genérica (sin estrategia base)</NativeSelectOption>
                {mockStrategySummaries.map((strategy) => (
                  <NativeSelectOption key={strategy.id} value={strategy.id}>
                    {strategy.name} — {strategy.objectiveLabel}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>

            <Field>
              <FieldLabel htmlFor="sim-costos">Costos Totales</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">Bs</InputGroupAddon>
                <InputGroupInput
                  id="sim-costos"
                  type="number"
                  min="0"
                  value={input.costosBs}
                  onChange={(e) => update({ costosBs: Number(e.target.value) })}
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="sim-ventas">Ventas Totales</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">Bs</InputGroupAddon>
                <InputGroupInput
                  id="sim-ventas"
                  type="number"
                  min="0"
                  value={input.ventasBs}
                  onChange={(e) => update({ ventasBs: Number(e.target.value) })}
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="sim-incremento">Incremento de ventas esperado</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="sim-incremento"
                  type="number"
                  value={input.salesIncreasePercent}
                  onChange={(e) => update({ salesIncreasePercent: Number(e.target.value) })}
                />
                <InputGroupAddon align="inline-end">%</InputGroupAddon>
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel>Duración</FieldLabel>
              <NativeSelect value={String(input.durationMonths)} onChange={(e) => update({ durationMonths: Number(e.target.value) })}>
                {monthsOptions.map((option) => (
                  <NativeSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>

            <Field>
              <FieldLabel>Nivel de confianza</FieldLabel>
              <NativeSelect value={String(input.confidenceLevel)} onChange={(e) => update({ confidenceLevel: Number(e.target.value) })}>
                {confidenceLevelOptions.map((level) => (
                  <NativeSelectOption key={level} value={level}>
                    {level}%
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          </div>
        </FieldGroup>

        <div className="flex justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw data-icon="inline-start" size={14} />
            Restablecer valores por defecto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Ganancia Neta (Ventas − Costos)" value={formatBs(gananciaNetaBs)} hint="Se recalcula automáticamente" />
        <StatCard label="ROI" value={formatPercent(Math.round(roi))} hint="Ganancia neta / Costos" emphasize />
      </div>

      <StatisticalModelTab data={simulationResult} />
    </div>
  )
}
