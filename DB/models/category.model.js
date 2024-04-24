import { Schema, Types, model } from 'mongoose';
import { SubCategory } from './subcategory.model.js';

const categorySchema = new Schema(
  {
    name: { type: String, require: true, unique: true, min: 3, max: 20 },
    slug: { type: String, require: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: 'User', require: true },
    image: { id: { type: String }, url: { type: String } },
    brands: [{ type: Types.ObjectId, ref: 'Brand' }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.post(
  'deleteOne',
  { document: true, query: false },
  async function () {
    await SubCategory.deleteMany({ category: this._id });
  }
);

categorySchema.virtual('subcategory', {
  ref: 'SubCategory',
  localField: '_id',
  foreignField: 'category',
});

export const Category = model('Category', categorySchema);
