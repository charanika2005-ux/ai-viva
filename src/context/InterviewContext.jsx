import { createContext, useContext, useState, useCallback } from 'react'
import { interviewService } from '../services/interviewService'

const InterviewContext = createContext(null)

export function InterviewProvider({ children }) {
  const [currentInterview, setCurrentInterview] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [interviews, setInterviews] = useState([])
  const [stats, setStats] = useState(null)

  const createInterview = useCallback(async (config) => {
    setLoading(true)
    try {
      const data = await interviewService.createInterview(config)
      setCurrentInterview(data.interview)
      setQuestions(data.questions || [])
      setCurrentIndex(0)
      setAnswers({})
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const submitAnswer = useCallback(async (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
    if (currentInterview) {
      await interviewService.submitAnswer(currentInterview.id, questionId, answer)
    }
  }, [currentInterview])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))
  }, [questions.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const finishInterview = useCallback(async () => {
    if (!currentInterview) return
    setLoading(true)
    try {
      const data = await interviewService.finishInterview(currentInterview.id)
      return data
    } finally {
      setLoading(false)
    }
  }, [currentInterview])

  const fetchInterviews = useCallback(async (params) => {
    setLoading(true)
    try {
      const data = await interviewService.getInterviews(params)
      setInterviews(data.interviews || [])
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const data = await interviewService.getStats()
      setStats(data)
      return data
    } catch {
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setCurrentInterview(null)
    setQuestions([])
    setCurrentIndex(0)
    setAnswers({})
  }, [])

  return (
    <InterviewContext.Provider
      value={{
        currentInterview,
        questions,
        currentIndex,
        answers,
        loading,
        interviews,
        stats,
        createInterview,
        submitAnswer,
        goToNext,
        goToPrev,
        finishInterview,
        fetchInterviews,
        fetchStats,
        reset,
      }}
    >
      {children}
    </InterviewContext.Provider>
  )
}

export function useInterview() {
  const context = useContext(InterviewContext)
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider')
  }
  return context
}
