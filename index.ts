import express from 'express'
import { connectDB } from './config/db'

const dotenv = require('dotenv')
dotenv.config()

const app = express()
const PORT = process.env.PORT
connectDB()

app.listen(
  PORT, () => console.log(`live on http://localhost:${PORT}`)
)

app.get('/', async () => console.log('index'))