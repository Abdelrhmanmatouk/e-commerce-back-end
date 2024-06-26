import joi from 'joi'
import { isValidobjectId } from '../../middleware/validation.middleware.js'

export const addReview = joi.object({
    productId:joi.string().custom(isValidobjectId).required(),
    comment:joi.string().required(),
    rating:joi.number().min(1).max(5).required()
}).required()

export const updateReview =joi.object({
    productId:joi.string().custom(isValidobjectId).required(),
    comment:joi.string(),
    rating:joi.number().min(1).max(5),
    id:joi.string().custom(isValidobjectId).required()
}).required()