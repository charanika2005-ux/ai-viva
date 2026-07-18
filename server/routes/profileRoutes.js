import { Router } from 'express'
import { getProfileStats, updateProfileSettings } from '../controllers/profileController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.use(authenticateToken)

router.get('/', getProfileStats)

router.put('/', updateProfileSettings)

export default router
