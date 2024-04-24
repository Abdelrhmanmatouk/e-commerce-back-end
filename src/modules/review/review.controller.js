import { Order } from './../../../DB/models/order.model.js';
import { Review } from './../../../DB/models/review.model.js';
import { Product } from './../../../DB/models/product.model.js';

export const addReview = async (req, res, next) => {
  // data
  const { productId } = req.params;
  const { rating, comment } = req.body;
  //   check if product is bought
  const order = await Order.findOne({
    user: req.user._id,
    status: 'deliverd',
    'products.productId': productId,
  });

  if (!order)
    return next(new Error('can not review this product', { cause: 400 }));
  // check past reviews

  if (await Review.findOne({ createdBy: req.user._id, productId: productId }))
    return next(new Error('this order already reviewed by you'));
  // create review
  const review = await Review.create({
    comment,
    rating,
    createdBy: req.user._id,
    productId,
    orderId: order._id,
  });

  // calculate average rating

  let calcRating = 0;
  const product = await Product.findById(productId);
  const reviews = await Review.find({ productId });

  for (let i = 0; i < reviews.length; i++) {
    calcRating += reviews[i].rating;
  }

  product.averageRate = calcRating / reviews.length;
  await product.save();

  return res.status(201).json({ success: true, results: review });
};

// update review

export const updateReview = async (req, res, next) => {
  const { productId, id } = req.params;

  const review = await Review.findOne({ _id: id, productId: productId });

  review.rating = req.body.rating ? req.body.rating : review.rating;
  review.comment = req.body.comment ? req.body.comment : review.comment;
  await review.save();

  if (req.body.rating) {
    // calculate average rating

    let calcRating = 0;
    const product = await Product.findById(productId);
    const reviews = await Review.find({ productId });

    for (let i = 0; i < reviews.length; i++) {
      calcRating += reviews[i].rating;
    }

    product.averageRate = calcRating / reviews.length;
    await product.save();
  }

  return res.json({ success: true, message: 'Review updated successfully!' });
};
