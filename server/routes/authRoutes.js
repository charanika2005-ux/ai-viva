import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, getProfile, updateProfile, deleteAccount } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'
import { validate } from '../middleware/validator.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('full_name').optional().isString().trim(),
  ],
  validate,
  register
)

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
)

router.get('/profile', authenticateToken, getProfile)

router.put(
  '/profile',
  authenticateToken,
  [
    body('full_name').optional().isString().trim().isLength({ min: 1, max: 100 }),
    body('avatar_url').optional().isURL(),
  ],
  validate,
  updateProfile
)

router.delete('/account', authenticateToken, deleteAccount)

export default router
