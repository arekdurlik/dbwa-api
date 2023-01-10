import mongoose from 'mongoose'

const effectSchema = new mongoose.Schema({
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

export const findById = async (id: string) => Effect.findById(id)

export const findManyByIds = async (ids: any[], effect?: string) => Effect.find({ 
  _id: { $in: ids },
  ...(effect) && { 'effect.name': effect }
})