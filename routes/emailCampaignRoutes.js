const express = require('express');
const router = express.Router();
const connectDB = require('../db');

// POST /api/campaigns - Save and send email campaign
router.post('/', async (req, res) => {
  try {
    const db = await connectDB();
    const { title, subject, body, targetSegment } = req.body;

    const campaign = {
      title,
      subject,
      body,
      targetSegment,
      status: 'scheduled',
      stats: { sent: 0, opened: 0, clicked: 0 },
      createdAt: new Date()
    };

    const result = await db.collection('email_campaigns').insertOne(campaign);
    res.json({ success: true, campaignId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/campaigns - List email campaigns
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const campaigns = await db.collection('email_campaigns').find({}).toArray();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
