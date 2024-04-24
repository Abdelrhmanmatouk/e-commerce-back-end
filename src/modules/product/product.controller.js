import { Category } from './../../../DB/models/category.model.js';
import { Brand } from './../../../DB/models/brand.model.js';
import { SubCategory } from './../../../DB/models/subcategory.model.js';
import { Product } from './../../../DB/models/product.model.js';
import cloudinary from './../../utils/cloud.js';
import { nanoid } from 'nanoid';
import APIFeatures from '../../utils/apiFeatures.js';

// create product
export const createProduct = async (req, res, next) => {
  // check category
  const category = await Category.findById(req.body.category);
  if (!category) return next(new Error('category not found', { cause: 404 }));
  //   check brand
  const brand = await Brand.findById(req.body.brand);
  if (!brand) return next(new Error('brand not found', { cause: 404 }));
  //   check subcategory
  const subcategory = await SubCategory.findById(req.body.subcategory);
  if (!subcategory)
    return next(new Error('subcategory not found', { cause: 404 }));
  // create folder name
  const cloudFolder = nanoid();
  //   check files
  if (!req.files)
    return next(new Error('product images are reqiured ', { cause: 400 }));
  // upload images
  let images = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.CLOUD_FILE_NAME}/products/${cloudFolder}` }
    );
    images.push({ id: secure_url, id: public_id });
  }
  // upload main image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.CLOUD_FILE_NAME}/products/${cloudFolder}` }
  );
  // create product
  const product = await Product.create({
    ...req.body,
    images,
    createdBy: req.user._id,
    defualtImage: { id: public_id, url: secure_url },
    cloudFolder,
  });
  // responce
  res.status(200).json({
    success: true,
    message: 'product created successfully',
    results: product,
  });
};

// delete product

export const deleteProduct = async (req, res, next) => {
  // check product
  const product = await Product.findById(req.params.id);
  if (!product) return next(new Error('invalid product id', { cause: 404 }));
  // check owner
  if (req.user._id.toString() !== product.createdBy.toString())
    return next(new Error('you are not authorzed', { cause: 403 }));
  // delete images
  const ids = product.images.map((image) => image.id);
  ids.push(product.defualtImage.id);
  await cloudinary.api.delete_resources(ids);
  // delete folder
  await cloudinary.api.delete_folder(
    `${process.env.CLOUD_FILE_NAME}/products/${product.cloudFolder}`
  );
  // delete product
  await product.deleteOne();
  // responce
  return res.json({ success: true, message: 'product deleted successfully!' });
};

// get products

export const getProducts = async (req, res, next) => {
  const { keyword, category, brand, subcategory } = req.query;

  if (category && !(await Category.findById(category)))
    return next(new Error('category not found', { cause: 404 }));

  if (brand && !(await Brand.findById(brand)))
    return next(new Error('brand not found', { cause: 404 }));

  if (subcategory && !(await SubCategory.findById(subcategory)))
    return next(new Error('subcategory not found', { cause: 404 }));

  // const products = await Product.find({ ...req.query })
  //   .sort(sort)
  //   .paginate(page)
  //   .search(keyword);

  const features = new APIFeatures(Product.find(), req.query)
  .filter()
  .sort()
  .limitfields()
  .paginate();


  const products = await features.query.search(keyword);

  return res.status(200).json({ success: true, results: products });
};
