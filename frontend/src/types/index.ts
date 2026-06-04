export interface Theme {
  id: string
  name: string
  slug: string
  description: string
  category: string
  benchmark_etf: string
  score?: ThemeScore
}

export interface ThemeScore {
  score: number
  level: 'ALERT' | 'WATCH' | 'QUIET'
  unique_companies_buying: number
  total_value_accumulated: number
  csuite_count: number
  congress_signal: boolean
  unusual_options_count: number
  sentiment_signal: boolean
  signal_breakdown: Record<string, unknown>
  scored_at: string
}

export interface InsiderFiling {
  id: string
  symbol: string
  insider_name: string
  insider_title: string
  transaction_type: 'BUY' | 'SELL' | 'EXERCISE'
  shares: number
  price_per_share: number
  total_value: number
  is_open_market: boolean
  is_congress: boolean
  filing_date: string
  signal_score: number
}

export interface MarketIndex {
  symbol: string
  name: string
  price: number
  change: number
  change_pct: number
}

export interface NewsArticle {
  id: string
  title: string
  url: string
  source: string
  published_at: string
  sentiment_score: number | null
  tickers: string[]
}

export interface OptionContract {
  strike: number
  expiration: string
  option_type: 'call' | 'put'
  bid: number
  ask: number
  last: number
  volume: number
  open_interest: number
  implied_volatility: number
  delta: number
  gamma: number
  theta: number
  vega: number
}

export interface Paginated<T> {
  items: T[]
  page: number
  per_page: number
  total: number
  total_pages: number
}
