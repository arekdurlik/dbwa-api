import Joi from 'joi'
import { joiObjectId, validator } from './validator'

// getEffectLibrary
export type getEffectLibraryRequest = {
  effect?: string
}

const getEffectLibrarySchema = Joi.object<getEffectLibraryRequest>({
  effect: Joi.string().allow('')
})

export const validateGetEffectLibrary = (body: getEffectLibraryRequest) => 
  validator(getEffectLibrarySchema, body)

  // changeVisibility
export type ChangeVisibilityRequest = { id: string, value: boolean }[]

const changeVisibilitySchema = Joi.array<ChangeVisibilityRequest>().items({
    id: joiObjectId(),
    value: Joi.boolean()
})

export const validateChangeVisibility = (body: ChangeVisibilityRequest) =>
  validator(changeVisibilitySchema, body)
