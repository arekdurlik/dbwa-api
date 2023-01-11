import mongoose, { Schema } from 'mongoose'

export const effectSchema = new Schema({
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
  effect: {
    name: {
      type: String,
      required: true,
      enum: [
        'bitcrusher',
        'analogDelay'
      ]
    },
    values: {
      type: Map,
      of: Number
    },
  }
}, {
  timestamps: true
})

export const Effect = mongoose.model('Effect', effectSchema)