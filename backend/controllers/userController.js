const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

//@desc Get all users
//@route GET /api/users
//@access private/admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        count: users.length,
        data: users,
    });
});

//@desc Get user by ID
//@route GET /api/users/:id
//@access private
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    res.status(200).json({
        success: true,
        data: user,
    });
});

//@desc Create new user
//@route POST /api/users
//@access public
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide name, email, and password",
        });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "User with this email already exists",
        });
    }

    const user = new User({
        name,
        email,
        password,
        phone,
        role: role || "participant",
    });

    const savedUser = await user.save();

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
        },
    });
});

//@desc Update user
//@route PUT /api/users/:id
//@access private
const updateUser = asyncHandler(async (req, res) => {
    const { name, email, phone, role, isActive, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name,
            email,
            phone,
            role,
            isActive,
            profileImage,
            updatedAt: Date.now(),
        },
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
    });
});

//@desc Delete user
//@route DELETE /api/users/:id
//@access private/admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: {},
    });
});

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
