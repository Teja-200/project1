const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Participation = require('../models/Participation');

// Show all events
router.get('/', async(req, res) => {
    const events = await Event.find();
    res.render('events', { events });
});

// Form to add new event
router.get('/new', (req, res) => {
    res.render('newEvent');
});

// Handle new event
router.post('/add', async(req, res) => {
    const { title, date, location, totalSeats } = req.body;
    await Event.create({ title, date, location, totalSeats, bookedSeats: 0 });
    res.redirect('/');
});

// Book seat manually
router.post('/book/:id', async(req, res) => {
    const event = await Event.findById(req.params.id);
    if (event.bookedSeats < event.totalSeats) {
        event.bookedSeats += 1;
        await event.save();
    }
    res.redirect('/');
});

// Cancel seat manually
router.post('/cancel/:id', async(req, res) => {
    const event = await Event.findById(req.params.id);
    if (event.bookedSeats > 0) {
        event.bookedSeats -= 1;
        await event.save();
    }
    res.redirect('/');
});

// Show participation form
router.get('/participate/:id', async(req, res) => {
    const event = await Event.findById(req.params.id);
    res.render('participate', { event });
});

// Handle participation form + increment bookedSeats
router.post('/participate/:id', async(req, res) => {
    const { name, email, message } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
        return res.status(404).send("❌ Event not found.");
    }

    if (event.bookedSeats >= event.totalSeats) {
        return res.send("❌ Sorry, all seats for this event are already booked.");
    }

    // Save participant
    await Participation.create({
        eventId: event._id,
        name,
        email,
        message
    });

    // Increment bookedSeats
    event.bookedSeats += 1;
    await event.save();

    res.send("✅ You have successfully registered! Your seat has been booked.");
});

module.exports = router;