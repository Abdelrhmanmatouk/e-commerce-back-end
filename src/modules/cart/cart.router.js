import { Router } from 'express';
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { isAuthorized } from '../../middleware/autherization.middleware.js';
import { validation } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as cartSchema from './cart.schema.js';
import * as cartController from './cart.controller.js';

const router = Router();

// add to cart
router.post(
  '/',
  isAuthenticated,
  isAuthorized('user'),
  validation(cartSchema.addToCart),
  asyncHandler(cartController.addToCart)
);

// get cart

router.get(
  '/',
  isAuthenticated,
  isAuthorized('user', 'admin'),
  validation(cartSchema.getCart),
  asyncHandler(cartController.getCart)
);

// update cart
router.patch(
    '/',
    isAuthenticated,
    isAuthorized('user'),
    validation(cartSchema.updateCart),
    asyncHandler(cartController.updateCart)
  );

// remove product from cart
router.patch(
    '/:productId',
    isAuthenticated,
    isAuthorized('user'),
    validation(cartSchema.removeFromCart),
    asyncHandler(cartController.removeFromCart)
  );

  router.put(
    '/clear',
    isAuthenticated,
    isAuthorized('user'),
    asyncHandler(cartController.clearCart)
  );

export default router;
