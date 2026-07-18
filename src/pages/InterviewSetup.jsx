import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  Users,
  Code,
  GraduationCap,
  ArrowRight,
  Settings,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { useInterview } from '../context/InterviewContext'
import { INTERVIEW_TYPES, SUBJECTS, DIFFICULTY_LEVELS, QUESTION_COUNTS } from '../utils/constants'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

const iconMap = { Users, Code, GraduationCap }

export default function InterviewSetup() {
  const [loading, setLoading] = useState(false)
  const { createInterview } = useInterview()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      type: 'technical',
      subject: 'computer-science',
      difficulty: 'medium',
      questionCount: '10',
    },
  })

  const selectedType = watch('type')
  const selectedDifficulty = watch('difficulty')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await createInterview({
        type: data.type,
        subject: data.subject,
        difficulty: data.difficulty,
        question_count: parseInt(data.questionCount, 10),
      })
      toast.success('Interview created!')
      navigate(`/interview/session/${result.interview?.id || 'new'}`)
    } catch {
      toast.error('Failed to create interview. Starting demo mode.')
      navigate('/interview/session/demo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto space-y-8">
      <motion.div variants={fadeIn}>
        <h1 className="text-2xl font-bold text-white mb-2">Set Up Your Interview</h1>
        <p className="text-surface-400">Configure your interview settings and get started</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <motion.div variants={fadeIn}>
          <label className="block text-sm font-medium text-surface-300 mb-3">Interview Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {INTERVIEW_TYPES.map(({ value, label, icon, description }) => {
              const Icon = iconMap[icon]
              return (
                <label key={value} className="cursor-pointer">
                  <input type="radio" value={value} className="peer sr-only" {...register('type', { required: true })} />
                  <div className={`glass-card rounded-2xl p-5 text-center transition-all duration-200 peer-checked:border-primary-500/50 peer-checked:bg-primary-500/5 hover:border-surface-600 ${
                    selectedType === value ? 'border-primary-500/50 bg-primary-500/5' : ''
                  }`}>
                    <div className={`p-3 rounded-xl w-fit mx-auto mb-3 ${
                      selectedType === value ? 'bg-primary-500/20 text-primary-400' : 'bg-surface-800/50 text-surface-400'
                    }`}>
                      {Icon && <Icon className="h-6 w-6" />}
                    </div>
                    <p className="text-sm font-semibold text-white mb-1">{label}</p>
                    <p className="text-xs text-surface-500">{description}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Select
            label="Subject"
            options={SUBJECTS}
            placeholder="Select subject"
            error={errors.subject}
            {...register('subject', { required: 'Subject is required' })}
          />
          <Select
            label="Question Count"
            options={QUESTION_COUNTS.map((c) => ({ value: String(c), label: `${c} questions` }))}
            placeholder="Select count"
            error={errors.questionCount}
            {...register('questionCount', { required: 'Count is required' })}
          />
        </motion.div>

        <motion.div variants={fadeIn}>
          <label className="block text-sm font-medium text-surface-300 mb-3">Difficulty Level</label>
          <div className="grid grid-cols-3 gap-4">
            {DIFFICULTY_LEVELS.map(({ value, label, color, bg, border }) => (
              <label key={value} className="cursor-pointer">
                <input type="radio" value={value} className="peer sr-only" {...register('difficulty', { required: true })} />
                <div className={`rounded-xl p-4 text-center border transition-all duration-200 ${
                  selectedDifficulty === value
                    ? `${bg} ${border} ${color}`
                    : 'glass-card border-surface-600/30 text-surface-400 hover:border-surface-500/50'
                }`}>
                  <p className="text-sm font-semibold">{label}</p>
                </div>
              </label>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="flex items-center gap-4">
          <Button type="submit" size="lg" loading={loading}>
            <Settings className="h-5 w-5" /> Start Interview <ArrowRight className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
