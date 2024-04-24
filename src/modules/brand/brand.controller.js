import slugify from 'slugify';
import { Brand } from '../../../DB/models/brand.model.js';
import { Category } from '../../../DB/models/category.model.js';
import cloudinary from '../../utils/cloud.js';

export const createBrand = async (req, res, next) => {
  // check categories
  const { categories, name } = req.body;
  categories.forEach(async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category)
      return next(new Error(`category ${categoryId} not found`), {
        cause: 404,
      });
  });
  // check file
  if (!req.file)
    return next(new Error('brand image is required', { cause: 400 }));

  // upload image to cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FILE_NAME}/brand`,
    }
  );

  //   save brand
  const brand = await Brand.create({
    name,
    createdBy: req.user._id,
    slug: slugify(name),
    image: { url: secure_url, id: public_id },
  });
  //   save brand in each categories
  categories.forEach(async (categoryId) => {
    const category = await Category.findById(categoryId);
    category.brands.push(brand._id);
    await category.save();
  });

  //   return response
  return res.json({ success: true, message: 'brand created successfully!' });
};

export const updateBrand = async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) return next(new Error('brand not found', { cause: 404 }));
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      brand.image.id
    );
    brand.image = { url: secure_url, id: public_id };
  }
  brand.name = req.body.name ? req.body.name : brand.name;
  brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;
  await brand.save();
  return res.json({ success: true, message: 'brand updated successfully!' });
};

export const deleteBrand = async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) return next(new Error('brand not found', { cause: 404 }));
  //   delete brand image
  await cloudinary.uploader.destroy(brand.image.id);
  //   delete brand from all categories
  await Category.updateMany({}, { $pull: { brands: brand._id } });
  //   send response
  return res.json({ success: true, message: 'brand deleted successfully!' });
};

export const getAllBrands = async (req, res, next) => {
  const brands = await Brand.find();
  return res.json({ success: true, results: brands });
};
