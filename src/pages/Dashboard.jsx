import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Video,
  Clock,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Zap,
  Target,
  Award,
  History,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ScoreCard from '../components/ui/ScoreCard'
import Skeleton from '../components/ui/Skeleton'
import ProfileAvatar from '../components/ui/ProfileAvatar'
import { useAuth } from '../context/AuthContext'
import { useInterview } from '../context/InterviewContext'
import { formatDate } from '../utils/helpers'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

const mockChart = [
  { date: 'Mon', score: 65 },
  { date: 'Tue', score: 72 },
  { date: 'Wed', score: 68 },
  { date: 'Thu', score: 80 },
  { date: 'Fri', score: 85 },
  { date: 'Sat', score: 78 },
  { date: 'Sun', score: 90 },
]

const mockRecent = [
  { id: 1, type: 'Technical', subject: 'Data Structures', score: 82, date: '2026-07-17', questions: 10 },
  { id: 2, type: 'HR', subject: 'Behavioral', score: 75, date: '2026-07-15', questions: 8 },
  { id: 3, type: 'Viva', subject: 'Computer Science', score: 88, date: '2026-07-14', questions: 12 },
  { id: 4, type: 'Technical', subject: 'Web Development', score: 90, date: '2026-07-12', questions: 10 },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { stats, fetchStats } = useInterview()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      await fetchStats()
      setLoading(false)
    }
    load()
  }, [fetchStats])

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
      <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ProfileAvatar name={displayName} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {displayName}
            </h1>
            <p className="text-sm text-surface-400">
              Ready to sharpen your interview skills?
            </p>
          </div>
        </div>
        <Button onClick={() => navigate('/interview/setup')} size="lg">
          <Video className="h-5 w-5" /> Start Interview <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : (
        <motion.div variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ScoreCard title="Overall Score" score={stats?.overallScore || 82} icon={Target} delay={0} />
          <ScoreCard title="Interviews Done" score={stats?.totalInterviews || 15} icon={Award} delay={0.1} />
          <ScoreCard title="Avg. Time" score={stats?.avgTime || 75} icon={Clock} delay={0.2} />
          <ScoreCard title="Improvement" score={stats?.improvement || 68} icon={TrendingUp} delay={0.3} />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={fadeIn} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary-400" />
                Performance Trend
              </h3>
              <span className="text-xs text-surface-500">Last 7 days</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.chartData || mockChart}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="h-full">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-6">
              <Zap className="h-4 w-4 text-primary-400" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/interview/setup')}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 hover:border-primary-500/40 transition-all text-left"
              >
                <Video className="h-5 w-5 text-primary-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">New Interview</p>
                  <p className="text-xs text-surface-400">Start a fresh session</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/interview/history')}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl glass-card hover:bg-surface-700/30 transition-all text-left"
              >
                <History className="h-5 w-5 text-surface-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">View History</p>
                  <p className="text-xs text-surface-400">Review past interviews</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl glass-card hover:bg-surface-700/30 transition-all text-left"
              >
                <Award className="h-5 w-5 text-surface-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Your Profile</p>
                  <p className="text-xs text-surface-400">View stats & settings</p>
                </div>
              </button>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={fadeIn}>
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-400" />
              Recent Interviews
            </h3>
            <button
              onClick={() => navigate('/interview/history')}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {(stats?.recentInterviews || mockRecent).slice(0, 4).map((interview) => (
              <div
                key={interview.id}
                onClick={() => navigate(`/interview/report/${interview.id}`)}
                className="flex items-center justify-between p-3.5 rounded-xl glass-card hover:bg-surface-700/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    interview.type === 'Technical'
                      ? 'bg-blue-500/10 text-blue-400'
                      : interview.type === 'HR'
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    <Video className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{interview.type} - {interview.subject}</p>
                    <p className="text-xs text-surface-500">{formatDate(interview.date)} &middot; {interview.questions} questions</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${
                    interview.score >= 80 ? 'text-emerald-400' : interview.score >= 60 ? 'text-blue-400' : interview.score >= 40 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {interview.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
