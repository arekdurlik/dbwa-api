import mongoose from 'mongoose'

const recordingSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  path: String,
})

export const Recording = mongoose.model('Recording', recordingSchema)