import mongoose from 'mongoose'

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
  settings: {
    mappings: [{
      effect: String,
      param: String,
      key: String
    }]
  }
}, { 
  timestamps: true
})

export const User = mongoose.model('User', userSchema)