const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    date: String,
    location: String,
    totalSeats: Number,
    bookedSeats: { type: Number, default: 0 }
});

module.exports = mongoose.model('Event', eventSchema);