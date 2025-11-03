// TODO: swagger documentation

const express = require('express');
const {getCampgrounds, getCampground, createCampground, updateCampground, deleteCampground} = require('../controllers/Campgrounds');
const router = express.Router();
const {protect, authorize} = require('../middleware/auth');
const appointmentRouter = require('./appointments');

// Apply the protect middleware to all routes in this router

// Re-route into other resource routers
router.use('/:campgroundId/appointments', appointmentRouter);
router.route('/').get(getCampgrounds).post(protect, authorize('admin'), createCampground);
router.route('/:id').get(getCampground).put(protect, authorize('admin'), updateCampground).delete(protect, authorize('admin'), deleteCampground);

module.exports = router;