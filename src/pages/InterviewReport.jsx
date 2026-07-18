import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  TrendingUp,
  Target,
  MessageSquare,
  Award,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ScoreCard from '../components/ui/ScoreCard'
import FeedbackCard from '../components/ui/FeedbackCard'
import { interviewService } from '../services/interviewService'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

const mockReport = {
  overallScore: 78,
  technicalScore: 82,
  communicationScore: 75,
  grammarScore: 80,
  radarData: [
    { subject: 'Technical', score: 82 },
    { subject: 'Communication', score: 75 },
    { subject: 'Confidence', score: 70 },
    { subject: 'Clarity', score: 85 },
    { subject: 'Relevance', score: 78 },
    { subject: 'Grammar', score: 80 },
  ],
  barData: [
    { q: 'Q1', score: 85 },
    { q: 'Q2', score: 72 },
    { q: 'Q3', score: 88 },
    { q: 'Q4', score: 65 },
    { q: 'Q5', score: 80 },
  ],
  strengths: [
    'Strong technical knowledge and problem-solving ability',
    'Clear and articulate communication',
    'Good use of examples to support answers',
  ],
  weaknesses: [
    'Could provide more specific metrics in answers',
    'Some answers were slightly too verbose',
    'Room for improvement in structuring responses',
  ],
  suggestions: [
    'Use the STAR method for behavioral questions',
    'Practice keeping answers under 2 minutes',
    'Add quantifiable results to project descriptions',
    'Research common questions for your target role',
  ],
  questionFeedback: [
    {
      question: 'Tell me about yourself and your background.',
      answer: 'I am a software engineer with 3 years of experience...',
      score: 85,
      feedback: {
        strengths: ['Clear introduction', 'Relevant experience highlighted'],
        weaknesses: ['Could mention specific technologies'],
        suggestion: 'Try to quantify your impact with metrics.',
      },
    },
    {
      question: 'Describe a challenging project you worked on.',
      answer: 'I worked on a real-time data pipeline that processed...',
      score: 72,
      feedback: {
        strengths: ['Good problem description', 'Mentioned technical stack'],
        weaknesses: ['Did not explain the resolution clearly'],
        suggestion: 'Structure your answer using the STAR method.',
      },
    },
    {
      question: 'What are your strengths and weaknesses?',
      answer: 'My strength is my ability to learn quickly...',
      score: 88,
      feedback: {
        strengths: ['Honest self-assessment', 'Provided context for both'],
        weaknesses: [],
        suggestion: 'Consider adding how you are actively improving.',
      },
    },
  ],
}

export default function InterviewReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await interviewService.getReport(id)
        const r = data.report
        setReport({
          overallScore: r.overall_score || 0,
          technicalScore: r.technical_score || 0,
          communicationScore: r.communication_score || 0,
          grammarScore: r.grammar_score || 0,
          radarData: r.radar_data || [],
          barData: r.bar_data || [],
          strengths: r.strengths || [],
          weaknesses: r.weaknesses || [],
          suggestions: r.improvement_plan || [],
          questionFeedback: (r.question_feedback || []).map((qf) => ({
            question: typeof qf.question === 'object' ? qf.question.text : qf.question,
            answer: qf.answer,
            score: qf.score,
            feedback: qf.feedback,
          })),
        })
      } catch {
        setReport(mockReport)
      }
    }
    loadReport()
  }, [id])

  if (!report) return null

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-5xl mx-auto space-y-8">
      <motion.div variants={fadeIn} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Interview Report</h1>
            <p className="text-sm text-surface-400">Detailed analysis of your performance</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" /> Export PDF
        </Button>
      </motion.div>

      <motion.div variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard title="Overall Score" score={report.overallScore} icon={Target} delay={0} />
        <ScoreCard title="Technical" score={report.technicalScore} icon={BarChart3} delay={0.1} />
        <ScoreCard title="Communication" score={report.communicationScore} icon={MessageSquare} delay={0.2} />
        <ScoreCard title="Grammar" score={report.grammarScore} icon={Award} delay={0.3} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeIn}>
          <Card className="h-full">
            <h3 className="text-sm font-semibold text-surface-200 mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary-400" />
              Skill Radar
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={report.radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={12} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={10} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#7c3aed"
                    fill="#7c3aed"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="h-full">
            <h3 className="text-sm font-semibold text-surface-200 mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary-400" />
              Question-wise Scores
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="q" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Bar dataKey="score" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeIn}>
          <Card className="h-full">
            <h3 className="text-sm font-semibold text-surface-200 mb-4 flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-emerald-400" />
              Strengths
            </h3>
            <ul className="space-y-2.5">
              {report.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card className="h-full">
            <h3 className="text-sm font-semibold text-surface-200 mb-4 flex items-center gap-2">
              <ThumbsDown className="h-4 w-4 text-amber-400" />
              Areas for Improvement
            </h3>
            <ul className="space-y-2.5">
              {report.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                  <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={fadeIn}>
        <Card>
          <h3 className="text-sm font-semibold text-surface-200 mb-4 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary-400" />
            Improvement Suggestions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-800/30">
                <span className="text-xs font-bold text-primary-400 mt-0.5">{i + 1}</span>
                <p className="text-sm text-surface-300">{s}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-400" />
          Question-wise Feedback
        </h3>
        <div className="space-y-4">
          {report.questionFeedback.map((qf, i) => (
            <FeedbackCard
              key={i}
              question={qf.question}
              answer={qf.answer}
              feedback={qf.feedback}
              score={qf.score}
              delay={i * 0.1}
            />
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="flex justify-center gap-4 pb-8">
        <Button onClick={() => navigate('/interview/setup')}>
          Start New Interview
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </motion.div>
    </motion.div>
  )
}


