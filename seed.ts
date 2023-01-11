import { Effect } from './models/effect.model'
import { Pedalboard } from './models/pedalboard.model'
import { User } from './models/user.model'

export const seedDb = async () => {
  await Effect.deleteMany({})
  await User.deleteMany({})
  await Pedalboard.deleteMany({})

  await User.create({
    username: 'tester',
    password: '$2b$10$lpSxVQNXbGIoqQJDtDS5UuahLmnTmYxnHvM6UYWFJ7zmnij9ya/K6', // test
    effects: [],
    pedalboards: [],
    recordings: []
  })

  await User.create({
    username: 'tester2',
    password: '$2b$10$lpSxVQNXbGIoqQJDtDS5UuahLmnTmYxnHvM6UYWFJ7zmnij9ya/K6', // test
    effects: [],
    pedalboards: [],
    recordings: []
  })

  await Effect.create([
    {
      author: 'tester',
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
      author: 'tester2',
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