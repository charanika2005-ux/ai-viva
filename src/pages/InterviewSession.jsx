import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Send,
  Clock,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import AudioRecorder from '../components/ui/AudioRecorder'
import TranscriptBox from '../components/ui/TranscriptBox'
import { useInterview } from '../context/InterviewContext'
import { useTimer } from '../hooks/useRecorder'
import { audioService } from '../services/audioService'

const mockQuestions = [
  { id: 1, text: 'Tell me about yourself and your background in technology.' },
  { id: 2, text: 'Describe a challenging project you worked on and how you overcame the obstacles.' },
  { id: 3, text: 'What are your strengths and weaknesses in a team environment?' },
  { id: 4, text: 'How do you handle tight deadlines and competing priorities?' },
  { id: 5, text: 'Where do you see yourself in 5 years?' },
]

export default function InterviewSession() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { questions: ctxQuestions, currentIndex, answers, submitAnswer, goToNext, goToPrev, finishInterview, loading } = useInterview()

  const questions = ctxQuestions.length > 0 ? ctxQuestions : mockQuestions
  const question = questions[currentIndex] || questions[0]
  const totalQuestions = questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100

  const { time, formattedTime, isRunning, start, stop, reset } = useTimer(300)
  const [transcript, setTranscript] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    reset(300)
    setTranscript('')
    return () => stop()
  }, [currentIndex, reset, stop])

  useEffect(() => {
    if (!isRunning && currentIndex < totalQuestions) {
      start()
    }
  }, [currentIndex, isRunning, start, totalQuestions])

  const handleRecordingComplete = async (blob) => {
    try {
      const result = await audioService.uploadAudio(blob, id, question.id)
      if (result.transcript) {
        setTranscript(result.transcript)
      }
    } catch {
      setTranscript('Transcript will appear here after processing...')
    }
  }

  const handleTranscriptUpdate = (value) => {
    setTranscript(value)
  }

  const handleSubmit = async () => {
    if (!transcript.trim()) {
      toast.error('Please record or type your answer first')
      return
    }
    setIsSubmitting(true)
    try {
      await submitAnswer(question.id, transcript)
      toast.success('Answer submitted!')
      if (currentIndex < totalQuestions - 1) {
        goToNext()
      }
    } catch {
      toast.error('Failed to submit answer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinish = async () => {
    if (Object.keys(answers).length < totalQuestions) {
      const unanswered = totalQuestions - Object.keys(answers).length
      if (!window.confirm(`You have ${unanswered} unanswered question(s). Finish anyway?`)) {
        return
      }
    }
    try {
      await finishInterview()
      toast.success('Interview completed!')
      navigate(`/interview/report/${id}`)
    } catch {
      toast.error('Failed to finish interview')
      navigate(`/interview/report/${id}`)
    }
  }

  const isLastQuestion = currentIndex === totalQuestions - 1

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">
            Question {currentIndex + 1} of {totalQuestions}
          </h1>
          <p className="text-sm text-surface-400">Answer the question using your microphone or type below</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-surface-400">
          <Clock className="h-4 w-4" />
          <span className={`font-mono ${time < 60 ? 'text-red-400' : ''}`}>{formattedTime}</span>
        </div>
      </div>

      <ProgressBar value={currentIndex + 1} max={totalQuestions} showLabel />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="min-h-[200px]">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-primary-500/10 shrink-0">
                <span className="text-lg font-bold text-primary-400">{currentIndex + 1}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 mb-2">Current Question</p>
                <p className="text-lg text-white leading-relaxed">
                  {question.text || question.question}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Card>
        <p className="text-sm font-medium text-surface-300 mb-4">Record Your Answer</p>
        <div className="flex justify-center py-6">
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
          />
        </div>
      </Card>

      <TranscriptBox
        transcript={transcript}
        editable
        onUpdate={handleTranscriptUpdate}
      />

      {time === 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Time is up! You can still submit your answer.
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          onClick={goToPrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

        <div className="flex items-center gap-3">
          {answers[question.id] && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          <Button onClick={handleSubmit} loading={isSubmitting} variant="secondary">
            <Send className="h-4 w-4" /> Submit Answer
          </Button>
          {isLastQuestion ? (
            <Button onClick={handleFinish} loading={loading}>
              Finish Interview
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
