import jwt from "jsonwebtoken";
import Admin from "../models/AdminModel.js";

export const adminAuth = async (req, res, next) => {
  try {
    const accesstoken = req.cookies?.accesstoken || req.headers.accesstoken;
    console.log("Access token received:", accesstoken ? "Token present" : "No token");

    if (!accesstoken) {
      return res
        .status(400)
        .json({ success: false, message: "Authorization failed." });
    }

    // Verify the JWT token
    const decoded = jwt.verify(accesstoken, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug log
    console.log("Looking for admin with ID:", decoded.adminId);

    // Find admin by ID (using adminId from token)
    const admin = await Admin.findById(decoded.adminId);
    console.log("Admin found:", admin ? "Yes" : "No");

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Authorization failed." });
    }

    if (!admin.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Please verify admin" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.log("Auth middleware error:", error.message);
    console.log("Error name:", error.name);
    
    return res
      .status(400)
      .json({ success: false, message: "Something went is wrong." });
  }
};