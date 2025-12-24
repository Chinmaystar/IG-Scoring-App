const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a sport name"],
            trim: true,
            unique: true,
        },
        code: {
            type: String,
            required: [true, "Please provide a sport code"],
            trim: true,
            unique: true,
            lowercase: true,
        },
        displayName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        maxPlayersPerTeam: {
            type: Number,
            default: 11,
        },
        scoringUnit: {
            type: String,
            default: "points",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        icon: {
            type: String,
            default: null,
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

module.exports = mongoose.model("Sport", sportSchema);
