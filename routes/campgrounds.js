/**
 * @swagger
 * tags:
 *   - name: Campgrounds
 *     description: Campground management
 *
 * /api/v1/campgrounds:
 *   get:
 *     summary: Get all campgrounds
 *     tags: [Campgrounds]
 *     responses:
 *       200:
 *         description: List of campgrounds
 *       500:
 *         description: Server Error while fetching campgrounds
 *   post:
 *     summary: Create a new campground
 *     tags: [Campgrounds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               telephone:
 *                 type: string
 *               dailyCapacity:
 *                 type: integer
 *                 description: Daily booking capacity for the campground (optional, default 1)
 *             example:
 *               name: "Sunny Meadows"
 *               address: "123 Forest Lane, Springfield"
 *               telephone: "0123456789"
 *               dailyCapacity: 1
 *     responses:
 *       201:
 *         description: Created campground
 *       400:
 *         description: Validation error or duplicate field (e.g., name/telephone already exists)
 *       500:
 *         description: Server error while creating campground
 *
 * /api/v1/campgrounds/{id}:
 *   get:
 *     summary: Get a campground by id
 *     tags: [Campgrounds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campground object
 *       400:
 *         description: Campground not found (controller returns 400 when not found)
 *       404:
 *         description: Error fetching campground
 *   put:
 *     summary: Update a campground
 *     tags: [Campgrounds]
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
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               telephone:
 *                 type: string
 *             example:
 *               name: "Sunny Meadows (updated)"
 *               address: "123 Forest Lane, Springfield"
 *               telephone: "0123456789"
 *               dailyCapacity: 1
 *     responses:
 *       200:
 *         description: Updated campground
 *       404:
 *         description: Campground not found
 *       400:
 *         description: Validation error or bad request
 *   delete:
 *     summary: Delete a campground
 *     tags: [Campgrounds]
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
 *         description: Campground not found
 *       400:
 *         description: Bad request
 *
 * /api/v1/campgrounds/{campgroundId}/availability:
 *   get:
 *     summary: Get availability calendar for a campground
 *     tags: [Campgrounds]
 *     parameters:
 *       - in: path
 *         name: campgroundId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the campground to fetch availability for
 *     responses:
 *       200:
 *         description: Availability returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 campground:
 *                   type: string
 *                   example: "Sunny Meadows"
 *                 availability:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-11-12"
 *                       booked:
 *                         type: integer
 *                         example: 3
 *                       available:
 *                         type: integer
 *                         example: 2
 *                       isFull:
 *                         type: boolean
 *                         example: false
 *       404:
 *         description: Campground not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No campground with the id of 123"
 *       500:
 *         description: Server error while retrieving availability
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cannot get availability"
 */

const express = require('express');
const {getCampgrounds, getCampground, createCampground, updateCampground, deleteCampground, getAvailability} = require('../controllers/campgrounds');
const router = express.Router();
const {protect, authorize} = require('../middleware/auth');
const appointmentRouter = require('./appointments');

// Apply the protect middleware to all routes in this router

// Re-route into other resource routers
router.use('/:campgroundId/appointments', appointmentRouter);
router.route('/').get(getCampgrounds).post(protect, authorize('admin'), createCampground);
router.route('/:id').get(getCampground).put(protect, authorize('admin'), updateCampground).delete(protect, authorize('admin'), deleteCampground);
router.route('/:campgroundId/availability').get(getAvailability);

module.exports = router;