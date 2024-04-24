import { Cart } from '../../../DB/models/cart.model.js';
import { Product } from '../../../DB/models/product.model.js';

export const addToCart = async (req, res, next) => {
  const { productId, qauntity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new Error('invalid product ID', { cause: 404 }));
  // check in stock
  if (!product.inStock(qauntity))
    return next(new Error(`sorry, only ${product.availableItems} items left`));
// check if the product already exist in the cart
  const isProductinCart = await Cart.findOne({
    user: req.user._id,
    'products.productId': productId,
  });

  if (isProductinCart) {
    const theProduct = isProductinCart.products.find(
      (prd) => prd.productId.toString() === productId.toString()
    );
    // check stock
    if (product.inStock(theProduct.qauntity + qauntity))
      {theProduct.qauntity = theProduct.qauntity + qauntity;
    await isProductinCart.save()
    return res.json({success:true,results:isProductinCart})}
  else{
    return next(new Error(`sorry, only ${product.availableItems} items left`));
  }
  }
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $push: { products: { productId, qauntity } } },
    { new: true }
  );

  return res.status(200).json({ success: true, results: cart });
};

export const getCart = async (req, res, next) => {
  if (req.user.role == 'user') {
    const cart = await Cart.findOne({ user: req.user._id });
    return res.json({ success: true, results: cart });
  }
  if (req.user.role == 'admin' && !req.body.cartId)
    return next(new Error('cart ID is reqiered'));
  const cart = await Cart.findById(req.body.cartId);
  return res.json({ success: true, results: cart });
};

export const updateCart = async (req, res, next) => {
  const { productId, qauntity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new Error('invalid product ID', { cause: 404 }));

  // check in stock

  if (!product.inStock(qauntity))
    return next(new Error(`sorry, only ${product.availableItems} items left`));

  const cart = await Cart.findOneAndUpdate(
    {
      user: req.user._id,
      'products.productId': productId,
    },
    {
      'products.$.qauntity': qauntity,
    },
    {
      new: true,
    }
  );
  return res.json({ success: true, results: cart });
};

export const removeFromCart = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) return next(new Error('invalid product ID', { cause: 404 }));
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: { productId } } },
    { new: true }
  );
  return res.json({ success: true, results: cart });
};

export const clearCart = async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { new: true }
  );
  return res.json({ success: true, results: cart });
};
