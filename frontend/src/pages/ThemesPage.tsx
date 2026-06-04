import { Flame } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ThemesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Flame className="h-6 w-6 text-amber-400" />
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Theme Intelligence</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Smart money convergence across 50+ market themes</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Themes</CardTitle>
          <Badge variant="amber">Coming Soon</Badge>
        </CardHeader>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Theme scoring is being built. This will show all themes ranked by insider convergence score,
          with detailed signal breakdowns including insider buys, unusual options activity, congressional trades,
          and sentiment signals.
        </p>
      </Card>
    </div>
  )
}
