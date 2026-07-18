import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ transparent = false }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'glass border-b border-surface-700/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">AI Viva</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm text-surface-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/interview/history" className="text-sm text-surface-300 hover:text-white transition-colors">
                  History
                </Link>
                <Button size="sm" onClick={() => navigate('/interview/setup')}>
                  Start Interview
                </Button>
              </>
            ) : (
              <>
                <a href="#features" className="text-sm text-surface-300 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-sm text-surface-300 hover:text-white transition-colors">
                  How It Works
                </a>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Log In
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-xl text-surface-300 hover:text-white hover:bg-surface-800/50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass border-t border-surface-700/30"
        >
          <div className="px-4 py-4 space-y-3">
            {user ? (
              <>
                <Link to="/dashboard" className="block text-sm text-surface-300 hover:text-white" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/interview/history" className="block text-sm text-surface-300 hover:text-white" onClick={() => setMobileOpen(false)}>
                  History
                </Link>
                <Button className="w-full" size="sm" onClick={() => { navigate('/interview/setup'); setMobileOpen(false) }}>
                  Start Interview
                </Button>
                <Button variant="ghost" className="w-full" size="sm" onClick={() => { handleLogout(); setMobileOpen(false) }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-sm text-surface-300 hover:text-white" onClick={() => setMobileOpen(false)}>
                  Log In
                </Link>
                <Button className="w-full" size="sm" onClick={() => { navigate('/register'); setMobileOpen(false) }}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}
