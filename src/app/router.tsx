import {
  BarChart3,
  FileText,
  FlaskConical,
  Gauge,
  LayoutDashboard,
  Lightbulb,
  Settings,
  User,
  Users,
  Wallet,
} from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/app/layout/AppLayout'
import { PlaceholderPage } from '@/app/pages/PlaceholderPage'
import { CreateStrategyPage } from '@/features/strategies/pages/CreateStrategyPage'
import { StrategiesListPage } from '@/features/strategies/pages/StrategiesListPage'
import { StrategyDetailPage } from '@/features/strategies/pages/StrategyDetailPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/estrategias" replace />} />

        <Route
          path="dashboard"
          element={
            <PlaceholderPage
              icon={LayoutDashboard}
              title="Dashboard"
              description="El resumen ejecutivo de comercial intelligence estará disponible próximamente."
            />
          }
        />

        <Route path="estrategias">
          <Route index element={<StrategiesListPage />} />
          <Route path="crear" element={<CreateStrategyPage />} />
          <Route path=":id" element={<StrategyDetailPage />} />
        </Route>

        <Route
          path="recomendaciones"
          element={
            <PlaceholderPage
              icon={Lightbulb}
              title="Recomendaciones"
              description="Sugerencias generadas por Venado AI para tus próximas estrategias."
            />
          }
        />
        <Route
          path="clientes-objetivo"
          element={
            <PlaceholderPage
              icon={Users}
              title="Clientes objetivo"
              description="Segmentos y perfiles de clientes usados por tus estrategias."
            />
          }
        />
        <Route
          path="experimentos"
          element={
            <PlaceholderPage
              icon={FlaskConical}
              title="Experimentos"
              description="Pruebas A/B de estrategias comerciales."
            />
          }
        />
        <Route
          path="resultados"
          element={
            <PlaceholderPage
              icon={BarChart3}
              title="Resultados"
              description="Resultados consolidados de todas tus estrategias activas."
            />
          }
        />
        <Route
          path="venado-money"
          element={
            <PlaceholderPage
              icon={Wallet}
              title="Venado Money"
              description="Administra los incentivos y el saldo entregado a clientes y empleados."
            />
          }
        />
        <Route
          path="kpis"
          element={
            <PlaceholderPage icon={Gauge} title="KPIs" description="Indicadores clave configurados en la plataforma." />
          }
        />
        <Route
          path="reportes"
          element={
            <PlaceholderPage
              icon={FileText}
              title="Reportes"
              description="Reportes exportables de desempeño comercial."
            />
          }
        />
        <Route
          path="configuracion"
          element={
            <PlaceholderPage icon={Settings} title="Configuración" description="Preferencias generales de la cuenta." />
          }
        />
        <Route
          path="usuario"
          element={<PlaceholderPage icon={User} title="Usuario" description="Datos del perfil y la sesión activa." />}
        />

        <Route path="*" element={<Navigate to="/estrategias" replace />} />
      </Route>
    </Routes>
  )
}
