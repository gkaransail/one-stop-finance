import { create } from 'zustand'

export interface QuoteUpdate {
  symbol: string
  price: number
  change: number
  change_pct: number
  volume: number
  timestamp: string
}

interface RealtimeState {
  quotes: Record<string, QuoteUpdate>
  wsConnected: boolean
  wsSocket: WebSocket | null
  updateQuote: (quote: QuoteUpdate) => void
  setConnected: (connected: boolean) => void
  connect: (token?: string) => void
  disconnect: () => void
}

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000'

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  quotes: {},
  wsConnected: false,
  wsSocket: null,

  updateQuote: (quote) =>
    set((s) => ({ quotes: { ...s.quotes, [quote.symbol]: quote } })),

  setConnected: (wsConnected) => set({ wsConnected }),

  connect: (token) => {
    const existing = get().wsSocket
    if (existing) existing.close()

    const url = token ? `${WS_URL}/ws/v1/connect?token=${token}` : `${WS_URL}/ws/v1/connect`
    const socket = new WebSocket(url)

    socket.onopen = () => get().setConnected(true)
    socket.onclose = () => get().setConnected(false)
    socket.onerror = () => get().setConnected(false)
    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string)
        if (msg.type === 'quote') get().updateQuote(msg.data as QuoteUpdate)
      } catch {
        // ignore malformed messages
      }
    }

    set({ wsSocket: socket })
  },

  disconnect: () => {
    const socket = get().wsSocket
    if (socket) socket.close()
    set({ wsSocket: null, wsConnected: false })
  },
}))
