import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'cyan'
  className?: string
}

const variantClasses = {
  default: 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]',
  green: 'bg-green-500/15 text-green-400 border border-green-500/30',
  red: 'bg-red-500/15 text-red-400 border border-red-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
