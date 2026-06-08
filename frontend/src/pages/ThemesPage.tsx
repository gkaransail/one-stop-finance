import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Flame, TrendingUp, Users, Clock, ChevronDown, LayoutGrid, List } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { useThemeIntelligence, type ThemeScore } from '@/features/dashboard/hooks'
import { cn, formatLargeNumber } from '@/lib/utils'

/* ── Constants ───────────────────────────────────────────────────────────── */

const CATEGORIES = ['All', 'Technology', 'Healthcare', 'Defense', 'Energy', 'Finance', 'Consumer', 'Real Estate', 'Industrial']
const LEVELS     = ['All', 'Alert', 'Watch', 'Quiet'] as const
const SORTS      = [
  { label: 'Score',       key: 'score'      },
  { label: 'Name',        key: 'name'       },
  { label: 'Value',       key: 'value'      },
  { label: 'Companies',   key: 'companies'  },
] as const

type LevelFilter = typeof LEVELS[number]
type SortKey     = typeof SORTS[number]['key']

const LEVEL_CONFIG = {
  alert: { label: 'Alert', badge: 'red'     as const, dot: 'bg-red-400',   glow: 'shadow-red-500/20'   },
  watch: { label: 'Watch', badge: 'amber'   as const, dot: 'bg-amber-400', glow: 'shadow-amber-500/10' },
  quiet: { label: 'Quiet', badge: 'default' as const, dot: '',             glow: ''                    },
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export function ThemesPage() {
  const { data: themes, isLoading, isError } = useThemeIntelligence()

  const [category, setCategory] = useState('All')
  const [level,    setLevel]    = useState<LevelFilter>('All')
  const [sort,     setSort]     = useState<SortKey>('score')
  const [view,     setView]     = useState<'grid' | 'list'>('grid')

  const filtered = useMemo(() => {
    if (!themes) return []
    let out = [...themes]
    if (category !== 'All') out = out.filter(t => t.category === category)
    if (level !== 'All')    out = out.filter(t => t.level === level.toLowerCase())
    switch (sort) {
      case 'name':      out.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'value':     out.sort((a, b) => b.total_value_accumulated - a.total_value_accumulated); break
      case 'companies': out.sort((a, b) => b.unique_companies_buying - a.unique_companies_buying); break
      default:          out.sort((a, b) => b.score - a.score)
    }
    return out
  }, [themes, category, level, sort])

  const alertCount = themes?.filter(t => t.level === 'alert').length ?? 0
  const watchCount = themes?.filter(t => t.level === 'watch').length ?? 0

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30">
            <Flame className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Theme Intelligence</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Smart money convergence across {themes?.length ?? '—'} investment themes
            </p>
          </div>
        </div>

        {/* Stat pills */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {alertCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              {alertCount} Alert{alertCount > 1 ? 's' : ''}
            </span>
          )}
          {watchCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              {watchCount} Watching
            </span>
          )}
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1 text-xs text-[var(--color-text-muted)]">
            Updates every 15 min
          </span>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                category === cat
                  ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level + Sort + View row */}
        <div className="flex flex-wrap items-center gap-2">
          {LEVELS.map(lvl => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={cn(
                'rounded-md border px-3 py-1 text-xs font-medium transition-colors',
                level === lvl
                  ? lvl === 'Alert' ? 'border-red-500/40 bg-red-500/10 text-red-400'
                  : lvl === 'Watch' ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                  : lvl === 'Quiet' ? 'border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]'
                  : 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/15 text-[var(--color-accent-blue)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
              )}
            >
              {lvl}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                className="appearance-none rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1 pl-3 pr-7 text-xs text-[var(--color-text-secondary)] focus:outline-none cursor-pointer"
              >
                {SORTS.map(s => <option key={s.key} value={s.key}>Sort: {s.label}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--color-text-muted)]" />
            </div>

            {/* View toggle */}
            <div className="flex rounded-md border border-[var(--color-border)] overflow-hidden">
              {(['grid', 'list'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    'px-2.5 py-1 transition-colors',
                    view === v
                      ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                      : 'bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
                  )}
                >
                  {v === 'grid' ? <LayoutGrid className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      {isLoading && !themes && (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
          <p className="text-sm font-medium text-red-400">Failed to load theme data.</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">The backend may be starting up — refresh in a moment.</p>
        </div>
      )}

      {themes && filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-[var(--color-text-muted)]">
          No themes match the current filters.
        </div>
      )}

      {themes && filtered.length > 0 && (
        view === 'grid'
          ? <ThemeGrid themes={filtered} />
          : <ThemeList themes={filtered} />
      )}
    </div>
  )
}

/* ── Grid view ───────────────────────────────────────────────────────────── */

function ThemeGrid({ themes }: { themes: ThemeScore[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {themes.map(theme => <ThemeCard key={theme.slug} theme={theme} />)}
    </div>
  )
}

function ThemeCard({ theme }: { theme: ThemeScore }) {
  const cfg = LEVEL_CONFIG[theme.level]
  const hasActivity = theme.score > 0

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border bg-[var(--color-bg-card)] p-4 transition-all',
        theme.level === 'alert'
          ? 'border-red-500/30 shadow-lg shadow-red-500/10'
          : theme.level === 'watch'
          ? 'border-amber-500/20'
          : 'border-[var(--color-border)]',
      )}
    >
      {/* Top row */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{theme.name}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{theme.benchmark_etf ?? '—'}</p>
        </div>
        <Badge variant={cfg.badge} className="flex-shrink-0">{cfg.label}</Badge>
      </div>

      {/* Score */}
      <div className="mb-1 flex items-end justify-between">
        <span className="text-3xl font-bold text-[var(--color-text-primary)]">{theme.score.toFixed(0)}</span>
        <span className="mb-1 text-xs text-[var(--color-text-muted)]">/ 100</span>
      </div>

      {/* Bar */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            theme.level === 'alert' ? 'bg-red-400'
            : theme.level === 'watch' ? 'bg-amber-400'
            : 'bg-[var(--color-text-muted)]/40',
          )}
          style={{ width: `${theme.score}%` }}
        />
      </div>

      {/* Signal stats */}
      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[var(--color-border)] pt-3">
        <Stat icon={<Users className="h-3 w-3" />} label="Companies" value={theme.unique_companies_buying} />
        <Stat
          icon={<TrendingUp className="h-3 w-3" />}
          label="Accumulated"
          value={hasActivity ? formatLargeNumber(theme.total_value_accumulated) : '—'}
        />
      </div>

      {/* Primary signal + time */}
      {hasActivity && (
        <div className="mt-2 flex items-center justify-between">
          <span className="rounded-full bg-[var(--color-bg-elevated)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-secondary)] capitalize">
            {theme.primary_signal}
          </span>
          {theme.scored_at && (
            <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
              <Clock className="h-2.5 w-2.5" />
              {timeAgo(theme.scored_at)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* ── List view ───────────────────────────────────────────────────────────── */

function ThemeList({ themes }: { themes: ThemeScore[] }) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="divide-y divide-[var(--color-border)]">
        {/* Header row */}
        <div className="grid grid-cols-[2fr_80px_100px_100px_120px_100px] gap-4 px-4 py-2.5">
          {['Theme', 'Score', 'Level', 'Companies', 'Accumulated', 'Signal'].map(h => (
            <span key={h} className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">{h}</span>
          ))}
        </div>

        {themes.map(theme => {
          const cfg = LEVEL_CONFIG[theme.level]
          return (
            <div
              key={theme.slug}
              className="grid grid-cols-[2fr_80px_100px_100px_120px_100px] items-center gap-4 px-4 py-3 hover:bg-[var(--color-bg-elevated)] transition-colors"
            >
              {/* Name */}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{theme.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{theme.benchmark_etf ?? '—'}</p>
              </div>

              {/* Score + bar */}
              <div className="space-y-1">
                <span className="text-sm font-bold text-[var(--color-text-primary)]">{theme.score.toFixed(0)}</span>
                <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      theme.level === 'alert' ? 'bg-red-400'
                      : theme.level === 'watch' ? 'bg-amber-400'
                      : 'bg-[var(--color-text-muted)]/40',
                    )}
                    style={{ width: `${theme.score}%` }}
                  />
                </div>
              </div>

              <Badge variant={cfg.badge}>{cfg.label}</Badge>

              <span className="text-sm text-[var(--color-text-secondary)]">
                {theme.unique_companies_buying > 0 ? theme.unique_companies_buying : '—'}
              </span>

              <span className="text-sm text-[var(--color-text-secondary)]">
                {theme.total_value_accumulated > 0 ? formatLargeNumber(theme.total_value_accumulated) : '—'}
              </span>

              <span className="text-xs capitalize text-[var(--color-text-muted)]">
                {theme.primary_signal === 'none' ? '—' : theme.primary_signal}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
        {icon}
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-xs font-semibold text-[var(--color-text-secondary)]">{value}</span>
    </div>
  )
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
