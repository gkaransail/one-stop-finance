import { TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function TrendPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-green-400" />
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Trend Reversal</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Chart pattern detection and technical reversal signals</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reversal Signals</CardTitle>
          <Badge variant="green">Coming Soon</Badge>
        </CardHeader>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Algorithmic detection of double bottoms, cup & handle, ascending triangles, wedges,
          and flags. Volume-confirmed reversal signals with entry/exit levels.
        </p>
      </Card>
    </div>
  )
}
