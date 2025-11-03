const mongoose = require("mongoose");

const CampgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, "Name can not be more than 50 characters"],
    },
    address: {
        type: String,
        required: [true, "Please add an address"],
    },
    telephone: {
        type: String,
        required: [true, "Please add a telephone"],
        unique: true,
        match: [/^0\d{9}$/, "Please add a valid telephone number"],
    },
});

// Reverse populate with virtuals
CampgroundSchema.virtual("appointments", {
    ref: "Appointment",
    localField: "_id",
    foreignField: "campground",
    justOne: false,
});

module.exports = mongoose.model("Campground", CampgroundSchema);
