import { Request, Response } from 'express'
import { Effect } from '../models/effect.model'
import { EffectByIdRequest, GetEffectsRequest, SetEffectRequest, UpdateEffectRequest, validateDeleteEffect, validateGetEffectById, validateGetEffects, validateSetEffect, validateUpdateEffect } from '../validators/effect.validator'
import mongoose, { Types } from 'mongoose'
import { TypedRequestBody } from '../types'
import { User } from '../models/user.model'
import { ChangeVisibilityRequest, validateChangeVisibility } from '../validators/me.validator'
/**
 * Get all effects. 
 * 
 * Available parameters:
 * @param req.private - include private effects. Defaults to false
 * @param req.effect - effect name equals value
 * @param req.title - document title includes value
 * @param req.user - username of the author equals value
 */
const getEffects = async (req: Request<GetEffectsRequest>, res: Response) => {
  const { value, error } = validateGetEffects(req.query)

  if (error) return res.status(422).json(error.details)
  
  const { user, title, private: includePrivate, effect } = value

  try {
    const effects = await Effect.find({
      ...(title)            && { title: new RegExp(`${title}`, 'i') },
      ...(!includePrivate)  && { public: true },
      ...(user)             && { author: user },
      ...(effect)           && { 'effect.name': new RegExp(`^${effect}$`, 'i') }
    })
    
    res.status(200).json(effects)
  } catch (error) {
    res.status(500).json(error)
  }
}

/**
 * Get effect by id.
 * @param req.id - id of the effect
 */
const getEffectById = async (req: Request<EffectByIdRequest>, res: Response) => {
  const { value, error } = validateGetEffectById({ id: req.params.id })

  if (error) return res.status(422).json(error.details)

  try {
    const effect = await Effect.findById(value.id)
  
    effect 
    ? res.status(200).json(effect)
    : res.status(404).json({ message: 'Effect not found' })
  } catch (error) {
    res.status(500).json(error)
  }
}

/**
 * Set effect.
 */
const setEffect = async (req: TypedRequestBody<SetEffectRequest>, res: Response) => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthorized request' })

  const { value, error } = validateSetEffect(req.body)

  if (error) return res.status(422).json(error.details)

  const { title, description, public: isPublic, effect } = value


  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const created = await Effect.create([{
      author: req.auth.username,
      title,
      description,
      public: isPublic,
      effect
    }], { session })

    if (created) await User.updateOne(
      { username: req.auth.username },
      { $push: { effects: created[0].id }}
    )

    await session.commitTransaction()
    res.status(200).json(created[0])
  } catch (error) {
    await session.abortTransaction()
    res.status(500).json(error)
  }
  session.endSession()
}

/**
 * Update effect by id.
 */
const updateEffect = async (req: Request<{ id: string }, UpdateEffectRequest>, res: Response) => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthorized request' })

  const { value, error } = validateUpdateEffect({ ...req.body, id: req.params.id })

  if (error) return res.status(422).json(error.details)

  const { id, title, description, public: isPublic, effect } = value

  try {
    const updated = await Effect.updateOne({ _id: id }, {
      ...(title)                  && { title },
      ...(description)            && { description },
      ...(isPublic !== undefined) && { public: isPublic },
      ...(effect)                 && { effect }
    })

    res.status(200).json(updated)
  } catch (error) {
    res.status(500).json(error)
  }
}

/**
 * Delete effect by id.
 */
const deleteEffect = async (req: Request<{ id: string }>, res: Response) => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthorized request' })

  const { value, error } = validateDeleteEffect({ id: req.params.id })

  if (error) return res.status(422).json(error.details)

  const { id } = value

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const deleted = await Effect.findOneAndDelete({ _id: id }).session(session)

    if (deleted) {
      await User.updateOne(
        { username: deleted.author }, 
        { $pull: { effects: deleted.id }}
      ).session(session)

      res.status(200).json(deleted)
    }

    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
    res.status(500).json(error)
  }
  session.endSession()
}

const changeVisibility = async (req: TypedRequestBody<ChangeVisibilityRequest>, res: Response) => {
  if (!req.auth) return res.status(401).json({ message: 'Unauthorized request' })

  const { value: entries, error } = validateChangeVisibility(req.body)

  if (error) return res.status(422).json(error.details)

  try {
    const bulkChange = entries.map(({ id, value }) => ({
      updateOne: {
        filter: {
          _id: id,
          author: req.auth?.username
        },
        update: {
          public: value
        }
      }
    }))

    await Effect.bulkWrite(bulkChange)
  } catch (error) {
    res.status(500).json(error)
  }
  res.status(200).json({ message: 'Visibility settings saved' })
}

export {
  getEffects,
  getEffectById,
  setEffect,
  updateEffect,
  deleteEffect,
  changeVisibility
}