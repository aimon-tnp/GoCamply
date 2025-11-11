/**
 * @swagger
 * tags:
 *   - name: Appointments
 *     description: Appointment management
 *
 * /api/v1/appointments:
 *   get:
 *     summary: Get appointments for the current user (admin can see all)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of appointments
 *   post:
 *     summary: Create a new appointment (for campground when used via nested route)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apptDate:
 *                 type: string
 *                 format: date-time
 *               campground:
 *                 type: string
 *             example:
 *               apptDate: "2025-12-01T10:00:00.000Z"
 *               campground: "64a1b2c3d4e5f67890123456"
 *     responses:
 *       200:
 *         description: Created appointment
 *
 * /api/v1/appointments/{id}:
 *   get:
 *     summary: Get a single appointment by id
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment object
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apptDate:
 *                 type: string
 *                 format: date-time
 *             example:
 *               apptDate: "2025-12-05T11:00:00.000Z"
 *     responses:
 *       200:
 *         description: Updated appointment
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *
 * /api/v1/campgrounds/{campgroundId}/appointments:
 *   post:
 *     summary: Create an appointment for a specific campground
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campgroundId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apptDate:
 *                 type: string
 *                 format: date-time
 *             example:
 *               apptDate: "2025-12-01T10:00:00.000Z"
 *     responses:
 *       200:
 *         description: Created appointment
 */

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

