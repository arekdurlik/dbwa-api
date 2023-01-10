import Joi from 'joi'
import { joiObjectId, validator } from './validator'

// getEffects
export type GetEffectsRequest = {
  private?: boolean
  name?: string
  title?: string
  user?: string
}

const getEffectsSchema = Joi.object<GetEffectsRequest>({
  private: Joi.boolean().default(false),
  name: Joi.string(),
  title: Joi.string(),
  user: Joi.string(),
})

export const validateGetEffects = (body: GetEffectsRequest) => 
  validator(getEffectsSchema, body)


// getEffectById && deleteEffect
export type EffectByIdRequest = {
  id: string
}

const effectByIdSchema = Joi.object<EffectByIdRequest>({
  id: joiObjectId()
})

export const validateGetEffectById = (body: EffectByIdRequest) => 
  validator(effectByIdSchema, body)

export const validateDeleteEffect = (body: EffectByIdRequest) =>
  validator(effectByIdSchema, body)

// setEffect & updateEffect
export type SetEffectRequest = {
  title: string
  description?: string
  public: boolean
  effect: {
    name: string
    values: {
      [key: string]: number
    }
  }
}

export type UpdateEffectRequest = Partial<SetEffectRequest> & { id: string }

const effectSchema = {
  title: Joi.string().min(2),
  description: Joi.string().allow(''),
  public: Joi.boolean(),
  effect: {
    name: Joi.string(),
    values: Joi.object().pattern(
      Joi.string(), Joi.number()
    )
  }
}

const setEffectSchema = Joi.object<SetEffectRequest>(effectSchema)
const updateEffectSchema = Joi.object<UpdateEffectRequest>({
  ...effectSchema, 
  id: joiObjectId().required() 
})

export const validateSetEffect = (body: SetEffectRequest) => 
  validator(setEffectSchema, body)

export const validateUpdateEffect = (body: UpdateEffectRequest) => 
  validator(updateEffectSchema, body)