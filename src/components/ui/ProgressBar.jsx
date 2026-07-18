import { motion } from 'framer-motion'
import { classNames } from '../../utils/helpers'

export default function ProgressBar({ value = 0, max = 100, color = 'primary', showLabel = false, size = 'md', className }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const colors = {
    primary: 'from-primary-500 to-accent-500',
    success: 'from-emerald-500 to-emerald-400',
    warning: 'from-amber-500 to-amber-400',
    danger: 'from-red-500 to-red-400',
  }

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={classNames('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-surface-400">Progress</span>
          <span className="text-xs font-medium text-surface-300">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={classNames('w-full bg-surface-800 rounded-full overflow-hidden', heights[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={classNames('h-full rounded-full bg-gradient-to-r', colors[color])}
        />
      </div>
    </div>
  )
}
