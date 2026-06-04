import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wifi, WifiOff, Search, Home } from 'lucide-react'
import { useRealtimeStore } from '@/stores/realtime.store'

export function Topbar() {
  const { wsConnected } = useRealtimeStore()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim().toUpperCase()
    if (q) {
      navigate(`/search?q=${q}`)
      setQuery('')
    }
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-6">
      {/* Home link */}
      <Link
        to="/"
        className="flex-shrink-0 rounded-lg p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] transition-colors"
        title="Back to home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-1 max-w-sm items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 focus-within:border-[var(--color-accent-blue)] transition-colors">
        <Search className="h-3.5 w-3.5 flex-shrink-0 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ticker… (e.g. AAPL)"
          className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none"
        />
        {query && (
          <kbd className="hidden sm:inline rounded bg-[var(--color-bg-elevated)] px-1.5 py-0.5 text-xs text-[var(--color-text-muted)]">↵</kbd>
        )}
      </form>

      {/* Spacer */}
      <div className="flex-1" />

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
    </header>
  )
}
