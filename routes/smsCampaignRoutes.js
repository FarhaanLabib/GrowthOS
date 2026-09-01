const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');

// POST /api/messages/sms - Send SMS message
router.post('/sms', async (req, res) => {
  try {
    const db = await connectDB();
    const { contactId, phoneNumber, text } = req.body;

    const smsRecord = {
      contactId,
      phoneNumber,
      text,
      direction: 'outbound',
      status: 'delivered',
      timestamp: new Date()
    };

    const result = await db.collection('sms_logs').insertOne(smsRecord);
    res.json({ success: true, smsId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/messages/sms/:contactId - Fetch SMS conversation history
router.get('/sms/:contactId', async (req, res) => {
  try {
    const db = await connectDB();
    const { contactId } = req.params;

    const history = await db.collection('sms_logs')
      .find({ contactId })
      .sort({ timestamp: 1 })
      .toArray();

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
