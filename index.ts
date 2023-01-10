import express from 'express'
import { connectDB } from './config/db'
import { default as pedalboardRouter } from './routes/pedalboard.routes'
import { default as effectRouter } from './routes/effect.routes'
import { default as meRouter } from './routes/me.routes'
import { default as authRouter } from './routes/auth.routes'
import { errorHandler } from './middlewares/error-handler'
import { config } from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { seedDb } from './seed'

const app = express()
config()
connectDB()

seedDb()

const port = process.env.PORT
const client = process.env.CLIENT_URL

app.use(cors({ origin: client, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/api/pedalboards', pedalboardRouter)
app.use('/api/effects', effectRouter)
app.use('/api/me', meRouter)
app.use('/api/auth', authRouter)

app.use(errorHandler)

app.listen(port, () => console.log(`live on http://localhost:${port}`))

