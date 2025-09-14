import mongoose from "mongoose";

const MONGO_URL = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    // Connection event listeners
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );
    
    mongoose.connection.on("error", (err) =>
      console.log("Database Connection Error:", err)
    );
    
    mongoose.connection.on("disconnected", () =>
      console.log("Database Disconnected")
    );

    // Connect with proper options for Vercel/production
    await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000,          // 45 seconds
      bufferMaxEntries: 0,             // Disable mongoose buffering
      maxPoolSize: 10,                 // Maximum connection pool size
      minPoolSize: 1,                  // Minimum connection pool size
      maxIdleTimeMS: 30000,           // Close connections after 30 seconds of inactivity
    });

    console.log("MongoDB connection established successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    // Don't exit in production, let Vercel handle it
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;