import { Schema, Types, model } from 'mongoose';

const productSchema = new Schema(
  {
    name: { type: String, require: true, min: 2, max: 20 },
    description: { type: String, require: true, min: 10, max: 200 },
    images: [
      {
        id: { type: String, require: true },
        url: { type: String, require: true },
      },
    ],
    defualtImage: {
      id: { type: String, require: true },
      url: { type: String, require: true },
    },
    availableItems: { type: Number, min: 1, require: true },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, require: true, min: 1 },
    discount: { type: Number, min: 1, max: 100 },
    createdBy: { type: Types.ObjectId, ref: 'User', require: true },
    category: { type: Types.ObjectId, ref: 'Category', require: true },
    subcategory: { type: Types.ObjectId, ref: 'Subcategory', require: true },
    brand: { type: Types.ObjectId, ref: 'Brand', require: true },
    cloudFolder: { type: String, unique: true, require: true },
    averageRate: { type: Number, min: 1, max: 5 },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('review', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId',
});

// virtuals

productSchema.virtual('finalPrice').get(function () {
  return Number.parseFloat(
    this.price - (this.price * this.discount || 0) / 100
  ).toFixed(2);
});

productSchema.query.search = function (keyword) {
  if (keyword) {
    return this.find({ name: { $regex: keyword, $options: 'i' } });
  }
};

productSchema.methods.inStock = function (requiredQuantity) {
  return this.availableItems >= requiredQuantity ? true : false;
};

export const Product = model('Product', productSchema);
