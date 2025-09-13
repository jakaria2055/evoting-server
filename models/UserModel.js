import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    votedPositions: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

export default User;
