import { LineChart } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function OptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LineChart className="h-6 w-6 text-cyan-400" />
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Options Chain Analysis</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Full chain, greeks, IV surface, max pain, unusual flow</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Options Chain</CardTitle>
          <Badge variant="cyan">Coming Soon</Badge>
        </CardHeader>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Search any ticker to view the full options chain with live greeks, implied volatility surface,
          max pain level, and unusual activity detection.
        </p>
      </Card>
    </div>
  )
}
