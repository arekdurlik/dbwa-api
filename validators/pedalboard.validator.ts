import Joi from 'joi'
import { joiObjectId, validator } from './validator'

// getEffects
export type GetPedalboardsRequest = {
  private?: boolean
  title?: string
  user?: string
}

const getPedalboardsSchema = Joi.object<GetPedalboardsRequest>({
  private: Joi.boolean().default(false),
  title: Joi.string(),
  user: Joi.string(),
})

export const validateGetPedalboards = (body: GetPedalboardsRequest) => 
  validator(getPedalboardsSchema, body)


// getEffectById && deleteEffect
export type PedalboardByIdRequest = {
  id: string
}

const pedalboardByIdSchema = Joi.object<PedalboardByIdRequest>({
  id: joiObjectId()
})

export const validateGetPedalboardById = (body: PedalboardByIdRequest) => 
  validator(pedalboardByIdSchema, body)

export const validateDeletePedalboard = (body: PedalboardByIdRequest) =>
  validator(pedalboardByIdSchema, body)

// setEffect & updateEffect
export type setPedalboardRequest = {
  title: string
  description?: string
  public: boolean
  pedalboard: {
    slot: number
    effect: {
      name: string
      values: {
        [key: string]: number
      }
    }
  }[]
}

export type UpdatePedalboardRequest = Partial<setPedalboardRequest> & { id: string }

const pedalboardSchema = {
  title: Joi.string().min(2),
  description: Joi.string().allow(''),
  public: Joi.boolean(),
  pedalboard: Joi.array().items({
    slot: Joi.number(),
    effect: Joi.object({
      name: Joi.string(),
      values: Joi.object().pattern(
        Joi.string(), Joi.number()
      )
    }),
  })
}

const setPedalboardSchema = Joi.object<setPedalboardRequest>(pedalboardSchema)
const updatePedalboardSchema = Joi.object<UpdatePedalboardRequest>({
  ...pedalboardSchema, 
  id: joiObjectId().required() 
})

export const validateSetPedalboard = (body: setPedalboardRequest) => 
  validator(setPedalboardSchema, body)

export const validateUpdatePedalboard = (body: UpdatePedalboardRequest) => 
  validator(updatePedalboardSchema, body)