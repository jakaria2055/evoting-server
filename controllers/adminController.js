import { generateTokens, verifyOTP } from "../config/helper.js";
import { sendOTPtoEmail } from "../config/nodemailer.js";
import Admin from "../models/AdminModel.js";
import bcrypt from "bcryptjs";


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
export const adminLogoutService = async (userId, accesstoken) => {
  await Admin.findByIdAndUpdate(
    userId,
    { $pull: { refreshtokens: { token: accesstoken } } },
    { new: true } // return updated document if needed
  );

  return { message: "User logged out successfully!" };
};

