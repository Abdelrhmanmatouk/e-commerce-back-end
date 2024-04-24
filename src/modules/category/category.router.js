import { Router } from 'express';
import { isAuthenticated } from './../../middleware/authentication.middleware.js';
import { isAuthorized } from './../../middleware/autherization.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as categorySchema from './category.schema.js';
import * as categoryController from './category.controller.js';
import { fileUplaod } from './../../utils/fileUpload.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import subcategoryRouter from './../subcategory/subcategory.router.js'

const router = Router();

router.use('/:categoryId/subcategory',subcategoryRouter)


// create category
router.post(
  '/',
  isAuthenticated,isAuthorized("admin"),
  fileUplaod().single('category'),
  validation(categorySchema.createCategory),
  asyncHandler(categoryController.createCategory)
);

// update category
router.patch(
    '/:id',
    isAuthenticated,isAuthorized("admin"),
    fileUplaod().single('category'),
    validation(categorySchema.updateCategory),
    asyncHandler(categoryController.updateCategory)
  );
  
// delete category
router.delete(
    '/:id',
    isAuthenticated,isAuthorized("admin"),
    validation(categorySchema.deleteCategory),
    asyncHandler(categoryController.deleteCategory)
  );


  //get all category
router.get('/',asyncHandler(categoryController.getAllCategories)
  );
  
export default router;
