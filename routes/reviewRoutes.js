const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

// POST /api/reviews/request - Send review invite to client
router.post('/request', async (req, res) => {
  try {
    const db = await connectDB();
    const { contactId, channel } = req.body; // 'sms' or 'email'

    const reviewRequest = {
      contactId,
      channel,
      status: 'sent',
      sentAt: new Date()
    };

    const result = await db.collection('review_requests').insertOne(reviewRequest);
    res.json({ success: true, requestId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reviews - Fetch review feedback stats
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const reviews = await db.collection('reviews').find({}).sort({ createdAt: -1 }).toArray();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
