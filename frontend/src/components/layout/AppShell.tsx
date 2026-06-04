import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useUiStore } from '@/stores/ui.store'
import { cn } from '@/lib/utils'

interface AppShellProps {
  title?: string
}

export function AppShell({ title }: AppShellProps) {
  const { sidebarCollapsed } = useUiStore()

  return (
    <div className="flex h-screen bg-[var(--color-bg-primary)]">
      <Sidebar />
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-200',
          sidebarCollapsed ? 'ml-16' : 'ml-60',
        )}
      >
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
