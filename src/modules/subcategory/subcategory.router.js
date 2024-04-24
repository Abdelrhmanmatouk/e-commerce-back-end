import { Router } from 'express';
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { isAuthorized } from '../../middleware/autherization.middleware.js';
import { fileUplaod } from '../../utils/fileUpload.js';
import { validation } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as SubCategorySchema from './subcategory.schema.js';
import * as SubCategoryController from './subcategory.controller.js';

const router = Router({ mergeParams: true });

// create subcategory
router.post(
  '/',
  isAuthenticated,
  isAuthorized('admin'),
  fileUplaod().single('subcategory'),
  validation(SubCategorySchema.createSubCategory),
  asyncHandler(SubCategoryController.createSubCategory)
);

// update subcategory
router.patch(
    '/:id',
    isAuthenticated,isAuthorized("admin"),
    fileUplaod().single('subcategory'),
    validation(SubCategorySchema.updateSubcategory),
    asyncHandler(SubCategoryController.updateSubcategory)
  );


  // delete subcategory
router.delete(
    '/:id',
    isAuthenticated,isAuthorized("admin"),
    validation(SubCategorySchema.deletesubcategory),
    asyncHandler(SubCategoryController.deletesubcategory)
  );

//   get all sub categories

router.get('/',validation(SubCategorySchema.getAllsubcategories),asyncHandler(SubCategoryController.getAllsubcategories))

export default router;
