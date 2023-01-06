import { TokenPayload } from './controllers/auth.controller'

declare global {
  namespace Express {
    interface Request {
      auth?: TokenPayload
    }
  }
}

export interface TypedRequestBody<T> extends Express.Request {
  body: T
}


