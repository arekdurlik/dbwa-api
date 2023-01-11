import { Router } from 'express'
import { getPedalboards, getPedalboardById, setPedalboard, updatePedalboard, deletePedalboard, changeVisibility } from '../controllers/pedalboard.controller'
import { verifyToken } from '../middlewares/verify-token'

const router = Router()

router.get(   '/',      verifyToken, getPedalboards)
router.get(   '/:id',   verifyToken, getPedalboardById)
router.post(  '/',      verifyToken, setPedalboard)
router.put(   '/:id',   verifyToken, updatePedalboard)
router.delete('/:id',   verifyToken, deletePedalboard)

router.post('/change-visibility', verifyToken, changeVisibility)

export default router