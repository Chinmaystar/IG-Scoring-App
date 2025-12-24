const Department = require("../models/Department");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = asyncHandler(async (req, res) => {
    const departments = await Department.find({ isActive: true }).sort({ shortName: 1 });

    res.status(200).json({
        success: true,
        count: departments.length,
        data: departments,
    });
});

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
const getDepartment = asyncHandler(async (req, res) => {
    const department = await Department.findById(req.params.id);

    if (!department) {
        res.status(404);
        throw new Error("Department not found");
    }

    res.status(200).json({
        success: true,
        data: department,
    });
});

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin only)
const createDepartment = asyncHandler(async (req, res) => {
    const department = await Department.create(req.body);

    res.status(201).json({
        success: true,
        data: department,
    });
});

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin only)
const updateDepartment = asyncHandler(async (req, res) => {
    let department = await Department.findById(req.params.id);

    if (!department) {
        res.status(404);
        throw new Error("Department not found");
    }

    department = await Department.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: department,
    });
});

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin only)
const deleteDepartment = asyncHandler(async (req, res) => {
    const department = await Department.findById(req.params.id);

    if (!department) {
        res.status(404);
        throw new Error("Department not found");
    }

    await department.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});

module.exports = {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
};
