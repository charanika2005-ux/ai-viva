import api from './axios'

export const interviewService = {
  async createInterview(config) {
    const { data } = await api.post('/interviews', config)
    return data
  },

  async getInterview(id) {
    const { data } = await api.get(`/interviews/${id}`)
    return data
  },

  async getInterviews(params = {}) {
    const { data } = await api.get('/interviews', { params })
    return data
  },

  async submitAnswer(interviewId, questionId, answer) {
    const { data } = await api.post(`/interviews/${interviewId}/answers`, {
      question_id: questionId,
      answer,
    })
    return data
  },

  async finishInterview(interviewId) {
    const { data } = await api.post(`/interviews/${interviewId}/finish`)
    return data
  },

  async getReport(interviewId) {
    const { data } = await api.get(`/interviews/${interviewId}/report`)
    return data
  },

  async getStats() {
    const { data } = await api.get('/interviews/stats')
    return data
  },

  async deleteInterview(id) {
    const { data } = await api.delete(`/interviews/${id}`)
    return data
  },
}
