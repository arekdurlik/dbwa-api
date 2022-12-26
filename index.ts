import express from 'express'
import { connectDB } from './config/db'
import { default as pedalboardRouter } from './routes/pedalboard.routes'
import { errorHandler } from './middlewares/error-handler'
import { config } from 'dotenv'

const app = express()
const port = process.env.PORT
config()
connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/pedalboards', pedalboardRouter)

app.use(errorHandler)

app.listen(port, () => console.log(`live on http://localhost:${port}`))