import joi from 'joi';
import { isValidobjectId } from '../../middleware/validation.middleware.js';

export const createProduct = joi
  .object({
    name: joi.string().min(2).max(20).required(),
    description: joi.string().min(10).max(200),
    availableItems: joi.number().integer().min(1).required(),
    price: joi.number().integer().min(1).required(),
    soldItems: joi.number().integer(),
    discount: joi.number().min(1).max(100),
    category: joi.string().custom(isValidobjectId).required(),
    brand: joi.string().custom(isValidobjectId).required(),
    subcategory: joi.string().custom(isValidobjectId).required(),
  })
  .required();

  export const deleteProduct = joi.object({
    id:joi.string().custom(isValidobjectId).required()
  }).required()