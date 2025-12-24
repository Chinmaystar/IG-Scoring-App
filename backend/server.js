const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

// Load environment variables
dotenv.config();

console.log("🔄 Starting VNIT IG App Server...");
console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);

// Connect to MongoDB
console.log("🔄 Connecting to MongoDB...");
connectDB()
    .then(() => {
        console.log("✅ MongoDB connection completed");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        // Continue anyway - app can work without DB for now
    });

const app = express();

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io with CORS and connection settings
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
    transports: ["websocket", "polling"],
    connectTimeout: 45000,
    pingInterval: 25000,
    pingTimeout: 60000,
    perMessageDeflate: false,
    allowUpgrades: true,
});

// Make io accessible to routes/controllers
app.set("io", io);

// Ultra-simple test route (Before any middleware)
app.get("/alive", (req, res) => {
    res.json({ status: "alive" });
});

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
    const clientBuildPath = path.join(__dirname, "../frontend/dist");
    app.use(express.static(clientBuildPath));
}

// Logging middleware (development only)
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// Socket.io connection handling with error management
io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("disconnect", (reason) => {
        console.log("❌ Client disconnected:", socket.id, `(${reason})`);
    });

    socket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error.message);
    });

    // Example: Real-time score updates
    socket.on("score-update", (data) => {
        console.log("📊 Score update received:", data);
        io.emit("score-updated", data);
    });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "Server is running",
        timestamp: new Date(),
        environment: process.env.NODE_ENV || "development",
    });
});

// API Routes
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/scores", scoreRoutes);

// Serve React app for all other routes (client-side routing)
if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`✓ Server running on port ${port}`);
    console.log(`📍 Base URL: ${process.env.API_URL || `http://localhost:${port}`}`);
    console.log(`🔌 Socket.io ready for connections`);
});