import jwt from "jsonwebtoken";

export const verifyOTP = (otp, user) => {
  const isMatch = user.otp === otp;
  const notExpired = user.otp && user.otpExpires > new Date();
  return isMatch && notExpired;
};

export const generateTokens = (adminId) => {
  const accesstoken = jwt.sign({ adminId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { accesstoken };
};

export const generateUserTokens = (userId) => {
  const usertoken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return { usertoken };
};