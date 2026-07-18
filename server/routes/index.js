import { Router } from 'express'
import authRoutes from './authRoutes.js'
import interviewRoutes from './interviewRoutes.js'
import audioRoutes from './audioRoutes.js'
import reportRoutes from './reportRoutes.js'
import profileRoutes from './profileRoutes.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

router.use('/auth', authRoutes)
router.use('/interviews', interviewRoutes)
router.use('/audio', audioRoutes)
router.use('/reports', reportRoutes)
router.use('/profile', profileRoutes)

export default router
