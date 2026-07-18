import { evaluateAnswer, generateReportSummary } from '../services/openaiService.js'
import {
  getInterviewById,
  getAnswersByInterview,
  updateAnswer,
  updateInterview,
  getReportByInterview,
  createReportRecord,
  getUserReports,
} from '../services/supabaseService.js'
import crypto from 'crypto'

export async function evaluateInterview(req, res, next) {
  try {
    const interview = await getInterviewById(req.params.id)
    if (!interview) return res.status(404).json({ error: 'Interview not found' })
    if (interview.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' })

    const answers = await getAnswersByInterview(req.params.id)
    const questions = JSON.parse(interview.questions || '[]')
    const evaluations = []

    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.question_id)
      if (!question) continue

      const evaluation = await evaluateAnswer({
        question: question.text,
        transcript: answer.answer_text || '',
        type: interview.type,
      })

      evaluations.push(evaluation)

      await updateAnswer(answer.id, {
        evaluation: JSON.stringify(evaluation),
      })
    }

    if (evaluations.length > 0) {
      const avgScores = {
        technicalScore: Math.round(evaluations.reduce((s, e) => s + (e.technicalScore || 0), 0) / evaluations.length),
        communicationScore: Math.round(evaluations.reduce((s, e) => s + (e.communicationScore || 0), 0) / evaluations.length),
        grammarScore: Math.round(evaluations.reduce((s, e) => s + (e.grammarScore || 0), 0) / evaluations.length),
        overallScore: Math.round(evaluations.reduce((s, e) => s + (e.overallScore || 0), 0) / evaluations.length),
      }

      const allStrengths = [...new Set(evaluations.flatMap((e) => e.strengths || []))].slice(0, 6)
      const allWeaknesses = [...new Set(evaluations.flatMap((e) => e.weaknesses || []))].slice(0, 6)

      const summary = await generateReportSummary({ evaluations, type: interview.type })

      await updateInterview(req.params.id, {
        overall_score: avgScores.overallScore,
        technical_score: avgScores.technicalScore,
        communication_score: avgScores.communicationScore,
        grammar_score: avgScores.grammarScore,
        strengths: JSON.stringify(allStrengths),
        weaknesses: JSON.stringify(allWeaknesses),
        improvement_plan: JSON.stringify(summary.improvementPlan || []),
        top_weak_topics: JSON.stringify(summary.topWeakTopics || []),
      })

      await createReportRecord({
        id: crypto.randomUUID(),
        interview_id: req.params.id,
        user_id: req.user.id,
        overall_score: avgScores.overallScore,
        technical_score: avgScores.technicalScore,
        communication_score: avgScores.communicationScore,
        grammar_score: avgScores.grammarScore,
        strengths: JSON.stringify(allStrengths),
        weaknesses: JSON.stringify(allWeaknesses),
        improvement_plan: JSON.stringify(summary.improvementPlan || []),
        top_weak_topics: JSON.stringify(summary.topWeakTopics || []),
        summary: summary.summary || '',
        created_at: new Date().toISOString(),
      })
    }

    res.json({
      message: 'Evaluation complete',
      scores: evaluations.length > 0 ? {
        overallScore: Math.round(evaluations.reduce((s, e) => s + (e.overallScore || 0), 0) / evaluations.length),
        technicalScore: Math.round(evaluations.reduce((s, e) => s + (e.technicalScore || 0), 0) / evaluations.length),
        communicationScore: Math.round(evaluations.reduce((s, e) => s + (e.communicationScore || 0), 0) / evaluations.length),
        grammarScore: Math.round(evaluations.reduce((s, e) => s + (e.grammarScore || 0), 0) / evaluations.length),
      } : null,
    })
  } catch (err) {
    next(err)
  }
}

export async function getReport(req, res, next) {
  try {
    const interview = await getInterviewById(req.params.id)
    if (!interview) return res.status(404).json({ error: 'Interview not found' })
    if (interview.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' })

    const report = await getReportByInterview(req.params.id)
    if (!report) {
      return res.json({
        report: {
          interview_id: req.params.id,
          overall_score: interview.overall_score || 0,
          technical_score: interview.technical_score || 0,
          communication_score: interview.communication_score || 0,
          grammar_score: interview.grammar_score || 0,
          strengths: JSON.parse(interview.strengths || '[]'),
          weaknesses: JSON.parse(interview.weaknesses || '[]'),
          improvement_plan: JSON.parse(interview.improvement_plan || '[]'),
          top_weak_topics: JSON.parse(interview.top_weak_topics || '[]'),
        },
      })
    }

    res.json({
      report: {
        ...report,
        strengths: JSON.parse(report.strengths || '[]'),
        weaknesses: JSON.parse(report.weaknesses || '[]'),
        improvement_plan: JSON.parse(report.improvement_plan || '[]'),
        top_weak_topics: JSON.parse(report.top_weak_topics || '[]'),
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function getProgressHistory(req, res, next) {
  try {
    const reports = await getUserReports(req.user.id)
    res.json({ history: reports })
  } catch (err) {
    next(err)
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const reports = await getUserReports(req.user.id)
    if (!reports || reports.length === 0) {
      return res.json({
        totalInterviews: 0,
        avgScore: 0,
        trend: [],
        byType: {},
        byDifficulty: {},
      })
    }

    const avgScore = reports.reduce((s, r) => s + (r.overall_score || 0), 0) / reports.length
    const trend = reports.slice(0, 20).reverse().map((r) => ({
      date: r.created_at,
      score: r.overall_score,
    }))

    const byType = {}
    const byDifficulty = {}
    reports.forEach((r) => {
      const type = r.interviews?.type || 'unknown'
      const diff = r.interviews?.difficulty || 'unknown'
      if (!byType[type]) byType[type] = []
      if (!byDifficulty[diff]) byDifficulty[diff] = []
      byType[type].push(r.overall_score || 0)
      byDifficulty[diff].push(r.overall_score || 0)
    })

    Object.keys(byType).forEach((k) => {
      byType[k] = Math.round(byType[k].reduce((a, b) => a + b, 0) / byType[k].length)
    })
    Object.keys(byDifficulty).forEach((k) => {
      byDifficulty[k] = Math.round(byDifficulty[k].reduce((a, b) => a + b, 0) / byDifficulty[k].length)
    })

    res.json({
      totalInterviews: reports.length,
      avgScore: Math.round(avgScore),
      trend,
      byType,
      byDifficulty,
    })
  } catch (err) {
    next(err)
  }
}
