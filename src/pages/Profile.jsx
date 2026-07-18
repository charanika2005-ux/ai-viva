import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Save, Camera, BarChart3, Award, History } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import ProfileAvatar from '../components/ui/ProfileAvatar'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/helpers'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.user_metadata?.full_name || '')
  const [loading, setLoading] = useState(false)

  const displayName = user?.user_metadata?.full_name || 'User'
  const email = user?.email || 'user@example.com'
  const joinedDate = user?.created_at || '2026-01-01'

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile({ full_name: name })
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto space-y-8">
      <motion.div variants={fadeIn}>
        <h1 className="text-2xl font-bold text-white">Your Profile</h1>
        <p className="text-sm text-surface-400">Manage your account and view your statistics</p>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <ProfileAvatar name={displayName} size="xl" />
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-white">{displayName}</h2>
              <p className="text-sm text-surface-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5" /> {email}
              </p>
              <p className="text-xs text-surface-500 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                <Calendar className="h-3.5 w-3.5" /> Joined {formatDate(joinedDate)}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: BarChart3, label: 'Avg Score', value: '78', color: 'text-primary-400' },
          { icon: Award, label: 'Total Interviews', value: '15', color: 'text-emerald-400' },
          { icon: History, label: 'This Month', value: '6', color: 'text-blue-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <motion.div key={label} variants={fadeIn}>
            <Card className="text-center">
              <Icon className={`h-6 w-6 ${color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-surface-400">{label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeIn}>
        <Card>
          <h3 className="text-base font-semibold text-white mb-4">Edit Profile</h3>
          <div className="space-y-4 max-w-md">
            <Input
              label="Full Name"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              icon={Mail}
              value={email}
              disabled
            />
            <Button onClick={handleSave} loading={loading}>
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
