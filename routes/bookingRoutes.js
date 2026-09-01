const express = require('express');
const router = express.Router();
const connectDB = require('../config/db'); 

// GET /api/bookings - Fetch all scheduled appointments
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const bookings = await db.collection('bookings')
      .find({})
      .sort({ startTime: 1 })
      .toArray();

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bookings - Schedule a new appointment
router.post('/', async (req, res) => {
  try {
    const db = await connectDB();
    const { contactId, serviceName, startTime, endTime } = req.body;

    const booking = {
      contactId,
      serviceName,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'confirmed',
      createdAt: new Date()
    };

    const result = await db.collection('bookings').insertOne(booking);
    res.json({ success: true, bookingId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
