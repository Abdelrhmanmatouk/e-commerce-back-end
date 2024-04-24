import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Token } from '../../DB/models/token.model.js';
import { User } from '../../DB/models/user.model.js';

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  // check token
  let token = req.headers['token'];
  // check beare key
  if (!token || !token.startsWith(process.env.BEARER_KEY))
    return next(new Error('valid token is required'));
  // extract payload
  token = token.split(process.env.BEARER_KEY)[1];
 const payload = jwt.verify(token, process.env.TOKEN_SECRET);
  //   check token in DB
  const tokenDB = await Token.findOne({ user: payload.id, isvalid: true });
  if (!tokenDB) return next(new Error('invalid token'));
  //   check user
  const user = await User.findById(payload.id);
  if (!user) return next(new Error('user not found'));
  //   pass user
  req.user = user;

  next()
});
