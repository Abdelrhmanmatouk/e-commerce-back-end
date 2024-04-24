import slugify from 'slugify';
import { SubCategory } from '../../../DB/models/subcategory.model.js';
import cloudinary from '../../utils/cloud.js';
import { Category } from '../../../DB/models/category.model.js';

export const createSubCategory = async (req, res, next) => {
  // check file
  if (!req.file)
    return next(new Error('subcategory image is required'), { cause: 400 });
  // upload image to cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FILE_NAME}/subcategory`,
    }
  );
  // save subcategory to DB
  await SubCategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user.id,
    image: { id: public_id, url: secure_url },
    category: req.params.categoryId,
  });
  // response
  return res.json({
    success: true,
    message: 'subcategory created successfully !',
  });
};
export const updateSubcategory = async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error('category not found', { cause: 404 }));
  // check subcategory
  const subcategory = await SubCategory.findOne({
    _id: req.params.id,
    category: req.params.categoryId,
  });
  if (!subcategory)
    return next(new Error('subcategory not found', { cause: 404 }));
  // check owner
  if (subcategory.createdBy.toString() !== req.user.id.toString())
    return next(new Error('you cannot update this subcategory'));
  // upload image
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: subcategory.image.id }
    );
    subcategory.image = { id: public_id, url: secure_url };
  }
  //   update name
  subcategory.name = req.body.name ? req.body.name : subcategory.name;
  subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;
  await subcategory.save();
  //   response
  return res.json({
    success: true,
    message: 'subcategory update successfully!!',
  });
};
export const deletesubcategory = async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new Error('category not found', { cause: 404 }));
  // check subcategory
  const subcategory = await SubCategory.findOne({
    _id: req.params.id,
    category: req.params.categoryId,
  });
  if (!subcategory)
    return next(new Error('subcategory not found', { cause: 404 }));
  // check owner
  if (subcategory.createdBy.toString() !== req.user.id.toString())
    return next(new Error('you cannot delete this subcategory'));
  // delete category
  await SubCategory.findByIdAndDelete(req.params.id);
  // delete image from cloudinary
  await cloudinary.uploader.destroy(subcategory.image.id);
  //   response
  return res.json({
    success: true,
    message: 'subcategory deleted successfully',
  });
};

export const getAllsubcategories = async (req, res, next) => {
  if (req.params.categoryId) {
    // check category
    const category = await Category.findById(req.params.categoryId);
    if (!category) return next(new Error('category not found', { cause: 404 }));
    const results = await SubCategory.find({
      category: req.params.categoryId,
    }).populate('category');
    return res.json({ success: true, results });
  }
  const results = await SubCategory.find().populate([
    { path: 'category', select: 'name -_id' },
    {path:"createdBy",select:"-forgetCode"},
  ]);
  return res.json({ success: true, results });
};
