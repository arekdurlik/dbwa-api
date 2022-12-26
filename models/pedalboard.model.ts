import mongoose from 'mongoose'

const pedalboardSchema = new mongoose.Schema({
  author: String,
})

export default mongoose.model('Pedalboard', pedalboardSchema)