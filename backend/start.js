#!/usr/bin/env node

console.log("🔄 Starting VNIT IG Scoring App...");
console.log("Process info:", {
    node: process.version,
    platform: process.platform,
    cwd: process.cwd(),
});

// Catch all uncaught exceptions before starting
process.on("uncaughtException", (err) => {
    console.error("❌ UNCAUGHT EXCEPTION:", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ UNHANDLED REJECTION:", reason);
    process.exit(1);
});

// Load environment variables
require("dotenv").config();

console.log("✅ Environment loaded");
console.log("Environment variables check:");
console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  - PORT: ${process.env.PORT || "not set (will use 5000)"}`);
console.log(`  - MONGODB_URI: ${process.env.MONGODB_URI ? "✅ Set" : "❌ NOT SET"}`);

// Now start the actual server
try {
    console.log("🔄 Loading server.js...");
    require("./server.js");
    console.log("✅ Server module loaded successfully");
} catch (err) {
    console.error("❌ Failed to load server:", err);
    console.error("Stack:", err.stack);
    process.exit(1);
}
