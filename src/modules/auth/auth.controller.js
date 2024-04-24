import { User } from '../../../DB/models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from './../../utils/sendEmails.js';
import { signupTemp, forgetTemp } from './../../utils/htmlTeplates.js';
import { Token } from '../../../DB/models/token.model.js';
import Randomstring from 'randomstring';
import { Cart } from '../../../DB/models/cart.model.js';

export const register = async (req, res, next) => {
  // data from request
  const { email, userName, password } = req.body;
  // check user existence
  const ifuser = await User.findOne({ email });
  if (ifuser) return next(new Error('user already exist ', { cause: 409 }));
  //   hash password
  const hashpassword = bcryptjs.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );
  //   generate token
  const token = jwt.sign({ email }, process.env.TOKEN_SECRET);
  //   create user
 const user = await User.create({ ...req.body, password: hashpassword });
  // create confirmation link
  const confirmatioLink = `http://localhost:3000/auth/activate_account/${token}`;
  // send email
  const messageSent = await sendEmail({
    to: email,
    subject: 'activate your account',
    html: signupTemp(confirmatioLink),
  });
  if (!messageSent) return next(new Error('something went wrong!'));
  // send response
  return res
    .status(201)
    .json({ success: true, message: 'activate your account' });
};

// activate account
export const activateAccount = async (req, res, next) => {
  // data from request
  const { token } = req.params;
  const { email } = jwt.verify(token, process.env.TOKEN_SECRET);
  // find user , update is confirmed
  const user = await User.findOneAndUpdate({ email }, { isConfirmed: true });
  // create cart 
  await Cart.create({user:user._id})
  // send response
  res.status(200).json({ success: true, message: 'try to login' });
};

// login
export const login = async (req, res, next) => {
  // data from request
  const { email, password } = req.body;
  // check email
  const user = await User.findOne({ email });
  if (!user) return next(new Error('invalid email!', { cause: 404 }));
  // check is confirmed
  if (!user.isConfirmed)
    return next(new Error('you should confirm your email!', { cause: 404 }));
  // check passwrod
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) return next(new Error('invalid password!', { cause: 404 }));
  //   create token
  const token = jwt.sign({ email, id: user._id }, process.env.TOKEN_SECRET);
  //   save token in Token model
  await Token.create({ token, user: user._id });
  //   send response
  res.json({ success: true, results: token });
};

// forget code

export const forgetCode = async (req, res, next) => {
  // data from request
  const { email } = req.body;
  // check email
  const user = await User.findOne({ email });
  if (!user) return next(new Error('invalid email!', { cause: 404 }));
  //   generate code
  const forgetcode = Randomstring.generate({
    length: 5,
    charset: 'numeric',
  });
  //   update forget code
  user.forgetCode = forgetcode;
  await user.save();
  //   send confirmation code
  const messageSent = sendEmail({
    to: email,
    subject: 'confirmation code',
    html: forgetTemp(forgetcode),
  });
  if (!messageSent) return next(new Error('something went wrong !'));
  //   send response
  res.json({
    success: true,
    message: 'check your email for confirmation code',
  });
};

// reset password
export const resetPassword = async (req, res, next) => {
  // data from request
  const { email, password, forgetCode } = req.body;
  // check email
  const user = await User.findOne({ email });
  if (!user) return next(new Error('invalid email!', { cause: 404 }));
  //   check forget code
  if (forgetCode !== user.forgetCode)
    return next(new Error('incorrect confirmation code !'));
  // reset password
  user.password = bcryptjs.hashSync(password, parseInt(process.env.SALT_ROUND));
  await user.save();
  //   invalidate all user tokens
  const tokens = await Token.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isvalid = false;
    await token.save();
  });
  // send response
  return res.json({ success: true, message: 'try to login now ' });
};
