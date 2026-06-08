import { useState } from 'react'
import { Users, ExternalLink, ChevronLeft, ChevronRight, TrendingUp, DollarSign, Star } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useInsiderFeed, useClusterBuys, type InsiderFiling, type ClusterBuy } from '@/features/insiders/hooks'
import { cn, formatLargeNumber } from '@/lib/utils'

/* ── Types ───────────────────────────────────────────────────────────────── */

type TxnFilter   = 'buy' | 'sell' | 'all'
type ActiveTab   = 'feed' | 'clusters'

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function scoreColor(score: number | null) {
  if (!score) return 'text-[var(--color-text-muted)]'
  if (score >= 70) return 'text-emerald-400'
  if (score >= 40) return 'text-amber-400'
  return 'text-[var(--color-text-muted)]'
}

function scoreBg(score: number | null): 'green' | 'amber' | 'default' {
  if (!score) return 'default'
  if (score >= 70) return 'green'
  if (score >= 40) return 'amber'
  return 'default'
}

function timeAgo(iso: string | null): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export function InsidersPage() {
  const [tab,        setTab]       = useState<ActiveTab>('feed')
  const [txnType,    setTxnType]   = useState<TxnFilter>('buy')
  const [congress,   setCongress]  = useState(false)
  const [minValue,   setMinValue]  = useState(0)
  const [page,       setPage]      = useState(1)

  const { data, isLoading, isError } = useInsiderFeed({
    type: txnType,
    congress,
    min_value: minValue,
    page,
    per_page: 25,
  })

  const items    = data?.items ?? []
  const meta     = data?.meta
  const totalBuyValue = items
    .filter(f => f.transaction_type === 'buy')
    .reduce((s, f) => s + (f.total_value ?? 0), 0)
  const highSignal = items.filter(f => (f.signal_score ?? 0) >= 70).length

  function handleFilterChange(fn: () => void) {
    fn()
    setPage(1)
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Insider Trades</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              SEC Form 4 filings · Open-market transactions · Signal scored
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live · updates every 15 min
        </span>
      </div>

      {/* ── Stats ── */}
      {meta && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            icon={<TrendingUp className="h-4 w-4 text-blue-400" />}
            label="Filings (30d)"
            value={meta.total}
          />
          <StatCard
            icon={<DollarSign className="h-4 w-4 text-emerald-400" />}
            label="Buy Value (this page)"
            value={formatLargeNumber(totalBuyValue)}
          />
          <StatCard
            icon={<Star className="h-4 w-4 text-amber-400" />}
            label="High Signal (≥70)"
            value={highSignal}
          />
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-1 w-fit">
        {(['feed', 'clusters'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors',
              tab === t
                ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
            )}
          >
            {t === 'feed' ? 'Feed' : 'Cluster Buys'}
          </button>
        ))}
      </div>

      {tab === 'feed' ? (
        <>
          {/* ── Filters ── */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Transaction type */}
            <div className="flex rounded-md border border-[var(--color-border)] overflow-hidden">
              {(['buy', 'sell', 'all'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => handleFilterChange(() => setTxnType(t))}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                    txnType === t
                      ? t === 'buy'  ? 'bg-emerald-500/15 text-emerald-400'
                      : t === 'sell' ? 'bg-red-500/15 text-red-400'
                      : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                      : 'bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Congress toggle */}
            <button
              onClick={() => handleFilterChange(() => setCongress(v => !v))}
              className={cn(
                'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                congress
                  ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
              )}
            >
              Congress Only
            </button>

            {/* Min value */}
            <div className="flex rounded-md border border-[var(--color-border)] overflow-hidden">
              {[
                { label: 'Any',   value: 0 },
                { label: '$100K', value: 100_000 },
                { label: '$500K', value: 500_000 },
                { label: '$1M+',  value: 1_000_000 },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleFilterChange(() => setMinValue(opt.value))}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium transition-colors',
                    minValue === opt.value
                      ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                      : 'bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Feed ── */}
          {isLoading && !data && (
            <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>
          )}
          {isError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
              <p className="text-sm font-medium text-red-400">Failed to load insider filings.</p>
            </div>
          )}
          {data && items.length === 0 && (
            <div className="py-16 text-center text-sm text-[var(--color-text-muted)]">
              No filings match the current filters.
            </div>
          )}
          {data && items.length > 0 && (
            <>
              <InsiderTable filings={items} />
              {meta && meta.total_pages > 1 && (
                <Pagination page={page} meta={meta} onPage={setPage} />
              )}
            </>
          )}
        </>
      ) : (
        <ClusterTab />
      )}
    </div>
  )
}

/* ── Feed Table ──────────────────────────────────────────────────────────── */

function InsiderTable({ filings }: { filings: InsiderFiling[] }) {
  return (
    <Card className="p-0 overflow-hidden">
      {/* Table header */}
      <div className="hidden grid-cols-[90px_120px_1fr_140px_100px_90px_70px_40px] gap-3 border-b border-[var(--color-border)] px-4 py-2.5 md:grid">
        {['Date', 'Ticker', 'Insider', 'Company', 'Value', 'Type', 'Score', ''].map(h => (
          <span key={h} className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">{h}</span>
        ))}
      </div>

      <div className="divide-y divide-[var(--color-border)]">
        {filings.map(f => <FilingRow key={f.id} filing={f} />)}
      </div>
    </Card>
  )
}

function FilingRow({ filing: f }: { filing: InsiderFiling }) {
  const isBuy  = f.transaction_type === 'buy'
  const isSell = f.transaction_type === 'sell'

  return (
    <div className="grid grid-cols-1 gap-2 px-4 py-3 hover:bg-[var(--color-bg-elevated)] transition-colors md:grid-cols-[90px_120px_1fr_140px_100px_90px_70px_40px] md:items-center md:gap-3">

      {/* Date */}
      <span className="text-xs text-[var(--color-text-muted)]">
        {formatDate(f.transaction_date ?? f.filing_date)}
      </span>

      {/* Ticker + congress badge */}
      <div className="flex items-center gap-1.5">
        <span className="inline-flex h-7 min-w-[52px] items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2 text-xs font-bold text-[var(--color-text-primary)]">
          {f.symbol}
        </span>
        {f.is_congress && (
          <Badge variant="blue" className="text-[10px]">CON</Badge>
        )}
      </div>

      {/* Insider name + title */}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{f.insider_name}</p>
        <p className="truncate text-xs text-[var(--color-text-muted)]">{f.insider_title ?? '—'}</p>
      </div>

      {/* Company */}
      <p className="hidden truncate text-xs text-[var(--color-text-muted)] md:block">
        {f.issuer_name ?? '—'}
      </p>

      {/* Value */}
      <div>
        <p className={cn('text-sm font-semibold', isBuy ? 'text-emerald-400' : isSell ? 'text-red-400' : 'text-[var(--color-text-secondary)]')}>
          {f.total_value ? formatLargeNumber(f.total_value) : '—'}
        </p>
        {f.shares && (
          <p className="text-[10px] text-[var(--color-text-muted)]">
            {f.shares.toLocaleString()} sh @ {f.price_per_share ? `$${f.price_per_share.toFixed(2)}` : '—'}
          </p>
        )}
      </div>

      {/* Type badge */}
      <Badge variant={isBuy ? 'green' : isSell ? 'red' : 'default'} className="w-fit capitalize">
        {f.transaction_type}
        {f.is_open_market && isBuy ? ' · mkt' : ''}
      </Badge>

      {/* Signal score */}
      <div className="flex items-center gap-1.5">
        <span className={cn('text-sm font-bold', scoreColor(f.signal_score))}>
          {f.signal_score ?? '—'}
        </span>
        {f.signal_score !== null && (
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-bg-elevated)] max-w-[32px]">
            <div
              className={cn('h-full rounded-full', f.signal_score >= 70 ? 'bg-emerald-400' : f.signal_score >= 40 ? 'bg-amber-400' : 'bg-[var(--color-text-muted)]/40')}
              style={{ width: `${f.signal_score}%` }}
            />
          </div>
        )}
      </div>

      {/* SEC link */}
      {f.sec_filing_url ? (
        <a
          href={f.sec_filing_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-end text-[var(--color-text-muted)] hover:text-[var(--color-accent-blue)] transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : <span />}
    </div>
  )
}

/* ── Cluster Buys Tab ────────────────────────────────────────────────────── */

function ClusterTab() {
  const { data: clusters, isLoading, isError } = useClusterBuys(30)

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>
  if (isError)   return <p className="py-8 text-center text-sm text-red-400">Failed to load cluster data.</p>

  if (!clusters?.length) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-16 text-center">
        <Users className="mx-auto mb-3 h-8 w-8 text-[var(--color-text-muted)]" />
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">No cluster activity yet</p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Clusters appear when 2+ insiders at the same company buy within 30 days.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--color-text-muted)]">
        Companies where multiple insiders purchased shares in the last 30 days — a stronger signal than a single trade.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clusters.map(c => <ClusterCard key={c.symbol} cluster={c} />)}
      </div>
    </div>
  )
}

