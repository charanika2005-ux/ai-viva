import { motion } from 'framer-motion'
import { getScoreColor, getScoreLabel } from '../../utils/helpers'

export default function ScoreCard({ title, score, icon: Icon, delay = 0 }) {
  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-surface-400">{title}</span>
        {Icon && (
          <div className="p-2 rounded-xl bg-surface-800/50" style={{ color }}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold" style={{ color }}>
          {score ?? '--'}
        </span>
        <span className="text-sm mb-1" style={{ color }}>{label}</span>
      </div>
      <div className="w-full bg-surface-800 rounded-full h-1.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score || 0}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  )
}
