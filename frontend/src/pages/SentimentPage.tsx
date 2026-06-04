import { Brain } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function SentimentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-purple-400" />
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Sentiment Analysis</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">FinBERT NLP scoring on news articles and headlines</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Market Sentiment</CardTitle>
          <Badge variant="purple">Coming Soon</Badge>
        </CardHeader>
        <p className="text-sm text-[var(--color-text-secondary)]">
          AI-powered sentiment scoring using FinBERT on thousands of news articles daily.
          Per-ticker and market-wide sentiment scores with trend visualization.
        </p>
      </Card>
    </div>
  )
}
