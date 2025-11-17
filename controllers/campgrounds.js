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
// @route   POST /api/v1/campgrounds
// @access  Private
exports.createCampground = async (req, res, next) => {
    try {
        // console.log(req.body);
        const campground = await Campground.create(req.body);

        return res.status(201).json({
            success: true,
            data: campground,
        });
    } catch (err) {
        // Duplicate key error (unique constraint)
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: "Duplicate field value entered",
                fields: err.keyValue || null,
            });
        }

        // Mongoose validation error
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                error: messages,
            });
        }

        // Fallback server error
        console.error("Error creating campground:", err);
        return res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
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
// @route   GET /api/v1/campgrounds/:campgroundId/availability?month=12&year=2025
// @access  Public
exports.getAvailability = async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.campgroundId);

    const monthParam = parseInt(req.query.month, 10);
    const yearParam = parseInt(req.query.year, 10);
    const useMonthView = !Number.isNaN(monthParam) && !Number.isNaN(yearParam);

    if (useMonthView && (monthParam < 1 || monthParam > 12)) {
      return res.status(400).json({
        success: false,
        message: 'month must be between 1 and 12',
      });
    }

    let calendarStart = new Date();
    calendarStart.setHours(0, 0, 0, 0);
    let totalDays = 30;

    if (useMonthView) {
      calendarStart = new Date(yearParam, monthParam - 1, 1);
      calendarStart.setHours(0, 0, 0, 0);
      totalDays = new Date(yearParam, monthParam, 0).getDate();
    }

    const periodEnd = new Date(calendarStart);
    periodEnd.setDate(calendarStart.getDate() + totalDays);

    // ดึง appointments ของแคมป์ภายในช่วงเวลาที่ต้องการ
    const appointments = await Appointment.find({
      campground: req.params.campgroundId,
      apptDate: { $gte: calendarStart, $lt: periodEnd },
    });

    // รวมจำนวนการจองในแต่ละวัน
    const bookingMap = {};
    appointments.forEach((appt) => {
      const dateKey = appt.apptDate.toISOString().split('T')[0];
      bookingMap[dateKey] = (bookingMap[dateKey] || 0) + 1;
    });

    // สร้าง calendar รายวัน
    const availability = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(calendarStart);
      date.setDate(calendarStart.getDate() + i);
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
      month: useMonthView ? monthParam : undefined,
      year: useMonthView ? yearParam : undefined,
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
