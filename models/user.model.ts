import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  settings: {
    mappings: [{
      effect: String,
      param: String,
      key: String
    }]
  }
})

export default mongoose.model('User', userSchema)