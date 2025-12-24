const asyncHandler = require("../middleware/asyncHandler");
const Score = require("../models/Score");
const User = require("../models/User");

//@desc Get all scores
//@route GET /api/scores
//@access public
const getAllScores = asyncHandler(async (req, res) => {
    const { event, status } = req.query;
    const filter = {};

    if (event) filter.event = event;
    if (status) filter.status = status;

    const scores = await Score.find(filter)
        .populate("scoredBy", "name email")
        .sort({ matchDate: -1 });

    res.status(200).json({
        success: true,
        count: scores.length,
        data: scores,
    });
});

//@desc Get score by ID
//@route GET /api/scores/:id
//@access public
const getScoreById = asyncHandler(async (req, res) => {
    const score = await Score.findById(req.params.id).populate("scoredBy", "name email");

    if (!score) {
        return res.status(404).json({
            success: false,
            message: "Score not found",
        });
    }

    res.status(200).json({
        success: true,
        data: score,
    });
});

//@desc Create new score
//@route POST /api/scores
//@access private
const createScore = asyncHandler(async (req, res) => {
    const { event, team1, team2, scoredBy, matchDate, venue, remarks } = req.body;

    // Validation
    if (!event || !team1 || !team2 || !scoredBy || !matchDate) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields",
        });
    }

    // Check if user exists
    const user = await User.findById(scoredBy);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Scorer user not found",
        });
    }

    // Determine winner
    let winner = null;
    if (team1.score > team2.score) winner = "team1";
    else if (team2.score > team1.score) winner = "team2";
    else if (team1.score === team2.score) winner = "tie";

    const score = new Score({
        event,
        team1,
        team2,
        winner,
        scoredBy,
        matchDate,
        venue,
        remarks,
        status: "completed",
    });

    const savedScore = await score.save();
    await savedScore.populate("scoredBy", "name email");

    res.status(201).json({
        success: true,
        message: "Score created successfully",
        data: savedScore,
    });
});

//@desc Update score
//@route PUT /api/scores/:id
//@access private
const updateScore = asyncHandler(async (req, res) => {
    const { team1, team2, status, remarks } = req.body;

    const score = await Score.findById(req.params.id);
    if (!score) {
        return res.status(404).json({
            success: false,
            message: "Score not found",
        });
    }

    // Update fields
    if (team1) score.team1 = { ...score.team1, ...team1 };
    if (team2) score.team2 = { ...score.team2, ...team2 };
    if (status) score.status = status;
    if (remarks) score.remarks = remarks;

    // Determine winner
    if (team1 || team2) {
        const t1Score = team1?.score || score.team1.score;
        const t2Score = team2?.score || score.team2.score;

        if (t1Score > t2Score) score.winner = "team1";
        else if (t2Score > t1Score) score.winner = "team2";
        else if (t1Score === t2Score) score.winner = "tie";
    }

    score.updatedAt = Date.now();
    const updatedScore = await score.save();
    await updatedScore.populate("scoredBy", "name email");

    res.status(200).json({
        success: true,
        message: "Score updated successfully",
        data: updatedScore,
    });
});

//@desc Delete score
//@route DELETE /api/scores/:id
//@access private/admin
const deleteScore = asyncHandler(async (req, res) => {
    const score = await Score.findByIdAndDelete(req.params.id);

    if (!score) {
        return res.status(404).json({
            success: false,
            message: "Score not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Score deleted successfully",
        data: {},
    });
});

module.exports = {
    getAllScores,
    getScoreById,
    createScore,
    updateScore,
    deleteScore,
};
