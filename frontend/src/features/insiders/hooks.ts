import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { apiClient, type ApiResponse } from '@/lib/api-client'

export interface InsiderFiling {
  id: string
  symbol: string
  issuer_name: string | null
  insider_name: string
  insider_title: string | null
  transaction_type: 'buy' | 'sell' | 'exercise'
  shares: number | null
  price_per_share: number | null
  total_value: number | null
  is_open_market: boolean
  is_congress: boolean
  signal_score: number | null
  filing_date: string
  transaction_date: string | null
  sec_filing_url: string | null
}

export interface ClusterBuy {
  symbol: string
  issuer_name: string | null
  insider_count: number
  total_value: number
  max_score: number | null
  latest_filing: string | null
}

interface FeedMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

interface FeedParams {
  type?: 'buy' | 'sell' | 'all'
  congress?: boolean
  open_market?: boolean
  min_value?: number
  days?: number
  page?: number
  per_page?: number
}

export function useInsiderFeed(params: FeedParams = {}) {
  const {
    type = 'buy',
    congress = false,
    open_market = true,
    min_value = 0,
    days = 30,
    page = 1,
    per_page = 25,
  } = params

  return useQuery({
    queryKey: ['insiders', 'feed', type, congress, open_market, min_value, days, page],
    queryFn: async () => {
      const res = await apiClient.get<{ data: InsiderFiling[]; error: null; meta: FeedMeta }>(
        '/insiders/feed',
        { params: { type, congress, open_market, min_value, days, page, per_page } },
      )
      return { items: res.data.data, meta: res.data.meta }
    },
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
}

export function useClusterBuys(days = 30) {
  return useQuery({
    queryKey: ['insiders', 'clusters', days],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<{ clusters: ClusterBuy[] }>>(
        '/insiders/cluster-buys',
        { params: { days } },
      )
      return res.data.data.clusters
    },
    staleTime: 5 * 60_000,
  })
}
