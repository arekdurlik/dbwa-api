import mongoose from 'mongoose'

const pedalboardSchema = new mongoose.Schema({
  author: String,
})

export const Pedalboard = mongoose.model('Pedalboard', pedalboardSchema)