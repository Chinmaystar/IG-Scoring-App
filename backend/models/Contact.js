const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
            maxlength: [50, "Name cannot be more than 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
            unique: true,
        },
        phone: {
            type: String,
            match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
        },
        message: {
            type: String,
            required: [true, "Please provide a message"],
            maxlength: [500, "Message cannot be more than 500 characters"],
        },
        subject: {
            type: String,
            trim: true,
            maxlength: [100, "Subject cannot be more than 100 characters"],
        },
        status: {
            type: String,
            enum: ["new", "in-progress", "resolved"],
            default: "new",
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

module.exports = mongoose.model("Contact", contactSchema);
