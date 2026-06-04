import { useNavigate } from 'react-router-dom'
import { LogOut, User, Wifi, WifiOff } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useRealtimeStore } from '@/stores/realtime.store'
import { cn } from '@/lib/utils'

interface TopbarProps {
  title?: string
}

export function Topbar({ title }: TopbarProps) {
  const { user, logout } = useAuthStore()
  const { wsConnected } = useRealtimeStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-6">
      {title && (
        <h1 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h1>
      )}
      {!title && <div />}

      <div className="flex items-center gap-4">
        {/* WebSocket status */}
        <div className="flex items-center gap-1.5">
          {wsConnected ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-green-400" />
              <span className="text-xs text-green-400">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
              <span className="text-xs text-[var(--color-text-muted)]">Offline</span>
            </>
          )}
        </div>

        {/* User menu */}
        {user && (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                user.tier === 'pro'
                  ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                  : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]',
              )}
            >
              {user.full_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-[var(--color-text-primary)] leading-none">
                {user.full_name ?? user.email}
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)] capitalize">{user.tier}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-1 rounded-lg p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-accent-red)] transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        {!user && (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent-blue)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <User className="h-4 w-4" />
            Sign in
          </button>
        )}
      </div>
    </header>
  )
}
