import {
  BarChart3,
  FileText,
  FlaskConical,
  Gauge,
  LayoutDashboard,
  Lightbulb,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

export const mainNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Estrategias', path: '/estrategias', icon: TrendingUp },
  { label: 'Recomendaciones', path: '/recomendaciones', icon: Lightbulb },
  { label: 'Clientes objetivo', path: '/clientes-objetivo', icon: Users },
  { label: 'Experimentos', path: '/experimentos', icon: FlaskConical },
  { label: 'Resultados', path: '/resultados', icon: BarChart3 },
  { label: 'Venado Money', path: '/venado-money', icon: Wallet },
  { label: 'KPIs', path: '/kpis', icon: Gauge },
  { label: 'Reportes', path: '/reportes', icon: FileText },
]
