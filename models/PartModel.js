import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sign: { type: String },
    position: { type: String, enum: ["Member", "Chairman", "VP", "GS", "AGS"] },
    voteCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Party = mongoose.model("parties", partySchema);

export default Party;
