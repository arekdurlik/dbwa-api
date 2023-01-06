import Joi from 'joi'

export const validator = <T>(schema: Joi.ObjectSchema, body: T): Joi.ValidationResult<T> => 
  schema.validate(body, { abortEarly: false })

/**
 * Validate that the value is a valid MongoDB ObjectId
 */
export const joiObjectId = () => Joi.alternatives(
  Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  Joi.object().keys({
    id: Joi.any(),
    _bsontype: Joi.allow('ObjectId')
  })
)