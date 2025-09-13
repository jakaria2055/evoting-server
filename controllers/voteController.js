import Party from "../models/PartModel.js";


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
