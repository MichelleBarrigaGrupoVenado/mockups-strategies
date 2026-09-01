import { Settings, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { mainNavItems } from './nav-items'

export function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-sidebar-background">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          V
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-base font-semibold text-foreground">Venado</span>
          <span className="text-[11px] text-muted-foreground">Commercial Intelligence</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent',
                isActive && 'bg-primary text-primary-foreground hover:bg-primary'
              )
            }
          >
            <item.icon size={17} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-sidebar-border px-3 py-3">
        <NavLink
          to="/configuracion"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent',
              isActive && 'bg-primary text-primary-foreground hover:bg-primary'
            )
          }
        >
          <Settings size={17} strokeWidth={2} />
          Configuración
        </NavLink>
        <NavLink
          to="/usuario"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent',
              isActive && 'bg-primary text-primary-foreground hover:bg-primary'
            )
          }
        >
          <User size={17} strokeWidth={2} />
          Usuario
        </NavLink>
      </div>
    </aside>
  )
}
