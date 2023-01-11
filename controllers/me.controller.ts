import { Request, Response } from 'express'
import { EditLibraryRequest, getEffectLibraryRequest, validateEditLibrary, validateGetEffectLibrary } from '../validators/me.validator'
import { User } from '../models/user.model'
import { UserData, decodeToken } from './auth.controller'

/**
 * Retrieve user data from the access token
 * @returns response with user data
 */
const getUserData = (req: Request, res: Response): Response<UserData | { message: string }> => {
  const token = req.cookies['token']

  if (!token) return res.status(204)

  const secret1 = process.env.SECRET_1!
  const decoded = decodeToken(token, secret1)

  return decoded
  ? res.status(200).json(decoded)
  : res.status(401).json({ message: 'Unauthorized request' })
}

/**
 * Get effect settings saved by user.
 * @param req.query.effect - name of effect
 */
const getEffectLibrary = async (req: Request<getEffectLibraryRequest>, res: Response) => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthorized request' })

  const { value, error } = validateGetEffectLibrary(req.query)

  if (error) return res.status(422).json(error.details)
  
  const { effect } = value

  // get user's saved effects
  User.findOne({ _id: req.auth.id })
    .populate({
      path: 'effects',
      match: { 
        $or: [
          { author: { $not: new RegExp(`^${req.auth.username}$`) } , public: true },
          { author: req.auth.username }
        ],
        ...(effect) && { 'effect.name': effect }
      },
    })
    .exec((error, savedEffects) => {
      if (savedEffects) {
        res.status(200).json(savedEffects.effects)
      } else if (error) {
        res.status(500).json(error)
      } else {
        res.status(404).json({ message: 'No effects found' })
      }
    })
}

/**
 * Get pedalboards saved by user.
 */
const getPedalboardLibrary = async (req: Request, res: Response) => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthorized request' })

  // get user's saved pedalboards
  User.findOne({ _id: req.auth.id })
    .populate({
      path: 'pedalboards',
      match: {
        $or: [
          { author: { $not: new RegExp(`^${req.auth.username}$`) } , public: true },
          { author: req.auth.username }
        ],
      }
    })
    .exec((error, savedPedalboards) => {
      if (savedPedalboards) {
        res.status(200).json(savedPedalboards.pedalboards)
      } else if (error) {
        res.status(500).json(error)
      } else {
        res.status(404).json({ message: 'No pedalboards found' })
      }
    })
}

const saveEffectToLibrary = async (req: Request<EditLibraryRequest>, res: Response) =>
  saveToLibrary(req, res, 'effects')

const savePedalboardToLibrary = (req: Request<EditLibraryRequest>, res: Response) =>
  saveToLibrary(req, res, 'pedalboards')


/**
 * Save an item to user's library 
 * @param req.body.id - item id
 * @param type - type of item
 * @returns 
 */
const saveToLibrary = async (req: Request<EditLibraryRequest>, res: Response, type: 'effects' | 'pedalboards') => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthorized request' })

  const { value, error } = validateEditLibrary(req.body)

  if (error) return res.status(422).json(error.details)
  
  const { id } = value

  try {
    const saved = await User.updateOne(
      { _id: req.auth.id },
      { $push: { [type]: id }}
    )
    
    res.status(200).json(saved)
  } catch (error) {
    res.status(500).json(error)
  }
}

const removeEffectFromLibrary = (req: Request<EditLibraryRequest>, res: Response) => 
  removeFromLibrary(req, res, 'effects')

const removePedalboardFromLibrary = (req: Request<EditLibraryRequest>, res: Response) => 
  removeFromLibrary(req, res, 'pedalboards')

/**
 * Remove an item from user's library
 * 
 * @param req.params.id - id of item
 * @param type - type of item
 * @returns 
 */
const removeFromLibrary = async (req: Request<EditLibraryRequest>, res: Response, type: 'effects' | 'pedalboards') => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthorized request' })

  const { value, error } = validateEditLibrary({ id: req.params.id })

  if (error) return res.status(422).json(error.details)
  
  const { id } = value

  try {
    const removed = await User.updateOne(
      { _id: req.auth.id },
      { $pull: { [type]: id }}
    )
      
    if (removed) {
      res.status(200).json(removed)
    } else {
      res.status(404).json({ message: 'Item not found' })
    }
  } catch (error) {
    res.status(500).json(error)
  }
}
export {
  getUserData,
  getEffectLibrary,
  saveEffectToLibrary,
  removeEffectFromLibrary,
  getPedalboardLibrary,
  savePedalboardToLibrary,
  removePedalboardFromLibrary
}