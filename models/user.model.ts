import mongoose, { Types } from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  effects: [
    { type : Types.ObjectId, ref: 'Effect' }
  ],
  pedalboards: [
    { type: Types.ObjectId, ref: 'Pedalboard' }
  ],
  recordings: [
    { type: Types.ObjectId, ref: 'Recording' }
  ]
}, { 
  timestamps: true
})

export const User = mongoose.model('User', userSchema)