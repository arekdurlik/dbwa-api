import { Request, Response } from 'express'
import { Pedalboard } from '../models/pedalboard.model'

const getAllBoards = async (req: Request, res: Response) => {
  const pedalboards = await Pedalboard.find()
  
  res.status(200).json(pedalboards)
}

const getBoardById = (req: Request, res: Response) => {
  res.status(200).json({ message: `get pedalboard ${req.params.id}` })
}

const setBoard = async (req: Request, res: Response) => {
  const pedalboard = await Pedalboard.create({
    author: req.body.author
  })

  res.status(200).json(pedalboard)
}

const updateBoard = (req: Request, res: Response) => {
  res.status(200).json({ message: `update pedalboard ${req.params.id}` })
}

const deleteBoard = (req: Request, res: Response) => {
  res.status(200).json({ message: `delete pedalboard ${req.params.id}` })
}

export {
  getAllBoards,
  getBoardById,
  setBoard,
  updateBoard,
  deleteBoard
}