import NIDModel from "../models/NIDModel.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { nid, email, password, name } = req.body;

    // Check if the NID is valid
    const validNid = await NIDModel.findOne({ nidNumber: nid });
    if (!validNid) {
      return res.status(400).json({ success:false, message: "Invalid NID! You are not eligible to register." });
    }

    // Check if user already registered
    const existingUser = await User.findOne({ $or: [{ nid }, { email }] });
    if (existingUser) {
      return res.status(400).json({success:false, message: "User with this NID or Email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      nid,
      email,
      password: hashedPassword,
      name,
      votedPositions: [],
    });

    await newUser.save();

    res.status(201).json({success:true, message: "Registration successful", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: "Server error while registering user" });
  }
};
