import { Router } from 'express'
import { verifyToken } from '../middlewares/verify-token'
import { getEffectLibrary, getUserData } from '../controllers/me.controller'

const router = Router()

router.get('/:id/effects',  verifyToken, getEffectLibrary)
router.get('/',             verifyToken, getUserData)

export default router