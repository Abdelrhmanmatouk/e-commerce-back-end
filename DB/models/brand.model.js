
import { Schema, Types, model } from 'mongoose';

const brandSchema = new Schema(
  {
    name: { type: String, require: true, unique: true },
    slug: { type: String, require: true, unique: true },
    image: {
      url: { type: String, require: true },
      id: { type: String, require: true },
    },
    createdBy: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
export const Brand = model('Brand', brandSchema);
