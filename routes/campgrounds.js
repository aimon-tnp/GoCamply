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
 *             example:
 *               name: "Sunny Meadows"
 *               address: "123 Forest Lane, Springfield"
 *               telephone: "0123456789"
 *     responses:
 *       201:
 *         description: Created campground
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
 *     responses:
 *       200:
 *         description: Updated campground
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
 */

const express = require('express');
const {getCampgrounds, getCampground, createCampground, updateCampground, deleteCampground, getAvailability} = require('../controllers/Campgrounds');
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