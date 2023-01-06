import { Types } from 'mongoose'
import { Effect } from './models/effect.model'
import { User } from './models/user.model'

export const seedDb = async () => {
  await Effect.deleteMany({})
  await User.deleteMany({})

  await User.create({
    _id: new Types.ObjectId(1),
    username: 'tester',
    password: '$2b$10$lpSxVQNXbGIoqQJDtDS5UuahLmnTmYxnHvM6UYWFJ7zmnij9ya/K6', // test
    effects: [],
    pedalboards: [],
    recordings: []
  })

  await Effect.create([
  {
    author: 'test2',
    title: 'Test effect',
    description: 'Test description',
    public: false,
    effect: {
      name: 'analogDelay',
      values: {
        delay: 0.5,
        regen: 0.7,
        mix: 0.5
      }
    }
  },
  {
    author: 'test3',
    title: 'Test effect 2',
    description: 'Test description 2',
    public: true,
    effect: {
      name: 'analogDelay',
      values: {
        delay: 0.5,
        regen: 0.7,
        mix: 0.5
      }
    }
  },
])
}