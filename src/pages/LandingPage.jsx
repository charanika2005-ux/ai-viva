import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap,
  Mic,
  BarChart3,
  Brain,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  Video,
  MessageSquare,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Questions',
    description: 'Intelligent questions tailored to your role, experience, and industry.',
  },
  {
    icon: Mic,
    title: 'Voice Recognition',
    description: 'Speak naturally. Our AI transcribes and analyzes your responses in real-time.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Comprehensive scoring on technical skills, communication, and presentation.',
  },
  {
    icon: MessageSquare,
    title: 'Instant Feedback',
    description: 'Get actionable strengths, weaknesses, and improvement suggestions after each answer.',
  },
  {
    icon: Video,
    title: 'Multiple Formats',
    description: 'HR, Technical, and Viva interviews with customizable difficulty and topics.',
  },
  {
    icon: Zap,
    title: 'Track Progress',
    description: 'Monitor your improvement over time with detailed history and trend charts.',
  },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer at Google', content: 'AI Viva helped me prepare for my Google interview. The AI feedback was incredibly detailed and accurate.', rating: 5 },
  { name: 'Alex Chen', role: 'ML Engineer at Meta', content: 'The voice-based interview simulation felt incredibly real. Best practice tool I have used.', rating: 5 },
  { name: 'Sarah Johnson', role: 'Fresh Graduate', content: 'As a fresh graduate, this tool gave me the confidence I needed. The feedback helped me improve quickly.', rating: 5 },
]

const steps = [
  { step: '1', title: 'Setup', description: 'Choose your interview type, subject, and difficulty level.' },
  { step: '2', title: 'Interview', description: 'Answer questions using your microphone. Our AI evaluates in real-time.' },
  { step: '3', title: 'Report', description: 'Receive a detailed report with scores, feedback, and improvement tips.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar transparent />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium text-primary-300 mb-6">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Interview Simulation
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Ace Your Next</span>
              <br />
              <span className="gradient-text">Interview with AI</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice with our AI interview simulator. Get real-time voice-based questions, instant feedback, and detailed performance analytics to build confidence.
            </motion.p>

            <motion.div variants={fadeIn} className="flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" onClick={() => navigate(user ? '/interview/setup' : '/register')}>
                Start Practicing <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('#how-it-works')}>
                See How It Works
              </Button>
            </motion.div>

            <motion.div variants={fadeIn} className="mt-12 flex items-center justify-center gap-8 text-sm text-surface-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Instant feedback
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to succeed
            </motion.h2>
            <motion.p variants={fadeIn} className="text-surface-400 max-w-2xl mx-auto">
              Our AI-powered platform gives you a realistic interview experience with comprehensive feedback.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeIn}>
                <Card hover className="h-full">
                  <div className="p-2 rounded-xl bg-primary-500/10 w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 border-t border-surface-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How it works
            </motion.h2>
            <motion.p variants={fadeIn} className="text-surface-400">
              Three simple steps to improve your interview skills
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div key={step.step} variants={fadeIn} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl font-bold text-white mx-auto mb-5">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-surface-400">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-full w-full h-0.5 bg-gradient-to-r from-primary-500/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-t border-surface-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Loved by candidates
            </motion.h2>
            <motion.p variants={fadeIn} className="text-surface-400">
              See what others say about their experience
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeIn}>
                <Card className="h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-surface-300 leading-relaxed flex-1 mb-4">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{t.name}</p>
                      <p className="text-xs text-surface-500">{t.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-t border-surface-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20" />
            <div className="absolute inset-0 glass" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to ace your interview?
              </h2>
              <p className="text-surface-300 max-w-xl mx-auto mb-8">
                Start practicing with our AI simulator today. It takes less than a minute to get started.
              </p>
              <Button size="lg" onClick={() => navigate(user ? '/interview/setup' : '/register')}>
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
