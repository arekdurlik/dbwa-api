import express from 'express'
import { connectDB } from './config/db'
import { default as pedalboardRouter } from './routes/pedalboard.routes'
import { default as authRouter } from './routes/auth.routes'
import { errorHandler } from './middlewares/error-handler'
import { config } from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
config()
connectDB()

const port = process.env.PORT

app.use(cors({ origin: 'http://localhost:8000', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/api/pedalboards', pedalboardRouter)
app.use('/api/auth', authRouter)

app.use(errorHandler)

app.listen(port, () => console.log(`live on http://localhost:${port}`))