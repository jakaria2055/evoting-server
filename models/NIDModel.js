import mongoose from "mongoose";

const nidSchema = new mongoose.Schema({
  nidNumber: { type: String, required: true, unique: true },
  name: { type: String }, // Optional: keep real name for reference
  createdAt: { type: Date, default: Date.now },
});

const NIDModel = mongoose.model("nIDs", nidSchema);

export default NIDModel;


