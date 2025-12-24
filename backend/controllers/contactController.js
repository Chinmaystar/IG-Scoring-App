const asyncHandler = require("../middleware/asyncHandler");
const Contact = require("../models/Contact");

//@desc Get all contacts
//@route GET /api/contacts
//@access public
const getContact = asyncHandler(async (req, res) => {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        count: contacts.length,
        data: contacts,
    });
});

//@desc Get single contact
//@route GET /api/contacts/:id
//@access public
const getContactById = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        return res.status(404).json({
            success: false,
            message: "Contact not found",
        });
    }
    res.status(200).json({
        success: true,
        data: contact,
    });
});

//@desc Create New contacts
//@route POST /api/contacts
//@access public
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone, message, subject } = req.body;

    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields (name, email, message)",
        });
    }

    const contact = new Contact({
        name,
        email,
        phone,
        message,
        subject,
        status: "new",
    });

    const savedContact = await contact.save();

    res.status(201).json({
        success: true,
        message: "Contact created successfully",
        data: savedContact,
    });
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access public
const updateContact = asyncHandler(async (req, res) => {
    const { name, email, phone, message, subject, status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        {
            name,
            email,
            phone,
            message,
            subject,
            status,
            updatedAt: Date.now(),
        },
        { new: true, runValidators: true }
    );

    if (!contact) {
        return res.status(404).json({
            success: false,
            message: "Contact not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Contact updated successfully",
        data: contact,
    });
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access public
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
        return res.status(404).json({
            success: false,
            message: "Contact not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Contact deleted successfully",
        data: {},
    });
});

module.exports = {
    getContact,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
};