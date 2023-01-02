import { Request, Response } from 'express'
import { User } from '../models/user.model'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { TypedRequestBody } from '../types'

const saltRounds = 10

const signUp = async (req: TypedRequestBody<{ username: string, password: string }>, res: Response) => {
  if (!req.body.username || !req.body.password) {
    res.json(400).json({ message: 'Invalid request data' })
  }
  
  const user = await User.findOne({ username: req.body.username})
  
  if (user) {
    res.status(400).json({ message: 'Username already exists' })
    return
  }
  
  const salt = genSaltSync(saltRounds)
  const hashed = hashSync(req.body.password, salt)

  const created = await User.create({ 
    username: req.body.username,
    password: hashed 
  })
  
  if (created) {
    res.status(200).json({ message: 'User successfully signed up' })
  } else {
    res.status(500).json({ message: 'Error while creating a new user' })
  }
}

const signIn = async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.body.username})

  if (user) {
    const passwordIsValid = compareSync(req.body.password, user.password)

    if (passwordIsValid) {
      const secret1 = process.env.SECRET_1!
      const secret2 = process.env.SECRET_2!

      const token = jwt.sign({ id: user.id }, secret1, {
        expiresIn: 1000 * 60 * 10 // 10 minutes
      })
      const refreshToken = jwt.sign({ id: user.id }, secret2, {
        expiresIn: 1000 * 60 * 60 * 24 // 24 hours
      })

      res.cookie('token', token, { httpOnly: true })
      res.cookie('refresh-token', refreshToken, { httpOnly: true })

      res.status(200).json({ message: 'User successfully logged in'})
      return
    }
  }

  res.status(404).json({ message: 'Invalid username or password' })
}

export {
  signUp,
  signIn,
}