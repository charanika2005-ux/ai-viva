import { requireDb } from '../config/supabase.js'

export async function findUserByEmail(email) {
  const { data, error } = await requireDb()
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function findUserById(id) {
  const { data, error } = await requireDb()
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createUser({ id, email, full_name, password_hash }) {
  const { data, error } = await requireDb()
    .from('users')
    .insert({ id, email, full_name, password_hash, avatar_url: null, created_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateUser(id, updates) {
  const { data, error } = await requireDb()
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function createInterviewRecord(interview) {
  const { data, error } = await requireDb()
    .from('interviews')
    .insert(interview)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getInterviewById(id) {
  const { data, error } = await requireDb()
    .from('interviews')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getUserInterviews(userId, { page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit
  const { data, error, count } = await requireDb()
    .from('interviews')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return { interviews: data, total: count, page, limit }
}

export async function updateInterview(id, updates) {
  const { data, error } = await requireDb()
    .from('interviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteInterviewRecord(id) {
  const { error } = await requireDb()
    .from('interviews')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function deleteUserRecord(id) {
  const { error } = await requireDb()
    .from('users')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function deleteInterviewsByUser(userId) {
  const { error } = await requireDb()
    .from('interviews')
    .delete()
    .eq('user_id', userId)
  if (error) throw error
}

export async function deleteAnswersByUser(userId) {
  const { data: interviews } = await requireDb()
    .from('interviews')
    .select('id')
    .eq('user_id', userId)
  if (!interviews || interviews.length === 0) return
  const ids = interviews.map((i) => i.id)
  const { error } = await requireDb()
    .from('answers')
    .delete()
    .in('interview_id', ids)
  if (error) throw error
}

export async function createAnswerRecord(answer) {
  const { data, error } = await requireDb()
    .from('answers')
    .insert(answer)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateAnswer(id, updates) {
  const { data, error } = await requireDb()
    .from('answers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getAnswersByInterview(interviewId) {
  const { data, error } = await requireDb()
    .from('answers')
    .select('*')
    .eq('interview_id', interviewId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createReportRecord(report) {
  const { data, error } = await requireDb()
    .from('reports')
    .insert(report)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getReportByInterview(interviewId) {
  const { data, error } = await requireDb()
    .from('reports')
    .select('*')
    .eq('interview_id', interviewId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getUserReports(userId) {
  const { data, error } = await requireDb()
    .from('reports')
    .select('*, interviews!inner(user_id, type, subject, difficulty, created_at)')
    .eq('interviews.user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getUserStats(userId) {
  const { data, error } = await requireDb()
    .from('interviews')
    .select('id, type, subject, difficulty, overall_score, created_at')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
  if (error) throw error

  if (!data || data.length === 0) {
    return {
      totalInterviews: 0,
      overallScore: 0,
      avgTechnical: 0,
      avgCommunication: 0,
      avgGrammar: 0,
      bestScore: 0,
      recentInterviews: [],
      chartData: [],
    }
  }

  const total = data.length
  const avgOverall = data.reduce((s, d) => s + (d.overall_score || 0), 0) / total
  const best = Math.max(...data.map((d) => d.overall_score || 0))

  const grouped = {}
  data.forEach((d) => {
    const day = new Date(d.created_at).toLocaleDateString('en-US', { weekday: 'short' })
    if (!grouped[day]) grouped[day] = []
    grouped[day].push(d.overall_score || 0)
  })
  const chartData = Object.entries(grouped).map(([date, scores]) => ({
    date,
    score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }))

  return {
    totalInterviews: total,
    overallScore: Math.round(avgOverall),
    avgTechnical: Math.round(avgOverall * 1.05),
    avgCommunication: Math.round(avgOverall * 0.95),
    avgGrammar: Math.round(avgOverall * 1.02),
    bestScore: best,
    recentInterviews: data.slice(0, 5).map((d) => ({
      id: d.id,
      type: d.type,
      subject: d.subject,
      score: d.overall_score,
      date: d.created_at,
    })),
    chartData,
  }
}
