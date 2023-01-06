import { NextFunction, Request, RequestHandler, Response } from 'express'
import jwt from 'jsonwebtoken'
import { TokenPayload, getTokenPair } from '../controllers/auth.controller'

export const verifyToken = (req: Request, res: Response, next: NextFunction)  => {
  const token = req.cookies['token']
  const refreshToken = req.cookies['refresh-token']

  if (token && refreshToken) {
    const secret1 = process.env.SECRET_1!
    const secret2 = process.env.SECRET_2!

    // verify token
    try {
      const decodedToken = jwt.verify(token, secret1) as TokenPayload
      
      // token is valid
      if (decodedToken) {
        req.auth = decodedToken
        return next()
      }

    } catch (error) {
      // token is invalid, verify refresh token
      try {
        const decodedRefreshToken = jwt.verify(refreshToken, secret2) as TokenPayload

        // refresh token is valid, generate new token pair
        if (decodedRefreshToken && typeof decodedRefreshToken !== 'string') {
            const [token, refreshToken] = getTokenPair({ id: decodedRefreshToken.id, username: decodedRefreshToken.username })

            res.cookie('token', token, { httpOnly: true })
            res.cookie('refresh-token', refreshToken, { httpOnly: true })
            req.auth = decodedRefreshToken
            return next()
        }
        // invalid token and refresh token
      } catch {}
    }
  }

  // no token and no refresh token
  return res.status(401).json({ message: 'Unauthorized request' })
}

