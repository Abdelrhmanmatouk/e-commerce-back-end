import{ Schema, Types, model } from 'mongoose';

const cartSchema = new Schema(
  {
    products: [
      {
        productId: { type: Types.ObjectId, ref: 'Product' },
        qauntity: { type: Number, default: 1 },
      }
    ],
    user: { type: Types.ObjectId, require: true, unique: true },
  },
  { timestamps: true }
);

export const Cart = model('Cart', cartSchema);
