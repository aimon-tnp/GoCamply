/**
 * @swagger
 * tags:
 *   - name: Bookings
 *     description: Booking management
 *
 * /api/v1/bookings:
 *   get:
 *     summary: Get bookings for the current user (admin can see all)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of bookings
 *       500:
 *         description: Server error while retrieving bookings
 *   
 * /api/v1/bookings/{id}:
 *   get:
 *     summary: Get a single booking by id
 *     tags: [Bookings]
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
 *         description: Booking object
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error while fetching booking
 *   put:
 *     summary: Update an booking
 *     tags: [Bookings]
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
 *         description: Updated booking
 *       404:
 *         description: Booking not found
 *       401:
 *         description: Not authorized to update this booking
 *       500:
 *         description: Server error while updating booking
 *   delete:
 *     summary: Delete an booking
 *     tags: [Bookings]
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
 *       404:
 *         description: Booking not found
 *       401:
 *         description: Not authorized to delete this booking
 *       500:
 *         description: Server error while deleting booking
 *
 * /api/v1/campgrounds/{campgroundId}/bookings:
 *   get:
 *     summary: Get bookings for a specific campground
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campgroundId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of bookings for the campground
 *       500:
 *         description: Server error while retrieving bookings for campground
 *   post:
 *     summary: Create an booking for a specific campground
 *     tags: [Bookings]
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
 *         description: Created booking
 *       404:
 *         description: Campground not found
 *       400:
 *         description: User has already made 3 bookings (limit reached)
 *       500:
 *         description: Server error while creating booking
 */

const express = require("express");
const { getBookings, getBooking, addBooking, updateBooking, deleteBooking } = require("../controllers/bookings");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

// Apply the protect middleware to all routes in this router

router.route("/")
    .get(protect, getBookings)
    .post(protect, authorize('admin', 'user'), addBooking);
    
router.route("/:id").get(getBooking)
    .put(protect, authorize('admin', 'user'), updateBooking)
    .delete(protect, authorize('admin', 'user'), deleteBooking);

module.exports = router;

