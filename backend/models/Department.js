const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a department name"],
            trim: true,
            unique: true,
        },
        shortName: {
            type: String,
            required: [true, "Please provide a department short name"],
            trim: true,
            unique: true,
            uppercase: true,
        },
        isActive: {
            type: Boolean,
            default: true,
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

module.exports = mongoose.model("Department", departmentSchema);
