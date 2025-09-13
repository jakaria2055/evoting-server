import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const userAuth = async (req, res, next) => {
  try {
    const userToken = req.cookies?.userToken || req.headers.userToken;

    if (!userToken) {
      return res
        .status(400)
        .json({ success: false, message: "Authorization failed." });
    }

    // Verify the JWT token
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);

    // Find admin by ID (using adminId from token)
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Authorization failed." });
    }


    req.user = user;
    next();
  } catch (error) {
    console.log("Error name:", error.name);

    return res
      .status(400)
      .json({ success: false, message: "Something went is wrong." });
  }
};
