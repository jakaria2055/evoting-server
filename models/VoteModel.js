import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    partyId: { type: mongoose.Schema.Types.ObjectId, ref: "parties" },
    position: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Vote = mongoose.model("votes", voteSchema);

export default Vote;
