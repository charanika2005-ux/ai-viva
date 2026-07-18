import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Clock } from 'lucide-react'

export default function QuestionCard({ question, index, isActive, isAnswered, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className={`glass-card rounded-xl p-4 cursor-pointer transition-all duration-200 ${
        isActive
          ? 'border-primary-500/50 bg-primary-500/5'
          : 'hover:border-surface-600/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {isAnswered ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : isActive ? (
            <Clock className="h-5 w-5 text-primary-400 animate-pulse" />
          ) : (
            <Circle className="h-5 w-5 text-surface-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-surface-400">
            Question {index + 1}
          </span>
          <p className="text-sm text-surface-200 mt-1 line-clamp-2">
            {question.text || question.question}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
