import { Link } from 'react-router-dom'
import {
  TrendingUp, TrendingDown, Minus, ArrowRight,
  Flame, LineChart, Users, Brain, Zap, ExternalLink, Clock,
} from 'lucide-react'
import { useMarketSummary, useNewsFeed } from '@/features/landing/hooks'
import { cn, formatPercent } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <Navbar />
      <IndexBar />
      <Hero />
      <NewsSection />
      <FeaturesSection />
      <Footer />
    </div>
  )
}

/* ── Navbar ──────────────────────────────────────────────────────── */
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-[var(--color-text-primary)]">OneStop Finance</span>
        </div>

        <div className="flex items-center gap-1">
          {[
            { label: 'Themes',   to: '/themes' },
            { label: 'Options',  to: '/options' },
            { label: 'Insiders', to: '/insiders' },
            { label: 'Sentiment',to: '/sentiment' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="rounded-md px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/dashboard"
            className="ml-2 flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-blue)] px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ── Live Index Bar ───────────────────────────────────────────────── */
function IndexBar() {
  const { data: indices, isLoading } = useMarketSummary()

  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-stretch divide-x divide-[var(--color-border)]">
          {isLoading && !indices
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-1 items-center gap-3 px-5 py-3 animate-pulse">
                  <div className="h-3 w-12 rounded bg-[var(--color-bg-elevated)]" />
                  <div className="h-4 w-16 rounded bg-[var(--color-bg-elevated)]" />
                </div>
              ))
            : indices?.map((idx) => {
                const up = idx.change >= 0
                const neutral = idx.change === 0
                return (
                  <div key={idx.symbol} className="flex flex-1 items-center gap-3 px-5 py-3">
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                        {idx.short}
                      </p>
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">
                        {idx.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 text-xs font-semibold',
                      neutral ? 'text-[var(--color-text-muted)]' : up ? 'text-emerald-400' : 'text-red-400'
                    )}>
                      {neutral ? <Minus className="h-3 w-3" /> : up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {formatPercent(idx.change_pct)}
                    </div>
                  </div>
                )
              })}
        </div>
      </div>
    </div>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 text-center">
      <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        Real-time market intelligence
      </div>
      <h1 className="mb-4 text-5xl font-extrabold tracking-tight md:text-6xl">
        Every Edge.{' '}
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          One Platform.
        </span>
      </h1>
      <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--color-text-secondary)]">
        Theme intelligence, options flow, insider trades, sentiment analysis, and trend signals —
        all free, all live.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-purple-500 transition-all"
      >
        Open Dashboard <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

/* ── News ─────────────────────────────────────────────────────────── */
function NewsSection() {
  const { data: articles, isLoading } = useNewsFeed(24)

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Market News</h2>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">Updates every 5 min</span>
      </div>

      {isLoading && !articles ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : !articles?.length ? (
        <p className="py-8 text-center text-sm text-[var(--color-text-muted)]">No news available right now.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  )
}

function NewsCard({ article }: {
  article: {
    id: string; title: string; url: string; source: string
    summary: string; published_at: string; thumbnail: string | null
  }
}) {
  const timeAgo = getTimeAgo(article.published_at)

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden hover:border-[var(--color-accent-blue)] transition-colors"
    >
      {article.thumbnail ? (
        <img
          src={article.thumbnail}
          alt=""
          className="h-36 w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      ) : (
        <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-secondary)]">
          <LineChart className="h-8 w-8 text-[var(--color-text-muted)]/30" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-2 text-sm font-semibold leading-snug text-[var(--color-text-primary)] line-clamp-3 group-hover:text-blue-400 transition-colors">
          {article.title}
        </p>
        {article.summary && (
          <p className="mb-3 text-xs text-[var(--color-text-muted)] line-clamp-2">
            {article.summary}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span className="font-medium truncate">{article.source}</span>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
            <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </a>
  )
}

/* ── Features strip ───────────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    { icon: <Flame className="h-5 w-5 text-amber-400" />,   label: 'Theme Intelligence', to: '/themes',   desc: 'Smart money convergence scoring across 20 market themes' },
    { icon: <LineChart className="h-5 w-5 text-cyan-400" />, label: 'Options Chain',      to: '/options',  desc: 'Full chain with greeks, IV surface, max pain, unusual flow' },
    { icon: <Users className="h-5 w-5 text-blue-400" />,    label: 'Insider Trades',     to: '/insiders', desc: 'SEC Form 4 + Congress disclosures with signal scoring' },
    { icon: <Brain className="h-5 w-5 text-purple-400" />,  label: 'Sentiment',          to: '/sentiment',desc: 'FinBERT NLP scoring on thousands of headlines daily' },
    { icon: <TrendingUp className="h-5 w-5 text-green-400" />, label: 'Trend Reversal',  to: '/trend',    desc: 'Chart pattern detection and technical reversal alerts' },
  ]

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-14">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-8 text-center text-xl font-bold text-[var(--color-text-primary)]">Everything in One Place</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(({ icon, label, to, desc }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 hover:border-[var(--color-accent-blue)] transition-colors"
            >
              {icon}
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Footer ───────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8 text-center text-xs text-[var(--color-text-muted)]">
      © {new Date().getFullYear()} OneStop Finance — For informational purposes only. Not financial advice.
    </footer>
  )
}

/* ── Helpers ──────────────────────────────────────────────────────── */
function getTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1)  return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24)   return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
