import { Request, Response } from 'express'
import { Effect, findManyByIds } from '../models/effect.model'
import { getEffectLibraryRequest, validateGetEffectLibrary } from '../validators/me.validator'
import { User } from '../models/user.model'
import { UserData, decodeToken } from './auth.controller'

/**
 * Retrieve user data from the access token
 * @returns response with user data
 */
const getUserData = (req: Request, res: Response): Response<UserData | { message: string }> => {
  const token = req.cookies['token']
  const secret1 = process.env.SECRET_1!

  const decoded = decodeToken(token, secret1)

  return decoded
  ? res.status(200).json(decoded)
  : res.status(401).json({ message: 'Unauthorized request' })
}

/**
 * Get user's saved settings.
 * 
 * Available parameters:
 * @param req.effect - effect name
 */
const getEffectLibrary = async (req: Request<getEffectLibraryRequest>, res: Response) => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthorized request' })

  const { value, error } = validateGetEffectLibrary(req.query)

  if (error) return res.status(422).json(error.details)
  
  const { effect } = value

  try {
    // get user's saved effects
    const user = await User.findOne({ _id: req.auth.id }, 'effects')
    
    if (user && user.effects.length > 0) {
      try {
        const effects = await findManyByIds(user.effects, effect)

        return res.status(200).json(effects)
      } catch (error) {
        return res.status(500).json(error)
      }
    } else {
      return res.status(200).json([])
    }
  } catch (error) {
    return res.status(500).json(error)
  }
}

export {
  getUserData,
  getEffectLibrary
}