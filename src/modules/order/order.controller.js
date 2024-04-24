import { Coupon } from './../../../DB/models/coupon.model.js';
import { Cart } from './../../../DB/models/cart.model.js';
import { Product } from './../../../DB/models/product.model.js';
import { Order } from '../../../DB/models/order.model.js';
import createInvoice from '../../utils/pdfInvoice.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from './../../utils/cloud.js';
import { sendEmail } from '../../utils/sendEmails.js';
import { clearCart, updateStock } from './order.services.js';
import Stripe from 'stripe';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// create order
export const createOrder = async (req, res, next) => {
  // data
  const { coupon, address, payment, phone } = req.body;

  // check coupon
  let checkCoupon;
  if (coupon) {
    checkCoupon = await Coupon.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now() },
    });
    if (!checkCoupon) return next(new Error('Invalid Coupon', { cause: 404 }));
  }

  // get products from cart
  const cart = await Cart.findOne({ user: req.user._id });
  const products = cart.products;
  if (products.length < 1) return next(new Error('Empty Cart'));
  let orderProducts = [];
  let finalOrderPrice = 0;
  for (let i = 0; i < products.length; i++) {
    const product = await Product.findById(products[i].productId);
    if (!product) return next(new Error(`${products[i].productId} not found`));
    if (!product.inStock(products[i].qauntity))
      return next(
        new Error(
          `product out of stock, only ${product.availableItems} are available`
        )
      );
    orderProducts.push({
      productId: product._id,
      quantity: products[i].qauntity,
      name: product.name,
      description: product.description,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].qauntity,
    });

    finalOrderPrice += product.finalPrice * products[i].qauntity;
  }
  // create order in DB
  const order = await Order.create({
    user: req.user._id,
    products: orderProducts,
    address,
    payment,
    phone,
    price: finalOrderPrice,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
  });
  // create invoice
  const user = req.user;
  const invoice = {
    shipping: {
      name: user.name,
      address: order.address,
      country: 'EGYPT',
    },
    items: orderProducts,
    subtotal: order.price,
    paid: checkCoupon ? order.coupon.discount : 0,
    final: order.finalPrice,
    invoice_nr: order._id,
  };

  const pdfPath = path.join(__dirname, `./../../tempInvoices/${order._id}.pdf`);
  createInvoice(invoice, pdfPath);

  // upload invoice

  const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath, {
    folder: `${process.env.CLOUD_FILE_NAME}/order/invoices`,
  });

  // add invoice to the DB

  order.invoice = { id: public_id, url: secure_url };
  await order.save();
  if (!order.invoice)
    return next(new Error('something went wrong! while saving'));
  // send email to the user
  const isSent = await sendEmail({
    to: user.email,
    subject: 'order invoice',
    attachments: [
      {
        filename: `${order._id}.pdf`,
        href: secure_url,
        contentType: 'application/pdf',
      },
    ],
  });
  if (!isSent) return next(new Error('something went wrong!'));
  // update stock

  updateStock(order.products, true);
  // clear cart

  clearCart(user._id);

  if (order.payment === 'visa') {
    const stripe = new Stripe(process.env.STRIPE_KEY);

    // check coupon

    let couponExisted;
    if (order.coupon.name !== undefined) {
      couponExisted = await stripe.coupons.create({
        percent_off: order.coupon.discount,
        duration: 'once',
      });
    }

    // create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: 'egp',
            product_data: {
              name: product.name,
              // images: [product.defaultImage.url],
            },
            unit_amount: product.itemPrice * 100,
          },
          quantity:product.quantity
        };
      }),
      discounts:couponExisted? [{coupon:couponExisted.id}]:[]
    });
    return res.json({success:true,results:{url:session.url}})
  }

  // responce
  return res.json({ success: true, results: order });
};

// cancel order

export const cancelOrder = async (req, res, next) => {
  // check order
  const order = await Order.findById(req.params.id);
  if (!order) return next(new Error('invalid order id'));

  // check owner
  if (req.user._id.toString() !== order.user.toString())
    return next(new Error('this is not your order '));

  // check order status
  if (
    order.status == 'deliverd' ||
    order.status == 'shipped' ||
    order.status == 'canceld'
  )
    return next(
      new Error(`can't cancel your order after being ${order.status} `)
    );

  // cancel order
  order.status = 'canceld';
  await order.save();
  // update stock
  updateStock(order.products, false);
  // responce
  res.json({ success: true, message: 'order canceled successfully!' });
};
