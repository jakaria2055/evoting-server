import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import router from "./routes/api.js";

const app = express();

//MIDDLEWARE
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for production
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Set your frontend URL in env
  credentials: true
}));

// Health check route
app.get("/", (req, res) => res.send("API is Working Fine"));

// Database health check
app.get("/health", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    res.json({
      status: 'OK',
      database: dbStatus === 1 ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      error: error.message
    });
  }
});

app.use('/api/v1', router);

// Connect to database
connectDB();

const PORT = process.env.PORT || 3000;

// For Vercel, we need to export the app
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
}