import multer, {diskStorage} from 'multer';

export const fileUplaod = () => {
  const fileFilter = (req, file, cb) => {
    // check mime type
    if (!['image/png','image/jpeg'].includes(file.mimetype))
      return cb(new Error('inavlid format'), false);
    return cb(null, true);
  };
  return multer({ storage: diskStorage({}), fileFilter });
};
