import voucher_codes from 'voucher-code-generator';
import { Coupon } from '../../../DB/models/coupon.model.js';

// create coupon
export const createCoupon = async (req, res, next) => {
  // generate name
  const code = voucher_codes.generate({ length: 5 });
  // create coupon
  const coupon = await Coupon.create({
    name: code[0],
    createdBy: req.user._id,
    expiredAt: new Date(req.body.expiredAt).getTime(),
    discount: req.body.discount,
  });
  // response
  return res.status(201).json({ success: true, results: coupon });
};

// update coupon

export const updateCoupon = async (req, res, next) => {
  // check coupon
  const coupon = await Coupon.findOne({
    name: req.params.code,
    expiredAt: { $gt: Date.now() },
  });
  if (!coupon) return next(new Error('invalid coupon', { cause: 404 }));
  // check owner
  if (req.user._id.toString() != coupon.createdBy.toString())
    return next(new Error('not Authorized', { cause: 403 }));
  // update coupon
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiredAt = req.body.expiredAt
    ? new Date(req.body.expiredAt).getTime()
    : coupon.expiredAt;

  await coupon.save();

  return res.json({ success: true, message: 'coupon update successfully' });
};

// delete coupon

export const deleteCoupon = async (req, res, next) => {
  // check coupon
  const coupon = await Coupon.findOne({ name: req.params.code });
  if (!coupon) return next(new Error('invalid coupon', { cause: 404 }));
  // check owner
  if (req.user._id.toString() != coupon.createdBy.toString())
    return next(new Error('not Authorized', { cause: 403 }));
  // delete coupon
  await coupon.deleteOne();
  // response
  return res.json({ success: true, message: 'coupon deleted successfully' });
};

// get all coupons

export const getAllCoupon = async (req, res, next) => {
  // get coupons if admin
  if (req.user.role === 'admin') {
    const coupons = await Coupon.find();
    return res.json({ success: true, results: { coupons } });
  }
  // get coupons if seller
  if (req.user.role === 'seller') {
    const coupons = await Coupon.find({createdBy:req.user._id});
    return res.json({ success: true, results: { coupons } });
  }
};
