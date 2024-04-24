import { Types } from "mongoose";

export const isValidobjectId = (value,helper)=>{
  if(Types.ObjectId.isValid(value)) return true
  return helper.message('invalid id !!')
}



export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };

    const validationResult = schema.validate(data, { abortEarly: false });
    
    if (validationResult.error) {
      const errorMessages = validationResult.error.details.map((errorObj) => {
        return errorObj.message;
      });
      return next(new Error(errorMessages))
    }
    return next()
  };
};
