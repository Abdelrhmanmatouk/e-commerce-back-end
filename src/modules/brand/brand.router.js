import { Router } from 'express';
import { isAuthenticated } from './../../middleware/authentication.middleware.js';
import { isAuthorized } from './../../middleware/autherization.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as brandSchema from './brand.schema.js';
import * as brandController from './brand.controller.js';
import { fileUplaod } from './../../utils/fileUpload.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// create brand
router.post(
  '/',
  isAuthenticated,
  isAuthorized('admin'),
  fileUplaod().single('brand'),
  validation(brandSchema.createBrand),
  asyncHandler(brandController.createBrand)
);

// update brand

router.patch(
    '/:id',
    isAuthenticated,
    isAuthorized('admin'),
    fileUplaod().single('brand'),
    validation(brandSchema.updateBrand),
    asyncHandler(brandController.updateBrand)
  );
// delete brand
  router.delete(
    '/:id',
    isAuthenticated,
    isAuthorized('admin'),
    validation(brandSchema.deleteBrand),
    asyncHandler(brandController.deleteBrand)
  );
// get all brands

router.get("/",asyncHandler(brandController.getAllBrands))

export default router;
