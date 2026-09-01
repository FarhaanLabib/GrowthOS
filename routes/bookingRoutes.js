const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET all bookings for a team member (used to check availability)
router.get('/team/:teamMemberId', async (req, res) => {
  try {
    const bookings = await Booking.find({
      teamMemberId: req.params.teamMemberId,
      status: 'confirmed'
    }).sort({ startTime: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new booking (checks for overlap + buffer time)
router.post('/', async (req, res) => {
  try {
    const { contactId, teamMemberId, startTime, endTime, bufferMinutes = 15 } = req.body;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const bufferedStart = new Date(start.getTime() - bufferMinutes * 60000);
    const bufferedEnd = new Date(end.getTime() + bufferMinutes * 60000);

    const overlap = await Booking.findOne({
      teamMemberId,
      status: 'confirmed',
      startTime: { $lt: bufferedEnd },
      endTime: { $gt: bufferedStart }
    });

    if (overlap) {
      return res.status(409).json({ error: 'This slot conflicts with an existing booking or buffer time.' });
    }

    const booking = await Booking.create({ contactId, teamMemberId, startTime: start, endTime: end, bufferMinutes });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH reschedule or update status (cancel / no-show / completed)
router.patch('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;