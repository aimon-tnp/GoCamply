const Campground = require("../models/Campground");
const Appointment = require("../models/Appointment");

// @desc    Get all campgrounds
// @route   GET /api/v1/campgrounds
// @access  Public
exports.getCampgrounds = async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);
    console.log(reqQuery);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    query = Campground.find(JSON.parse(queryStr)).populate("appointments");

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const total = await Campground.countDocuments();
        query = query.skip(startIndex).limit(limit);

        // Executing query
        const campgrounds = await query;

        // Pagination results
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }

        return res.status(200).json({
            success: true,
            count: campgrounds.length,
            data: campgrounds,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
};

// @desc    Get single campground
// @route   GET /api/v1/campgrounds/:id
// @access  Public
exports.getCampground = async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            return res.status(400).json({
                success: false,
            });
        }
        return res.status(200).json({
            success: true,
            data: campground,
        });
    } catch (err) {
        return res.status(404).json({
            success: false,
        });
    }
};

// @desc    Create new campground
// @route   POST /api/v1/ca
// @access  Private
exports.createCampground = async (req, res, next) => {
    // console.log(req.body);
    const campground = await Campground.create(req.body);

    res.status(201).json({
        success: true,
        data: campground,
    });
};

// @desc    Update single campground
// @route   PUT /api/v1/campgrounds/:id
// @access  Private
exports.updateCampground = async (req, res, next) => {
    try {
        const campground = await Campground.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!campground) {
            return res.status(404).json({
                success: false,
            });
        }
        return res.status(200).json({
            success: true,
            data: campground,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
        });
    }
};

// @desc    Delete single campground
// @route   DELETE /api/v1/campgrounds/:id
// @access  Private
exports.deleteCampground = async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id);

        if (!campground) {
            return res.status(404).json({
                success: false,
            });
        }
        await Appointment.deleteMany({ campground: req.params.id });
        await Campground.deleteOne({ _id: req.params.id });

        return res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
        });
    }
};

// @desc    Get availability calendar for a campground
// @route   GET /api/v1/campgrounds/:campgroundId/availability
// @access  Public
exports.getAvailability = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.campgroundId);

    if (!campground) {
      return res.status(404).json({
        success: false,
        message: `No campground with the id of ${req.params.campgroundId}`,
      });
    }

    // ดึง appointments ของแคมป์นั้นทั้งหมด
    const appointments = await Appointment.find({
      campground: req.params.campgroundId,
    });

    // รวมจำนวนการจองในแต่ละวัน
    const bookingMap = {};
    appointments.forEach(appt => {
      const dateKey = appt.apptDate.toISOString().split('T')[0];
      bookingMap[dateKey] = (bookingMap[dateKey] || 0) + 1;
    });

    // สร้าง calendar รายวัน (เช่น 30 วันนับจากวันนี้)
    const today = new Date();
    const availability = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      const booked = bookingMap[dateKey] || 0;

      availability.push({
        date: dateKey,
        booked,
        available: Math.max(0, campground.dailyCapacity - booked),
        isFull: booked >= campground.dailyCapacity,
      });
    }

    res.status(200).json({
      success: true,
      campground: campground.name,
      availability,
    });
  } catch (err) {
    console.error('Error in getAvailability:', err);
    res.status(500).json({
      success: false,
      message: 'Cannot get availability',
    });
  }
};