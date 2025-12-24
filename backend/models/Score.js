const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
    {
        event: {
            type: String,
            required: [true, "Please provide an event name"],
            enum: ["cricket", "football", "basketball", "tennis", "table-tennis"],
            trim: true,
        },
        team1: {
            name: {
                type: String,
                required: [true, "Please provide team 1 name"],
                trim: true,
            },
            score: {
                type: Number,
                required: true,
                default: 0,
            },
        },
        team2: {
            name: {
                type: String,
                required: [true, "Please provide team 2 name"],
                trim: true,
            },
            score: {
                type: Number,
                required: true,
                default: 0,
            },
        },
        winner: {
            type: String,
            enum: ["team1", "team2", "tie"],
            default: null,
        },
        status: {
            type: String,
            enum: ["scheduled", "live", "completed"],
            default: "scheduled",
        },
        scoredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        matchDate: {
            type: Date,
            required: true,
        },
        venue: {
            type: String,
            trim: true,
        },
        remarks: {
            type: String,
            maxlength: [500, "Remarks cannot be more than 500 characters"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);
