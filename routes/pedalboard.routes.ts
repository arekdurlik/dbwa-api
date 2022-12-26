import { Router } from 'express'
import { getAllBoards, getBoard, setBoard, updateBoard, deleteBoard } from '../controllers/pedalboard.controller'

const router = Router()

router.get(   '/',      getAllBoards)
router.get(   '/:id',   getBoard)
router.post(  '/',      setBoard)
router.put(   '/:id',   updateBoard)
router.delete('/:id',   deleteBoard)

export default router