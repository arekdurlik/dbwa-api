import mongoose from 'mongoose'

export const connectDB = async () => {
  mongoose.set('strictQuery', false)
  
  try {
    const mongo = await mongoose.connect(process.env.DATABASE_URL as string)

    console.log(`connected to db: ${mongo.connection.host}`)
  } catch (error) {
    console.log(`error connecting to db: ${error}`)
  }
}