import { Router } from 'express'
import { verifyToken } from '../middlewares/verify-token'
import { getUserData, getEffectLibrary, getPedalboardLibrary, saveEffectToLibrary, removeEffectFromLibrary, savePedalboardToLibrary } from '../controllers/me.controller'

const router = Router()

router.get(   '/'                            , getUserData)
router.get(   '/effects',         verifyToken, getEffectLibrary)
router.post(  '/effects',         verifyToken, saveEffectToLibrary)
router.delete('/effects/:id',     verifyToken, removeEffectFromLibrary)
router.get(   '/pedalboards',     verifyToken, getPedalboardLibrary)
router.delete('/pedalboards/:id', verifyToken, removeEffectFromLibrary)
router.post(  '/pedalboards',     verifyToken, savePedalboardToLibrary)

export default router