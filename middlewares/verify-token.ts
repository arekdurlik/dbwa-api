import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { getTokenPair } from '../controllers/auth.controller'

export const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.cookies['token']
  const refreshToken = req.cookies['refresh-token']

  if (token && refreshToken) {
    const secret1 = process.env.SECRET_1!
    const secret2 = process.env.SECRET_2!

    // verify token
    try {
      const decodedToken = jwt.verify(token, secret1)

      // token is valid
      if (decodedToken) return next()

    } catch (error) {
      // token is invalid, verify refresh token
      try {
        const decodedRefreshToken = jwt.verify(refreshToken, secret2)

        // refresh token is valid, generate new token pair
        if (decodedRefreshToken && typeof decodedRefreshToken !== 'string') {
            const [token, refreshToken] = getTokenPair({ id: decodedRefreshToken.id, username: decodedRefreshToken.username })

            res.cookie('token', token, { httpOnly: true })
            res.cookie('refresh-token', refreshToken, { httpOnly: true })
            return next()
        }
        // invalid token and refresh token
      } catch {}
    }
  }

  // no token and no refresh token
  return res.status(401).json({ message: 'Unauthorized request' })
}

