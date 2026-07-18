import api from './axios'

export const reportService = {
  async getReport(interviewId) {
    const { data } = await api.get(`/reports/${interviewId}`)
    return data
  },

  async getQuestionFeedback(interviewId, questionId) {
    const { data } = await api.get(`/reports/${interviewId}/questions/${questionId}`)
    return data
  },

  async getProgressHistory() {
    const { data } = await api.get('/reports/history')
    return data
  },

  async getAnalytics() {
    const { data } = await api.get('/reports/analytics')
    return data
  },
}
