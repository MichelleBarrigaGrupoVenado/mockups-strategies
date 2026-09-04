import { create } from 'zustand'
import { createDefaultCondition } from '@/features/strategies/data/condition-fields'
import { ActionType, ClientIncentiveType, ConditionJoin, ConditionOperator, type StrategyWizardData, type TargetingCondition } from '@/features/strategies/types'
import { addMonthsIso, todayIso } from '@/shared/utils/format'

const defaultStartDate = todayIso()

const initialData: StrategyWizardData = {
  objective: null,
  name: '',
  description: '',
  startDate: defaultStartDate,
  endDate: addMonthsIso(defaultStartDate, 3),
  productLevel: '',
  productLevelValues: [],
  productLevelA: '',
  productLevelValuesA: [],
  productLevelB: '',
  productLevelValuesB: [],
  city: '',
  channel: '',
  subchannel: '',
  conditions: [
    { id: crypto.randomUUID(), field: 'Ventas históricas', operator: ConditionOperator.GreaterThan, value: '500', join: ConditionJoin.And },
  ],
  selectedClientIds: null,
  excludedClientIds: [],
  manuallyAddedClientIds: [],
  kpiPrincipal: 'Ticket promedio',
  metaMinPercent: 10,
  metaMaxPercent: 20,
  actionTypes: [
    ActionType.RecommendProducts,
  ],
  actionDetail: '',
  // Se habilita automáticamente al elegir la acción correspondiente en el paso 4 (ver Step4Action) —
  // arranca en `false` porque el default de `actionTypes` no incluye ninguna de esas acciones.
  clientIncentiveEnabled: false,
  // El selector de tipo está oculto por ahora en Step5Incentive (ver SHOW_CLIENT_INCENTIVE_TYPE_PICKER) —
  // "Por cumplimiento" es el único tipo visible, así que es el único default que tiene sentido.
  clientIncentiveType: ClientIncentiveType.Compliance,
  pointsRules: [
    { id: crypto.randomUUID(), amountBs: 100, points: 10 },
    { id: crypto.randomUUID(), amountBs: 200, points: 25 },
  ],
  clientComplianceRules: [
    { id: crypto.randomUUID(), percent: 100, points: 200 },
    { id: crypto.randomUUID(), percent: 120, points: 300 },
    { id: crypto.randomUUID(), percent: 150, points: 500 },
  ],
  productPointsRules: [],
  pointsExpire: false,
  // Mismo criterio que `clientIncentiveEnabled`: se habilita al elegir "Ofrecer puntos al Empleado" en el paso 4.
  employeeIncentiveEnabled: false,
  complianceRules: [{ id: crypto.randomUUID(), percent: 100, points: 0 }],
  priceRuleIncentiveEnabled: false,
  priceRule: null,
}

interface WizardState {
  step: number
  data: StrategyWizardData
  setStep: (step: number) => void
  update: (patch: Partial<StrategyWizardData>) => void
  addCondition: () => void
  removeCondition: (id: string) => void
  updateCondition: (id: string, patch: Partial<TargetingCondition>) => void
  addPointsRule: () => void
  removePointsRule: (id: string) => void
  updatePointsRule: (id: string, patch: Partial<{ amountBs: number; points: number }>) => void
  addClientComplianceRule: () => void
  removeClientComplianceRule: (id: string) => void
  updateClientComplianceRule: (id: string, patch: Partial<{ percent: number; points: number }>) => void
  updateComplianceRule: (id: string, patch: Partial<{ percent: number; points: number }>) => void
  reset: () => void
}

export const useWizardStore = create<WizardState>((set) => ({
  step: 0,
  data: initialData,
  setStep: (step) => set({ step }),
  update: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
  addCondition: () =>
    set((s) => ({
      data: {
        ...s.data,
        conditions: [...s.data.conditions, createDefaultCondition(s.data.objective)],
      },
    })),
  removeCondition: (id) => set((s) => ({ data: { ...s.data, conditions: s.data.conditions.filter((c) => c.id !== id) } })),
  updateCondition: (id, patch) =>
    set((s) => ({
      data: { ...s.data, conditions: s.data.conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)) },
    })),
  addPointsRule: () =>
    set((s) => ({ data: { ...s.data, pointsRules: [...s.data.pointsRules, { id: crypto.randomUUID(), amountBs: 0, points: 0 }] } })),
  removePointsRule: (id) => set((s) => ({ data: { ...s.data, pointsRules: s.data.pointsRules.filter((r) => r.id !== id) } })),
  updatePointsRule: (id, patch) =>
    set((s) => ({
      data: { ...s.data, pointsRules: s.data.pointsRules.map((r) => (r.id === id ? { ...r, ...patch } : r)) },
    })),
  addClientComplianceRule: () =>
    set((s) => ({
      data: { ...s.data, clientComplianceRules: [...s.data.clientComplianceRules, { id: crypto.randomUUID(), percent: 100, points: 0 }] },
    })),
  removeClientComplianceRule: (id) =>
    set((s) => ({ data: { ...s.data, clientComplianceRules: s.data.clientComplianceRules.filter((r) => r.id !== id) } })),
  updateClientComplianceRule: (id, patch) =>
    set((s) => ({
      data: { ...s.data, clientComplianceRules: s.data.clientComplianceRules.map((r) => (r.id === id ? { ...r, ...patch } : r)) },
    })),
  updateComplianceRule: (id, patch) =>
    set((s) => ({
      data: { ...s.data, complianceRules: s.data.complianceRules.map((r) => (r.id === id ? { ...r, ...patch } : r)) },
    })),
  reset: () => set({ step: 0, data: initialData }),
}))
