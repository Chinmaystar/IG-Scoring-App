const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} = require("../controllers/userController");

// Get all users
router.route("/").get(getAllUsers);

// Create new user
router.route("/").post(createUser);

// Get, update, delete single user
router.route("/:id").get(getUserById);
router.route("/:id").put(updateUser);
router.route("/:id").delete(deleteUser);

module.exports = router;
