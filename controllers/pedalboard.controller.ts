import { Request, Response } from 'express'
import { Pedalboard } from '../models/pedalboard.model'
import { GetPedalboardsRequest, setPedalboardRequest, validateGetPedalboards, validateSetPedalboard } from '../validators/pedalboard.validator'
import { TypedRequestBody } from '../types'
import mongoose, { Types } from 'mongoose'
import { User } from '../models/user.model'
import { ChangeVisibilityRequest, validateChangeVisibility } from '../validators/me.validator'

/**
 * Get all pedalboards. 
 * 
 * Available parameters:
 * @param req.private - include private effects. Defaults to false
 * @param req.title - document title includes value
 * @param req.user - user id equals value
 */
const getPedalboards = async (req: Request<GetPedalboardsRequest>, res: Response) => {
  const { value, error } = validateGetPedalboards(req.query)

  if (error) return res.status(422).json(error.details)
  
  const { user, title, private: includePrivate } = value

  try {
    const effects = await Pedalboard.find({
      ...(title)            && { title: new RegExp(`${title}`, 'i') },
      ...(!includePrivate)  && { public: true },
      ...(user)             && { author: user },
    })
    
    res.status(200).json(effects)
  } catch (error) {
    res.status(500).json(error)
  }
}


const getPedalboardById = (req: Request, res: Response) => {
  res.status(200).json({ message: `get pedalboard ${req.params.id}` })
}

/**
 * Set effect.
 */
const setPedalboard = async (req: TypedRequestBody<setPedalboardRequest>, res: Response) => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthorized request' })

  const { value, error } = validateSetPedalboard(req.body)

  if (error) return res.status(422).json(error.details)

  const { title, description, public: isPublic, pedalboard } = value

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const created = await Pedalboard.create([{
      author: req.auth.username,
      title,
      description,
      public: isPublic,
      pedalboard
    }], { session })

    if (created) await User.updateOne(
      { username: req.auth.username },
      { $push: { pedalboards: created[0].id }}
    )

    await session.commitTransaction()
    res.status(200).json(created[0])
  } catch (error) {
    await session.abortTransaction()
    res.status(500).json(error)
  }
  session.endSession()
}

const updatePedalboard = (req: Request, res: Response) => {
  res.status(200).json({ message: `update pedalboard ${req.params.id}` })
}

const deletePedalboard = (req: Request, res: Response) => {
  res.status(200).json({ message: `delete pedalboard ${req.params.id}` })
}

const changeVisibility = async (req: TypedRequestBody<ChangeVisibilityRequest>, res: Response) => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthorized request' })

  const { value: entries, error } = validateChangeVisibility(req.body)

  if (error) return res.status(422).json(error.details)

  try {
    const bulkChange = entries.map(({ id, value }) => ({
      updateOne: {
        filter: {
          _id: new Types.ObjectId(id),
          author: req.auth?.username
        },
        update: {
          public: value
        }
      }
    }))

    await Pedalboard.bulkWrite(bulkChange)
  } catch (error) {
    res.status(500).json(error)
  }
  res.status(200).json({ message: 'Visibility settings saved' })
}

export {
  getPedalboards,
  getPedalboardById,
  setPedalboard,
  updatePedalboard,
  deletePedalboard,
  changeVisibility
}