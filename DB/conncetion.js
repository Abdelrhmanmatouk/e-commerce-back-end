import mongoose from "mongoose";

export const connectDB = async () => {
  return await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => console.log("DB conncted successfully !"))
    .catch(() => console.log("failed to connect to DB"));
};
