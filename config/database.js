import mongoose from "mongoose";

const MONGO_URL = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected):")
    );
    await mongoose.connect(`${MONGO_URL}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
