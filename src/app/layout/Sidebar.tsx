import { PanelLeftClose, PanelLeftOpen, Settings, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { mainNavItems } from './nav-items'

const COLLAPSED_STORAGE_KEY = 'venado-sidebar-collapsed'

function getInitialCollapsed(): boolean {
  try {
    return window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(getInitialCollapsed)

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSED_STORAGE_KEY, String(collapsed))
    } catch {
      // Almacenamiento no disponible (ej. modo privado): el colapso sigue funcionando, solo no persiste.
    }
  }, [collapsed])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent',
      collapsed && 'justify-center px-0',
      isActive && 'bg-primary text-primary-foreground hover:bg-primary'
    )

  return (
    <aside
      className={cn(
        'relative flex h-full shrink-0 flex-col border-r border-border bg-sidebar-background transition-[width] duration-200 ease-in-out',
        collapsed ? 'w-[68px]' : 'w-60'
      )}
    >
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
        title={collapsed ? 'Expandir menú' : 'Contraer menú'}
        className="absolute top-8 -right-3 z-10 flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
      >
        {collapsed ? <PanelLeftOpen size={13} /> : <PanelLeftClose size={13} />}
      </button>

      <div className={cn('flex items-center gap-2.5 px-5 py-5', collapsed && 'justify-center px-0')}>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          V
        </span>
        {!collapsed && (
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="font-display text-base font-semibold text-foreground">Venado</span>
            <span className="text-[11px] text-muted-foreground">Commercial Intelligence</span>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {mainNavItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClass} title={collapsed ? item.label : undefined}>
            <item.icon size={17} strokeWidth={2} className="shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-sidebar-border px-3 py-3">
        <NavLink to="/configuracion" className={linkClass} title={collapsed ? 'Configuración' : undefined}>
          <Settings size={17} strokeWidth={2} className="shrink-0" />
          {!collapsed && <span className="truncate">Configuración</span>}
        </NavLink>
        <NavLink to="/usuario" className={linkClass} title={collapsed ? 'Usuario' : undefined}>
          <User size={17} strokeWidth={2} className="shrink-0" />
          {!collapsed && <span className="truncate">Usuario</span>}
        </NavLink>
      </div>
    </aside>
  )
}
