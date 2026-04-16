import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(`Database Connected At: ${connectInstance.connection.host}`);
  } catch (error) {
    console.log(`Database Connection Error: ${error}`);
  }
};

export default connectDB;
