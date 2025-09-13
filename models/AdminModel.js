import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: String,
    otpExpires: Date,
    isVerified: {type:Boolean, default: false},
  },
  { timestamps: true }
);

const Admin = mongoose.model("admins", superAdminSchema);

export default Admin;
