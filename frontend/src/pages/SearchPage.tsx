import { Search } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function SearchPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Search className="h-6 w-6 text-[var(--color-accent-blue)]" />
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Search</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Search any ticker for full analysis</p>
        </div>
      </div>

      <div className="max-w-xl">
        <input
          type="text"
          placeholder="Enter a ticker symbol (e.g. AAPL, NVDA, TSLA)…"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent-blue)] focus:outline-none"
        />
      </div>

      <Card>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Type a ticker to pull options chain, insider activity, sentiment score, and technical signals.
        </p>
      </Card>
    </div>
  )
}
