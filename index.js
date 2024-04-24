import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './DB/conncetion.js';
import authRouter from './src/modules/auth/auth.router.js';
import categoryRouter from './src/modules/category/category.router.js';
import subcategoryRouter from './src/modules/subcategory/subcategory.router.js';
import brandRouter from './src/modules/brand/brand.router.js';
import couponRouter from './src/modules/coupon/coupon.router.js';
import productRouter from './src/modules/product/product.router.js';
import cartRouter from './src/modules/cart/cart.router.js';
import orderRouter from './src/modules/order/order.router.js';
import cors from 'cors'


dotenv.config();
const app = express();
const port = process.env.PORT;

// connect to DB
await connectDB();

// cros

// const whiteList = ['http://127.0.0.1:5500'];

// app.use((req, res, next) => {
//   if (req.originalUrl.includes('/auth/activate_account/')) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET');
//     return next();
//   }

//   if (!whiteList.includes(req.header('origin'))) {
//     return next(new Error('blocked by cors'));
//   }
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', '*');
//   res.setHeader('Access-Control-Allow-Methods', '*');
//   res.setHeader('Access-Control-Private-Network', true);
//   return next();
// });

app.use(cors())

// parsing
app.use(express.json());

// routers
app.use('/auth', authRouter);
app.use('/category', categoryRouter);
app.use('/subcategory', subcategoryRouter);
app.use('/brand', brandRouter);
app.use('/coupon', couponRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);

// page not found
app.all('*', (req, res, next) => {
  return next(new Error('page not found', { cause: 404 }));
});
// global error handler
app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
});

app.listen(port, () => console.log(`App is listening on port ${port}!`));
