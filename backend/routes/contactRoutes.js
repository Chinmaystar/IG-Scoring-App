const express = require("express");
const router = express.Router();
const {
    getContact,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
} = require("../controllers/contactController");

// Get all contacts
router.route("/").get(getContact);

// Create new contact
router.route("/").post(createContact);

// Get, update, delete single contact
router.route("/:id").get(getContactById);
router.route("/:id").put(updateContact);
router.route("/:id").delete(deleteContact);

module.exports = router;

module.exports=router;