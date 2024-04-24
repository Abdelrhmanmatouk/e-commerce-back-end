import { Router } from 'express';
import { validation } from './../../middleware/validation.middleware.js';
import { asyncHandler } from './../../utils/asyncHandler.js';
import * as authController from './auth.controller.js';
import * as authschema from './auth.schema.js';
const router = Router();

// register

router.post(
  '/register',
  validation(authschema.register),
  asyncHandler(authController.register)
);

// activate account

router.get(
  '/activate_account/:token',
  validation(authschema.activateAccount),
  asyncHandler(authController.activateAccount)
);

// login

router.post(
  '/login',
  validation(authschema.login),
  asyncHandler(authController.login)
);

// forget code

router.patch(
  '/forgetcode',
  validation(authschema.forgetCode),
  asyncHandler(authController.forgetCode)
);

// reset password

router.patch(
  '/resetpassword',
  validation(authschema.resetPassword),
  asyncHandler(authController.resetPassword)
);

export default router;
