import { Link } from 'react-router-dom'
import { ArrowRight, Zap, TrendingUp, Brain, Users, LineChart, Flame } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Navbar */}
      <nav className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-[var(--color-text-primary)]">OneStop Finance</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started <ArrowRight className="h-3.5 w-3.5" /></Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <Badge variant="purple" className="mb-6">
          <Zap className="h-3 w-3" /> Real-time Market Intelligence
        </Badge>
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-6xl">
          Every Edge.<br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            One Platform.
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-[var(--color-text-secondary)]">
          Real-time theme intelligence, options chain analysis, insider trade tracking, sentiment analysis,
          and trend reversal signals — all in one place for serious traders.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" variant="pro">
              Start Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary">Sign In</Button>
          </Link>
        </div>
      </section>

      {/* Live Data Preview (placeholder) */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Live Market Intelligence</h2>
          <p className="mt-2 text-[var(--color-text-secondary)]">Real-time signals updated every 30 seconds</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <LivePreviewCard
            icon={<Flame className="h-5 w-5 text-amber-400" />}
            title="Hot Themes"
            description="AI Infrastructure, Defense Tech, and Biotech showing strong insider accumulation signals today."
            badge={<Badge variant="amber">3 ALERT</Badge>}
          />
          <LivePreviewCard
            icon={<Users className="h-5 w-5 text-blue-400" />}
            title="Top Insider Buys"
            description="CEOs at 12 companies made open-market purchases this week totaling $47M in aggregate."
            badge={<Badge variant="blue">12 filings</Badge>}
          />
          <LivePreviewCard
            icon={<Brain className="h-5 w-5 text-purple-400" />}
            title="Market Sentiment"
            description="Overall market sentiment turned bullish. Tech sector leading with 72% positive signal ratio."
            badge={<Badge variant="green">Bullish</Badge>}
          />
          <LivePreviewCard
            icon={<LineChart className="h-5 w-5 text-cyan-400" />}
            title="Options Flow"
            description="Unusual call activity detected in semiconductor names. IV spike suggests anticipated move."
            badge={<Badge variant="cyan">Unusual</Badge>}
          />
          <LivePreviewCard
            icon={<TrendingUp className="h-5 w-5 text-green-400" />}
            title="Trend Reversals"
            description="8 stocks approaching key support levels with high-volume accumulation patterns forming."
            badge={<Badge variant="green">8 signals</Badge>}
          />
          <LivePreviewCard
            icon={<Users className="h-5 w-5 text-amber-400" />}
            title="Congress Trades"
            description="3 Congress members disclosed new positions this week. Energy and defense sectors targeted."
            badge={<Badge variant="amber">New trades</Badge>}
          />
        </div>
      </section>

      {/* Feature List */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Everything You Need to Trade Smarter</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Flame />, title: 'Theme Intelligence', desc: 'Track smart money convergence across 50+ market themes with our proprietary scoring algorithm.' },
              { icon: <LineChart />, title: 'Options Chain Analysis', desc: 'Full options chain with greeks, IV surface, max pain, and unusual activity detection.' },
              { icon: <Users />, title: 'Insider Trades', desc: 'Real-time SEC Form 4 filings and Congress disclosures with signal scoring.' },
              { icon: <Brain />, title: 'Sentiment Analysis', desc: 'FinBERT-powered NLP sentiment scoring on thousands of news articles daily.' },
              { icon: <TrendingUp />, title: 'Trend Reversal', desc: 'Algorithmic detection of chart patterns and technical reversal signals.' },
              { icon: <Zap />, title: 'Real-Time Data', desc: 'WebSocket-powered live updates. No manual refreshing. Always current.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-xl border border-[var(--color-border)] p-5 bg-[var(--color-bg-card)]">
                <div className="mt-0.5 flex-shrink-0 text-[var(--color-accent-blue)]">{icon}</div>
                <div>
                  <h3 className="mb-1 font-semibold text-[var(--color-text-primary)]">{title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="mb-4 text-3xl font-bold text-[var(--color-text-primary)]">Start Trading Smarter Today</h2>
          <p className="mb-8 text-[var(--color-text-secondary)]">All 5 core features are free. No credit card required.</p>
          <Link to="/register">
            <Button size="lg" variant="pro">
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 text-center text-sm text-[var(--color-text-muted)]">
        © 2025 OneStop Finance. For informational purposes only. Not financial advice.
      </footer>
    </div>
  )
}

function LivePreviewCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode
  title: string
  description: string
  badge: React.ReactNode
}) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</span>
        </div>
        {badge}
      </div>
      <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
    </Card>
  )
}
