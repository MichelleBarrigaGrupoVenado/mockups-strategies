import { useMemo, useState } from 'react'
import { Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IncentiveEvolutionChart } from '@/features/results/components/IncentiveEvolutionChart'
import { IncentiveSeries, type IncentivesResult } from '@/features/results/types'
import { formatBsAmount, formatCount, formatPercentDecimal } from '@/shared/utils/format'

const ALL_RULES = 'all'

const ruleSeriesLabels: Record<IncentiveSeries, string> = {
  [IncentiveSeries.Granted]: 'Otorgadas',
  [IncentiveSeries.Used]: 'Utilizadas',
  [IncentiveSeries.Pending]: 'Pendientes',
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}

/**
 * Reglas de precio directas: la lista de la izquierda actúa de filtro sobre los indicadores
 * de la cabecera y sobre el gráfico de evolución de la derecha.
 */
export function PriceRulesIncentiveSection({ data }: { data: IncentivesResult }) {
  const [selectedRuleId, setSelectedRuleId] = useState<string>(ALL_RULES)

  const selectedRule = data.priceRules.find((rule) => rule.id === selectedRuleId)

  const summary = useMemo(() => {
    if (!selectedRule) {
      return {
        clients: data.priceRulesClients,
        applications: data.priceRulesApplications,
        averageBs: data.priceRulesAverageBenefitBs,
        benefitBs: data.priceRulesBenefitBs,
      }
    }
    return {
      clients: selectedRule.clients,
      applications: selectedRule.applications,
      averageBs: Math.round((selectedRule.benefitBs / selectedRule.clients) * 100) / 100,
      benefitBs: selectedRule.benefitBs,
    }
  }, [selectedRule, data])

  const chartRows = selectedRule ? selectedRule.byMonth : data.priceRulesByMonth

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Tag size={14} className="text-muted-foreground" />
            Reglas de Precio Directas
          </h3>
          <p className="text-sm text-muted-foreground">Descuentos comerciales y promociones automáticas asignadas</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SummaryChip label="Clientes beneficiados" value={`${formatCount(summary.clients)} clientes`} />
          <SummaryChip label="Usos otorgados" value={`${formatCount(summary.applications)} veces`} />
          <SummaryChip label="Beneficio promedio" value={`${formatBsAmount(summary.averageBs)} / cliente`} />
          <SummaryChip label="Beneficio total" value={formatBsAmount(summary.benefitBs)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <div className="flex max-h-[430px] flex-col gap-2 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => setSelectedRuleId(ALL_RULES)}
            className={cn(
              'rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors',
              selectedRuleId === ALL_RULES
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border bg-background text-muted-foreground hover:bg-accent'
            )}
          >
            Todas las reglas ({data.priceRules.length})
          </button>

          {data.priceRules.map((rule) => {
            const isSelected = rule.id === selectedRuleId
            return (
              <button
                key={rule.id}
                type="button"
                onClick={() => setSelectedRuleId(rule.id)}
                className={cn(
                  'flex flex-col gap-3 rounded-lg border p-3 text-left transition-colors',
                  isSelected ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-accent'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {formatPercentDecimal(rule.sharePercent)} del total
                  </span>
                  <Tag size={13} className="mt-0.5 shrink-0 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">{rule.name}</span>
                  <span className="text-xs text-muted-foreground">{rule.description}</span>
                </div>
                <div className="flex flex-col gap-1 border-t border-border pt-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Clientes:</span>
                    <span className="font-medium text-foreground">{formatCount(rule.clients)} clientes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Usos:</span>
                    <span className="font-medium text-foreground">{formatCount(rule.applications)} aplicaciones</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Beneficio otorgado:</span>
                    <span className="font-semibold text-foreground">{formatBsAmount(rule.benefitBs)}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <IncentiveEvolutionChart
          title={selectedRule ? `Evolución de "${selectedRule.name}" por Mes` : 'Evolución de Reglas de Precio por Mes'}
          description="Comparativa mensual de reglas de precio otorgadas, utilizadas y otorgadas sin ser utilizadas (pendientes)"
          rows={chartRows}
          seriesLabels={ruleSeriesLabels}
          primaryUnit={{ label: 'Aplicaciones', format: (value) => `${formatCount(value)} apl.` }}
          className="border-0 p-0"
          chartHeightClassName="h-72"
        />
      </div>
    </div>
  )
}
