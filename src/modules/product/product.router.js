import { Router } from 'express';
import { isAuthenticated } from './../../middleware/authentication.middleware.js';
import { isAuthorized } from './../../middleware/autherization.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as productSchema from './product.schema.js';
import * as productController from './product.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { fileUplaod } from './../../utils/fileUpload.js';
import reviewRouter from './../review/review.router.js'


const router = Router();

router.use('/:productId/review',reviewRouter)

// create product

router.post(
  '/',
  isAuthenticated,
  isAuthorized('seller'),
  fileUplaod().fields([
    { name: 'defaultImage', maxCount: 1 },
    { name: 'subImages', maxCount: 6 },
  ]),
  validation(productSchema.createProduct),
  asyncHandler(productController.createProduct)
);

// delete product

router.delete(
  '/:id',
  isAuthenticated,
  isAuthorized('seller'),
  validation(productSchema.deleteProduct),
  asyncHandler(productController.deleteProduct)
);

// get all products

router.get('/',asyncHandler(productController.getProducts))


export default router;
