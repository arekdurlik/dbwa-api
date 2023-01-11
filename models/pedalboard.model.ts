import mongoose, { Schema } from 'mongoose'

const pedalboardSchema = new Schema({
  author: {
    type: String, 
    required: true 
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  public: {
    type: Boolean,
    required: true
  },
  pedalboard: {
    type: [],
    required: true
  }
}, {
  timestamps: true
})

export const Pedalboard = mongoose.model('Pedalboard', pedalboardSchema)