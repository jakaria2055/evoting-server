import mongoose from "mongoose";

const partySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sign: { type: String }, // store image URL
    positions: [{ 
      type: String, 
      enum: ["Member", "Chairman", "MP", "VP", "GS", "AGS"] 
    }], // Array of positions this party has
    voteCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Party = mongoose.model("parties", partySchema);

export default Party;