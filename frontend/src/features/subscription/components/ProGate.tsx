import { Lock, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { getRequiredTier, type FeatureName } from '@/config/feature-flags'
import { cn } from '@/lib/utils'

interface ProGateProps {
  feature: FeatureName
  mode?: 'blur' | 'lock' | 'inline'
  children: React.ReactNode
  className?: string
}

export function ProGate({ feature, mode = 'blur', children, className }: ProGateProps) {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const requiredTier = getRequiredTier(feature)

  const userTier = user?.tier ?? 'free'
  const hasAccess = requiredTier === 'free' || userTier === 'pro'

  if (hasAccess) return <>{children}</>

  if (mode === 'inline') {
    return (
      <span className="inline-flex items-center gap-1 text-[var(--color-text-muted)]">
        <Lock className="h-3 w-3" />
        <span className="text-xs">Pro</span>
      </span>
    )
  }

  if (mode === 'lock') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border border-purple-500/30 bg-[var(--color-bg-card)] p-8 text-center',
          className,
        )}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30">
          <Lock className="h-5 w-5 text-purple-400" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-[var(--color-text-primary)]">Pro Feature</h3>
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
          Upgrade to Pro to unlock this feature and all advanced analytics.
        </p>
        <button
          onClick={() => navigate('/upgrade')}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-500 hover:to-blue-500 transition-colors"
        >
          <Zap className="h-4 w-4" />
          Upgrade to Pro
        </button>
      </div>
    )
  }

  // blur mode
  return (
    <div className={cn('relative overflow-hidden rounded-xl', className)}>
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-bg-primary)]/60 backdrop-blur-[2px]">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/40">
          <Lock className="h-4 w-4 text-purple-400" />
        </div>
        <p className="mb-3 text-sm font-medium text-[var(--color-text-primary)]">Pro Feature</p>
        <button
          onClick={() => navigate('/upgrade')}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:from-purple-500 hover:to-blue-500 transition-colors"
        >
          <Zap className="h-3.5 w-3.5" />
          Upgrade to Pro
        </button>
      </div>
    </div>
  )
}
