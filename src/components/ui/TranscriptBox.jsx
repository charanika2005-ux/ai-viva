import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Check, X } from 'lucide-react'

export default function TranscriptBox({ transcript, editable = false, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(transcript || '')

  const handleSave = () => {
    onUpdate?.(value)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setValue(transcript || '')
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-surface-400">Transcript</span>
        {editable && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded-lg hover:bg-surface-700/50 text-surface-400 hover:text-white transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        {isEditing && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              className="p-1 rounded-lg hover:bg-emerald-500/10 text-emerald-400 transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          className="w-full bg-surface-800/50 border border-surface-600/50 rounded-lg p-3 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 resize-none"
        />
      ) : (
        <p className="text-sm text-surface-300 leading-relaxed">
          {transcript || 'No transcript yet. Record your answer to generate one.'}
        </p>
      )}
    </motion.div>
  )
}
