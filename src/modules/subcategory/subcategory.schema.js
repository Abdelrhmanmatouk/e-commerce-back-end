import joi from 'joi'
import { isValidobjectId } from '../../middleware/validation.middleware.js'

export const createSubCategory = joi.object({
    name:joi.string().min(5).max(20).required(),
    categoryId:joi.string().custom(isValidobjectId).required()
}).required()


export const updateSubcategory = joi.object({
    name:joi.string().min(5).max(20),
    id:joi.string().custom(isValidobjectId).required(),
    categoryId:joi.string().custom(isValidobjectId).required()
}).required()

export const deletesubcategory = joi.object({
    id:joi.string().custom(isValidobjectId).required(),
    categoryId:joi.string().custom(isValidobjectId).required()
}).required()

export const getAllsubcategories= joi.object({
    categoryId:joi.string().custom(isValidobjectId)
}).required()