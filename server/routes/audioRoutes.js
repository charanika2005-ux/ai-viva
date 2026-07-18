import { Router } from 'express'
import { transcribe } from '../controllers/audioController.js'
import { authenticateToken } from '../middleware/auth.js'
import { uploadAudio } from '../middleware/upload.js'
import { audioLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.use(authenticateToken)

router.post(
  '/transcribe',
  audioLimiter,
  uploadAudio.single('audio'),
  transcribe
)

export default router
