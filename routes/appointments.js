// TODO: swagger documentation

const express = require("express");
const { getAppointments, getAppointment, addAppointment, updateAppointment, deleteAppointment } = require("../controllers/appointments");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

// Apply the protect middleware to all routes in this router

router.route("/")
    .get(protect, getAppointments)
    .post(protect, authorize('admin', 'user'), addAppointment);
    
router.route("/:id").get(getAppointment)
    .put(protect, authorize('admin', 'user'), updateAppointment)
    .delete(protect, authorize('admin', 'user'), deleteAppointment);

module.exports = router;

