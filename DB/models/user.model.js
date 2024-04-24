
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    require: true,
  },
  isConfirmed: { type: Boolean, default: false },
  gender: { type: String, enum: ["male", "female"] },
  phone: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "seller",'admin'],
    default: "user",
  },
  forgetCode: {
    type: String,
  },
  profileImage: {
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/dlhhtfzqc/image/upload/v1706723809/e-commerce/users/defualts/profile%20pic/R_csxgzc.jpg",
    },
    id: {
      type: String,
      default: "e-commerce/users/defualts/profile%20pic/R_csxgzc",
    },
  },
  coverImage:[{url:{type:String},id:{type:String}}]
},{timestamps:true});
export const User = model('User',userSchema)
