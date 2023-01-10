import { Router } from 'express'
import { getEffects, getEffectById, setEffect, updateEffect, deleteEffect, changeVisibility } from '../controllers/effect.controller'
import { verifyToken } from '../middlewares/verify-token'

const router = Router()

router.get(   '/',                  getEffects)
router.get(   '/:id',               getEffectById)
router.post(  '/',    verifyToken,  setEffect)
router.put(   '/:id', verifyToken,  updateEffect)
router.delete('/:id', verifyToken,  deleteEffect) 

router.post('/change-visibility', verifyToken, changeVisibility)

export default router