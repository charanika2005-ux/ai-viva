import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle } from 'lucide-react'
import { getScoreColor } from '../../utils/helpers'

export default function FeedbackCard({ question, answer, feedback, score, delay = 0 }) {
  const color = getScoreColor(score)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-surface-400 mb-1">Question</p>
          <p className="text-sm text-surface-200">{question}</p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {score >= 60 ? (
            <CheckCircle className="h-3.5 w-3.5" />
          ) : score >= 40 ? (
            <AlertTriangle className="h-3.5 w-3.5" />
          ) : (
            <ThumbsDown className="h-3.5 w-3.5" />
          )}
          {score}
        </div>
      </div>

      {answer && (
        <div>
          <p className="text-sm text-surface-400 mb-1">Your Answer</p>
          <p className="text-sm text-surface-300 bg-surface-800/30 rounded-xl p-3">{answer}</p>
        </div>
      )}

      {feedback && (
        <div className="space-y-2">
          {feedback.strengths?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium mb-1">
                <ThumbsUp className="h-3.5 w-3.5" />
                Strengths
              </div>
              <ul className="space-y-1">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-surface-400 pl-5">- {s}</li>
                ))}
              </ul>
            </div>
          )}
          {feedback.weaknesses?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium mb-1">
                <ThumbsDown className="h-3.5 w-3.5" />
                Areas for Improvement
              </div>
              <ul className="space-y-1">
                {feedback.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-surface-400 pl-5">- {w}</li>
                ))}
              </ul>
            </div>
          )}
          {feedback.suggestion && (
            <p className="text-xs text-surface-500 italic mt-2">{feedback.suggestion}</p>
          )}
        </div>
      )}
    </motion.div>
  )
}
