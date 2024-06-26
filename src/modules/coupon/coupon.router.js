import { Router } from 'express';
import { isAuthenticated } from './../../middleware/authentication.middleware.js';
import { isAuthorized } from './../../middleware/autherization.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as couponSchema from './coupon.schema.js';
import * as couponController from './coupon.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// create coupon
router.post(
  '/',
  isAuthenticated,
  isAuthorized('seller'),
  validation(couponSchema.createCoupon),
  asyncHandler(couponController.createCoupon)
);


//  update coupon
router.patch(
  '/:code',
  isAuthenticated,
  isAuthorized('seller'),
  validation(couponSchema.updateCoupon),
  asyncHandler(couponController.updateCoupon)
);

//  delete coupon
router.delete(
  '/:code',
  isAuthenticated,
  isAuthorized('seller'),
  validation(couponSchema.deleteCoupon),
  asyncHandler(couponController.deleteCoupon)
);

//  get all coupon
router.get(
  '/',
  isAuthenticated,
  isAuthorized('seller','admin'),
  asyncHandler(couponController.getAllCoupon)
);


export default router;
