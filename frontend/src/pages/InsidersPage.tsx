import { Users } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function InsidersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-blue-400" />
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Insider Trades</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">SEC Form 4 filings + Congress disclosures in real time</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Filings</CardTitle>
          <Badge variant="blue">Coming Soon</Badge>
        </CardHeader>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Real-time feed of SEC Form 4 insider filings and congressional trade disclosures.
          Filtered by open-market buys, C-suite executives, and cluster activity.
        </p>
      </Card>
    </div>
  )
}
