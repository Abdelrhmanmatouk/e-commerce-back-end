import joi from 'joi';
import { isValidobjectId } from '../../middleware/validation.middleware.js';

export const addToCart = joi
  .object({
    productId: joi.string().custom(isValidobjectId).required(),
    qauntity: joi.number().integer().min(1).required(),
  })
  .required();

export const getCart = joi
  .object({
    cartId: joi.string().custom(isValidobjectId),
  })
  .required();

  export const updateCart = joi
  .object({
    productId: joi.string().custom(isValidobjectId).required(),
    qauntity: joi.number().integer().min(1).required(),
  })
  .required();

  export const removeFromCart = joi
  .object({
    productId: joi.string().custom(isValidobjectId).required(),
  })
  .required();