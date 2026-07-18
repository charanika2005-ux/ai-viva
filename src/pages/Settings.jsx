import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Bell, Moon, Volume2, Globe, Shield, Save, LogOut, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

const SETTINGS_KEY = 'ai_viva_settings'

const defaultSettings = {
  notifications: true,
  darkMode: true,
  sound: true,
  autoTranscript: true,
}

function loadSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

function Toggle({ enabled, onChange, label, description, icon: Icon }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl glass-card">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-surface-400" />}
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          {description && <p className="text-xs text-surface-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-primary-500' : 'bg-surface-700'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { signOut, deleteAccount } = useAuth()
  const [settings, setSettings] = useState(loadSettings)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await deleteAccount()
      toast.success('Account deleted')
      navigate('/login')
    } catch {
      toast.error('Failed to delete account')
    } finally {
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out')
      navigate('/login')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto space-y-8">
      <motion.div variants={fadeIn}>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-surface-400">Customize your experience</p>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary-400" />
            Notifications
          </h3>
          <div className="space-y-3">
            <Toggle
              label="Push Notifications"
              description="Get notified about interview results"
              enabled={settings.notifications}
              onChange={(v) => updateSetting('notifications', v)}
              icon={Bell}
            />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Moon className="h-4 w-4 text-primary-400" />
            Appearance
          </h3>
          <div className="space-y-3">
            <Toggle
              label="Dark Mode"
              description="Use dark theme (recommended)"
              enabled={settings.darkMode}
              onChange={(v) => updateSetting('darkMode', v)}
              icon={Moon}
            />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-primary-400" />
            Interview Settings
          </h3>
          <div className="space-y-3">
            <Toggle
              label="Sound Effects"
              description="Play sounds during interviews"
              enabled={settings.sound}
              onChange={(v) => updateSetting('sound', v)}
              icon={Volume2}
            />
            <Toggle
              label="Auto-Transcription"
              description="Automatically transcribe audio responses"
              enabled={settings.autoTranscript}
              onChange={(v) => updateSetting('autoTranscript', v)}
              icon={Globe}
            />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary-400" />
            Privacy & Security
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl glass-card">
              <div>
                <p className="text-sm font-medium text-white">Sign Out</p>
                <p className="text-xs text-surface-500">Sign out of your account</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl glass-card border border-red-500/20">
              <div>
                <p className="text-sm font-medium text-white">Delete Account</p>
                <p className="text-xs text-surface-500">Permanently delete your account and all data</p>
              </div>
              <Button variant="danger" size="sm" onClick={() => setShowConfirm(true)} loading={deleting}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn} className="flex justify-start gap-4 pb-8">
        <Button onClick={handleSave} loading={saving} size="lg">
          <Save className="h-4 w-4" /> Save Settings
        </Button>
      </motion.div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-900 border border-surface-700 rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">Delete Account?</h3>
            <p className="text-sm text-surface-400">
              This will permanently delete your account, all interviews, answers, and reports. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteAccount} loading={deleting}>
                Yes, Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
