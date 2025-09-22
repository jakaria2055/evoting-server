import { generateUserTokens } from "../config/helper.js";
import NIDModel from "../models/NIDModel.js";
import Party from "../models/PartModel.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import Vote from "../models/VoteModel.js";
import { sendNIDtoAdminEmail } from "../config/nidNodemialer.js";

//******************REGISTER USER*********************
export const registerUser = async (req, res) => {
  try {
    const { nid, email, password, name } = req.body;

    // Check if the NID is valid
    const validNid = await NIDModel.findOne({ nidNumber: nid });
    if (!validNid) {
      return res.status(400).json({
        success: false,
        message: "Invalid NID! You are not eligible to register.",
      });
    }

    // Check if user already registered
    const existingUser = await User.findOne({ $or: [{ nid }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this NID or Email already exists.",
      });
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

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error while registering user" });
  }
};

//***************LOGIN USER***************************
export const loginUser = async (req, res) => {
  try {
    const { nid, password } = req.body;
    const user = await User.findOne({ nid });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "USER not Found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credential" });
    }

    const { usertoken } = generateUserTokens(user?._id);

    res.cookie("usertoken", usertoken, {
      httpOnly: false,
      secure: true,
      sameSite: "Strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, usertoken, message: "User login success." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//****************LOGOUT USER*************************
export const userLogout = async (req, res) => {
  try {
    const userId = req.user?._id;
    const usertoken = req.cookies.usertoken;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { refreshtokens: { token: usertoken } } },
      { new: true }
    );

    res.clearCookie("usertoken");

    return res.status(200).json({
      success: true,
      message: "User logged out successfully!",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//****************GET ALL PARTY*********************************
export const getParty = async (req, res) => {
  try {
    const party = await Party.find();

    if (!party) {
      return res.status(400).json({
        success: false,
        message: `No Party Found!!!`,
      });
    }

    res.status(200).json({
      success: true,
      message: "All Parties are founded.",
      data: party,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//****************SUBMIT VOTE ********************
export const submitVote = async (req, res) => {
  try {
    const partyId = req.params.id;
    const position = req.params.position;
    const userId = req.user._id;

    // Find and validate party
    const party = await Party.findById(partyId);
    if (!party) {
      return res.status(404).json({
        success: false,
        message: "Party not found",
      });
    }

    // Check if party has this position
    if (party.position !== position) {
      return res.status(400).json({
        success: false,
        message: `This party doesn't have the position: ${position}`,
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user already voted for this position
    if (user.votedPositions.includes(position)) {
      return res.status(400).json({
        success: false,
        message: `You already voted for ${position}`,
      });
    }

    // Check if vote already exists (double prevention)
    const existingVote = await Vote.findOne({ userId, position });
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: `You already voted for ${position}`,
      });
    }

    // Create vote record
    const vote = new Vote({ userId, partyId, position });
    await vote.save();

    // Increment party vote count
    await Party.findByIdAndUpdate(partyId, { $inc: { voteCount: 1 } });

    // Update user status - add the position to voted positions
    user.votedPositions.push(position);
    await user.save();

    res.status(201).json({
      success: true,
      message: `Vote submitted successfully for ${position}!`,
      vote: {
        partyName: party.name,
        position,
        votedAt: vote.createdAt,
      },
    });
  } catch (error) {
    console.error("Vote submission error:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting vote",
      error: error.message,
    });
  }
};

//***************GET PARTY LIST************************
// Get all unique party names
export const getPartiesByPosition = async (req, res) => {
  try {
    const { position } = req.params;

    // Allowed positions for validation
    const validPositions = ["AGS", "Chairman", "GS", "Member", "VP"];

    // Validate the position
    if (!validPositions.includes(position)) {
      return res.status(400).json({
        success: false,
        message: `Invalid position '${position}'. Valid positions are: ${validPositions.join(
          ", "
        )}`,
      });
    }

    // Find all parties with this position
    const parties = await Party.find({ position });

    if (parties.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No parties found for position: ${position}`,
      });
    }

    res.status(200).json({
      success: true,
      total: parties.length,
      position,
      parties,
    });
  } catch (error) {
    console.error("Error fetching parties by position:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch parties by position.",
    });
  }
};

//******************REGISTER NID******************
export const registerNID = async (req, res) => {
  try {
    const { email, nidNumber, name } = req.body;

    if (!email || !nidNumber || !name) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All credential are required are required",
        });
    }

    const existingNID = await NIDModel.findOne({ nidNumber });

    if (existingNID) {
      return res
        .status(400)
        .json({
          success: false,
          message: "This NID Number Already registered",
        });
    }

    await sendNIDtoAdminEmail(email, nidNumber, name);
    res.json({
      success: true,
      message: "NID register request sent successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
