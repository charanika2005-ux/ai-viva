import { Router } from 'express'
import { body } from 'express-validator'
import {
  createInterview,
  getInterview,
  getInterviews,
  submitAnswer,
  finishInterview,
  getInterviewReport,
  getStats,
  deleteInterview,
} from '../controllers/interviewController.js'
import { authenticateToken } from '../middleware/auth.js'
import { validate } from '../middleware/validator.js'

const router = Router()

router.use(authenticateToken)

router.post(
  '/',
  [
    body('type').isIn(['hr', 'technical', 'viva']).withMessage('Type must be hr, technical, or viva'),
    body('subject').isString().notEmpty().withMessage('Subject is required'),
    body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
    body('question_count').isInt({ min: 1, max: 30 }).withMessage('Question count must be 1-30'),
  ],
  validate,
  createInterview
)

router.get('/stats', getStats)

router.get('/', getInterviews)

router.get('/:id', getInterview)

router.post(
  '/:id/answers',
  [
    body('question_id').notEmpty().withMessage('Question ID is required'),
    body('answer').isString().notEmpty().withMessage('Answer text is required'),
  ],
  validate,
  submitAnswer
)

router.post('/:id/finish', finishInterview)

router.get('/:id/report', getInterviewReport)

router.delete('/:id', deleteInterview)

export default router
