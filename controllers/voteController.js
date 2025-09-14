import Party from "../models/PartModel.js";

//**************GET RESULT*************************
export const getVoteResults = async (req, res) => {
  try {
    const results = await Party.aggregate([
      {
        // Group by party + position
        $group: {
          _id: { party: "$name", position: "$position" },
          totalVotes: { $sum: "$voteCount" }
        }
      },
      {
        // Group by party to create positions array
        $group: {
          _id: "$_id.party",
          positions: {
            $push: {
              position: "$_id.position",
              totalVotes: "$totalVotes"
            }
          }
        }
      },
      {
        // Final clean output
        $project: {
          _id: 0,
          party: "$_id",
          positions: 1
        }
      }
    ]);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vote results", error });
  }
};



//AVAILABLE PARTY LIST
export const getAllParties = async (req, res) => {
  try {
    // Method 1: Simple approach using regular find
    const allParties = await Party.find({})
      .select('name sign')
      .lean(); // Use lean for better performance

    // Remove duplicates manually (more reliable than aggregation)
    const uniqueParties = [];
    const seenNames = new Set();

    for (const party of allParties) {
      if (!seenNames.has(party.name)) {
        seenNames.add(party.name);
        uniqueParties.push({
          name: party.name,
          sign: party.sign
        });
      }
    }

    res.status(200).json({
      success: true,
      total: uniqueParties.length,
      parties: uniqueParties
    });
  } catch (error) {
    console.error("Error fetching parties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch parties",
      error: error.message
    });
  }
};

// Alternative Method (if you want to stick with aggregation)
export const getAllPartiesWithAggregation = async (req, res) => {
  try {
    const parties = await Party.aggregate([
      {
        $group: {
          _id: "$name",
          sign: { $first: "$sign" }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          sign: 1
        }
      }
    ]).allowDiskUse(true); // Add this option for large datasets

    res.status(200).json({
      success: true,
      total: parties.length,
      parties
    });
  } catch (error) {
    console.error("Error fetching parties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch parties",
      error: error.message
    });
  }
};