function ClusterCard({ cluster: c }: { cluster: ClusterBuy }) {
  return (
    <Card>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--color-text-primary)]">{c.symbol}</p>
          <p className="truncate text-xs text-[var(--color-text-muted)]">{c.issuer_name ?? '—'}</p>
        </div>
        <Badge variant={scoreBg(c.max_score)} className="flex-shrink-0">
          Score {c.max_score ?? '—'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-[var(--color-border)] pt-3">
        <div>
          <p className="text-xs text-[var(--color-text-muted)]">Insiders buying</p>
          <p className="text-xl font-bold text-[var(--color-text-primary)]">{c.insider_count}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-text-muted)]">Total value</p>
          <p className="text-sm font-semibold text-emerald-400">{formatLargeNumber(c.total_value)}</p>
        </div>
      </div>

      {c.latest_filing && (
        <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">Last filed {timeAgo(c.latest_filing)}</p>
      )}
    </Card>
  )
}

/* ── Pagination ──────────────────────────────────────────────────────────── */

function Pagination({ page, meta, onPage }: {
  page: number
  meta: { total: number; total_pages: number; per_page: number }
  onPage: (p: number) => void
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-xs text-[var(--color-text-muted)]">
        {((page - 1) * meta.per_page) + 1}–{Math.min(page * meta.per_page, meta.total)} of {meta.total} filings
      </span>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </Button>
        <span className="text-xs text-[var(--color-text-muted)]">{page} / {meta.total_pages}</span>
        <Button variant="secondary" size="sm" disabled={page >= meta.total_pages} onClick={() => onPage(page + 1)}>
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

/* ── Stat card ───────────────────────────────────────────────────────────── */

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</p>
    </Card>
  )
}
