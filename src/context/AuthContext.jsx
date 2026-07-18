import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const { session } = await authService.getSession()
        setUser(session?.user ?? null)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const signUp = async (email, password, metadata) => {
    const data = await authService.signUp(email, password, metadata)
    setUser(data.user)
    return data
  }

  const signIn = async (email, password) => {
    const data = await authService.signIn(email, password)
    setUser(data.user)
    return data
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  const resetPassword = async (email) => {
    return authService.resetPassword(email)
  }

  const updateProfile = async (updates) => {
    const data = await authService.updateProfile(updates)
    setUser(data.user)
    return data
  }

  const deleteAccount = async () => {
    await authService.deleteAccount()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
