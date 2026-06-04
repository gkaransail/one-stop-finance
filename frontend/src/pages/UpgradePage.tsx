import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FREE_FEATURES = [
  'Theme Intelligence (top 3 themes)',
  'Options Chain (basic)',
  'Insider Trades (last 7 days)',
  'Sentiment Analysis (market-wide)',
  'Trend Reversal (basic signals)',
]

const PRO_FEATURES = [
  'All Free features',
  'Full Theme Intelligence (50+ themes)',
  'Complete Options Chain + IV Surface',
  'Unlimited Insider History + Congress',
  'Per-ticker Sentiment + News Feed',
  'Advanced Trend Signals + Patterns',
  'Real-time WebSocket data',
  'Custom Alerts',
  'Portfolio Tracker',
  'ML Predictions (Phase 4)',
]

export function UpgradePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Upgrade to Pro</h2>
        <p className="mt-2 text-[var(--color-text-secondary)]">Unlock the full power of OneStop Finance</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Free</h3>
            <p className="mt-1 text-3xl font-bold text-[var(--color-text-primary)]">$0<span className="text-sm font-normal text-[var(--color-text-muted)]">/mo</span></p>
          </div>
          <ul className="mb-6 space-y-2.5">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="w-full">Current Plan</Button>
        </div>

        {/* Pro */}
        <div className="rounded-xl border border-purple-500/40 bg-gradient-to-b from-purple-600/10 to-blue-600/10 p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Pro</h3>
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300 border border-purple-500/30">Most Popular</span>
            </div>
            <p className="mt-1 text-3xl font-bold text-[var(--color-text-primary)]">$29<span className="text-sm font-normal text-[var(--color-text-muted)]">/mo</span></p>
          </div>
          <ul className="mb-6 space-y-2.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Check className="h-4 w-4 text-purple-400 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Button variant="pro" className="w-full">
            <Zap className="h-4 w-4" />
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </div>
  )
}
