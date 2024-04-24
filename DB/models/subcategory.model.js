import { Schema, Types, model } from 'mongoose';

const subCategorySchema = new Schema(
  {
    name: { type: String, require: true, unique: true, min: 3, max: 20 },
    slug: { type: String, require: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: 'User' ,require:true},
    image: { id: { type: String }, url: { type: String } },
    category:{ type: Types.ObjectId, ref: 'Category' ,require:true},
    brands:[{type:Types.ObjectId,ref:"Brand"}]
  },
  { timestamps: true }
);

export const SubCategory = model('SubCategory', subCategorySchema);
