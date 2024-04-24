import slugify from 'slugify';
import { Category } from '../../../DB/models/category.model.js';
import cloudinary from './../../utils/cloud.js';

export const createCategory = async (req, res, next) => {
  // check file
  if (!req.file)
    return next(new Error('category image is required'), { cause: 400 });
  // upload image to cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FILE_NAME}/category`,
    }
  );
  // save category to DB
  await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user.id,
    image: { id: public_id, url: secure_url },
  });
  // response
  return res.json({
    success: true,
    message: 'category created successfully !',
  });
};

export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  // check category
  const category = await Category.findById(id);
  if (!category) return next(new Error('category not found', { cause: 404 }));
  // check owner
  if (category.createdBy.toString() !== req.user.id.toString())
    return next(new Error('you cannot update this category'));
  // upload image
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: category.image.id }
    );
    category.image = { id: public_id, url: secure_url };
  }
  //   update name
  category.name = req.body.name ? req.body.name : category.name;
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;
  await category.save();
  //   response
  return res.json({ success: true, message: 'category update successfully!!' });
};

export const deleteCategory = async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.id);
  if (!category) return next(new Error('category not found', { cause: 404 }));
  // check owner
  if (category.createdBy.toString() !== req.user.id.toString())
    return next(new Error('you cannot delete this category'));
  // delete category
  await category.deleteOne()
  // delete image from cloudinary
  await cloudinary.uploader.destroy(category.image.id);
  //   response
  return res.json({ success: true, message: 'category deleted successfully' });
};

export const getAllCategories = async (req, res, next) => {
  const results = await Category.find().populate(["subcategory",'brands']);
  return res.json({ success: true, results });
};
