import { generateQuestions, evaluateAnswer, generateReportSummary } from '../services/openaiService.js'
import {
  createInterviewRecord,
  getInterviewById,
  getUserInterviews,
  updateInterview,
  deleteInterviewRecord,
  createAnswerRecord,
  getAnswersByInterview,
  updateAnswer,
  getUserStats,
} from '../services/supabaseService.js'
import crypto from 'crypto'

function safeParse(value, fallback) {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export async function createInterview(req, res, next) {
  try {
    const { type, subject, difficulty, question_count } = req.body
    const userId = req.user.id

    const questions = await generateQuestions({
      type,
      subject,
      difficulty,
      count: question_count || 10,
    })

    const interview = await createInterviewRecord({
      id: crypto.randomUUID(),
      user_id: userId,
      type,
      subject,
      difficulty,
      question_count: question_count || 10,
      questions: JSON.stringify(questions),
      status: 'in_progress',
      created_at: new Date().toISOString(),
    })

    res.status(201).json({
      interview: { ...interview, questions: JSON.parse(interview.questions || '[]') },
      questions,
    })
  } catch (err) {
    next(err)
  }
}

export async function getInterview(req, res, next) {
  try {
    const interview = await getInterviewById(req.params.id)
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' })
    }
    if (interview.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const questions = JSON.parse(interview.questions || '[]')
    res.json({ interview: { ...interview, questions } })
  } catch (err) {
    next(err)
  }
}

export async function getInterviews(req, res, next) {
  try {
    const { page, limit } = req.query
    const result = await getUserInterviews(req.user.id, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    })

    result.interviews = result.interviews.map((i) => ({
      ...i,
      questions: JSON.parse(i.questions || '[]'),
    }))

    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function submitAnswer(req, res, next) {
  try {
    const { question_id, answer } = req.body
    const interviewId = req.params.id

    const interview = await getInterviewById(interviewId)
    if (!interview) return res.status(404).json({ error: 'Interview not found' })
    if (interview.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' })

    const answerRecord = await createAnswerRecord({
      id: crypto.randomUUID(),
      interview_id: interviewId,
      question_id: parseInt(question_id),
      answer_text: answer,
      created_at: new Date().toISOString(),
    })

    res.status(201).json({ answer: answerRecord })
  } catch (err) {
    next(err)
  }
}

export async function finishInterview(req, res, next) {
  try {
    const interview = await getInterviewById(req.params.id)
    if (!interview) return res.status(404).json({ error: 'Interview not found' })
    if (interview.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' })

    const questions = safeParse(interview.questions, [])
    const answers = await getAnswersByInterview(req.params.id)

    const evaluations = []
    for (const ans of answers) {
      try {
        const question = questions.find((q) => q.id === ans.question_id)
        const evalResult = await evaluateAnswer({
          question: question?.text || `Question ${ans.question_id}`,
          transcript: ans.answer_text,
          type: interview.type,
        })
        evaluations.push(evalResult)
        await updateAnswer(ans.id, { evaluation: JSON.stringify(evalResult) })
      } catch (evalErr) {
        console.error(`Evaluation failed for answer ${ans.id}:`, evalErr.message)
        evaluations.push({ technicalScore: 0, communicationScore: 0, grammarScore: 0, overallScore: 0, strengths: [], weaknesses: [], suggestion: '' })
      }
    }

    const avgTechnical = Math.round(evaluations.reduce((s, e) => s + (e.technicalScore || 0), 0) / (evaluations.length || 1))
    const avgCommunication = Math.round(evaluations.reduce((s, e) => s + (e.communicationScore || 0), 0) / (evaluations.length || 1))
    const avgGrammar = Math.round(evaluations.reduce((s, e) => s + (e.grammarScore || 0), 0) / (evaluations.length || 1))
    const avgOverall = Math.round(evaluations.reduce((s, e) => s + (e.overallScore || 0), 0) / (evaluations.length || 1))

    let improvementPlan = []
    let topWeakTopics = []
    try {
      const reportSummary = await generateReportSummary({ evaluations, type: interview.type })
      improvementPlan = reportSummary.improvementPlan || []
      topWeakTopics = reportSummary.topWeakTopics || []
    } catch (sumErr) {
      console.error('Report summary generation failed:', sumErr.message)
    }

    const allStrengths = [...new Set(evaluations.flatMap((e) => e.strengths || []))].slice(0, 6)
    const allWeaknesses = [...new Set(evaluations.flatMap((e) => e.weaknesses || []))].slice(0, 6)

    const updated = await updateInterview(req.params.id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      overall_score: avgOverall,
      technical_score: avgTechnical,
      communication_score: avgCommunication,
      grammar_score: avgGrammar,
      strengths: JSON.stringify(allStrengths),
      weaknesses: JSON.stringify(allWeaknesses),
      improvement_plan: JSON.stringify(improvementPlan),
      top_weak_topics: JSON.stringify(topWeakTopics),
    })

    res.json({ interview: updated })
  } catch (err) {
    next(err)
  }
}

export async function getInterviewReport(req, res, next) {
  try {
    const interview = await getInterviewById(req.params.id)
    if (!interview) return res.status(404).json({ error: 'Interview not found' })
    if (interview.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' })

    const answers = await getAnswersByInterview(req.params.id)
    const questions = safeParse(interview.questions, [])

    res.json({
      report: {
        interview_id: interview.id,
        type: interview.type,
        subject: interview.subject,
        difficulty: interview.difficulty,
        overall_score: interview.overall_score || 0,
        technical_score: interview.technical_score || 0,
        communication_score: interview.communication_score || 0,
        grammar_score: interview.grammar_score || 0,
        strengths: safeParse(interview.strengths, []),
        weaknesses: safeParse(interview.weaknesses, []),
        improvement_plan: safeParse(interview.improvement_plan, []),
        top_weak_topics: safeParse(interview.top_weak_topics, []),
        question_feedback: answers.map((a) => {
          const q = questions.find((q) => q.id === a.question_id) || {}
          const evaluation = safeParse(a.evaluation, {})
          return {
            question: q.text || `Question ${a.question_id}`,
            answer: a.answer_text,
            score: evaluation.overallScore || 0,
            feedback: {
              strengths: evaluation.strengths || [],
              weaknesses: evaluation.weaknesses || [],
              suggestion: evaluation.suggestion || '',
            },
          }
        }),
        radar_data: [
          { subject: 'Technical', score: interview.technical_score || 0 },
          { subject: 'Communication', score: interview.communication_score || 0 },
          { subject: 'Confidence', score: Math.min(100, (interview.communication_score || 0) + 5) },
          { subject: 'Clarity', score: Math.min(100, (interview.grammar_score || 0) + 8) },
          { subject: 'Relevance', score: Math.min(100, (interview.overall_score || 0) + 3) },
          { subject: 'Grammar', score: interview.grammar_score || 0 },
        ],
        bar_data: answers.map((a, i) => ({
          q: `Q${i + 1}`,
          score: safeParse(a.evaluation, {}).overallScore || 0,
        })),
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function getStats(req, res, next) {
  try {
    const stats = await getUserStats(req.user.id)
    res.json(stats)
  } catch (err) {
    next(err)
  }
}

export async function deleteInterview(req, res, next) {
  try {
    const interview = await getInterviewById(req.params.id)
    if (!interview) return res.status(404).json({ error: 'Interview not found' })
    if (interview.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' })

    await deleteInterviewRecord(req.params.id)
    res.json({ message: 'Interview deleted' })
  } catch (err) {
    next(err)
  }
}
