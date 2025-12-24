const Sport = require("../models/Sport");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all sports
// @route   GET /api/sports
// @access  Public
const getSports = asyncHandler(async (req, res) => {
    const sports = await Sport.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
        success: true,
        count: sports.length,
        data: sports,
    });
});

// @desc    Get single sport
// @route   GET /api/sports/:id
// @access  Public
const getSport = asyncHandler(async (req, res) => {
    const sport = await Sport.findById(req.params.id);

    if (!sport) {
        res.status(404);
        throw new Error("Sport not found");
    }

    res.status(200).json({
        success: true,
        data: sport,
    });
});

// @desc    Create new sport
// @route   POST /api/sports
// @access  Private (Admin only)
const createSport = asyncHandler(async (req, res) => {
    const sport = await Sport.create(req.body);

    res.status(201).json({
        success: true,
        data: sport,
    });
});

// @desc    Update sport
// @route   PUT /api/sports/:id
// @access  Private (Admin only)
const updateSport = asyncHandler(async (req, res) => {
    let sport = await Sport.findById(req.params.id);

    if (!sport) {
        res.status(404);
        throw new Error("Sport not found");
    }

    sport = await Sport.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: sport,
    });
});

// @desc    Delete sport
// @route   DELETE /api/sports/:id
// @access  Private (Admin only)
const deleteSport = asyncHandler(async (req, res) => {
    const sport = await Sport.findById(req.params.id);

    if (!sport) {
        res.status(404);
        throw new Error("Sport not found");
    }

    await sport.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});

module.exports = {
    getSports,
    getSport,
    createSport,
    updateSport,
    deleteSport,
};
