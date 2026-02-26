//@desc Get all contacts
//@route GET /api/contacts
//@access public
const getContact = (req,res) => {
    res.status(200).json({ message:"Get all contacts" });
};

//@desc Create New contacts
//@route POST /api/contacts
//@access public
const createContact = (req,res) => {
    res.status(201).json({ message:"Get all contacts" });
};
module.exports = { getContact };