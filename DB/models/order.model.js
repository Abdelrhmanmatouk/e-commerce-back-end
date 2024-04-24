import { Schema, Types, model } from 'mongoose';

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', require: true },
    products: [
      {
        productId: { type: Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, min: 1 },
        name: String,
        itemPrice: Number,
        totalPrice: Number,
        description:String
      },
    ],
    address: { type: String, require: true },
    payment: { type: String, default: 'cash', enum: ['cash', 'visa'] },
    phone: { type: Number, require: true },
    price: { type: Number, require: true },
    invoice: { url: String, id: String },
    coupon: {
      id: { type: Types.ObjectId, ref: 'Coupon' },
      name: String,
      discount: { type: Number, min: 1, max: 100 },
    },
    status: {
      type: String,
      enum: ['placed', 'shipped', 'deliverd', 'canceld', 'refunded'],
      default: 'placed',
    },
  },
  { timestamps: true ,toJSON: { virtuals: true },
  toObject: { virtuals: true },}
);

orderSchema.virtual('finalPrice').get(function () {
  return this.coupon
    ? Number.parseFloat(
        this.price - (this.price * this.coupon.discount) / 100
      ).toFixed(2)
    : this.price;
});

export const Order = model('Order', orderSchema);
