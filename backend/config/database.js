const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not set");
        }

        console.log("🔄 Attempting MongoDB connection...");
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            retryWrites: true,
            w: "majority",
            maxPoolSize: 10,
            minPoolSize: 2,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error("Stack:", error.stack);
        console.error("Make sure MONGODB_URI is set in environment variables");
        console.warn("⚠️  App starting without MongoDB - some features may not work");
        return null;
    }
};

module.exports = connectDB;
