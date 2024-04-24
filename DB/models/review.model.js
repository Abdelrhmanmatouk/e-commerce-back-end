import { Schema, Types, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    rating: { type: Number, require: true, min: 1, max: 5 },
    comment: { type: String, require: true },
    createdBy: { type: Types.ObjectId, ref: 'User' },
    productId: { type: Types.ObjectId, ref: 'Product' },
    orderId: { type: Types.ObjectId, ref: 'Order', require: true },
  },
  { timestamps: true }
);

export const Review = model('Review', reviewSchema);
