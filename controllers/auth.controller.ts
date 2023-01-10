import { Request, Response } from 'express'
import { User } from '../models/user.model'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { TypedRequestBody } from '../types'

const saltRounds = 10

export type UserData = {
  id: string,
  username: string
}

export type TokenPayload = UserData & JwtPayload

/**
 * Sign up a new user
 */
const signUp = async (req: TypedRequestBody<{ username: string, password: string }>, res: Response) => {
  console.log('sign up')
  if (!req.body.username || !req.body.password) {
    res.json(400).json({ message: 'Invalid request data' })
  }
  
  const user = await User.findOne({ username: req.body.username })
  
  if (user) {
    res.status(400).json({ message: 'Username already exists' })
    return
  }

  const salt = genSaltSync(saltRounds)
  const hashed = hashSync(req.body.password, salt)


  try {
    const created = await User.create({ 
      username: req.body.username,
      password: hashed 
    })
    
    if (created) {
      res.status(200).json({ message: 'User successfully signed up', user: {
        id: created.id,
        username: created.username
      }})
    }
  } catch (error) {
    res.status(500).json({ message: 'Error while creating a new user', error })
  }
}

/**
 * Sign in a user
 */
const signIn = async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.body.username })
  
  if (user) {
    const passwordIsValid = compareSync(req.body.password, user.password)

    if (passwordIsValid) {

      const userData = {
        id: user.id,
        username: user.username 
      }

      const [token, refreshToken] = getTokenPair(userData)
      res.cookie('token', token, { httpOnly: true })
      res.cookie('refresh-token', refreshToken, { httpOnly: true })
      res.status(200).json({ message: 'User successfully logged in', user: userData })
      return
    }
  }

  res.status(404).json({ message: 'Invalid username or password' })
}

const signOut = async (req: Request, res: Response) => {
  res.clearCookie('token')
  res.clearCookie('refresh-token')
  res.status(200).json({ message: 'User successfully signed out' })
}

export const decodeToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as TokenPayload
    
    return {
      id: decoded.id,
      username: decoded.username
    }
  } catch {
    return false
  }
}

/**
 * Generate a new access and refresh token pair
 * @param payload values that will be placed in both tokens
 * @returns token pair
 */
const getTokenPair = (payload: TokenPayload): [string, string] => {
  const secret1 = process.env.SECRET_1!
  const secret2 = process.env.SECRET_2!

  const token = jwt.sign(payload, secret1, {
    expiresIn: '10m'
  })
  const refreshToken = jwt.sign(payload, secret2, {
    expiresIn: '24h'
  })

  return [token, refreshToken]
}

export {
  signUp,
  signIn,
  signOut,
  getTokenPair
}