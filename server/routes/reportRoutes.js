import { Router } from 'express'
import {
  evaluateInterview,
  getReport,
  getProgressHistory,
  getAnalytics,
} from '../controllers/reportController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.use(authenticateToken)

router.get('/history', getProgressHistory)

router.get('/analytics', getAnalytics)

router.post('/:id/evaluate', evaluateInterview)

router.get('/:id', getReport)

export default router
