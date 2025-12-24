const express = require("express");
const router = express.Router();
const {
    getAllScores,
    getScoreById,
    createScore,
    updateScore,
    deleteScore,
} = require("../controllers/scoreController");

// Get all scores
router.route("/").get(getAllScores);

// Create new score
router.route("/").post(createScore);

// Get, update, delete single score
router.route("/:id").get(getScoreById);
router.route("/:id").put(updateScore);
router.route("/:id").delete(deleteScore);

module.exports = router;
