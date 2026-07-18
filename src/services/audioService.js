import api from './axios'

export const audioService = {
  async uploadAudio(blob, interviewId, questionId) {
    const formData = new FormData()
    formData.append('audio', blob, 'recording.webm')
    formData.append('interview_id', interviewId)
    formData.append('question_id', questionId)

    const { data } = await api.post('/audio/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async getTranscript(audioId) {
    const { data } = await api.get(`/audio/${audioId}/transcript`)
    return data
  },
}
