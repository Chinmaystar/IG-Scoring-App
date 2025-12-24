const express = require("express");
const router = express.Router();
const {
    getSports,
    getSport,
    createSport,
    updateSport,
    deleteSport,
} = require("../controllers/sportController");
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(getSports).post(protect, authorize("admin"), createSport);

router
    .route("/:id")
    .get(getSport)
    .put(protect, authorize("admin"), updateSport)
    .delete(protect, authorize("admin"), deleteSport);

module.exports = router;
