import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { History, Video, Search, Calendar, BarChart3, Trash2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import { useInterview } from '../context/InterviewContext'
import { formatDate } from '../utils/helpers'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.05 } } }

const mockHistory = [
  { id: 1, type: 'Technical', subject: 'Data Structures & Algorithms', difficulty: 'Medium', score: 82, date: '2026-07-17', questions: 10, duration: '18m' },
  { id: 2, type: 'HR', subject: 'Behavioral', difficulty: 'Easy', score: 75, date: '2026-07-15', questions: 8, duration: '14m' },
  { id: 3, type: 'Viva', subject: 'Computer Science', difficulty: 'Hard', score: 88, date: '2026-07-14', questions: 12, duration: '25m' },
  { id: 4, type: 'Technical', subject: 'Web Development', difficulty: 'Medium', score: 90, date: '2026-07-12', questions: 10, duration: '20m' },
  { id: 5, type: 'Technical', subject: 'Machine Learning', difficulty: 'Hard', score: 65, date: '2026-07-10', questions: 15, duration: '32m' },
  { id: 6, type: 'HR', subject: 'Leadership & Management', difficulty: 'Medium', score: 80, date: '2026-07-08', questions: 10, duration: '16m' },
  { id: 7, type: 'Viva', subject: 'Operating Systems', difficulty: 'Easy', score: 92, date: '2026-07-05', questions: 8, duration: '12m' },
]

export default function InterviewHistory() {
  const navigate = useNavigate()
  const { interviews, fetchInterviews } = useInterview()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      await fetchInterviews()
      setLoading(false)
    }
    load()
  }, [fetchInterviews])

  const history = interviews.length > 0 ? interviews : mockHistory
  const filtered = history.filter(
    (h) =>
      h.subject?.toLowerCase().includes(search.toLowerCase()) ||
      h.type?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
      <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Interview History</h1>
          <p className="text-sm text-surface-400">Review your past interview sessions</p>
        </div>
        <Button onClick={() => navigate('/interview/setup')} size="sm">
          <Video className="h-4 w-4" /> New Interview
        </Button>
      </motion.div>

      <motion.div variants={fadeIn} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
        <input
          type="text"
          placeholder="Search by subject or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-800/50 border border-surface-600/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
        />
      </motion.div>

      {loading ? (
        <Skeleton count={5} className="h-20" />
      ) : filtered.length === 0 ? (
        <motion.div variants={fadeIn}>
          <Card className="text-center py-12">
            <History className="h-12 w-12 text-surface-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No interviews yet</h3>
            <p className="text-sm text-surface-400 mb-4">Start your first interview to see your history here.</p>
            <Button onClick={() => navigate('/interview/setup')}>
              Start Interview
            </Button>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={stagger} className="space-y-3">
          {filtered.map((item) => {
            const typeLabel = item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Technical'
            const diffLabel = item.difficulty ? item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1) : 'Medium'
            const score = item.overall_score || item.score || 0
            const date = item.created_at || item.date
            const qCount = Array.isArray(item.questions) ? item.questions.length : item.question_count || item.questions || 0
            return (
            <motion.div key={item.id} variants={fadeIn}>
              <div
                onClick={() => navigate(`/interview/report/${item.id}`)}
                className="glass-card rounded-xl p-4 flex items-center justify-between hover:bg-surface-700/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${
                    typeLabel === 'Technical'
                      ? 'bg-blue-500/10 text-blue-400'
                      : typeLabel === 'Hr'
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{typeLabel} - {item.subject}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-surface-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {formatDate(date)}
                      </span>
                      <span>{qCount} questions</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        diffLabel === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : diffLabel === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {diffLabel}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${
                      score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-blue-400' : score >= 40 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {score}
                    </span>
                    <p className="text-[10px] text-surface-500">Score</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-surface-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
