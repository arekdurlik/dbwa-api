import { Router } from 'express'
import { getAllBoards, getBoardById, setBoard, updateBoard, deleteBoard } from '../controllers/pedalboard.controller'
import { verifyToken } from '../middlewares/verify-token'

const router = Router()

router.get(   '/',      verifyToken, getAllBoards)
router.get(   '/:id',   verifyToken, getBoardById)
router.post(  '/',      verifyToken, setBoard)
router.put(   '/:id',   verifyToken, updateBoard)
router.delete('/:id',   verifyToken, deleteBoard)

export default router