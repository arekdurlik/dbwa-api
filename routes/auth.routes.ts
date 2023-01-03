import { Router } from 'express'
import { signUp, signIn, signOut, getUserData } from '../controllers/auth.controller'
import { verifyToken } from '../middlewares/verify-token'

const router = Router()

router.post('/signup',                    signUp)
router.post('/signin',                    signIn)
router.post('/signout',                   signOut)
router.post('/verifytoken', verifyToken,  getUserData)

export default router