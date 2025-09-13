import { generateTokens, verifyOTP } from "../config/helper.js";
import { sendOTPtoEmail } from "../config/nodemailer.js";
import Admin from "../models/AdminModel.js";
import bcrypt from "bcryptjs";
import NIDModel from "../models/NIDModel.js";
import Party from "../models/PartModel.js";

//REGISTER ADMIN
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email & Pass are required" });
    }

    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await newAdmin.save();
    await sendOTPtoEmail(email, otp);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//VERIFY ADMIN
export const verifyAdmin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not Found!" });
    }

    if (!verifyOTP(otp, admin)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or OTP Expired." });
    }

    admin.otp = undefined;
    admin.otpExpires = undefined;
    admin.isVerified = true;

    const { accesstoken } = generateTokens(admin?._id);

    res.cookie("accesstoken", accesstoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    await admin.save();

    return res
      .status(200)
      .json({ success: true, accesstoken, message: "verified user." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not Found!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credential" });
    }

    if (!admin.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Please Verify your email." });
    }

    const { accesstoken } = generateTokens(admin?._id);

    res.cookie("accesstoken", accesstoken, {
      httpOnly: false,
      secure: true,
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, accesstoken, message: "Admin login success." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//LOGOUT ADMIN
export const adminLogoutService = async (req, res) => {
  try {
    const adminId = req.admin?._id; // Assuming you have middleware that sets req.user
    const accesstoken = req.cookies.accesstoken;

    if (!adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await Admin.findByIdAndUpdate(
      adminId,
      { $pull: { refreshtokens: { token: accesstoken } } },
      { new: true }
    );

    res.clearCookie("accesstoken");

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully!",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//ADD NID USER
// controllers/nidController.js
export const addNid = async (req, res) => {
  try {
    const { nidNumber, name } = req.body;

    // Check if NID already exists
    const existing = await NIDModel.findOne({ nidNumber });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "This NID is already registered." });
    }

    const newNid = new NIDModel({ nidNumber, name });
    await newNid.save();

    res
      .status(201)
      .json({ success: true, message: "NID added successfully", data: newNid });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error while adding NID" });
  }
};

//ADD PARTY INFORMATION
// controllers/partyController.js
export const addParties = async (req, res) => {
   try {
    const { name, sign, positions } = req.body;

    if (!name || !positions || positions.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Name and at least one position are required.",
        });
    }

    // Validate positions
    const validPositions = ["Member", "Chairman", "MP", "VP", "GS", "AGS"];
    const invalidPositions = positions.filter(pos => !validPositions.includes(pos));
    
    if (invalidPositions.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Invalid positions: ${invalidPositions.join(", ")}. Valid positions are: ${validPositions.join(", ")}`,
        });
    }

    // Remove duplicate positions
    const uniquePositions = [...new Set(positions)];

    // Create single party record with multiple positions
    const party = await Party.create({ 
      name, 
      sign, 
      positions: uniquePositions 
    });

    res.status(201).json({
      success: true,
      message: "Party created successfully",
      party,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating party",
        error: error.message,
      });
  }
};
