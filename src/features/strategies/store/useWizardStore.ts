import { create } from 'zustand'
import { ActionType, ConditionJoin, ConditionOperator, type StrategyWizardData, type TargetingCondition } from '@/features/strategies/types'

const initialData: StrategyWizardData = {
  objective: null,
  name: '',
  description: '',
  productLevel: '',
  productLevelValue: '',
  productLevelA: '',
  productLevelValueA: '',
  productLevelB: '',
  productLevelValueB: '',
  city: '',
  channel: '',
  subchannel: '',
  conditions: [
    { id: crypto.randomUUID(), field: 'Ventas históricas', operator: ConditionOperator.GreaterThan, value: '500', join: ConditionJoin.And },
  ],
  selectedClientIds: null,
  kpiPrincipal: 'Ticket promedio',
  metaMinPercent: 10,
  metaMaxPercent: 20,
  actionTypes: [
    ActionType.RecommendProducts,
  ],
  actionDetail: '',
  clientIncentiveEnabled: true,
  pointsRules: [
    { id: crypto.randomUUID(), amountBs: 100, points: 10 },
    { id: crypto.randomUUID(), amountBs: 200, points: 25 },
  ],
  pointsExpire: false,
  employeeIncentiveEnabled: true,
  complianceRules: [{ id: crypto.randomUUID(), percent: 100, points: 0 }],
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
        conditions: [
          ...s.data.conditions,
          { id: crypto.randomUUID(), field: 'Ventas históricas', operator: ConditionOperator.GreaterThan, value: '', join: ConditionJoin.And },
        ],
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
  reset: () => set({ step: 0, data: initialData }),
}))
