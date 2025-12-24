const jwt = require("jsonwebtoken");

// Verify JWT token
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token",
            error: error.message,
        });
    }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.userRole !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }
    next();
};

// Check if user is scorer or admin
const isScorer = (req, res, next) => {
    if (!["admin", "scorer"].includes(req.userRole)) {
        return res.status(403).json({
            success: false,
            message: "Scorer access required",
        });
    }
    next();
};

module.exports = {
    verifyToken,
    isAdmin,
    isScorer,
};
