import api from './axios'

export const authService = {
  async signUp(email, password, metadata = {}) {
    const { data } = await api.post('/auth/register', {
      email,
      password,
      full_name: metadata.full_name || '',
    })
    localStorage.setItem('access_token', data.access_token)
    return { user: data.user }
  },

  async signIn(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('access_token', data.access_token)
    return { user: data.user }
  },

  async signOut() {
    localStorage.removeItem('access_token')
  },

  async resetPassword() {
    // Backend doesn't have reset yet — no-op for now
  },

  async getSession() {
    const token = localStorage.getItem('access_token')
    if (!token) return { session: null }
    try {
      const { data } = await api.get('/auth/profile')
      return { session: { user: data.user } }
    } catch {
      localStorage.removeItem('access_token')
      return { session: null }
    }
  },

  async getUser() {
    const { data } = await api.get('/auth/profile')
    return data.user
  },

  onAuthStateChange(callback) {
    // No real-time listener with JWT — called once on init
    return { data: { subscription: { unsubscribe: () => {} } } }
  },

  async updateProfile(updates) {
    const { data } = await api.put('/auth/profile', updates)
    return { user: data.user }
  },

  async deleteAccount() {
    const { data } = await api.delete('/auth/account')
    localStorage.removeItem('access_token')
    return data
  },
}
