import joi from 'joi';
import { isValidobjectId } from '../../middleware/validation.middleware.js'

export const createBrand = joi
  .object({
    name: joi.string().required(),
    categories: joi
      .array()
      .items(joi.string().custom(isValidobjectId).required())
      .required(),
  })
  .required();

  export const updateBrand = joi
  .object({
    name: joi.string().required(),
    id:joi.string().custom(isValidobjectId).required()
  })
  .required();

  export const deleteBrand = joi
  .object({
   
    id:joi.string().custom(isValidobjectId).required()
  })
  .required();