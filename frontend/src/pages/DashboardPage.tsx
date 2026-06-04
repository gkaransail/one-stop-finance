import { Flame, Users, Brain, LineChart, TrendingUp, Activity } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Market Overview</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">Real-time signals across all features</p>
      </div>

      {/* Market indices ticker */}
      <div className="flex gap-4 overflow-x-auto pb-1">
        {[
          { symbol: 'S&P 500', price: '5,432.10', change: '+0.82%', up: true },
          { symbol: 'NASDAQ', price: '17,891.33', change: '+1.24%', up: true },
          { symbol: 'DOW', price: '42,103.55', change: '-0.14%', up: false },
          { symbol: 'VIX', price: '14.23', change: '-3.21%', up: false },
          { symbol: 'Russell', price: '2,105.88', change: '+0.55%', up: true },
        ].map(({ symbol, price, change, up }) => (
          <div
            key={symbol}
            className="flex-shrink-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2.5"
          >
            <p className="text-xs text-[var(--color-text-muted)]">{symbol}</p>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">{price}</p>
            <p className={`text-xs font-medium ${up ? 'text-green-400' : 'text-red-400'}`}>{change}</p>
          </div>
        ))}
      </div>

      {/* Feature summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureSummaryCard
          icon={<Flame className="h-4 w-4 text-amber-400" />}
          title="Theme Intelligence"
          value="3 ALERT"
          sub="AI, Defense, Biotech themes hot"
          href="/themes"
        />
        <FeatureSummaryCard
          icon={<Users className="h-4 w-4 text-blue-400" />}
          title="Insider Trades"
          value="12 buys"
          sub="$47M aggregate open market"
          href="/insiders"
        />
        <FeatureSummaryCard
          icon={<Brain className="h-4 w-4 text-purple-400" />}
          title="Sentiment"
          value="Bullish"
          sub="72% positive signal ratio"
          href="/sentiment"
        />
        <FeatureSummaryCard
          icon={<LineChart className="h-4 w-4 text-cyan-400" />}
          title="Options Flow"
          value="Unusual"
          sub="Semis showing vol spike"
          href="/options"
        />
        <FeatureSummaryCard
          icon={<TrendingUp className="h-4 w-4 text-green-400" />}
          title="Trend Reversal"
          value="8 signals"
          sub="Key support levels forming"
          href="/trend"
        />
        <FeatureSummaryCard
          icon={<Activity className="h-4 w-4 text-[var(--color-accent-blue)]" />}
          title="Real-Time Feed"
          value="Connected"
          sub="WebSocket live"
          href="/dashboard"
        />
      </div>

      {/* Coming soon placeholder for content */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Feed</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {[
            { time: '2m ago', event: 'Insider Buy: NVDA — CEO $12.4M open market purchase', type: 'buy' },
            { time: '8m ago', event: 'Unusual Options: TSLA — 2,400 calls at $280 strike (10x avg volume)', type: 'options' },
            { time: '15m ago', event: 'Theme Alert: AI Infrastructure — 8 unique insiders buying this week', type: 'theme' },
            { time: '22m ago', event: 'Congress Trade: AMZN — Rep. Jane Smith bought $50K–$100K', type: 'congress' },
          ].map(({ time, event, type }) => (
            <div key={event} className="flex items-start gap-3 text-sm">
              <span className="flex-shrink-0 text-xs text-[var(--color-text-muted)] w-12">{time}</span>
              <Badge
                variant={type === 'buy' ? 'green' : type === 'options' ? 'cyan' : type === 'theme' ? 'amber' : 'blue'}
                className="flex-shrink-0 capitalize"
              >
                {type}
              </Badge>
              <span className="text-[var(--color-text-secondary)]">{event}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function FeatureSummaryCard({
  icon,
  title,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode
  title: string
  value: string
  sub: string
  href: string
}) {
  return (
    <a href={href}>
      <Card className="hover:border-[var(--color-accent-blue)] transition-colors cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">{title}</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{sub}</p>
      </Card>
    </a>
  )
}
