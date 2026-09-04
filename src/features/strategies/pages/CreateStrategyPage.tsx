import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Steps, type StepItem } from '@/components/ui/steps'
import { useCreateStrategy } from '@/features/strategies/api/useStrategies'
import { Step1Objective } from '@/features/strategies/components/wizard-steps/Step1Objective'
import { Step2Targeting } from '@/features/strategies/components/wizard-steps/Step2Targeting'
import { Step3Kpi } from '@/features/strategies/components/wizard-steps/Step3Kpi'
import { Step4Action } from '@/features/strategies/components/wizard-steps/Step4Action'
import { Step5Incentive } from '@/features/strategies/components/wizard-steps/Step5Incentive'
import { useWizardStore } from '@/features/strategies/store/useWizardStore'
import { ActionType } from '@/features/strategies/types'

const stepComponents = [Step1Objective, Step2Targeting, Step3Kpi, Step4Action, Step5Incentive]

// El paso 5 (Incentivo) solo tiene algo que configurar si se eligió alguna de estas acciones en el
// paso 4 — de lo contrario no aplica ningún incentivo y la estrategia se puede guardar directamente
// desde "Acción".
const ACTIONS_THAT_NEED_INCENTIVE_STEP: ActionType[] = [ActionType.OfferPoints, ActionType.OfferEmployeePoints, ActionType.OfferPriceRule]

export function CreateStrategyPage() {
  const { step, setStep, data } = useWizardStore()
  const createStrategy = useCreateStrategy()
  const navigate = useNavigate()

  const needsIncentiveStep = data.actionTypes.some((type) => ACTIONS_THAT_NEED_INCENTIVE_STEP.includes(type))

  const steps: StepItem[] = [
    { id: 'objetivo', label: 'Objetivo' },
    { id: 'a-quien', label: '¿A quién?' },
    { id: 'kpi', label: 'KPI/Meta' },
    { id: 'accion', label: 'Acción' },
    { id: 'incentivo', label: 'Incentivo', disabled: !needsIncentiveStep },
  ]

  const StepComponent = stepComponents[step]
  const lastStepIndex = needsIncentiveStep ? steps.length - 1 : steps.length - 2
  const isLastStep = step === lastStepIndex

  const canAdvance =
    step === 0 ? !!data.objective && data.name.trim().length >= 3 : step === 3 ? data.actionTypes.length > 0 : true

  // Si el usuario llega a estar en el paso 5 (por ejemplo yendo hacia atrás) y luego quita del paso 4
  // todas las acciones que requieren incentivo, el paso deja de estar disponible — se lo regresa a
  // "Acción" en vez de dejarlo varado en una pantalla ahora deshabilitada.
  useEffect(() => {
    if (step === 4 && !needsIncentiveStep) setStep(3)
  }, [step, needsIncentiveStep, setStep])

  function handleNext() {
    if (!canAdvance) {
      toast.error('Completa los campos requeridos antes de continuar.')
      return
    }

    if (!isLastStep) {
      setStep(step + 1)
      return
    }

    createStrategy.mutate(data, {
      onSuccess: () => {
        toast.success('Estrategia creada correctamente.')
        navigate('/estrategias')
      },
    })
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Creador de campaña</span>
          <h1 className="text-2xl font-semibold text-foreground">Crear Estrategia</h1>
        </div>
        <Link to="/estrategias" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <X size={16} />
          Guardar y Salir
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card px-5 py-4">
        <Steps steps={steps} current={step} onStepClick={(index) => setStep(index)} className="min-w-[520px]" />
      </div>

      <StepComponent />

      <div className="flex items-center justify-between border-t border-border pt-5">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>
          <ArrowLeft data-icon="inline-start" />
          Anterior
        </Button>
        <Button onClick={handleNext} disabled={createStrategy.isPending}>
          {isLastStep ? 'Finalizar y Activar' : 'Siguiente'}
          {!isLastStep && <ArrowRight data-icon="inline-end" />}
        </Button>
      </div>
    </div>
  )
}
