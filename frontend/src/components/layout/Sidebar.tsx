import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Flame,
  LineChart,
  Users,
  Brain,
  TrendingUp,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/themes', icon: Flame, label: 'Theme Intelligence' },
  { to: '/options', icon: LineChart, label: 'Options Chain' },
  { to: '/insiders', icon: Users, label: 'Insider Trades' },
  { to: '/sentiment', icon: Brain, label: 'Sentiment' },
  { to: '/trend', icon: TrendingUp, label: 'Trend Reversal' },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUiStore()
  const { user } = useAuthStore()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] transition-all duration-200',
        sidebarCollapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[var(--color-border)] px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-sm font-bold text-[var(--color-text-primary)]">OneStop Finance</span>
          )}
        </div>
      </div>

      {/* Search */}
      {!sidebarCollapsed && (
        <div className="px-3 pt-3">
          <NavLink
            to="/search"
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 text-sm text-[var(--color-text-muted)] hover:border-[var(--color-accent-blue)] hover:text-[var(--color-text-secondary)] transition-colors"
          >
            <Search className="h-4 w-4 flex-shrink-0" />
            <span>Search ticker…</span>
            <kbd className="ml-auto rounded bg-[var(--color-bg-elevated)] px-1.5 py-0.5 text-xs">⌘K</kbd>
          </NavLink>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]',
              )
            }
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--color-border)] p-2 space-y-0.5">
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]',
            )
          }
          title={sidebarCollapsed ? 'Alerts' : undefined}
        >
          <Bell className="h-4 w-4 flex-shrink-0" />
          {!sidebarCollapsed && <span>Alerts</span>}
        </NavLink>

        {!sidebarCollapsed && user?.tier === 'free' && (
          <NavLink
            to="/upgrade"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 px-3 py-2 text-sm text-purple-300 hover:from-purple-600/30 hover:to-blue-600/30 transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span>Upgrade to Pro</span>
          </NavLink>
        )}

        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-secondary)] transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
