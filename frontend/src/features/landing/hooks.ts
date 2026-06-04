import { useQuery } from '@tanstack/react-query'
import { apiClient, type ApiResponse } from '@/lib/api-client'

interface MarketIndex {
  symbol: string
  name: string
  short: string
  price: number
  change: number
  change_pct: number
}

interface NewsArticle {
  id: string
  title: string
  url: string
  source: string
  summary: string
  published_at: string
  thumbnail: string | null
}

export function useMarketSummary() {
  return useQuery({
    queryKey: ['public', 'market-summary'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<{ indices: MarketIndex[] }>>('/public/market-summary')
      return res.data.data.indices
    },
    staleTime: 55_000,
    refetchInterval: 60_000,
  })
}

export function useNewsFeed(limit = 24) {
  return useQuery({
    queryKey: ['public', 'news-feed', limit],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<{ articles: NewsArticle[] }>>(`/public/news-feed?limit=${limit}`)
      return res.data.data.articles
    },
    staleTime: 290_000,
    refetchInterval: 300_000,
  })
}
